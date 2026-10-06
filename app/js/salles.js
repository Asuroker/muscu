// Recherche de salles de sport (OpenStreetMap) et horaires d'ouverture.

import { urlSure } from './validation.js';

const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const CODES_OSM = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

async function avecDelai(url, options = {}, ms = 25000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { ...options, signal: ctl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

/** Trouve les coordonnées d'une ville ou d'une adresse. */
export async function geocoder(lieu) {
  const url = `${NOMINATIM}?format=jsonv2&limit=1&accept-language=fr&q=${encodeURIComponent(lieu)}`;
  const res = await avecDelai(url, { headers: { Accept: 'application/json' } }, 15000);
  if (!res.length) return null;
  return { lat: +res[0].lat, lon: +res[0].lon, nom: res[0].display_name };
}

export function maPosition() {
  return new Promise((ok, ko) => {
    if (!navigator.geolocation) return ko(new Error('Géolocalisation indisponible'));
    navigator.geolocation.getCurrentPosition(
      (p) => ok({ lat: p.coords.latitude, lon: p.coords.longitude }),
      (e) => ko(new Error(e.code === 1 ? 'Accès à la position refusé' : 'Position introuvable')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  });
}

export function distanceKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const compact = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Salles autour d'un point, éventuellement filtrées par nom. */
export async function chercherSalles({ lat, lon, rayon = 8000, nom = '' }) {
  const q = `[out:json][timeout:25];(
    nwr["leisure"="fitness_centre"](around:${rayon},${lat},${lon});
    nwr["leisure"="sports_centre"]["sport"~"fitness|bodybuilding|weightlifting"](around:${rayon},${lat},${lon});
  );out center tags;`;
  // Les serveurs Overpass sont parfois saturés : on essaie chacun, deux tours au maximum.
  let donnees = null, erreur = null;
  for (let tour = 0; tour < 2 && !donnees; tour++) {
    for (const url of OVERPASS) {
      try {
        donnees = await avecDelai(url, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 20000);
        break;
      } catch (e) {
        erreur = e;
      }
    }
  }
  if (!donnees) throw erreur || new Error('Service indisponible');

  const filtre = compact(nom);
  return donnees.elements
    .map((el) => versSalle(el, { lat, lon }))
    .filter((s) => !filtre || compact(`${s.nom} ${s.marque} ${s.ville}`).includes(filtre) || filtre.includes(compact(s.marque)) && compact(s.marque))
    .sort((a, b) => a.distance - b.distance);
}

function versSalle(el, centre) {
  const t = el.tags || {};
  const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
  const marque = t.brand || '';
  let nom = t.name || marque || 'Salle de sport';
  if (t.branch && !nom.includes(t.branch)) nom += ' ' + t.branch;
  else if (!t.branch && t['addr:city'] && nom === marque && !nom.includes(t['addr:city'])) nom += ' ' + t['addr:city'];
  const ville = t['addr:city'] || t.branch || '';
  const adresse = [[t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' '), [t['addr:postcode'], t['addr:city']].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ');
  const horairesOsm = t.opening_hours || '';
  return {
    osm: `${el.type}/${el.id}`, nom, marque, ville, adresse, lat, lon,
    site: urlSure(t.website || t['contact:website'] || ''),
    tel: t.phone || t['contact:phone'] || '',
    horairesOsm,
    horaires: lireHorairesOsm(horairesOsm),
    distance: distanceKm(centre, { lat, lon }),
  };
}

// ---------- Horaires ----------
// Format interne : tableau de 7 jours (lundi = 0), chacun une liste de plages ["HH:MM", "HH:MM"].

export const horairesVides = () => Array.from({ length: 7 }, () => []);

function joursDepuis(spec) {
  const jours = new Set();
  for (const part of spec.split(',')) {
    const [a, b] = part.split('-').map((x) => CODES_OSM.indexOf(x.trim()));
    if (a < 0) return null;
    if (b === undefined) { jours.add(a); continue; }
    if (b < 0) return null;
    for (let i = a; ; i = (i + 1) % 7) { jours.add(i); if (i === b) break; }
  }
  return [...jours];
}

/** Lit les formats OSM courants ("Mo-Fr 06:00-22:00; Sa,Su 08:00-20:00", "24/7"). Retourne null si inconnu. */
export function lireHorairesOsm(texte) {
  if (!texte) return null;
  const t = texte.trim();
  if (t === '24/7') return Array.from({ length: 7 }, () => [['00:00', '24:00']]);
  const res = horairesVides();
  let compris = false;
  for (let regle of t.split(';')) {
    regle = regle.trim();
    if (!regle) continue;
    if (/^(PH|SH)\b/.test(regle)) continue; // jours fériés : ignorés
    const m = regle.match(/^((?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*[-,]\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))*)?\s*(.*)$/);
    if (!m) return null;
    const jours = m[1] ? joursDepuis(m[1].replace(/\s/g, '')) : [0, 1, 2, 3, 4, 5, 6];
    if (!jours) return null;
    const heures = m[2].trim();
    if (/^(off|closed)$/i.test(heures)) { jours.forEach((j) => (res[j] = [])); compris = true; continue; }
    const plages = [];
    for (const p of heures.split(',')) {
      const h = p.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
      if (!h) return null;
      plages.push([`${h[1].padStart(2, '0')}:${h[2]}`, `${h[3].padStart(2, '0')}:${h[4]}`]);
    }
    jours.forEach((j) => (res[j] = plages));
    compris = true;
  }
  return compris ? res : null;
}

const enMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const jourIndex = (d) => (d.getDay() + 6) % 7;

/** "Ouvert · ferme à 22:30" ou "Fermé · ouvre demain à 08:00". */
export function statutOuverture(horaires, maintenant = new Date()) {
  if (!horaires) return null;
  const j = jourIndex(maintenant);
  const min = maintenant.getHours() * 60 + maintenant.getMinutes();

  // Plage de la veille qui déborde après minuit
  const veille = horaires[(j + 6) % 7] || [];
  for (const [a, b] of veille) {
    if (enMinutes(b) < enMinutes(a) && min < enMinutes(b)) return { ouvert: true, texte: `Ouvert · ferme à ${b}` };
  }
  for (const [a, b] of horaires[j] || []) {
    const da = enMinutes(a), db = enMinutes(b);
    const fin = db <= da ? db + 1440 : db;
    if (min >= da && min < fin) {
      if (da === 0 && fin >= 1440 && horaires.every((p) => p.some(([x, y]) => x === '00:00' && (y === '24:00' || y === '00:00')))) {
        return { ouvert: true, texte: 'Ouvert 24 h/24' };
      }
      return { ouvert: true, texte: `Ouvert · ferme à ${b === '24:00' ? 'minuit' : b}` };
    }
  }
  for (let k = 0; k < 8; k++) {
    const jj = (j + k) % 7;
    const plages = [...(horaires[jj] || [])].sort((x, y) => enMinutes(x[0]) - enMinutes(y[0]));
    for (const [a] of plages) {
      if (k === 0 && enMinutes(a) <= min) continue;
      const quand = k === 0 ? "aujourd'hui" : k === 1 ? 'demain' : JOURS[jj].toLowerCase();
      return { ouvert: false, texte: `Fermé · ouvre ${quand} à ${a}` };
    }
  }
  return { ouvert: false, texte: 'Fermé' };
}

export function texteJour(plages) {
  if (!plages || !plages.length) return 'Fermé';
  if (plages.length === 1 && plages[0][0] === '00:00' && ['24:00', '00:00', '23:59'].includes(plages[0][1])) return '24 h/24';
  return plages.map(([a, b]) => `${a} – ${b}`).join(', ');
}

export const lienPlans = (s) => `https://maps.apple.com/?q=${encodeURIComponent(s.nom)}&ll=${s.lat},${s.lon}`;
export const lienRechercheHoraires = (s) => `https://www.google.com/search?q=${encodeURIComponent(`${s.nom} ${s.ville || ''} horaires`)}`;

// Nettoyage des données chargées ou importées : chaque champ est remis au bon type,
// ce qui est inattendu est retiré. Protège contre un fichier de sauvegarde piégé.

const RE_ID = /^[A-Za-z0-9_-]{1,80}$/;
const RE_JOUR = /^\d{4}-\d{2}-\d{2}$/;
const RE_HEURE = /^\d{2}:\d{2}$/;
const RE_OSM = /^(node|way|relation)\/\d+$/;

const tableau = (v) => (Array.isArray(v) ? v : []);
const objet = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : null);
const texte = (v, max = 200) => (typeof v === 'string' ? v.slice(0, max) : typeof v === 'number' ? String(v) : '');
const nombre = (v, min = -1e9, max = 1e9, defaut = 0) => {
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : defaut;
};
const id = (v) => (typeof v === 'string' && RE_ID.test(v) ? v : null);
const jour = (v) => (typeof v === 'string' && RE_JOUR.test(v) ? v : null);
const heure = (v) => (typeof v === 'string' && RE_HEURE.test(v) ? v : null);
const dateIso = (v) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v.slice(0, 40) : null);

/** N'accepte que les liens web (http / https). */
export function urlSure(v) {
  if (typeof v !== 'string') return '';
  const u = v.trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u.slice(0, 500) : '';
}

function horaires(v) {
  if (!Array.isArray(v) || v.length !== 7) return null;
  return v.map((jourPlages) => tableau(jourPlages)
    .filter((p) => Array.isArray(p) && heure(p[0]) && (heure(p[1]) || p[1] === '24:00'))
    .map((p) => [p[0], p[1]]));
}

function serie(v) {
  const s = objet(v);
  if (!s) return null;
  return { reps: nombre(s.reps, 0, 10000), kg: nombre(s.kg, 0, 2000), faite: s.faite === true };
}

function exerciceSeance(v) {
  const e = objet(v);
  if (!e || !id(e.exId)) return null;
  const x = { exId: e.exId, series: tableau(e.series).map(serie).filter(Boolean).slice(0, 100) };
  if (e.fini === true) x.fini = true;
  return x;
}

function seance(v) {
  const s = objet(v);
  if (!s || !id(s.id) || !jour(s.date)) return null;
  return {
    id: s.id, date: s.date, debut: heure(s.debut) || '18:00', duree: nombre(s.duree, 0, 1440),
    salleId: id(s.salleId), types: tableau(s.types).map(id).filter(Boolean).slice(0, 20),
    exercices: tableau(s.exercices).map(exerciceSeance).filter(Boolean).slice(0, 60),
    xp: nombre(s.xp, 0, 100000), note: texte(s.note, 2000), source: texte(s.source, 20),
  };
}

function enCours(v) {
  const s = objet(v);
  if (!s) return null;
  const base = seance(s);
  if (!base) return null;
  const r = objet(s.repos);
  return {
    ...base, debutTs: nombre(s.debutTs, 0, 1e15, Date.now()), dureeVisee: nombre(s.dureeVisee, 0, 1440),
    ...(r ? { repos: { mode: r.mode === 'chrono' ? 'chrono' : 'decompte', fin: nombre(r.fin, 0, 1e15), total: nombre(r.total, 1, 3600, 90), debut: nombre(r.debut, 0, 1e15) } } : {}),
  };
}

function salle(v) {
  const s = objet(v);
  if (!s || !id(s.id)) return null;
  return {
    id: s.id, osm: typeof s.osm === 'string' && RE_OSM.test(s.osm) ? s.osm : null,
    nom: texte(s.nom, 120) || 'Salle de sport', marque: texte(s.marque, 80), ville: texte(s.ville, 80), adresse: texte(s.adresse, 200),
    lat: s.lat == null ? null : nombre(s.lat, -90, 90), lon: s.lon == null ? null : nombre(s.lon, -180, 180),
    site: urlSure(s.site), tel: texte(s.tel, 40).replace(/[^\d+ ().-]/g, ''),
    horairesOsm: texte(s.horairesOsm, 300), horaires: horaires(s.horaires),
  };
}

/**
 * Retourne une copie propre des données (mêmes champs que etatInitial dans store.js).
 * `base` fournit les valeurs par défaut des champs absents.
 */
export function assainir(brut, base) {
  const d = objet(brut) || {};
  const res = { ...base };
  res.version = nombre(d.version, 1, 100, base.version);
  res.creeLe = dateIso(d.creeLe) || base.creeLe;
  res.salles = tableau(d.salles).map(salle).filter(Boolean).slice(0, 50);
  res.salleParDefaut = id(d.salleParDefaut) && res.salles.some((s) => s.id === d.salleParDefaut) ? d.salleParDefaut : (res.salles[0]?.id || null);
  res.seances = tableau(d.seances).map(seance).filter(Boolean);
  res.poids = tableau(d.poids).map(objet).filter((p) => p && jour(p.date)).map((p) => ({ date: p.date, kg: nombre(p.kg, 20, 400, 70) }));
  res.xp = tableau(d.xp).map(objet).filter((x) => x && jour(x.date)).map((x) => {
    const e = { date: x.date, montant: nombre(x.montant, 0, 100000), raison: texte(x.raison, 40) };
    if (id(x.seanceId)) e.seanceId = x.seanceId;
    return e;
  });
  res.bons = tableau(d.bons).map(objet).filter((b) => b && id(b.id)).map((b) => ({
    id: b.id, titre: texte(b.titre, 80), emoji: texte(b.emoji, 8), niveau: nombre(b.niveau, 0, 10000),
    gagneLe: dateIso(b.gagneLe) || new Date().toISOString(), utiliseLe: dateIso(b.utiliseLe),
  }));
  if (Array.isArray(d.regles)) {
    res.regles = d.regles.map(objet).filter(Boolean).map((r) => ({ tous: Math.round(nombre(r.tous, 1, 1000, 1)), emoji: texte(r.emoji, 8), titre: texte(r.titre, 80) }))
      .filter((r) => r.titre).slice(0, 30);
  }
  res.enCours = enCours(d.enCours);
  const reg = objet(d.reglages) || {};
  res.reglages = { repos: nombre(reg.repos, 10, 900, 90), ...(reg.reposAuto === false ? { reposAuto: false } : {}) };
  const o = objet(d.objectifs) || {};
  const op = objet(o.poids);
  res.objectifs = {
    poids: op ? { cible: nombre(op.cible, 20, 400), depart: nombre(op.depart, 20, 400), debut: jour(op.debut) || '', atteintLe: jour(op.atteintLe) } : null,
    charges: tableau(o.charges).map(objet).filter((c) => c && id(c.id) && id(c.exId)).map((c) => ({
      id: c.id, exId: c.exId, cible: nombre(c.cible, 0, 2000), creeLe: jour(c.creeLe) || '', atteintLe: jour(c.atteintLe),
    })),
  };
  const p = objet(d.profil);
  res.profil = p ? {
    prenom: texte(p.prenom, 40), sexe: p.sexe === 'H' || p.sexe === 'F' ? p.sexe : '',
    age: p.age ? nombre(p.age, 12, 100) : '', taille: p.taille ? nombre(p.taille, 120, 230) : '',
    activite: ['sedentaire', 'modere', 'actif'].includes(p.activite) ? p.activite : 'modere',
    objectif: ['auto', 'perte', 'maintien', 'prise'].includes(p.objectif) ? p.objectif : 'auto',
  } : null;
  if (dateIso(d.derniereSauvegarde)) res.derniereSauvegarde = d.derniereSauvegarde;
  if (jour(d.rappelSauvegardeReporte)) res.rappelSauvegardeReporte = d.rappelSauvegardeReporte;
  if (d.bienvenueFaite === true) res.bienvenueFaite = true;
  return res;
}

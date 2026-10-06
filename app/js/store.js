// État de l'application, sauvegardé dans le stockage local du téléphone.

const CLE = 'muscu.v1';

function etatInitial() {
  return {
    version: 1,
    creeLe: new Date().toISOString(),
    salles: [],          // {id, nom, marque, ville, adresse, lat, lon, osm, site, horairesOsm, horaires}
    salleParDefaut: null,
    seances: [],         // {id, date, debut, duree, salleId, types[], exercices[{exId, series[{reps, kg, faite}]}], xp, note, source}
    poids: [],           // {date, kg}
    xp: [],              // {date, montant, raison}
    bons: [],            // {id, titre, emoji, niveau, gagneLe, utiliseLe}
    regles: [            // récompenses par niveau : la plus grande "tous" qui divise le niveau gagne
      { tous: 10, emoji: '🎮', titre: 'Soirée jeux vidéo illimitée' },
      { tous: 5, emoji: '🍔', titre: 'Cheat meal' },
      { tous: 3, emoji: '🍫', titre: 'Snack sucré au choix' },
      { tous: 1, emoji: '🥤', titre: 'Boisson sucrée' },
    ],
    enCours: null,       // séance en cours (même structure qu'une séance + debutTs)
    reglages: { repos: 90 },
  };
}

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return etatInitial();
    return migrer({ ...etatInitial(), ...JSON.parse(brut) });
  } catch {
    return etatInitial();
  }
}

/** Met à jour les données enregistrées avec une ancienne version de l'app. */
function migrer(e) {
  // Récompense par défaut remplacée : équipement de sport → soirée jeux vidéo.
  for (const r of e.regles || []) {
    if (r.titre === 'Nouvel équipement de sport' && r.emoji === '🛍️') {
      r.titre = 'Soirée jeux vidéo illimitée';
      r.emoji = '🎮';
    }
  }
  return e;
}

export const etat = charger();
const abonnes = new Set();

export function sauver() {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch (e) {
    console.error('Sauvegarde impossible', e);
  }
}

/** Modifie l'état, sauvegarde et redessine la vue (sauf si silencieux). */
export function maj(fn, { silencieux = false } = {}) {
  fn(etat);
  sauver();
  if (!silencieux) abonnes.forEach((f) => f());
}

export function abonner(f) {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

export function remplacerEtat(nouveau) {
  Object.keys(etat).forEach((k) => delete etat[k]);
  Object.assign(etat, migrer({ ...etatInitial(), ...nouveau }));
  sauver();
  abonnes.forEach((f) => f());
}

export function reinitialiser() {
  remplacerEtat(etatInitial());
}

// ---------- Utilitaires ----------

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Date locale au format AAAA-MM-JJ. */
export function jour(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function heure(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${z(d.getHours())}:${z(d.getMinutes())}`;
}

export function dateDepuisJour(s) {
  const [a, m, j] = s.split('-').map(Number);
  return new Date(a, m - 1, j);
}

const fmtLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtCourt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
const fmtCourtAn = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const dateLongue = (s) => {
  const t = fmtLong.format(dateDepuisJour(s));
  return t.charAt(0).toUpperCase() + t.slice(1);
};
export const dateCourte = (s) => {
  const d = dateDepuisJour(s);
  return (d.getFullYear() === new Date().getFullYear() ? fmtCourt : fmtCourtAn).format(d);
};

export function duree(min) {
  min = Math.round(min);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}

export const kg = (n) => `${String(Math.round(n * 100) / 100).replace('.', ',')} kg`;

export const salle = (id) => etat.salles.find((s) => s.id === id);

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function seancesTriees() {
  return [...etat.seances].sort((a, b) => (b.date + b.debut).localeCompare(a.date + a.debut));
}

/** Historique d'un exercice : une entrée par séance, avec meilleure charge et volume. */
export function historiqueExercice(exId) {
  const res = [];
  for (const s of etat.seances) {
    for (const ex of s.exercices || []) {
      if (ex.exId !== exId) continue;
      const faites = ex.series.filter((x) => x.faite && (x.reps > 0));
      if (!faites.length) continue;
      const max = Math.max(...faites.map((x) => x.kg || 0));
      const volume = faites.reduce((t, x) => t + (x.kg || 0) * x.reps, 0);
      const unRM = Math.max(...faites.map((x) => (x.kg || 0) * (1 + x.reps / 30)));
      res.push({ date: s.date, debut: s.debut, seanceId: s.id, series: faites, max, volume, unRM });
    }
  }
  return res.sort((a, b) => (a.date + a.debut).localeCompare(b.date + b.debut));
}

/** Les dernières séries réalisées sur un exercice (pour pré-remplir). */
export function dernieresSeries(exId, sauf) {
  const h = historiqueExercice(exId).filter((x) => x.seanceId !== sauf);
  return h.length ? h[h.length - 1].series : null;
}

// Expérience, niveaux et bons de récompense.
import { etat, uid, jour, dateDepuisJour, historiqueExercice } from './store.js';

/** XP nécessaire pour passer du niveau n au niveau n + 1. */
export const besoinNiveau = (n) => 150 + (n - 1) * 75;

export function xpTotal() {
  return etat.xp.reduce((t, x) => t + x.montant, 0);
}

export function niveauDepuisXp(total) {
  let niveau = 1, reste = total;
  while (reste >= besoinNiveau(niveau)) {
    reste -= besoinNiveau(niveau);
    niveau++;
  }
  return { niveau, xpDansNiveau: reste, besoin: besoinNiveau(niveau), total };
}

export const niveauActuel = () => niveauDepuisXp(xpTotal());

export function recompensePourNiveau(niveau) {
  const regles = [...etat.regles].filter((r) => r.tous > 0).sort((a, b) => b.tous - a.tous);
  return regles.find((r) => niveau % r.tous === 0) || null;
}

const TITRES = [
  [1, 'Débutant'], [3, 'Habitué'], [5, 'Régulier'], [8, 'Costaud'], [12, 'Athlète'],
  [16, 'Machine'], [20, 'Colosse'], [25, 'Titan'], [30, 'Légende'],
];
export function titreNiveau(n) {
  let t = TITRES[0][1];
  for (const [min, nom] of TITRES) if (n >= min) t = nom;
  return t;
}

/**
 * Ajoute de l'XP (à appeler dans un maj()). Retourne les niveaux gagnés et les bons créés.
 */
export function ajouterXp(e, montant, raison, date = jour(), extra = {}) {
  if (montant <= 0) return { niveaux: [], bons: [] };
  const avant = niveauDepuisXp(e.xp.reduce((t, x) => t + x.montant, 0)).niveau;
  e.xp.push({ date, montant, raison, ...extra });
  const apres = niveauDepuisXp(e.xp.reduce((t, x) => t + x.montant, 0)).niveau;
  const niveaux = [], bons = [];
  for (let n = avant + 1; n <= apres; n++) {
    niveaux.push(n);
    const r = recompensePourNiveau(n);
    if (r) {
      const bon = { id: uid(), titre: r.titre, emoji: r.emoji, niveau: n, gagneLe: new Date().toISOString(), utiliseLe: null };
      e.bons.push(bon);
      bons.push(bon);
    }
  }
  return { niveaux, bons };
}

/** Lundi de la semaine d'une date AAAA-MM-JJ. */
function lundi(s) {
  const d = dateDepuisJour(s);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return jour(d);
}

export function seancesSemaine(s, seances = etat.seances) {
  const l = lundi(s);
  return seances.filter((x) => lundi(x.date) === l);
}

/** Détail de l'XP gagnée pour une séance (avant qu'elle soit ajoutée à l'état). */
export function calculerXpSeance(seance) {
  const lignes = [];
  lignes.push({ lib: 'Séance à la salle', xp: 50 });
  if (!etat.seances.length) lignes.push({ lib: 'Toute première séance 🎉', xp: 100 });
  const minutes = Math.min(120, Math.round(seance.duree || 0));
  if (minutes > 0) lignes.push({ lib: `${minutes} min d'entraînement`, xp: minutes });
  const series = (seance.exercices || []).reduce((t, ex) => t + ex.series.filter((x) => x.faite).length, 0);
  if (series) lignes.push({ lib: `${series} série${series > 1 ? 's' : ''} validée${series > 1 ? 's' : ''}`, xp: Math.min(series, 40) * 5 });

  let records = 0;
  for (const ex of seance.exercices || []) {
    const faites = ex.series.filter((x) => x.faite && x.reps > 0 && x.kg > 0);
    if (!faites.length) continue;
    const h = historiqueExercice(ex.exId).filter((x) => x.seanceId !== seance.id);
    if (!h.length) continue;
    const ancien = Math.max(...h.map((x) => x.max));
    if (Math.max(...faites.map((x) => x.kg)) > ancien) records++;
  }
  if (records) lignes.push({ lib: `${records} nouveau${records > 1 ? 'x' : ''} record${records > 1 ? 's' : ''}`, xp: records * 25 });

  const dejaSemaine = seancesSemaine(seance.date).filter((x) => x.id !== seance.id).length;
  if (dejaSemaine === 2) lignes.push({ lib: '3e séance de la semaine 🔥', xp: 50 });

  return { lignes, total: lignes.reduce((t, l) => t + l.xp, 0), records };
}

/** Nombre de semaines consécutives (jusqu'à cette semaine) avec au moins une séance. */
export function serieSemaines() {
  if (!etat.seances.length) return 0;
  const semaines = new Set(etat.seances.map((s) => lundi(s.date)));
  const d = dateDepuisJour(lundi(jour()));
  let n = 0;
  if (!semaines.has(jour(d))) d.setDate(d.getDate() - 7); // la semaine en cours peut encore venir
  while (semaines.has(jour(d))) { n++; d.setDate(d.getDate() - 7); }
  return n;
}

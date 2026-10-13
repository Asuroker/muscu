// Expérience, niveaux et bons de récompense.
import { etat, uid, jour, dateDepuisJour, historiqueExercice } from './store.js';

export const NIVEAU_MAX = 55;
/** 10 prestiges + Maître du prestige (rang 11). */
export const PRESTIGE_MAX = 11;

/** XP nécessaire pour passer du niveau n au niveau n + 1 (≈ 15 000 XP du niveau 1 au 55, soit ~50 séances). */
export const besoinNiveau = (n) => 120 + (n - 1) * 6;

export function xpTotal(e = etat) {
  return e.xp.reduce((t, x) => t + x.montant, 0);
}

export const rangPrestige = (e = etat) => e.prestige?.rang || 0;

/** XP gagnée depuis le dernier passage de prestige. */
const xpDuPrestige = (e) => Math.max(0, xpTotal(e) - (e.prestige?.xpDebut || 0));

export function niveauDepuisXp(xp) {
  let niveau = 1, reste = xp;
  while (niveau < NIVEAU_MAX && reste >= besoinNiveau(niveau)) {
    reste -= besoinNiveau(niveau);
    niveau++;
  }
  const max = niveau >= NIVEAU_MAX;
  return { niveau, xpDansNiveau: max ? besoinNiveau(niveau) : reste, besoin: besoinNiveau(niveau), max, total: xp };
}

/** Niveau dans le prestige actuel ; `total` reste l'XP gagnée depuis le début. */
export const niveauActuel = (e = etat) => ({ ...niveauDepuisXp(xpDuPrestige(e)), total: xpTotal(e), prestige: rangPrestige(e) });

export const peutPasserPrestige = (e = etat) => niveauActuel(e).max && rangPrestige(e) < PRESTIGE_MAX;

/** Passe au prestige suivant (à appeler dans un maj()). Le niveau repart à 1, tout le reste est gardé. */
export function passerPrestige(e) {
  if (!peutPasserPrestige(e)) return null;
  const rang = rangPrestige(e) + 1;
  e.prestige = { rang, xpDebut: xpTotal(e), historique: [...(e.prestige?.historique || []), { rang, date: jour() }] };
  const bon = {
    id: uid(), titre: rang === PRESTIGE_MAX ? 'Récompense de Maître du prestige : le plus gros plaisir au choix' : 'Récompense de prestige : un gros plaisir au choix',
    emoji: '👑', niveau: NIVEAU_MAX, gagneLe: new Date().toISOString(), utiliseLe: null,
  };
  e.bons.push(bon);
  return { rang, bon };
}

export function recompensePourNiveau(niveau) {
  const regles = [...etat.regles].filter((r) => r.tous > 0).sort((a, b) => b.tous - a.tous);
  return regles.find((r) => niveau % r.tous === 0) || null;
}

const TITRES = [
  [1, 'Débutant'], [3, 'Habitué'], [5, 'Régulier'], [8, 'Costaud'], [12, 'Athlète'],
  [16, 'Machine'], [20, 'Colosse'], [25, 'Titan'], [30, 'Légende'], [35, 'Mythe'],
  [40, 'Demi-dieu'], [45, 'Olympien'], [50, 'Immortel'], [55, 'Légende vivante'],
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
  const avant = niveauDepuisXp(xpDuPrestige(e)).niveau;
  e.xp.push({ date, montant, raison, ...extra });
  const apres = niveauDepuisXp(xpDuPrestige(e)).niveau;
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

/**
 * Passage à la courbe 1-55 (version 3 des données) : si l'XP déjà gagnée donne maintenant
 * plus de niveaux qu'avant, on offre les bons de ces niveaux. À appeler dans un maj().
 */
export function migrerCourbe(e) {
  if ((e.version || 1) >= 3) return 0;
  const total = xpTotal(e);
  let ancien = 1, reste = total;
  while (reste >= 150 + (ancien - 1) * 75) { reste -= 150 + (ancien - 1) * 75; ancien++; }
  const nouveau = niveauDepuisXp(total).niveau;
  let offerts = 0;
  for (let n = ancien + 1; n <= nouveau; n++) {
    const r = recompensePourNiveau(n);
    if (r) { e.bons.push({ id: uid(), titre: r.titre, emoji: r.emoji, niveau: n, gagneLe: new Date().toISOString(), utiliseLe: null }); offerts++; }
  }
  e.version = 3;
  return offerts;
}

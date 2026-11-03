// Estimation des calories dépensées : kcal = MET × poids (kg) × durée (h).
// Valeurs MET tirées du Compendium of Physical Activities (Ainsworth et al.).
import { etat } from './store.js';
import { exo, colonnes, estGainage, famille } from './exercices.js';

export const POIDS_PAR_DEFAUT = 75;

/** Poids corporel à une date : dernière pesée avant ou ce jour-là, sinon la première connue. */
export function poidsA(date) {
  const p = [...etat.poids].sort((a, b) => a.date.localeCompare(b.date));
  if (!p.length) return { kg: POIDS_PAR_DEFAUT, estime: true };
  const avant = p.filter((x) => x.date <= date);
  return { kg: (avant.length ? avant[avant.length - 1] : p[0]).kg, estime: false };
}

/** Interpolation dans une table [[vitesse km/h, MET], …]. */
function selonVitesse(table, v) {
  if (v <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [v0, m0] = table[i - 1], [v1, m1] = table[i];
    if (v <= v1) return m0 + ((v - v0) / (v1 - v0)) * (m1 - m0);
  }
  return table[table.length - 1][1];
}
const COURSE = [[6.4, 6.0], [8, 8.3], [9.7, 9.8], [11.3, 11.0], [12.9, 11.8], [14.5, 12.8], [16, 14.5], [17.7, 16.0]];
const MARCHE = [[3.2, 2.8], [4.8, 3.5], [5.6, 4.3], [6.4, 5.0], [7.2, 7.0]];

const MET_CARDIO = {
  'Running, Treadmill': 9.8, 'Jogging, Treadmill': 7.0, 'Walking, Treadmill': 3.5, 'Trail Running/Walking': 6.0,
  'Bicycling, Stationary': 6.8, Bicycling: 7.5, 'Recumbent Bike': 5.5, 'Elliptical Trainer': 5.0,
  'Rowing, Stationary': 7.0, Stairmaster: 9.0, 'Step Mill': 9.0, 'Rope Jumping': 11.8, Skating: 7.0,
};
const LIBRES = ['barbell', 'dumbbell', 'kettlebells', 'e-z curl bar', 'body only', 'other', 'medicine ball'];

/** MET d'un exercice. Pour le cardio, `minutes` et `km` permettent de tenir compte de la vitesse. */
export function metExercice(ex, { minutes = 0, km = 0 } = {}) {
  if (!ex) return 5.0;
  if (ex.c === 'cardio') {
    let v = minutes > 0 && km > 0 ? km / (minutes / 60) : 0;
    if (v > 25) v = 0; // distance aberrante : on ignore la vitesse
    if (v && /Running|Jogging/.test(ex.en)) return selonVitesse(COURSE, v);
    if (v && /Walking/.test(ex.en)) return v >= 7.5 ? selonVitesse(COURSE, v) : selonVitesse(MARCHE, v);
    return MET_CARDIO[ex.en] ?? 7.0;
  }
  if (ex.c === 'stretching') return 2.3;
  if (estGainage(ex)) return 3.8; // gainage / isométrie
  if (ex.c === 'plyometrics') return 8.0;
  if (ex.en === 'Battling Ropes') return 10.0;
  if (['olympic weightlifting', 'strongman', 'powerlifting'].includes(ex.c)) return 6.0;
  if (ex.k === 'compound') return LIBRES.includes(ex.e) ? 6.0 : 5.0;
  return 3.5;
}

/** MET d'une visite sans exercices détaillés, selon ce qui a été travaillé. */
function metGeneral(types = []) {
  if (types.length && types.every((t) => t === 'cardio')) return 7.0;
  if (types.length && types.every((t) => t === 'etirements')) return 2.3;
  return 4.5; // musculation d'intensité modérée, temps de repos compris
}

const kcal = (met, kg, minutes) => (met * kg * minutes) / 60;

// ---------- Musculation : calcul série par série ----------
// Amplitude du mouvement (m) selon la famille de l'exercice.
const AMPLITUDE = {
  squat: 0.6, presse: 0.45, souleve: 0.55, fentes: 0.45, 'hip-thrust': 0.3, 'leg-extension': 0.4, 'leg-curl': 0.35,
  mollets: 0.12, developpe: 0.4, 'developpe-epaules': 0.5, dips: 0.45, pompes: 0.35, 'tirage-vertical': 0.5,
  rowing: 0.4, 'rowing-menton': 0.4, shrug: 0.1, curl: 0.4, 'triceps-extension': 0.35, ecartes: 0.4, pullover: 0.45,
  'elevation-laterale': 0.5, 'elevation-frontale': 0.5, oiseau: 0.45, crunch: 0.25, 'releve-jambes': 0.35, poignets: 0.08,
};
// Part du poids du corps déplacée pour les exercices sans charge (le lest saisi s'y ajoute).
const PART_DU_CORPS = {
  'tirage-vertical': 0.95, dips: 0.9, pompes: 0.65, squat: 0.7, fentes: 0.7, crunch: 0.3, 'releve-jambes': 0.3, 'hip-thrust': 0.5,
};
const RENDEMENT_MUSCULAIRE = 0.22; // ~22 % de l'énergie devient du travail mécanique
const SECONDES_PAR_REP = 3;
const RECUPERATION_S = 45; // dépense un peu supérieure au repos juste après chaque série
const MET_RECUPERATION = 2.5;

/** Calories d'une série de musculation : effort + travail mécanique + récupération. */
export function kcalSerie(ex, serie, poidsCorps) {
  const reps = Math.max(0, serie.reps || 0);
  if (!reps) return 0;
  const fam = famille(ex);
  const corps = ex.e === 'body only' ? (PART_DU_CORPS[fam] ?? 0.4) * poidsCorps : 0;
  const charge = corps + Math.max(0, serie.kg || 0);
  const dureeEffort = Math.max(20, reps * SECONDES_PAR_REP + 10); // secondes
  const effort = (metExercice(ex) * poidsCorps * dureeEffort) / 3600;
  const travail = (charge * 9.81 * (AMPLITUDE[fam] ?? 0.4) * reps * 1.3) / (4184 * RENDEMENT_MUSCULAIRE);
  const recuperation = (MET_RECUPERATION * poidsCorps * RECUPERATION_S) / 3600;
  return effort + travail + recuperation;
}

/**
 * Calories d'une séance, calculées à partir des séries validées :
 *  - musculation : série par série (exercice, charge, répétitions) ;
 *  - cardio, gainage, étirements : durée saisie × intensité.
 * Une séance sans aucune série (visite notée à la main) est estimée d'après sa durée,
 * sauf si `parTemps` est faux (séance en cours : rien ne compte tant qu'aucune série n'est validée).
 * Retourne { total, parExercice: [kcal par exercice, même ordre], poids, estime }.
 */
export function caloriesSeance(seance, { seuleValidees = true, parTemps = true } = {}) {
  const { kg, estime } = poidsA(seance.date);
  const exercices = seance.exercices || [];
  const parExercice = exercices.map(() => 0);
  let nbSeries = 0;

  exercices.forEach((e, i) => {
    const ex = exo(e.exId);
    const series = e.series.filter((x) => !seuleValidees || x.faite);
    nbSeries += series.length;
    const mode = colonnes(ex).mode;
    if (mode === 'cardio') {
      series.forEach((x) => (parExercice[i] += kcal(metExercice(ex, { minutes: x.reps || 0, km: x.kg || 0 }), kg, x.reps || 0)));
    } else if (mode === 'etirement' || mode === 'gainage') {
      parExercice[i] += kcal(metExercice(ex), kg, series.reduce((t, x) => t + (x.reps || 0), 0) / 60);
    } else {
      series.forEach((x) => (parExercice[i] += kcalSerie(ex, x, kg)));
    }
  });

  // Visite sans détail des séries : estimation d'après la durée.
  const autre = !nbSeries && parTemps ? kcal(metGeneral(seance.types), kg, Math.max(0, seance.duree || 0)) : 0;

  const total = parExercice.reduce((t, x) => t + x, 0) + autre;
  return { total, parExercice, poids: kg, estime };
}

export const totalCalories = (seances) => seances.reduce((t, s) => t + caloriesSeance(s).total, 0);

export const fmtKcal = (n) => `${Math.round(n).toLocaleString('fr-FR')} kcal`;

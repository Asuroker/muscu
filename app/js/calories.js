// Estimation des calories dépensées : kcal = MET × poids (kg) × durée (h).
// Valeurs MET tirées du Compendium of Physical Activities (Ainsworth et al.).
import { etat } from './store.js';
import { exo, colonnes } from './exercices.js';

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

/**
 * Calories d'une séance.
 * `seance.duree` (minutes) est le temps total ; `seuleValidees` ne compte que les séries cochées.
 * Retourne { total, parExercice: [kcal par exercice, même ordre], poids, estime }.
 */
export function caloriesSeance(seance, { seuleValidees = true } = {}) {
  const { kg, estime } = poidsA(seance.date);
  const duree = Math.max(0, seance.duree || 0);
  const exercices = seance.exercices || [];
  const parExercice = exercices.map(() => 0);

  // 1. Cardio et étirements : leur durée est saisie.
  let minutesExplicites = 0;
  const muscu = [];
  exercices.forEach((e, i) => {
    const ex = exo(e.exId);
    const series = e.series.filter((x) => !seuleValidees || x.faite);
    const mode = colonnes(ex).mode;
    if (mode === 'cardio') {
      series.forEach((x) => {
        const min = x.reps || 0;
        minutesExplicites += min;
        parExercice[i] += kcal(metExercice(ex, { minutes: min, km: x.kg || 0 }), kg, min);
      });
    } else if (mode === 'etirement') {
      const min = series.reduce((t, x) => t + (x.reps || 0), 0) / 60;
      minutesExplicites += min;
      parExercice[i] += kcal(metExercice(ex), kg, min);
    } else if (series.length) {
      muscu.push({ i, ex, nb: series.length });
    }
  });

  // 2. Le reste du temps est réparti entre les exercices de muscu selon le nombre de séries.
  const reste = Math.max(0, duree - minutesExplicites);
  const nbSeries = muscu.reduce((t, m) => t + m.nb, 0);
  let autre = 0;
  if (nbSeries) {
    muscu.forEach((m) => (parExercice[m.i] += kcal(metExercice(m.ex), kg, (reste * m.nb) / nbSeries)));
  } else if (reste > 0) {
    autre = kcal(metGeneral(seance.types), kg, reste);
  }

  const total = parExercice.reduce((t, x) => t + x, 0) + autre;
  return { total, parExercice, poids: kg, estime };
}

export const totalCalories = (seances) => seances.reduce((t, s) => t + caloriesSeance(s).total, 0);

export const fmtKcal = (n) => `${Math.round(n).toLocaleString('fr-FR')} kcal`;

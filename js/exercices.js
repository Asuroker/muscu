// Bibliothèque d'exercices (free-exercise-db, domaine public) et générateur de séance.

const BASE_IMAGES = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/';

export const MUSCLES = {
  abdominals: 'Abdominaux', abductors: 'Abducteurs', adductors: 'Adducteurs', biceps: 'Biceps',
  calves: 'Mollets', chest: 'Pectoraux', forearms: 'Avant-bras', glutes: 'Fessiers',
  hamstrings: 'Ischio-jambiers', lats: 'Grand dorsal', 'lower back': 'Lombaires', 'middle back': 'Milieu du dos',
  neck: 'Cou', quadriceps: 'Quadriceps', shoulders: 'Épaules', traps: 'Trapèzes', triceps: 'Triceps',
};

export const MATERIEL = {
  barbell: 'Barre', dumbbell: 'Haltères', machine: 'Machine', cable: 'Poulie', 'body only': 'Poids du corps',
  kettlebells: 'Kettlebell', bands: 'Élastiques', 'medicine ball': 'Médecine-ball', 'exercise ball': 'Swiss ball',
  'foam roll': 'Rouleau de massage', 'e-z curl bar': 'Barre EZ', other: 'Autre',
};

export const CATEGORIES = {
  strength: 'Musculation', stretching: 'Étirement', plyometrics: 'Pliométrie', powerlifting: 'Force athlétique',
  'olympic weightlifting': 'Haltérophilie', strongman: 'Strongman', cardio: 'Cardio',
};

export const NIVEAUX = { beginner: 'Débutant', intermediate: 'Intermédiaire', expert: 'Expert' };

/** Groupes proposés pour composer une séance. */
export const GROUPES = [
  { id: 'pecs', nom: 'Pecs', emoji: '🦍', muscles: ['chest'] },
  { id: 'dos', nom: 'Dos', emoji: '🦅', muscles: ['lats', 'middle back', 'lower back', 'traps'] },
  { id: 'epaules', nom: 'Épaules', emoji: '🏋️', muscles: ['shoulders'] },
  { id: 'biceps', nom: 'Biceps', emoji: '💪', muscles: ['biceps'] },
  { id: 'triceps', nom: 'Triceps', emoji: '🔱', muscles: ['triceps'] },
  { id: 'jambes', nom: 'Jambes', emoji: '🦵', muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'] },
  { id: 'fessiers', nom: 'Fessiers', emoji: '🍑', muscles: ['glutes', 'abductors', 'hamstrings'] },
  { id: 'abdos', nom: 'Abdos', emoji: '🍫', muscles: ['abdominals'] },
  { id: 'avantbras', nom: 'Avant-bras', emoji: '✊', muscles: ['forearms'] },
  { id: 'cardio', nom: 'Cardio', emoji: '❤️‍🔥', categorie: 'cardio' },
  { id: 'etirements', nom: 'Étirements', emoji: '🧘', categorie: 'stretching' },
];

export const MODELES = [
  { nom: 'Haut du corps', groupes: ['pecs', 'dos', 'epaules', 'biceps', 'triceps'] },
  { nom: 'Bas du corps', groupes: ['jambes', 'fessiers', 'abdos'] },
  { nom: 'Push (pousser)', groupes: ['pecs', 'epaules', 'triceps'] },
  { nom: 'Pull (tirer)', groupes: ['dos', 'biceps', 'avantbras'] },
  { nom: 'Full body', groupes: ['pecs', 'dos', 'jambes', 'epaules', 'abdos'] },
];

export const nomGroupe = (id) => GROUPES.find((g) => g.id === id)?.nom || id;

let liste = [];
let parId = new Map();

export async function chargerExercices() {
  if (liste.length) return liste;
  const r = await fetch('data/exercices.json');
  liste = await r.json();
  parId = new Map(liste.map((e) => [e.id, e]));
  return liste;
}

export const tous = () => liste;
export const exo = (id) => parId.get(id);
export const image = (ex, i = 0) => (ex?.i?.[i] ? BASE_IMAGES + ex.i[i] : null);

export function normaliser(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Colonnes de saisie selon le type d'exercice. */
export function colonnes(ex) {
  if (ex?.c === 'cardio') return { reps: 'Min', kg: 'Km', mode: 'cardio' };
  if (ex?.c === 'stretching') return { reps: 'Sec', kg: null, mode: 'etirement' };
  if (ex?.e === 'body only') return { reps: 'Reps', kg: 'Lest kg', mode: 'muscu' };
  return { reps: 'Reps', kg: 'Kg', mode: 'muscu' };
}

// Familles de mouvements : servent à trouver les variantes et à éviter les doublons.
const FAMILLES = [
  ['pullover', /pullover/i], ['ecartes', /fly|flye|crossover|butterfly|pec deck|iron cross/i],
  ['dips', /\bdip/i], ['pompes', /push-?up|pushup/i], ['tirage-vertical', /pulldown|pull-?up|pullup|chin/i],
  ['rowing-menton', /upright/i], ['rowing', /\brow/i], ['shrug', /shrug/i],
  ['souleve', /deadlift|good morning|rack pull/i], ['hip-thrust', /hip thrust|glute bridge|butt lift|hip raise|hip lift|bridge/i],
  ['fentes', /lunge|split squat|step ?up/i], ['presse', /leg press/i], ['squat', /squat/i],
  ['leg-curl', /leg curl|hamstring curl|glute ham/i], ['leg-extension', /leg extension/i],
  ['mollets', /calf/i], ['oiseau', /rear delt|reverse fly|rear lateral|reverse machine/i],
  ['elevation-laterale', /lateral|side raise|deltoid raise/i], ['elevation-frontale', /front .*raise|front raise|plate raise/i],
  ['poignets', /wrist/i], ['triceps-extension', /triceps|tricep|skull|kickback|pushdown|jm press|tate/i],
  ['curl', /curl/i], ['developpe-epaules', /shoulder press|military|arnold|overhead press|push press|bradford/i],
  ['developpe', /bench press|chest press|floor press|\bpress\b/i], ['crunch', /crunch|sit-?up|jackknife/i],
  ['gainage', /plank|bridge|bug|pallof/i], ['rotation', /twist|wood ?chop|rotation|russian/i],
  ['releve-jambes', /leg raise|knee.*raise|leg pull|knee tuck|hanging/i],
  ['abduction', /abduct/i], ['adduction', /adduct/i], ['kickback', /kickback/i],
];

export function famille(ex) {
  for (const [nom, re] of FAMILLES) if (re.test(ex.en)) return nom;
  return 'autre-' + ex.c;
}

export function variantes(ex, max = 12) {
  const f = famille(ex);
  return liste
    .filter((x) => x.id !== ex.id && famille(x) === f && x.m.some((m) => ex.m.includes(m)))
    .sort((a, b) => (b.ess - a.ess) || a.n.localeCompare(b.n))
    .slice(0, max);
}

export function muscleGroupe(groupeId) {
  return GROUPES.find((g) => g.id === groupeId);
}

function correspond(ex, groupe) {
  if (groupe.categorie) return ex.c === groupe.categorie;
  return ['strength', 'powerlifting'].includes(ex.c) && ex.m.some((m) => groupe.muscles.includes(m));
}

const PREFS_MATERIEL = {
  tout: null,
  machines: ['machine', 'cable'],
  libres: ['barbell', 'dumbbell', 'e-z curl bar', 'kettlebells'],
  corps: ['body only', 'bands', 'exercise ball', 'other'],
};

export function candidats(groupeId, materiel = 'tout', seulementEssentiels = true) {
  const g = muscleGroupe(groupeId);
  const prefs = PREFS_MATERIEL[materiel];
  let c = liste.filter((ex) => correspond(ex, g) && (!seulementEssentiels || ex.ess));
  if (prefs) {
    const filtres = c.filter((ex) => prefs.includes(ex.e));
    if (filtres.length >= 2) c = filtres;
  }
  return c;
}

function melanger(t) {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Nombre d'exercices conseillé pour une durée en minutes. */
export const nbExercicesPour = (min) => Math.max(2, Math.min(10, Math.round(min / 9)));

/**
 * Propose une séance : liste de {exId, series:[{reps, kg}]}.
 * Les exercices polyarticulaires passent en premier, sans deux variantes du même mouvement.
 */
export function genererSeance(groupes, minutes, materiel = 'tout') {
  const n = nbExercicesPour(minutes);
  const avecCardio = groupes.includes('cardio');
  const autres = groupes.filter((g) => g !== 'cardio');
  const choisis = [];
  const famillesPrises = new Set();

  const piocher = (groupeId, sousMuscle) => {
    let c = candidats(groupeId, materiel).filter((ex) => !choisis.includes(ex) && !famillesPrises.has(famille(ex)));
    if (sousMuscle) {
      const cible = c.filter((ex) => ex.m[0] === sousMuscle);
      if (cible.length) c = cible;
    }
    if (!c.length) c = candidats(groupeId, materiel, false).filter((ex) => !choisis.includes(ex) && !famillesPrises.has(famille(ex)) && ex.l !== 'expert');
    // Groupes à un seul type de mouvement (biceps = que des curls) : on accepte une autre variante.
    if (!c.length) c = candidats(groupeId, materiel).filter((ex) => !choisis.includes(ex));
    if (!c.length) return null;
    const compos = melanger(c.filter((ex) => ex.k === 'compound'));
    const isos = melanger(c.filter((ex) => ex.k !== 'compound'));
    const dejaDuGroupe = choisis.filter((ex) => correspond(ex, muscleGroupe(groupeId))).length;
    const ex = (dejaDuGroupe === 0 ? [...compos, ...isos] : [...isos, ...compos])[0];
    choisis.push(ex);
    famillesPrises.add(famille(ex));
    return ex;
  };

  let slots = avecCardio && autres.length ? n - 1 : n;
  if (!autres.length && avecCardio) slots = 0;

  // Répartition équitable entre groupes, en alternant les sous-muscles (ex. quadriceps / ischios / mollets).
  const tours = {};
  for (let i = 0; i < slots && autres.length; i++) {
    const g = autres[i % autres.length];
    tours[g] = (tours[g] || 0) + 1;
    const muscles = muscleGroupe(g).muscles || [];
    const sous = muscles.length > 1 ? muscles[(tours[g] - 1) % Math.min(muscles.length, 4)] : null;
    piocher(g, sous);
  }
  if (avecCardio) {
    const nbCardio = autres.length ? 1 : Math.max(1, Math.round(minutes / 20));
    for (let i = 0; i < nbCardio; i++) piocher('cardio');
  }

  // Ordre : polyarticulaires d'abord, cardio à la fin.
  const rang = (ex) => (ex.c === 'cardio' ? 3 : ex.c === 'stretching' ? 4 : ex.k === 'compound' ? 0 : 1);
  choisis.sort((a, b) => rang(a) - rang(b));

  const minutesCardio = autres.length ? 15 : Math.round(minutes / Math.max(1, choisis.length));
  return choisis.map((ex) => ({ exId: ex.id, series: seriesParDefaut(ex, minutesCardio) }));
}

export function seriesParDefaut(ex, minutesCardio = 15) {
  const mode = colonnes(ex).mode;
  if (mode === 'cardio') return [{ reps: minutesCardio, kg: 0, faite: false }];
  if (mode === 'etirement') return [{ reps: 30, kg: 0, faite: false }, { reps: 30, kg: 0, faite: false }];
  const compose = ex.k === 'compound';
  return Array.from({ length: compose ? 4 : 3 }, () => ({ reps: compose ? 10 : 12, kg: 0, faite: false }));
}

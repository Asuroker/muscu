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
// Catégories de muscles, sur deux niveaux :
//  - zone : grand groupe (Bras, Dos, Jambes…) ; `enfants` = ses muscles précis ;
//  - parent : muscle précis rattaché à une zone.
// Pecs, Épaules et Abdos sont à la fois une zone et un muscle (un seul muscle dedans).
// Les identifiants historiques (pecs, dos, biceps, fessiers…) sont conservés pour les séances déjà enregistrées.
export const GROUPES = [
  { id: 'bras', nom: 'Bras', emoji: '💪', zone: true, muscles: ['biceps', 'triceps', 'forearms'] },
  { id: 'dos', nom: 'Dos', emoji: '🦅', zone: true, muscles: ['lats', 'middle back', 'lower back', 'traps'] },
  { id: 'jambes', nom: 'Jambes', emoji: '🦵', zone: true, muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'] },
  { id: 'pecs', nom: 'Pecs', emoji: '🦍', zone: true, muscles: ['chest'] },
  { id: 'epaules', nom: 'Épaules', emoji: '🏋️', zone: true, muscles: ['shoulders'] },
  { id: 'abdos', nom: 'Abdos', emoji: '🍫', zone: true, muscles: ['abdominals'] },
  { id: 'cardio', nom: 'Cardio', emoji: '❤️‍🔥', zone: true, categorie: 'cardio' },
  { id: 'etirements', nom: 'Étirements', emoji: '🧘', zone: true, categorie: 'stretching' },

  { id: 'biceps', nom: 'Biceps', emoji: '💪', parent: 'bras', muscles: ['biceps'] },
  { id: 'triceps', nom: 'Triceps', emoji: '🔱', parent: 'bras', muscles: ['triceps'] },
  { id: 'avantbras', nom: 'Avant-bras', emoji: '✊', parent: 'bras', muscles: ['forearms'] },

  { id: 'grand-dorsal', nom: 'Grand dorsal', emoji: '🏊', parent: 'dos', muscles: ['lats'] },
  { id: 'milieu-dos', nom: 'Milieu du dos', emoji: '🔙', parent: 'dos', muscles: ['middle back'] },
  { id: 'lombaires', nom: 'Lombaires', emoji: '🧱', parent: 'dos', muscles: ['lower back'] },
  { id: 'trapezes', nom: 'Trapèzes', emoji: '⛰️', parent: 'dos', muscles: ['traps'] },

  { id: 'quadriceps', nom: 'Quadriceps', emoji: '🦵', parent: 'jambes', muscles: ['quadriceps'] },
  { id: 'ischios', nom: 'Ischio-jambiers', emoji: '🦿', parent: 'jambes', muscles: ['hamstrings'] },
  { id: 'fessiers', nom: 'Fessiers', emoji: '🍑', parent: 'jambes', muscles: ['glutes'] },
  { id: 'mollets', nom: 'Mollets', emoji: '🥾', parent: 'jambes', muscles: ['calves'] },
  { id: 'adducteurs', nom: 'Adducteurs', emoji: '↔️', parent: 'jambes', muscles: ['adductors'] },
  { id: 'abducteurs', nom: 'Abducteurs', emoji: '↕️', parent: 'jambes', muscles: ['abductors'] },

  { id: 'cou', nom: 'Cou', emoji: '🦒', muscles: ['neck'] },
];

export const ZONES = GROUPES.filter((g) => g.zone);
export const enfantsDe = (zoneId) => GROUPES.filter((g) => g.parent === zoneId);
/** Muscles précis sans zone (affichés dans « Autres »). */
export const MUSCLES_SEULS = GROUPES.filter((g) => !g.zone && !g.parent);

/** Catégorie la plus précise d'un exercice (muscle) : Triceps, Grand dorsal, Pecs, Cardio… */
export function categorieMuscle(ex) {
  if (!ex) return null;
  const parCat = GROUPES.find((g) => g.categorie === ex.c);
  if (parCat) return parCat;
  const m = ex.m[0];
  return GROUPES.find((g) => g.muscles?.includes(m) && !enfantsDe(g.id).length) || null;
}

/** Grand groupe d'un exercice : Bras, Dos, Jambes, Pecs… */
export function categorieZone(ex) {
  const c = categorieMuscle(ex);
  if (!c) return null;
  return c.parent ? GROUPES.find((g) => g.id === c.parent) : c;
}

/**
 * Sélection de catégories (Set d'identifiants) : un groupe coché inclut ses muscles.
 * Toucher un muscle d'un groupe coché le retire du groupe ; cocher tous les muscles revient au groupe.
 */
export function estChoisi(sel, id) {
  const g = GROUPES.find((x) => x.id === id);
  return sel.has(id) || !!(g?.parent && sel.has(g.parent));
}

export function basculerCategorie(sel, id) {
  const g = GROUPES.find((x) => x.id === id);
  if (!g) return;
  const enfants = enfantsDe(id);
  if (enfants.length) {
    if (sel.has(id)) sel.delete(id);
    else { sel.add(id); enfants.forEach((e) => sel.delete(e.id)); }
    return;
  }
  if (g.parent) {
    const freres = enfantsDe(g.parent);
    if (sel.has(g.parent)) {
      sel.delete(g.parent);
      freres.filter((f) => f.id !== id).forEach((f) => sel.add(f.id));
    } else if (sel.has(id)) {
      sel.delete(id);
    } else {
      sel.add(id);
      if (freres.every((f) => sel.has(f.id))) { freres.forEach((f) => sel.delete(f.id)); sel.add(g.parent); }
    }
    return;
  }
  sel.has(id) ? sel.delete(id) : sel.add(id);
}

export const MODELES = [
  { nom: 'Haut du corps', groupes: ['pecs', 'dos', 'epaules', 'bras'] },
  { nom: 'Bas du corps', groupes: ['jambes', 'abdos'] },
  { nom: 'Push (pousser)', groupes: ['pecs', 'epaules', 'triceps'] },
  { nom: 'Pull (tirer)', groupes: ['dos', 'biceps', 'avantbras'] },
  { nom: 'Bras complets', groupes: ['bras'] },
  { nom: 'Fessiers', groupes: ['fessiers', 'ischios', 'abducteurs'] },
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

/** Texte court d'une série : "10×45", "15 min · 2,5 km", "30 s". */
export function texteSerie(ex, x) {
  const n = (v) => String(v).replace('.', ',');
  const col = colonnes(ex);
  if (col.mode === 'cardio') return `${n(x.reps)} min${x.kg ? ` · ${n(x.kg)} km` : ''}`;
  if (col.mode === 'etirement') return `${n(x.reps)} s`;
  if (col.mode === 'gainage') return `${n(x.reps)} s${x.kg ? ` · +${n(x.kg)} kg` : ''}`;
  return x.kg ? `${n(x.reps)}×${n(x.kg)}` : `${n(x.reps)} reps`;
}

// Exercices de maintien (gainage, isométrie) : on les fait en secondes.
const GAINAGE_EN_PLUS = new Set(['One_Handed_Hang', 'Stomach_Vacuum']);
const PAS_GAINAGE = new Set(['Prone_Manual_Hamstring']);
export const estGainage = (ex) => !!ex && ((ex.f === 'static' && ex.c !== 'stretching' && !PAS_GAINAGE.has(ex.id)) || GAINAGE_EN_PLUS.has(ex.id));

/** Vrai si les séries se comptent en secondes (gainage, étirement) : on peut lancer un minuteur. */
export const enSecondes = (ex) => ['gainage', 'etirement'].includes(colonnes(ex).mode);

/** Colonnes de saisie selon le type d'exercice. */
export function colonnes(ex) {
  if (ex?.c === 'cardio') return { reps: 'Min', kg: 'Km', mode: 'cardio' };
  if (ex?.c === 'stretching') return { reps: 'Sec', kg: null, mode: 'etirement' };
  if (estGainage(ex)) return { reps: 'Sec', kg: 'Lest kg', mode: 'gainage' };
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
export function genererSeance(groupes, minutes, materiel = 'tout', schema = null) {
  const n = nbExercicesPour(minutes);
  const avecCardio = groupes.includes('cardio');
  const autres = groupes.filter((g) => g !== 'cardio' && muscleGroupe(g)); // ignore les catégories inconnues
  const choisis = [];
  const famillesPrises = new Set();

  const piocher = (groupeId, sousMuscle) => {
    let c = candidats(groupeId, materiel).filter((ex) => !choisis.includes(ex) && !famillesPrises.has(famille(ex)));
    if (sousMuscle) {
      const cible = c.filter((ex) => ex.m[0] === sousMuscle);
      // Ce muscle n'a plus de nouveau mouvement (ex. biceps = que des curls) : autre variante du même muscle.
      const memeMuscle = candidats(groupeId, materiel).filter((ex) => !choisis.includes(ex) && ex.m[0] === sousMuscle);
      if (cible.length) c = cible;
      else if (memeMuscle.length) c = memeMuscle;
    }
    // Plus de nouveau mouvement parmi les essentiels : on prend une autre variante courante
    // (ex. biceps = que des curls) plutôt qu'un exercice rare.
    if (!c.length) c = candidats(groupeId, materiel).filter((ex) => !choisis.includes(ex));
    if (!c.length) c = candidats(groupeId, materiel, false).filter((ex) => !choisis.includes(ex) && !famillesPrises.has(famille(ex)) && ex.l !== 'expert');
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
  return choisis.map((ex) => ({ exId: ex.id, series: seriesParDefaut(ex, minutesCardio, schema) }));
}

/** Formats séries × répétitions proposés (null = automatique selon l'exercice). */
export const FORMATS = [
  { id: 'auto', nom: 'Auto', detail: '4 × 10 / 3 × 12', schema: null },
  { id: 'force', nom: 'Force', detail: '5 × 5', schema: { series: 5, reps: 5 } },
  { id: 'muscle', nom: 'Muscle', detail: '4 × 8', schema: { series: 4, reps: 8 } },
  { id: 'volume', nom: 'Volume', detail: '4 × 12', schema: { series: 4, reps: 12 } },
  { id: 'endurance', nom: 'Endurance', detail: '3 × 15', schema: { series: 3, reps: 15 } },
];

/** Séries par défaut d'un exercice ; `schema` = { series, reps } impose un format pour la musculation. */
export function seriesParDefaut(ex, minutesCardio = 15, schema = null) {
  const mode = colonnes(ex).mode;
  if (mode === 'cardio') return [{ reps: minutesCardio, kg: 0, faite: false }];
  if (mode === 'etirement') return [{ reps: 30, kg: 0, faite: false }, { reps: 30, kg: 0, faite: false }];
  if (mode === 'gainage') return Array.from({ length: 3 }, () => ({ reps: 30, kg: 0, faite: false }));
  const compose = ex.k === 'compound';
  const n = schema?.series || (compose ? 4 : 3);
  const reps = schema?.reps || (compose ? 10 : 12);
  return Array.from({ length: n }, () => ({ reps, kg: 0, faite: false }));
}

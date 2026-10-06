// Besoins nutritionnels, conseils et recettes.
// Valeurs des ingrédients pour 100 g (approximatives, d'après les tables CIQUAL / USDA) :
// [nom, kcal, protéines, glucides, lipides]
import { etat, jour } from './store.js';
import { poidsA } from './calories.js';
import { RECETTES_PLUS } from './recettes.js';

export const INGREDIENTS = {
  avoine: ['Flocons d’avoine', 372, 13.5, 58.7, 7],
  lait: ['Lait demi-écrémé', 46, 3.3, 4.8, 1.6],
  banane: ['Banane', 90, 1.1, 20, 0.3],
  whey: ['Protéine en poudre (whey)', 380, 78, 6, 5],
  cacahuete: ['Beurre de cacahuète', 600, 25, 14, 50],
  oeuf: ['Œuf (≈ 55 g pièce)', 140, 12.5, 0.7, 9.5],
  pain: ['Pain complet', 240, 9, 41, 3.3],
  painBurger: ['Pain à burger', 270, 9, 49, 4],
  fromageBlanc: ['Fromage blanc 0 %', 46, 7.5, 4, 0.2],
  skyr: ['Skyr nature', 60, 10.5, 4, 0.2],
  cottage: ['Cottage cheese', 98, 11, 3.4, 4.3],
  fruitsRouges: ['Fruits rouges (surgelés)', 45, 1, 8, 0.4],
  pomme: ['Pomme', 52, 0.3, 12, 0.2],
  miel: ['Miel', 320, 0.4, 80, 0],
  amandes: ['Amandes', 610, 21, 9, 52],
  noix: ['Cerneaux de noix', 690, 15, 7, 65],
  chocolat: ['Chocolat noir 70 %', 580, 8, 33, 42],
  cacao: ['Cacao en poudre non sucré', 230, 20, 20, 14],
  galettesRiz: ['Galettes de riz soufflé', 390, 8, 82, 3],
  poulet: ['Blanc de poulet (cru)', 110, 23, 0, 1.8],
  dinde: ['Escalope de dinde (crue)', 105, 23, 0, 1.2],
  boeuf: ['Bœuf haché 5 % (cru)', 125, 21, 0, 5],
  saumon: ['Pavé de saumon (cru)', 200, 20, 0, 13],
  thon: ['Thon au naturel (égoutté)', 110, 25, 0, 1],
  jambon: ['Jambon blanc dégraissé', 110, 21, 1, 3],
  tofu: ['Tofu ferme', 145, 15, 2, 8.5],
  riz: ['Riz basmati (cru)', 355, 8, 78, 0.8],
  pates: ['Pâtes complètes (crues)', 350, 13, 65, 2.5],
  quinoa: ['Quinoa (cru)', 370, 14, 64, 6],
  lentilles: ['Lentilles corail (sèches)', 330, 24, 48, 1.5],
  poisChiches: ['Pois chiches (conserve, égouttés)', 140, 7.5, 18, 2.6],
  haricotsRouges: ['Haricots rouges (conserve, égouttés)', 110, 8, 15, 0.5],
  patateDouce: ['Patate douce', 86, 1.6, 20, 0.1],
  pommeDeTerre: ['Pomme de terre', 77, 2, 17, 0.1],
  tortilla: ['Tortilla de blé (≈ 60 g pièce)', 300, 8, 50, 7],
  brocoli: ['Brocoli', 34, 2.8, 5, 0.4],
  haricotsVerts: ['Haricots verts', 31, 1.8, 4.5, 0.2],
  courgette: ['Courgette', 17, 1.2, 2.5, 0.3],
  poivron: ['Poivron', 26, 1, 5, 0.3],
  oignon: ['Oignon', 40, 1.1, 8, 0.1],
  tomate: ['Tomate', 18, 0.9, 3, 0.2],
  epinards: ['Épinards (frais ou surgelés)', 23, 2.9, 1.5, 0.4],
  avocat: ['Avocat', 160, 2, 2, 15],
  coulis: ['Coulis de tomate', 35, 1.5, 6, 0.3],
  emmental: ['Emmental râpé', 380, 28, 0, 30],
  feta: ['Feta', 265, 14, 1, 21],
  huile: ['Huile d’olive', 900, 0, 0, 100],
  soja: ['Sauce soja', 60, 8, 5, 0.1],
  crevettes: ['Crevettes décortiquées (crues)', 85, 18, 0.5, 1],
  cabillaud: ['Dos de cabillaud (cru)', 80, 18, 0, 0.7],
  saumonFume: ['Saumon fumé', 180, 22, 0.5, 10],
  sardines: ['Sardines à l’huile (égouttées)', 210, 24, 0, 13],
  rumsteck: ['Rumsteck de bœuf (cru)', 130, 22, 0, 4.5],
  porc: ['Filet mignon de porc (cru)', 120, 21, 0, 4],
  blancOeuf: ['Blancs d’œufs liquides', 48, 10.5, 0.7, 0.2],
  mozzarella: ['Mozzarella', 250, 18, 1, 19],
  parmesan: ['Parmesan', 390, 33, 0, 28],
  yaourtGrec: ['Yaourt grec 2 %', 75, 10, 4, 2],
  laitCoco: ['Lait de coco allégé', 75, 0.8, 2, 7],
  houmous: ['Houmous', 270, 8, 14, 20],
  pesto: ['Pesto', 450, 5, 6, 45],
  olives: ['Olives noires', 150, 1, 1, 15],
  semoule: ['Semoule / couscous (crue)', 360, 12.5, 72, 1.5],
  nouillesRiz: ['Nouilles de riz (sèches)', 360, 6, 80, 0.6],
  boulgour: ['Boulgour (cru)', 345, 12, 69, 1.3],
  gnocchis: ['Gnocchis', 150, 4, 32, 0.5],
  cremeRiz: ['Crème de riz (poudre)', 370, 7, 82, 0.8],
  granola: ['Granola', 450, 10, 62, 17],
  pita: ['Pain pita', 275, 9, 55, 1.2],
  chia: ['Graines de chia', 490, 17, 8, 31],
  dattes: ['Dattes', 280, 2.5, 66, 0.4],
  mangue: ['Mangue', 60, 0.8, 14, 0.4],
  ananas: ['Ananas', 50, 0.5, 12, 0.1],
  mais: ['Maïs (conserve, égoutté)', 85, 3, 15, 1.2],
  petitsPois: ['Petits pois (surgelés)', 80, 5.5, 11, 0.4],
  edamame: ['Edamame (surgelés, écossés)', 120, 11, 7, 5],
  champignons: ['Champignons de Paris', 22, 3, 2, 0.3],
  carotte: ['Carotte', 37, 0.8, 7.5, 0.2],
  concombre: ['Concombre', 15, 0.7, 2.5, 0.1],
  salade: ['Salade verte', 15, 1.4, 1.5, 0.2],
};

// type : petitdej | repas | collation · tags : seche, masse, equilibre, vege, rapide, pre, post
const RECETTES_BASE = [
  {
    id: 'porridge-proteine', nom: 'Porridge protéiné banane & cacahuète', emoji: '🥣', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['masse', 'equilibre', 'rapide'],
    ingredients: [['avoine', 60], ['lait', 250], ['whey', 25], ['banane', 100], ['cacahuete', 15]],
    etapes: [
      'Verse les flocons d’avoine et le lait dans une petite casserole.',
      'Fais chauffer à feu moyen 4 à 5 minutes en remuant jusqu’à ce que ça épaississe.',
      'Hors du feu, ajoute la whey et mélange bien (sinon elle fait des grumeaux).',
      'Verse dans un bol, ajoute la banane en rondelles et le beurre de cacahuète.',
    ],
    astuce: 'Version micro-ondes : 2 min, on remue, puis 1 min de plus.',
  },
  {
    id: 'omelette-epinards-feta', nom: 'Omelette épinards & feta, pain complet', emoji: '🍳', type: 'petitdej', minutes: 10, portions: 1,
    tags: ['equilibre', 'seche', 'rapide'],
    ingredients: [['oeuf', 165], ['epinards', 60], ['feta', 30], ['pain', 60], ['huile', 5]],
    etapes: [
      'Bats les 3 œufs avec une pincée de sel et de poivre.',
      'Fais revenir les épinards 2 minutes dans la poêle huilée jusqu’à ce qu’ils fondent.',
      'Verse les œufs, émiette la feta par-dessus et laisse cuire 3 à 4 minutes à feu doux.',
      'Plie l’omelette en deux et sers avec le pain complet grillé.',
    ],
  },
  {
    id: 'bowl-skyr', nom: 'Bowl skyr, fruits rouges & amandes', emoji: '🫐', type: 'petitdej', minutes: 3, portions: 1,
    tags: ['seche', 'equilibre', 'rapide'],
    ingredients: [['skyr', 250], ['fruitsRouges', 125], ['amandes', 20], ['miel', 10]],
    etapes: [
      'Verse le skyr dans un bol.',
      'Ajoute les fruits rouges (décongelés la veille au frigo, ou directement surgelés).',
      'Parsème d’amandes concassées et termine avec un filet de miel.',
    ],
  },
  {
    id: 'pancakes-proteines', nom: 'Pancakes protéinés à la banane', emoji: '🥞', type: 'petitdej', minutes: 15, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['avoine', 50], ['oeuf', 110], ['banane', 100], ['whey', 20], ['huile', 3]],
    etapes: [
      'Mixe l’avoine, les 2 œufs, la banane et la whey jusqu’à obtenir une pâte lisse.',
      'Laisse reposer 5 minutes pour que la pâte épaississe.',
      'Dans une poêle à peine huilée à feu moyen, verse des petites louches de pâte.',
      'Retourne quand des bulles apparaissent (environ 2 minutes), puis 1 minute de l’autre côté.',
    ],
    astuce: 'Ajoute quelques fruits rouges ou un peu de fromage blanc par-dessus.',
  },
  {
    id: 'overnight-oats', nom: 'Overnight oats (prêt la veille)', emoji: '🫙', type: 'petitdej', minutes: 5, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['avoine', 50], ['skyr', 150], ['lait', 100], ['fruitsRouges', 80], ['miel', 10]],
    etapes: [
      'Le soir, mélange l’avoine, le skyr et le lait dans un bocal.',
      'Ajoute les fruits rouges et le miel, ferme et mets au frigo toute la nuit.',
      'Le matin, c’est prêt : mélange et mange froid.',
    ],
  },
  {
    id: 'tartines-oeufs-avocat', nom: 'Tartines œufs brouillés & avocat', emoji: '🥑', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['pain', 80], ['oeuf', 110], ['avocat', 60]],
    etapes: [
      'Fais griller les tranches de pain.',
      'Écrase l’avocat à la fourchette avec un peu de sel, de poivre et de citron, puis tartine.',
      'Brouille les 2 œufs à feu doux en remuant sans arrêt, retire-les encore crémeux.',
      'Dépose les œufs sur les tartines.',
    ],
  },
  {
    id: 'poulet-riz-brocoli', nom: 'Poulet, riz & brocoli (le classique)', emoji: '🍗', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre', 'masse', 'seche'],
    ingredients: [['poulet', 150], ['riz', 80], ['brocoli', 200], ['huile', 10]],
    etapes: [
      'Fais cuire le riz dans 2 fois son volume d’eau salée (environ 12 minutes).',
      'Pendant ce temps, cuis le brocoli à la vapeur ou dans l’eau bouillante 6 à 7 minutes.',
      'Coupe le poulet en morceaux, assaisonne (paprika, ail, sel, poivre) et poêle-le dans l’huile 6 à 8 minutes.',
      'Vérifie que le poulet n’est plus rosé au centre, puis assemble l’assiette.',
    ],
    astuce: 'Prépare 3 ou 4 portions d’un coup pour tes repas de la semaine (meal prep).',
  },
  {
    id: 'saumon-patate-douce', nom: 'Saumon, patate douce rôtie & haricots verts', emoji: '🐟', type: 'repas', minutes: 30, portions: 1,
    tags: ['equilibre'],
    ingredients: [['saumon', 150], ['patateDouce', 250], ['haricotsVerts', 200], ['huile', 5]],
    etapes: [
      'Préchauffe le four à 200 °C. Coupe la patate douce en cubes, mélange avec l’huile, sel et paprika.',
      'Enfourne les cubes 25 minutes en les retournant à mi-cuisson.',
      'Ajoute le pavé de saumon sur la plaque pour les 12 dernières minutes.',
      'Cuis les haricots verts 8 minutes à l’eau bouillante ou à la vapeur.',
    ],
  },
  {
    id: 'bolo-complete', nom: 'Pâtes complètes bolognaise', emoji: '🍝', type: 'repas', minutes: 25, portions: 1,
    tags: ['masse'],
    ingredients: [['pates', 100], ['boeuf', 150], ['coulis', 150], ['oignon', 50], ['emmental', 20], ['huile', 5]],
    etapes: [
      'Fais cuire les pâtes selon le temps indiqué sur le paquet.',
      'Émince l’oignon et fais-le revenir 3 minutes dans l’huile.',
      'Ajoute le bœuf haché, fais-le dorer en l’émiettant, puis verse le coulis.',
      'Laisse mijoter 10 minutes (sel, poivre, herbes de Provence), puis sers sur les pâtes avec l’emmental.',
    ],
  },
  {
    id: 'chili', nom: 'Chili con carne & riz', emoji: '🌶️', type: 'repas', minutes: 30, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['boeuf', 120], ['haricotsRouges', 120], ['riz', 70], ['coulis', 150], ['oignon', 50], ['poivron', 80]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais revenir l’oignon et le poivron coupés en dés 5 minutes à la poêle.',
      'Ajoute le bœuf haché et fais-le dorer, puis le coulis, les haricots rouges, du cumin et une pincée de piment.',
      'Laisse mijoter 15 minutes à couvert et sers avec le riz.',
    ],
    astuce: 'Encore meilleur réchauffé le lendemain.',
  },
  {
    id: 'wraps-poulet', nom: 'Wraps poulet & crudités', emoji: '🌯', type: 'repas', minutes: 15, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['tortilla', 120], ['poulet', 130], ['tomate', 80], ['avocat', 50], ['fromageBlanc', 50]],
    etapes: [
      'Coupe le poulet en lanières, assaisonne et poêle-le 6 minutes.',
      'Mélange le fromage blanc avec sel, poivre et ciboulette pour faire la sauce.',
      'Tartine les tortillas de sauce, ajoute poulet, tomate et avocat en tranches.',
      'Roule bien serré. Tu peux les passer 1 minute à la poêle pour les dorer.',
    ],
  },
  {
    id: 'curry-pois-chiches', nom: 'Curry de pois chiches, épinards & quinoa', emoji: '🍛', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['poisChiches', 200], ['quinoa', 70], ['epinards', 100], ['coulis', 100], ['oignon', 50], ['huile', 10]],
    etapes: [
      'Rince le quinoa et cuis-le 12 minutes dans 2 fois son volume d’eau.',
      'Fais revenir l’oignon dans l’huile avec 1 cuillère à café de curry.',
      'Ajoute les pois chiches et le coulis, laisse mijoter 8 minutes.',
      'Incorpore les épinards à la fin jusqu’à ce qu’ils fondent, puis sers avec le quinoa.',
    ],
  },
  {
    id: 'salade-nicoise', nom: 'Salade façon niçoise au thon', emoji: '🥗', type: 'repas', minutes: 20, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['thon', 120], ['pommeDeTerre', 200], ['oeuf', 55], ['haricotsVerts', 100], ['tomate', 100], ['huile', 10]],
    etapes: [
      'Cuis les pommes de terre coupées en morceaux 15 minutes dans l’eau bouillante salée.',
      'Cuis l’œuf 9 minutes (dur) et les haricots verts 8 minutes.',
      'Laisse refroidir puis assemble avec la tomate et le thon émietté.',
      'Assaisonne avec l’huile d’olive, un peu de vinaigre, sel et poivre.',
    ],
  },
  {
    id: 'dinde-courgettes', nom: 'Dinde, courgettes & riz', emoji: '🥘', type: 'repas', minutes: 20, portions: 1,
    tags: ['seche'],
    ingredients: [['dinde', 150], ['courgette', 250], ['riz', 60], ['huile', 10]],
    etapes: [
      'Lance la cuisson du riz.',
      'Coupe la courgette en demi-rondelles et fais-la dorer 8 minutes à la poêle avec la moitié de l’huile.',
      'Dans une autre poêle, cuis la dinde en lanières avec le reste de l’huile, ail et herbes, 6 minutes.',
      'Mélange le tout et sers.',
    ],
  },
  {
    id: 'dahl-lentilles', nom: 'Dahl de lentilles corail', emoji: '🍲', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['lentilles', 80], ['coulis', 150], ['oignon', 50], ['epinards', 100], ['riz', 50], ['huile', 5]],
    etapes: [
      'Fais revenir l’oignon dans l’huile avec du curry et du cumin.',
      'Ajoute les lentilles rincées, le coulis et 250 ml d’eau.',
      'Laisse mijoter 15 à 18 minutes jusqu’à ce que les lentilles soient fondantes ; ajoute les épinards à la fin.',
      'Sers avec le riz cuit à part.',
    ],
  },
  {
    id: 'tofu-saute', nom: 'Tofu sauté aux légumes & riz', emoji: '🥢', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['tofu', 200], ['poivron', 100], ['brocoli', 150], ['riz', 70], ['soja', 15], ['huile', 10]],
    etapes: [
      'Lance la cuisson du riz.',
      'Coupe le tofu en cubes et fais-le dorer 6 à 8 minutes dans l’huile bien chaude.',
      'Ajoute le poivron et le brocoli en petits morceaux, fais sauter 5 minutes.',
      'Verse la sauce soja, mélange 1 minute et sers sur le riz.',
    ],
  },
  {
    id: 'burger-maison', nom: 'Burger maison & frites au four', emoji: '🍔', type: 'repas', minutes: 35, portions: 1,
    tags: ['masse'],
    ingredients: [['painBurger', 80], ['boeuf', 150], ['emmental', 20], ['tomate', 50], ['oignon', 20], ['pommeDeTerre', 250], ['huile', 10]],
    etapes: [
      'Préchauffe le four à 220 °C. Coupe les pommes de terre en frites, mélange avec l’huile et du sel.',
      'Enfourne 25 à 30 minutes en les retournant une fois.',
      'Forme un steak avec le bœuf haché et cuis-le 3 à 4 minutes par face ; ajoute le fromage à la fin pour qu’il fonde.',
      'Monte le burger avec la tomate et l’oignon dans le pain grillé.',
    ],
    astuce: 'Le cheat meal… qui reste raisonnable 😉',
  },
  {
    id: 'shake-post', nom: 'Shake post-entraînement', emoji: '🥤', type: 'collation', minutes: 3, portions: 1,
    tags: ['masse', 'post', 'rapide'],
    ingredients: [['whey', 30], ['lait', 300], ['banane', 120], ['avoine', 30]],
    etapes: [
      'Mets tout dans un blender.',
      'Mixe 30 secondes jusqu’à ce que ce soit bien lisse.',
      'À boire dans l’heure qui suit ta séance.',
    ],
  },
  {
    id: 'fromage-blanc-cacao', nom: 'Fromage blanc au cacao (dessert protéiné)', emoji: '🍫', type: 'collation', minutes: 2, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['fromageBlanc', 250], ['cacao', 10], ['miel', 10]],
    etapes: [
      'Mélange le cacao et le miel dans le fromage blanc jusqu’à ce que ce soit homogène.',
      'Mets 10 minutes au frais pour une texture de mousse.',
    ],
  },
  {
    id: 'galettes-pre', nom: 'Galettes de riz, cacahuète & banane (avant la séance)', emoji: '⚡', type: 'collation', minutes: 2, portions: 1,
    tags: ['pre', 'rapide', 'equilibre'],
    ingredients: [['galettesRiz', 30], ['cacahuete', 20], ['banane', 100]],
    etapes: [
      'Tartine les 3 galettes de riz de beurre de cacahuète.',
      'Ajoute la banane en rondelles.',
      'À manger 45 min à 1 h avant l’entraînement pour avoir de l’énergie.',
    ],
  },
  {
    id: 'energy-balls', nom: 'Energy balls avoine & cacahuète (4 boules)', emoji: '🟤', type: 'collation', minutes: 15, portions: 4,
    tags: ['masse', 'pre'],
    ingredients: [['avoine', 80], ['cacahuete', 60], ['miel', 30], ['chocolat', 20], ['whey', 30]],
    etapes: [
      'Mélange l’avoine, la whey et le chocolat haché dans un saladier.',
      'Ajoute le beurre de cacahuète et le miel, mélange jusqu’à obtenir une pâte qui se tient.',
      'Forme 4 grosses boules (ou 8 petites) avec les mains.',
      'Laisse durcir 30 minutes au frigo. Se conservent 5 jours dans une boîte.',
    ],
  },
  {
    id: 'cottage-pomme', nom: 'Cottage cheese, pomme & noix', emoji: '🍏', type: 'collation', minutes: 3, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['cottage', 200], ['pomme', 150], ['noix', 15]],
    etapes: [
      'Coupe la pomme en petits dés.',
      'Mélange avec le cottage cheese, ajoute les noix et une pincée de cannelle.',
    ],
  },
];

export const RECETTES = [...RECETTES_BASE, ...RECETTES_PLUS];

export const TYPES_REPAS = { petitdej: 'Petit-déjeuner', repas: 'Déjeuner / dîner', collation: 'Collation' };
export const TAGS = {
  seche: 'Sèche', masse: 'Prise de masse', equilibre: 'Équilibré', vege: 'Végétarien', rapide: 'Rapide', pre: 'Avant la séance', post: 'Après la séance',
};

export const recette = (id) => RECETTES.find((r) => r.id === id);

/** Valeurs nutritionnelles d'une portion (× facteur). */
export function macrosRecette(r, facteur = 1) {
  const t = { kcal: 0, p: 0, g: 0, l: 0 };
  for (const [id, g] of r.ingredients) {
    const [, kcal, p, gl, l] = INGREDIENTS[id];
    const q = (g * facteur) / r.portions / 100;
    t.kcal += kcal * q; t.p += p * q; t.g += gl * q; t.l += l * q;
  }
  return t;
}

// ---------- Besoins ----------

export const ACTIVITES = [
  { id: 'sedentaire', nom: 'Peu actif (travail assis, peu de marche)', facteur: 1.375 },
  { id: 'modere', nom: 'Modérément actif (3–4 séances / semaine)', facteur: 1.55 },
  { id: 'actif', nom: 'Très actif (5–6 séances ou travail physique)', facteur: 1.725 },
];

export const OBJECTIFS_NUTRI = {
  perte: { nom: 'Perdre du gras', emoji: '🔥', tag: 'seche' },
  maintien: { nom: 'Maintenir / recomposition', emoji: '⚖️', tag: 'equilibre' },
  prise: { nom: 'Prendre du muscle', emoji: '💪', tag: 'masse' },
};

/** Objectif nutritionnel : choisi dans le profil, sinon déduit de l'objectif de poids. */
export function objectifNutri() {
  const choix = etat.profil?.objectif;
  if (choix && choix !== 'auto') return choix;
  const cible = etat.objectifs?.poids?.cible;
  const actuel = poidsA(jour()).kg;
  if (cible && cible < actuel - 1) return 'perte';
  if (cible && cible > actuel + 1) return 'prise';
  return 'maintien';
}

export const profilComplet = () => {
  const p = etat.profil || {};
  return p.sexe && p.age > 0 && p.taille > 0;
};

/** Besoins journaliers (Mifflin-St Jeor × activité, ajustés selon l'objectif). */
export function besoins() {
  const p = etat.profil || {};
  const { kg, estime } = poidsA(jour());
  const bmr = 10 * kg + 6.25 * (p.taille || 175) - 5 * (p.age || 25) + (p.sexe === 'F' ? -161 : 5);
  const act = ACTIVITES.find((a) => a.id === p.activite) || ACTIVITES[1];
  const maintien = bmr * act.facteur;
  const obj = objectifNutri();
  let kcal = maintien;
  if (obj === 'perte') kcal = maintien - Math.min(500, maintien * 0.2);
  if (obj === 'prise') kcal = maintien + Math.min(300, maintien * 0.1);
  const protParKg = { perte: 2.0, maintien: 1.8, prise: 1.8 }[obj];
  const lipParKg = obj === 'perte' ? 0.8 : 0.9;
  const p_ = protParKg * kg, l = lipParKg * kg;
  const g = Math.max(0, (kcal - p_ * 4 - l * 9) / 4);
  return {
    kcal: Math.round(kcal), maintien: Math.round(maintien), bmr: Math.round(bmr),
    p: Math.round(p_), g: Math.round(g), l: Math.round(l),
    eau: Math.round((kg * 0.035 + 0.5) * 10) / 10,
    objectif: obj, poids: kg, poidsEstime: estime,
  };
}

// ---------- Conseils ----------

export const CONSEILS = {
  general: [
    ['🥩', 'Des protéines à chaque repas', 'Vise 25 à 40 g par repas (viande, poisson, œufs, skyr, tofu, légumineuses). C’est ce qui nourrit tes muscles après l’entraînement.'],
    ['💧', 'Bois suffisamment', 'Environ 35 ml par kilo de poids corporel, plus 500 ml les jours de séance. Une urine claire est un bon indicateur.'],
    ['🥦', 'Des légumes deux fois par jour', 'Fibres, vitamines et minéraux : ils aident la digestion et la récupération, pour très peu de calories.'],
    ['⏰', 'Autour de la séance', 'Un repas ou une collation avec des glucides 1 à 2 h avant, et des protéines dans les 2 h qui suivent.'],
    ['😴', 'Le sommeil compte autant que l’assiette', '7 à 9 h par nuit : c’est pendant le sommeil que le muscle se reconstruit, et ça régule l’appétit.'],
    ['📦', 'Prépare à l’avance', 'Cuisiner 3 ou 4 portions d’un coup (meal prep) évite de craquer sur la malbouffe quand tu es pressé.'],
  ],
  perte: [
    ['📉', 'Un déficit modéré', 'Mange environ 15 à 20 % sous ton maintien. Trop bas, tu perds du muscle et de l’énergie à la salle.'],
    ['🎯', 'Rythme visé', 'Entre 0,5 et 1 % de ton poids par semaine. Plus vite, c’est surtout du muscle et de l’eau que tu perds.'],
    ['🥗', 'Volume et satiété', 'Remplis la moitié de l’assiette de légumes, privilégie les aliments peu transformés et les protéines maigres.'],
    ['🥤', 'Attention aux calories liquides', 'Sodas, jus, alcool : ils comptent beaucoup sans caler. Garde-les pour tes bons de récompense 😉'],
    ['🏋️', 'Continue à soulever lourd', 'Garder des charges élevées dit au corps de conserver le muscle pendant la sèche.'],
  ],
  maintien: [
    ['⚖️', 'Stabilité', 'Mange autour de ton maintien et surveille ton poids sur 2 à 3 semaines plutôt qu’au jour le jour.'],
    ['🔁', 'Recomposition', 'Avec assez de protéines et une progression régulière des charges, tu peux prendre du muscle et perdre un peu de gras en même temps, surtout en débutant.'],
    ['🍽️', 'La règle 80/20', '80 % d’aliments simples et nutritifs, 20 % de plaisir : c’est tenable sur le long terme.'],
  ],
  prise: [
    ['📈', 'Un léger surplus', '+200 à +300 kcal par jour suffisent. Au-delà, tu stockes surtout du gras.'],
    ['🎯', 'Rythme visé', 'Entre 0,25 et 0,5 % de ton poids par semaine. Si la balance ne bouge pas en 2 semaines, ajoute 150 kcal.'],
    ['🍚', 'Les glucides sont tes alliés', 'Riz, pâtes, avoine, pommes de terre : ils remplissent tes réserves pour des séances plus lourdes.'],
    ['🥜', 'Calories faciles', 'Si tu as du mal à manger plus : beurre de cacahuète, oléagineux, shakes maison, huile d’olive dans les plats.'],
    ['📊', 'Progresse sur tes charges', 'Le surplus ne sert à rien sans stimulation : note tes charges et essaie de battre la séance précédente.'],
  ],
};

/** Journée type : un petit-déjeuner, deux repas et une collation adaptés à l'objectif. */
export function journeeType(graine = 0) {
  const tag = OBJECTIFS_NUTRI[objectifNutri()].tag;
  const choisir = (type, decalage) => {
    const c = RECETTES.filter((r) => r.type === type && r.tags.includes(tag));
    const pool = c.length ? c : RECETTES.filter((r) => r.type === type);
    return pool[(graine + decalage) % pool.length];
  };
  const repas = RECETTES.filter((r) => r.type === 'repas' && r.tags.includes(tag));
  const pool = repas.length >= 2 ? repas : RECETTES.filter((r) => r.type === 'repas');
  const dej = pool[graine % pool.length];
  const din = pool[(graine + 1 + Math.floor(pool.length / 2)) % pool.length] === dej ? pool[(graine + 1) % pool.length] : pool[(graine + 1 + Math.floor(pool.length / 2)) % pool.length];
  return [
    { moment: 'Petit-déjeuner', r: choisir('petitdej', 0) },
    { moment: 'Déjeuner', r: dej },
    { moment: 'Collation', r: choisir('collation', 1) },
    { moment: 'Dîner', r: din },
  ];
}

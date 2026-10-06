// Troisième série de recettes (mêmes champs que dans nutrition.js).
// type : petitdej | repas | collation · tags : seche, masse, equilibre, vege, rapide, pre, post
export const RECETTES_PLUS_2 = [
  // ---------- Petits-déjeuners ----------
  {
    id: 'crepes-proteinees', nom: 'Crêpes protéinées aux fruits rouges', emoji: '🫓', type: 'petitdej', minutes: 15, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['farine', 40], ['oeuf', 110], ['lait', 150], ['whey', 20], ['fruitsRouges', 60], ['huile', 3]],
    etapes: [
      'Fouette la farine, la whey, les 2 œufs et le lait jusqu’à obtenir une pâte lisse et assez liquide.',
      'Laisse reposer 5 minutes.',
      'Fais cuire des crêpes fines dans une poêle à peine huilée, environ 1 minute par face.',
      'Garnis avec les fruits rouges.',
    ],
  },
  {
    id: 'tartine-ricotta', nom: 'Tartines ricotta, miel & noix', emoji: '🧀', type: 'petitdej', minutes: 4, portions: 1,
    tags: ['equilibre', 'rapide', 'vege'],
    ingredients: [['pain', 70], ['ricotta', 80], ['miel', 10], ['noix', 10]],
    etapes: [
      'Fais griller le pain.',
      'Tartine la ricotta, ajoute les noix concassées et un filet de miel.',
    ],
  },
  {
    id: 'porridge-chocolat', nom: 'Porridge chocolat-banane', emoji: '🍫', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['avoine', 60], ['lait', 250], ['whey', 25], ['cacao', 8], ['banane', 80]],
    etapes: [
      'Fais cuire l’avoine dans le lait 4 à 5 minutes en remuant.',
      'Hors du feu, ajoute le cacao et la whey, mélange bien.',
      'Termine avec la banane en rondelles.',
    ],
  },
  {
    id: 'oeufs-cocotte', nom: 'Œufs cocotte au jambon & mouillettes', emoji: '🥚', type: 'petitdej', minutes: 15, portions: 1,
    tags: ['equilibre'],
    ingredients: [['oeuf', 110], ['jambon', 40], ['cremeLegere', 20], ['pain', 50]],
    etapes: [
      'Préchauffe le four à 180 °C.',
      'Dans 2 ramequins, mets le jambon en morceaux et une cuillère de crème, puis casse un œuf dans chacun.',
      'Fais cuire au bain-marie au four 10 à 12 minutes : le blanc doit être pris et le jaune coulant.',
      'Sers avec le pain coupé en mouillettes.',
    ],
  },
  {
    id: 'sandwich-oeuf-jambon', nom: 'Sandwich pain de mie œuf & jambon', emoji: '🥪', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['painMie', 60], ['oeuf', 55], ['jambon', 40], ['salade', 20]],
    etapes: [
      'Fais cuire l’œuf au plat ou en omelette fine.',
      'Garnis le pain de mie avec le jambon, l’œuf et la salade.',
      'Tu peux le passer 2 minutes à la poêle pour un croque doré.',
    ],
  },
  {
    id: 'bowl-cottage-ananas', nom: 'Bowl cottage cheese, ananas & granola', emoji: '🍍', type: 'petitdej', minutes: 3, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['cottage', 200], ['ananas', 100], ['granola', 25]],
    etapes: ['Verse le cottage cheese dans un bol, ajoute l’ananas en morceaux et le granola.'],
  },
  {
    id: 'galettes-avoine-banane', nom: 'Galettes avoine-banane', emoji: '🍌', type: 'petitdej', minutes: 12, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['avoine', 50], ['banane', 100], ['oeuf', 55], ['cacahuete', 10]],
    etapes: [
      'Écrase la banane, mélange avec l’œuf et l’avoine.',
      'Forme 3 ou 4 petites galettes dans une poêle antiadhésive chaude.',
      'Cuis 2 à 3 minutes par face et sers avec le beurre de cacahuète.',
    ],
  },
  {
    id: 'smoothie-avoine', nom: 'Smoothie petit-déj avoine & cacahuète', emoji: '🥛', type: 'petitdej', minutes: 3, portions: 1,
    tags: ['masse', 'rapide'],
    ingredients: [['avoine', 40], ['banane', 100], ['lait', 250], ['cacahuete', 15], ['whey', 20]],
    etapes: [
      'Mets tout dans un blender.',
      'Mixe 45 secondes jusqu’à ce que l’avoine soit bien fine. Un petit-déj complet à boire en 2 minutes.',
    ],
  },

  // ---------- Plats ----------
  {
    id: 'shakshuka', nom: 'Shakshuka (œufs à la tomate & poivron)', emoji: '🍳', type: 'repas', minutes: 25, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['oeuf', 165], ['coulis', 200], ['poivron', 100], ['oignon', 50], ['feta', 20], ['pain', 60], ['huile', 5]],
    etapes: [
      'Fais revenir l’oignon et le poivron émincés dans l’huile 6 minutes avec cumin et paprika.',
      'Ajoute le coulis et laisse mijoter 5 minutes.',
      'Creuse 3 puits, casse un œuf dans chacun, couvre et laisse cuire 6 à 8 minutes.',
      'Émiette la feta par-dessus et sers avec le pain.',
    ],
  },
  {
    id: 'poulet-tikka', nom: 'Poulet tikka masala & riz', emoji: '🍛', type: 'repas', minutes: 30, portions: 1,
    tags: ['equilibre', 'masse'],
    ingredients: [['poulet', 150], ['yaourtGrec', 60], ['riz', 75], ['coulis', 80], ['oignon', 40], ['huile', 5]],
    etapes: [
      'Mélange le poulet en dés avec la moitié du yaourt et 1 cuillère de garam masala (10 minutes minimum).',
      'Lance la cuisson du riz.',
      'Fais revenir l’oignon dans l’huile, ajoute le poulet et fais-le dorer 6 minutes.',
      'Ajoute le coulis, laisse mijoter 8 minutes, puis le reste du yaourt hors du feu.',
    ],
  },
  {
    id: 'moussaka-legere', nom: 'Moussaka légère', emoji: '🍆', type: 'repas', minutes: 45, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['aubergine', 250], ['boeuf', 130], ['coulis', 120], ['yaourtGrec', 60], ['emmental', 20], ['huile', 5]],
    etapes: [
      'Coupe l’aubergine en tranches, badigeonne-les d’huile et fais-les rôtir 15 minutes à 200 °C.',
      'Fais dorer le bœuf haché avec ail, cannelle et origan, puis ajoute le coulis.',
      'Alterne dans un plat : aubergines, viande, aubergines.',
      'Couvre du yaourt mélangé à l’emmental et gratine 15 minutes.',
    ],
  },
  {
    id: 'ratatouille-oeufs', nom: 'Ratatouille & œufs pochés', emoji: '🫑', type: 'repas', minutes: 40, portions: 1,
    tags: ['vege', 'seche'],
    ingredients: [['aubergine', 150], ['courgette', 150], ['poivron', 100], ['tomate', 150], ['oeuf', 110], ['huile', 10], ['pain', 50]],
    etapes: [
      'Coupe tous les légumes en dés et fais-les revenir dans l’huile 5 minutes.',
      'Ajoute herbes de Provence, ail, sel et poivre, couvre et laisse mijoter 25 minutes.',
      'Poche les 2 œufs 3 minutes dans une eau frémissante vinaigrée.',
      'Sers les œufs sur la ratatouille avec le pain.',
    ],
  },
  {
    id: 'quiche-sans-pate', nom: 'Quiche sans pâte poireaux & jambon (2 parts)', emoji: '🥧', type: 'repas', minutes: 40, portions: 2,
    tags: ['seche'],
    ingredients: [['oeuf', 330], ['lait', 300], ['jambon', 160], ['poireau', 300], ['emmental', 50]],
    etapes: [
      'Préchauffe le four à 180 °C. Fais fondre les poireaux émincés 10 minutes à la poêle avec un peu d’eau.',
      'Bats les 6 œufs avec le lait, sel, poivre et muscade.',
      'Mets les poireaux et le jambon en dés dans un plat, verse les œufs et parsème d’emmental.',
      'Enfourne 25 à 30 minutes jusqu’à ce que ce soit pris et doré.',
    ],
    astuce: 'Se mange chaud ou froid : la deuxième part fait un super repas du lendemain.',
  },
  {
    id: 'fajitas-boeuf', nom: 'Fajitas de bœuf aux poivrons', emoji: '🌯', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['tortilla', 120], ['rumsteck', 140], ['poivron', 120], ['oignon', 50], ['yaourtGrec', 40], ['huile', 5]],
    etapes: [
      'Coupe le bœuf, le poivron et l’oignon en lanières.',
      'Fais sauter les légumes 5 minutes à feu vif, puis le bœuf 2 à 3 minutes avec cumin, paprika et piment.',
      'Réchauffe les tortillas, garnis et ajoute le yaourt grec.',
    ],
  },
  {
    id: 'dinde-moutarde', nom: 'Escalope de dinde sauce moutarde, riz & haricots', emoji: '🍽️', type: 'repas', minutes: 20, portions: 1,
    tags: ['seche'],
    ingredients: [['dinde', 160], ['cremeLegere', 30], ['riz', 70], ['haricotsVerts', 150], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz et des haricots verts.',
      'Fais dorer l’escalope 4 minutes par face dans l’huile.',
      'Retire-la, verse la crème et 1 cuillère de moutarde dans la poêle, mélange 1 minute.',
      'Nappe l’escalope de sauce et sers.',
    ],
  },
  {
    id: 'papillote-saumon', nom: 'Papillote de saumon aux légumes & riz', emoji: '🐟', type: 'repas', minutes: 25, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['saumon', 140], ['courgette', 150], ['carotte', 100], ['riz', 60]],
    etapes: [
      'Préchauffe le four à 200 °C et lance la cuisson du riz.',
      'Sur une feuille de papier cuisson, dépose la courgette et la carotte en fines lanières, puis le saumon.',
      'Ajoute citron, aneth, sel et poivre, ferme la papillote.',
      'Enfourne 18 minutes.',
    ],
  },
  {
    id: 'burger-poulet', nom: 'Burger de poulet & frites de patate douce', emoji: '🍔', type: 'repas', minutes: 35, portions: 1,
    tags: ['masse'],
    ingredients: [['painBurger', 80], ['poulet', 140], ['salade', 20], ['tomate', 50], ['yaourtGrec', 30], ['patateDouce', 200], ['huile', 5]],
    etapes: [
      'Coupe la patate douce en frites, mélange avec l’huile et du paprika, enfourne 25 minutes à 210 °C.',
      'Aplatis le blanc de poulet et poêle-le 4 minutes par face avec des épices.',
      'Mélange le yaourt avec un peu de moutarde pour la sauce.',
      'Monte le burger avec la salade et la tomate.',
    ],
  },
  {
    id: 'salade-quinoa-feta', nom: 'Salade méditerranéenne quinoa & feta', emoji: '🥗', type: 'repas', minutes: 20, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['quinoa', 70], ['feta', 40], ['concombre', 100], ['tomate', 100], ['olives', 20], ['poisChiches', 80], ['huile', 8]],
    etapes: [
      'Cuis le quinoa 12 minutes et laisse-le refroidir.',
      'Coupe le concombre, la tomate et la feta en dés.',
      'Mélange tout avec les pois chiches et les olives.',
      'Assaisonne avec l’huile, du citron et de l’origan.',
    ],
    astuce: 'Se garde 2 jours au frigo : parfait en boîte pour le déjeuner.',
  },
  {
    id: 'carbonara-legere', nom: 'Pâtes carbonara légères', emoji: '🍝', type: 'repas', minutes: 15, portions: 1,
    tags: ['masse', 'rapide'],
    ingredients: [['pates', 100], ['oeuf', 55], ['jambon', 60], ['parmesan', 20], ['cremeLegere', 20]],
    etapes: [
      'Cuis les pâtes.',
      'Pendant ce temps, mélange l’œuf, le parmesan, la crème et beaucoup de poivre.',
      'Fais dorer le jambon en lanières 2 minutes.',
      'Hors du feu, mélange les pâtes égouttées (garde un peu d’eau de cuisson) avec la sauce et le jambon.',
    ],
  },
  {
    id: 'poulet-chou-fleur', nom: 'Poulet rôti, chou-fleur & pommes de terre au four', emoji: '🍗', type: 'repas', minutes: 35, portions: 1,
    tags: ['seche'],
    ingredients: [['poulet', 160], ['chouFleur', 300], ['pommeDeTerre', 150], ['huile', 10]],
    etapes: [
      'Préchauffe le four à 200 °C.',
      'Coupe le chou-fleur en bouquets et les pommes de terre en quartiers, mélange avec l’huile, curcuma, sel et poivre.',
      'Ajoute le poulet assaisonné sur la plaque.',
      'Enfourne 25 à 30 minutes en retournant à mi-cuisson.',
    ],
  },
  {
    id: 'donburi', nom: 'Donburi : bol de riz au poulet & œuf', emoji: '🍚', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['riz', 80], ['poulet', 120], ['oeuf', 55], ['oignon', 50], ['soja', 20]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais revenir l’oignon émincé 3 minutes, ajoute le poulet en morceaux, la sauce soja et 50 ml d’eau.',
      'Laisse mijoter 6 minutes, puis verse l’œuf battu et couvre 1 minute.',
      'Fais glisser le tout sur le riz.',
    ],
  },
  {
    id: 'salade-lentilles', nom: 'Salade de lentilles, œuf & thon', emoji: '🥗', type: 'repas', minutes: 25, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['lentillesVertes', 60], ['oeuf', 55], ['thon', 80], ['tomate', 80], ['oignon', 20], ['huile', 8]],
    etapes: [
      'Cuis les lentilles 20 minutes dans l’eau non salée, puis égoutte.',
      'Cuis l’œuf 9 minutes (dur).',
      'Mélange les lentilles tièdes avec le thon, la tomate et l’oignon émincé finement.',
      'Assaisonne avec l’huile, du vinaigre et de la moutarde, ajoute l’œuf en quartiers.',
    ],
  },
  {
    id: 'pates-saumon', nom: 'Pâtes au saumon & épinards', emoji: '🍝', type: 'repas', minutes: 20, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['pates', 90], ['saumon', 120], ['cremeLegere', 30], ['epinards', 80]],
    etapes: [
      'Cuis les pâtes.',
      'Poêle le saumon en dés 4 minutes.',
      'Ajoute les épinards puis la crème, avec citron et poivre, 2 minutes.',
      'Mélange avec les pâtes égouttées.',
    ],
  },
  {
    id: 'nouilles-tofu', nom: 'Nouilles sautées au tofu & sauce cacahuète', emoji: '🥜', type: 'repas', minutes: 20, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['nouillesRiz', 80], ['tofu', 150], ['carotte', 80], ['brocoli', 100], ['cacahuete', 15], ['soja', 15]],
    etapes: [
      'Fais tremper les nouilles 8 minutes dans l’eau très chaude.',
      'Fais dorer le tofu en cubes 6 minutes, puis les légumes 4 minutes.',
      'Mélange le beurre de cacahuète, la sauce soja et 2 cuillères d’eau chaude.',
      'Ajoute les nouilles et la sauce, mélange 1 minute.',
    ],
  },
  {
    id: 'boulettes-semoule', nom: 'Boulettes de bœuf à la tomate & semoule', emoji: '🧆', type: 'repas', minutes: 30, portions: 1,
    tags: ['masse'],
    ingredients: [['boeuf', 150], ['coulis', 150], ['semoule', 70], ['oignon', 30], ['huile', 5]],
    etapes: [
      'Mélange le bœuf avec l’oignon haché, cumin, sel et poivre, forme 6 boulettes.',
      'Fais-les dorer 5 minutes dans l’huile.',
      'Ajoute le coulis et laisse mijoter 15 minutes.',
      'Prépare la semoule avec le même volume d’eau bouillante et sers.',
    ],
  },
  {
    id: 'burrito-bowl', nom: 'Burrito bowl au poulet', emoji: '🌯', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre'],
    ingredients: [['riz', 70], ['poulet', 130], ['haricotsRouges', 80], ['mais', 50], ['avocat', 40], ['tomate', 60]],
    etapes: [
      'Lance la cuisson du riz (ajoute du citron vert à la fin).',
      'Poêle le poulet avec cumin, paprika et un peu de piment.',
      'Réchauffe les haricots et le maïs.',
      'Dispose tout dans un bol avec la tomate et l’avocat.',
    ],
  },
  {
    id: 'patates-douces-farcies', nom: 'Patates douces farcies au thon', emoji: '🍠', type: 'repas', minutes: 45, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['patateDouce', 300], ['thon', 100], ['yaourtGrec', 40], ['mais', 40]],
    etapes: [
      'Pique la patate douce et fais-la cuire 40 minutes à 200 °C (ou 8 à 10 minutes au micro-ondes).',
      'Mélange le thon, le yaourt, le maïs, du citron, sel et poivre.',
      'Ouvre la patate en deux et garnis avec la préparation.',
    ],
  },
  {
    id: 'brochettes-taboule', nom: 'Brochettes de poulet & taboulé', emoji: '🍢', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre'],
    ingredients: [['poulet', 150], ['semoule', 60], ['tomate', 80], ['concombre', 80], ['huile', 10]],
    etapes: [
      'Fais gonfler la semoule avec le même volume d’eau bouillante, puis laisse refroidir.',
      'Ajoute la tomate et le concombre en petits dés, menthe, citron et la moitié de l’huile.',
      'Coupe le poulet en cubes, pique-les sur des brochettes et fais-les griller 8 à 10 minutes avec le reste de l’huile.',
    ],
  },
  {
    id: 'steak-hache-legumes', nom: 'Steak haché, haricots verts & pommes de terre vapeur', emoji: '🥩', type: 'repas', minutes: 20, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['boeuf', 150], ['haricotsVerts', 200], ['pommeDeTerre', 200], ['huile', 5]],
    etapes: [
      'Cuis les pommes de terre en morceaux 15 minutes à la vapeur ou à l’eau.',
      'Cuis les haricots verts 8 minutes.',
      'Poêle le steak haché 3 minutes par face.',
    ],
    astuce: 'Le repas de base le plus simple : rapide, pas cher et très protéiné.',
  },
  {
    id: 'soupe-crevettes', nom: 'Soupe asiatique aux crevettes & nouilles', emoji: '🍜', type: 'repas', minutes: 15, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['nouillesRiz', 50], ['crevettes', 120], ['champignons', 80], ['epinards', 50], ['soja', 15]],
    etapes: [
      'Porte 500 ml d’eau à ébullition avec un cube de bouillon, du gingembre et la sauce soja.',
      'Ajoute les nouilles et les champignons émincés, 4 minutes.',
      'Ajoute les crevettes et les épinards, 3 minutes de plus.',
    ],
  },

  // ---------- Collations ----------
  {
    id: 'fromage-blanc-compote', nom: 'Fromage blanc, compote & avoine', emoji: '🍏', type: 'collation', minutes: 2, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['fromageBlanc', 200], ['compote', 100], ['avoine', 15]],
    etapes: ['Mélange le fromage blanc et la compote, parsème de flocons d’avoine.'],
  },
  {
    id: 'roules-jambon-chevre', nom: 'Roulés jambon & chèvre frais', emoji: '🥙', type: 'collation', minutes: 4, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['tortilla', 60], ['jambon', 50], ['chevreFrais', 30], ['salade', 20]],
    etapes: [
      'Tartine la tortilla de fromage de chèvre.',
      'Ajoute le jambon et la salade, roule serré et coupe en tronçons.',
    ],
  },
  {
    id: 'banane-cacahuete', nom: 'Banane & beurre de cacahuète', emoji: '🍌', type: 'collation', minutes: 1, portions: 1,
    tags: ['pre', 'rapide', 'vege'],
    ingredients: [['banane', 120], ['cacahuete', 20]],
    etapes: ['Coupe la banane en deux dans la longueur et tartine de beurre de cacahuète. Idéal 30 à 60 min avant la séance.'],
  },
  {
    id: 'cookies-proteines', nom: 'Cookies protéinés (8 cookies)', emoji: '🍪', type: 'collation', minutes: 20, portions: 8,
    tags: ['masse', 'pre'],
    ingredients: [['avoine', 120], ['whey', 60], ['oeuf', 55], ['cacahuete', 60], ['chocolat', 40], ['miel', 30]],
    etapes: [
      'Préchauffe le four à 180 °C.',
      'Mélange l’avoine, la whey, l’œuf, le beurre de cacahuète et le miel, puis ajoute le chocolat en pépites.',
      'Forme 8 boules, aplatis-les sur une plaque recouverte de papier cuisson.',
      'Enfourne 10 à 12 minutes : ils durcissent en refroidissant.',
    ],
  },
  {
    id: 'lait-chocolate', nom: 'Lait chocolaté maison (après la séance)', emoji: '🥛', type: 'collation', minutes: 2, portions: 1,
    tags: ['post', 'rapide'],
    ingredients: [['lait', 400], ['cacao', 10], ['miel', 15]],
    etapes: [
      'Mélange le cacao et le miel avec un fond de lait chaud pour éviter les grumeaux.',
      'Ajoute le reste du lait, chaud ou froid.',
    ],
    astuce: 'Le bon ratio glucides / protéines pour récupérer, à prix mini.',
  },
  {
    id: 'galettes-saumon', nom: 'Galettes de riz, chèvre frais & saumon fumé', emoji: '🐠', type: 'collation', minutes: 3, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['galettesRiz', 25], ['chevreFrais', 30], ['saumonFume', 40]],
    etapes: ['Tartine les galettes de fromage frais et ajoute le saumon fumé, un peu d’aneth et de poivre.'],
  },
  {
    id: 'pomme-au-four', nom: 'Pomme au four, cannelle & skyr', emoji: '🍎', type: 'collation', minutes: 25, portions: 1,
    tags: ['seche'],
    ingredients: [['pomme', 200], ['skyr', 100], ['noix', 10]],
    etapes: [
      'Évide la pomme, saupoudre de cannelle et enfourne 20 minutes à 180 °C (ou 4 minutes au micro-ondes).',
      'Sers chaude avec le skyr et les noix concassées.',
    ],
  },
  {
    id: 'muffins-banane', nom: 'Muffins banane-avoine (6 muffins)', emoji: '🧁', type: 'collation', minutes: 25, portions: 6,
    tags: ['equilibre', 'pre'],
    ingredients: [['avoine', 150], ['banane', 250], ['oeuf', 110], ['lait', 100], ['whey', 40], ['chocolat', 30]],
    etapes: [
      'Préchauffe le four à 180 °C.',
      'Écrase les bananes, ajoute les œufs, le lait, puis l’avoine, la whey et 1 sachet de levure.',
      'Ajoute le chocolat en morceaux et répartis dans 6 moules.',
      'Enfourne 20 minutes.',
    ],
  },
  {
    id: 'surimi-crudites', nom: 'Surimi & crudités, sauce yaourt', emoji: '🦀', type: 'collation', minutes: 5, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['surimi', 100], ['carotte', 80], ['concombre', 80], ['yaourtGrec', 40]],
    etapes: [
      'Coupe la carotte et le concombre en bâtonnets.',
      'Mélange le yaourt avec ciboulette, sel et poivre pour la sauce.',
      'Trempe le surimi et les crudités dans la sauce.',
    ],
  },
  {
    id: 'pois-chiches-grilles', nom: 'Pois chiches grillés croustillants', emoji: '🫘', type: 'collation', minutes: 30, portions: 1,
    tags: ['vege', 'seche'],
    ingredients: [['poisChiches', 150], ['huile', 5]],
    etapes: [
      'Rince et sèche bien les pois chiches dans un torchon.',
      'Mélange avec l’huile, du paprika, du cumin et du sel.',
      'Enfourne 25 minutes à 200 °C en remuant à mi-cuisson : ils doivent être croustillants.',
    ],
    astuce: 'Une alternative aux chips, riche en fibres et en protéines.',
  },
  {
    id: 'fromage-blanc-vanille', nom: 'Fromage blanc protéiné vanille & granola', emoji: '🍨', type: 'collation', minutes: 2, portions: 1,
    tags: ['post', 'rapide'],
    ingredients: [['fromageBlanc', 250], ['whey', 15], ['granola', 25]],
    etapes: ['Mélange la whey (vanille si possible) dans le fromage blanc, ajoute le granola au moment de manger.'],
  },
];

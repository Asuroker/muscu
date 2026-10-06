// Recettes supplémentaires (mêmes champs que dans nutrition.js).
// type : petitdej | repas | collation · tags : seche, masse, equilibre, vege, rapide, pre, post
export const RECETTES_PLUS = [
  // ---------- Petits-déjeuners ----------
  {
    id: 'pain-perdu-proteine', nom: 'Pain perdu protéiné aux fruits rouges', emoji: '🍞', type: 'petitdej', minutes: 12, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['pain', 80], ['oeuf', 110], ['lait', 80], ['whey', 15], ['fruitsRouges', 80], ['huile', 3]],
    etapes: [
      'Bats les 2 œufs avec le lait et la whey dans une assiette creuse.',
      'Trempe les tranches de pain des deux côtés pour qu’elles s’imbibent bien.',
      'Fais-les dorer 2 à 3 minutes par face dans une poêle à peine huilée.',
      'Sers avec les fruits rouges par-dessus.',
    ],
  },
  {
    id: 'bowl-yaourt-granola', nom: 'Bowl yaourt grec, granola & mangue', emoji: '🥭', type: 'petitdej', minutes: 3, portions: 1,
    tags: ['equilibre', 'rapide', 'vege'],
    ingredients: [['yaourtGrec', 200], ['granola', 40], ['mangue', 100], ['chia', 10]],
    etapes: [
      'Verse le yaourt grec dans un bol.',
      'Ajoute la mangue coupée en dés et le granola.',
      'Parsème de graines de chia.',
    ],
  },
  {
    id: 'muffins-oeufs', nom: 'Muffins aux œufs, jambon & légumes (6 muffins)', emoji: '🧁', type: 'petitdej', minutes: 25, portions: 2,
    tags: ['seche', 'equilibre'],
    ingredients: [['oeuf', 330], ['poivron', 80], ['epinards', 60], ['emmental', 30], ['jambon', 60]],
    etapes: [
      'Préchauffe le four à 180 °C et huile légèrement 6 moules à muffins.',
      'Coupe le poivron, les épinards et le jambon en petits morceaux et répartis-les dans les moules.',
      'Bats les 6 œufs avec sel et poivre, verse dans les moules et ajoute l’emmental.',
      'Enfourne 18 à 20 minutes jusqu’à ce qu’ils soient gonflés et pris.',
    ],
    astuce: 'Se gardent 3 jours au frigo : parfait pour les matins pressés (3 muffins = 1 portion).',
  },
  {
    id: 'smoothie-bowl', nom: 'Smoothie bowl protéiné', emoji: '🍓', type: 'petitdej', minutes: 5, portions: 1,
    tags: ['equilibre', 'post', 'rapide'],
    ingredients: [['whey', 25], ['banane', 120], ['fruitsRouges', 100], ['lait', 100], ['granola', 25], ['chia', 10]],
    etapes: [
      'Mixe la banane (idéalement congelée), les fruits rouges, la whey et le lait : la texture doit rester épaisse.',
      'Verse dans un bol.',
      'Décore avec le granola et les graines de chia.',
    ],
  },
  {
    id: 'toast-saumon', nom: 'Toasts saumon fumé, skyr & concombre', emoji: '🐠', type: 'petitdej', minutes: 5, portions: 1,
    tags: ['seche', 'equilibre', 'rapide'],
    ingredients: [['pain', 70], ['saumonFume', 60], ['skyr', 60], ['concombre', 60]],
    etapes: [
      'Fais griller le pain.',
      'Mélange le skyr avec un peu de citron, sel, poivre et aneth.',
      'Tartine, ajoute le concombre en fines rondelles et le saumon fumé.',
    ],
  },
  {
    id: 'creme-de-riz', nom: 'Crème de riz protéinée banane & cacahuète', emoji: '🍚', type: 'petitdej', minutes: 6, portions: 1,
    tags: ['masse', 'pre'],
    ingredients: [['cremeRiz', 60], ['lait', 250], ['whey', 25], ['banane', 100], ['cacahuete', 10]],
    etapes: [
      'Fais chauffer le lait puis verse la crème de riz en pluie en fouettant.',
      'Laisse épaissir 2 à 3 minutes à feu doux en remuant.',
      'Hors du feu, ajoute la whey et mélange bien.',
      'Termine avec la banane en rondelles et le beurre de cacahuète.',
    ],
    astuce: 'Très digeste : idéal 1 à 2 h avant une grosse séance.',
  },
  {
    id: 'omelette-blancs', nom: 'Omelette de blancs aux champignons', emoji: '🍄', type: 'petitdej', minutes: 10, portions: 1,
    tags: ['seche'],
    ingredients: [['blancOeuf', 250], ['oeuf', 55], ['champignons', 100], ['emmental', 15], ['pain', 40]],
    etapes: [
      'Fais revenir les champignons émincés 4 minutes à la poêle antiadhésive.',
      'Bats les blancs avec l’œuf entier, sel, poivre et herbes.',
      'Verse sur les champignons, ajoute l’emmental et laisse prendre 3 à 4 minutes à feu doux.',
      'Sers avec le pain grillé.',
    ],
  },
  {
    id: 'chia-pudding', nom: 'Chia pudding aux fruits rouges', emoji: '🫙', type: 'petitdej', minutes: 5, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['chia', 30], ['lait', 200], ['skyr', 100], ['fruitsRouges', 80], ['miel', 8]],
    etapes: [
      'Mélange les graines de chia avec le lait et le miel dans un bocal.',
      'Remue de nouveau après 10 minutes pour éviter les grumeaux, puis laisse au frigo toute la nuit.',
      'Le matin, ajoute le skyr et les fruits rouges par-dessus.',
    ],
  },
  {
    id: 'wrap-petit-dej', nom: 'Wrap petit-déj œufs, jambon & fromage', emoji: '🌯', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['masse', 'equilibre', 'rapide'],
    ingredients: [['tortilla', 60], ['oeuf', 110], ['jambon', 40], ['emmental', 20], ['tomate', 50]],
    etapes: [
      'Brouille les 2 œufs à la poêle.',
      'Fais chauffer la tortilla 20 secondes de chaque côté.',
      'Garnis avec les œufs, le jambon, l’emmental et la tomate, puis roule.',
    ],
  },
  {
    id: 'porridge-pomme', nom: 'Porridge pomme, cannelle & noix', emoji: '🍎', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['equilibre', 'seche'],
    ingredients: [['avoine', 50], ['lait', 200], ['pomme', 120], ['skyr', 100], ['noix', 10]],
    etapes: [
      'Fais cuire l’avoine dans le lait avec la pomme râpée et une cuillère de cannelle, 4 à 5 minutes.',
      'Laisse tiédir un peu puis incorpore le skyr.',
      'Ajoute les noix concassées.',
    ],
  },

  // ---------- Plats ----------
  {
    id: 'pad-thai-crevettes', nom: 'Nouilles sautées aux crevettes (façon pad thaï)', emoji: '🍤', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['crevettes', 150], ['nouillesRiz', 80], ['oeuf', 55], ['carotte', 80], ['poivron', 80], ['soja', 15], ['cacahuete', 10], ['huile', 10]],
    etapes: [
      'Fais tremper les nouilles dans l’eau très chaude 8 minutes, puis égoutte.',
      'Mélange la sauce soja, le beurre de cacahuète, un peu de citron vert et une cuillère d’eau.',
      'Saute la carotte râpée et le poivron 3 minutes dans l’huile, ajoute les crevettes 3 minutes, puis l’œuf battu.',
      'Ajoute les nouilles et la sauce, mélange 2 minutes à feu vif.',
    ],
  },
  {
    id: 'cabillaud-puree', nom: 'Cabillaud, purée maison & haricots verts', emoji: '🐟', type: 'repas', minutes: 25, portions: 1,
    tags: ['seche'],
    ingredients: [['cabillaud', 180], ['pommeDeTerre', 250], ['lait', 50], ['haricotsVerts', 150], ['huile', 10]],
    etapes: [
      'Cuis les pommes de terre épluchées 20 minutes dans l’eau salée.',
      'Écrase-les avec le lait chaud et la moitié de l’huile, sale et poivre.',
      'Cuis le cabillaud 4 minutes par face dans une poêle avec le reste de l’huile.',
      'Cuis les haricots verts 8 minutes et sers le tout.',
    ],
  },
  {
    id: 'steak-pommes-de-terre', nom: 'Rumsteck, pommes de terre sautées & salade', emoji: '🥩', type: 'repas', minutes: 25, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['rumsteck', 180], ['pommeDeTerre', 250], ['salade', 80], ['huile', 10]],
    etapes: [
      'Coupe les pommes de terre en cubes, précuis-les 8 minutes à l’eau puis fais-les dorer 10 minutes à la poêle avec l’huile.',
      'Sors la viande du frigo 15 minutes avant, sale et poivre.',
      'Saisis le rumsteck à feu vif : 2 à 3 minutes par face pour saignant, 4 pour à point. Laisse reposer 3 minutes.',
      'Sers avec la salade assaisonnée.',
    ],
  },
  {
    id: 'couscous-poulet', nom: 'Couscous au poulet & légumes', emoji: '🍲', type: 'repas', minutes: 30, portions: 1,
    tags: ['equilibre'],
    ingredients: [['poulet', 150], ['semoule', 80], ['courgette', 150], ['carotte', 100], ['poisChiches', 80], ['huile', 10]],
    etapes: [
      'Fais dorer le poulet en morceaux dans l’huile avec du ras-el-hanout.',
      'Ajoute la carotte et la courgette en gros morceaux, les pois chiches et 300 ml d’eau. Laisse mijoter 20 minutes.',
      'Verse le même volume d’eau bouillante que de semoule, couvre 5 minutes puis égrène à la fourchette.',
      'Sers la semoule avec le poulet, les légumes et un peu de bouillon.',
    ],
  },
  {
    id: 'buddha-bowl', nom: 'Buddha bowl quinoa, pois chiches & patate douce', emoji: '🥙', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['quinoa', 70], ['poisChiches', 120], ['patateDouce', 150], ['epinards', 50], ['avocat', 50], ['houmous', 30]],
    etapes: [
      'Rôtis la patate douce en cubes 25 minutes à 200 °C avec les pois chiches égouttés et du paprika.',
      'Cuis le quinoa 12 minutes.',
      'Dispose tout dans un bol avec les épinards crus et l’avocat.',
      'Termine par une cuillère de houmous.',
    ],
  },
  {
    id: 'pizza-tortilla', nom: 'Pizza express sur tortilla', emoji: '🍕', type: 'repas', minutes: 12, portions: 1,
    tags: ['rapide', 'equilibre'],
    ingredients: [['tortilla', 60], ['coulis', 60], ['mozzarella', 50], ['jambon', 60], ['champignons', 50]],
    etapes: [
      'Préchauffe le four à 220 °C (ou utilise une poêle avec couvercle).',
      'Étale le coulis sur la tortilla, ajoute le jambon, les champignons émincés et la mozzarella.',
      'Enfourne 7 à 8 minutes jusqu’à ce que le fromage soit doré.',
    ],
    astuce: 'Ajoute de l’origan et un œuf au centre pour une version « reine » encore plus protéinée.',
  },
  {
    id: 'risotto-poulet', nom: 'Risotto poulet & champignons', emoji: '🍛', type: 'repas', minutes: 30, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['riz', 80], ['poulet', 130], ['champignons', 150], ['parmesan', 15], ['oignon', 40], ['huile', 5]],
    etapes: [
      'Fais revenir l’oignon émincé dans l’huile, ajoute le riz et remue 1 minute.',
      'Ajoute un bouillon chaud louche par louche en remuant, pendant 18 minutes.',
      'Pendant ce temps, poêle le poulet en dés et les champignons.',
      'Mélange le tout avec le parmesan à la fin.',
    ],
    astuce: 'Le vrai risotto se fait avec du riz arborio, mais le basmati marche aussi.',
  },
  {
    id: 'poke-saumon', nom: 'Poke bowl saumon & edamame', emoji: '🍣', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['riz', 80], ['saumon', 120], ['edamame', 60], ['mangue', 60], ['concombre', 60], ['avocat', 40], ['soja', 15]],
    etapes: [
      'Cuis le riz et laisse-le tiédir.',
      'Coupe le saumon en cubes (très frais si cru, sinon poêle-le 4 minutes), la mangue, le concombre et l’avocat.',
      'Cuis les edamame 4 minutes dans l’eau bouillante.',
      'Dispose tout sur le riz et arrose de sauce soja.',
    ],
  },
  {
    id: 'gnocchis-pesto', nom: 'Gnocchis au pesto & poulet', emoji: '🌿', type: 'repas', minutes: 15, portions: 1,
    tags: ['masse', 'rapide'],
    ingredients: [['gnocchis', 250], ['poulet', 130], ['pesto', 25], ['tomate', 100]],
    etapes: [
      'Poêle le poulet en dés 6 à 7 minutes.',
      'Fais dorer les gnocchis 5 minutes dans la même poêle (ou cuis-les 2 minutes à l’eau).',
      'Ajoute le pesto et les tomates cerises coupées, mélange 1 minute.',
    ],
  },
  {
    id: 'one-pot-boulgour', nom: 'One pot boulgour, dinde & légumes', emoji: '🥘', type: 'repas', minutes: 25, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['dinde', 150], ['boulgour', 70], ['poivron', 100], ['courgette', 100], ['coulis', 100], ['huile', 5]],
    etapes: [
      'Fais dorer la dinde en dés dans l’huile.',
      'Ajoute le poivron et la courgette en dés, le boulgour, le coulis et 200 ml d’eau.',
      'Couvre et laisse cuire 15 minutes à feu doux jusqu’à absorption.',
    ],
    astuce: 'Une seule casserole à laver 👌',
  },
  {
    id: 'tortilla-espagnole', nom: 'Tortilla espagnole & salade', emoji: '🍳', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['oeuf', 220], ['pommeDeTerre', 200], ['oignon', 50], ['huile', 10], ['salade', 60]],
    etapes: [
      'Coupe les pommes de terre en fines rondelles et fais-les cuire 15 minutes à feu doux avec l’oignon et l’huile.',
      'Bats les 4 œufs, ajoute les pommes de terre et mélange.',
      'Reverse dans la poêle et laisse prendre 5 minutes à feu doux.',
      'Retourne-la à l’aide d’une assiette et cuis encore 3 minutes. Sers avec la salade.',
    ],
  },
  {
    id: 'cesar-light', nom: 'Salade César légère au poulet', emoji: '🥗', type: 'repas', minutes: 15, portions: 1,
    tags: ['seche'],
    ingredients: [['poulet', 150], ['salade', 120], ['parmesan', 15], ['pain', 30], ['yaourtGrec', 50], ['tomate', 80], ['huile', 5]],
    etapes: [
      'Poêle le poulet assaisonné 6 à 8 minutes, puis coupe-le en tranches.',
      'Fais griller le pain coupé en petits cubes pour faire des croûtons.',
      'Sauce : yaourt grec, parmesan râpé, un peu de moutarde, citron et l’huile.',
      'Mélange la salade avec la sauce, ajoute poulet, tomates et croûtons.',
    ],
  },
  {
    id: 'chili-sin-carne', nom: 'Chili sin carne (végétarien)', emoji: '🫘', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['haricotsRouges', 200], ['mais', 80], ['coulis', 150], ['poivron', 80], ['oignon', 50], ['riz', 60], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais revenir l’oignon et le poivron dans l’huile avec cumin, paprika et une pointe de piment.',
      'Ajoute les haricots, le maïs et le coulis, laisse mijoter 15 minutes.',
      'Sers avec le riz.',
    ],
  },
  {
    id: 'porc-ananas', nom: 'Porc sauté à l’ananas & riz', emoji: '🍍', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['porc', 150], ['ananas', 100], ['poivron', 80], ['riz', 70], ['soja', 15], ['huile', 10]],
    etapes: [
      'Lance la cuisson du riz.',
      'Coupe le porc en lamelles et saisis-le 4 minutes à feu vif dans l’huile.',
      'Ajoute le poivron et l’ananas en morceaux, fais sauter 4 minutes.',
      'Verse la sauce soja, mélange et sers sur le riz.',
    ],
  },
  {
    id: 'curry-coco', nom: 'Curry de poulet au lait de coco', emoji: '🥥', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre', 'masse'],
    ingredients: [['poulet', 150], ['laitCoco', 120], ['riz', 70], ['epinards', 80], ['oignon', 40], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais revenir l’oignon avec 1 à 2 cuillères à café de curry, puis le poulet en dés 5 minutes.',
      'Ajoute le lait de coco et laisse mijoter 10 minutes.',
      'Incorpore les épinards à la fin et sers avec le riz.',
    ],
  },
  {
    id: 'pates-thon', nom: 'Pâtes au thon, tomate & olives', emoji: '🍝', type: 'repas', minutes: 15, portions: 1,
    tags: ['rapide', 'equilibre'],
    ingredients: [['pates', 90], ['thon', 120], ['coulis', 150], ['olives', 20], ['parmesan', 10]],
    etapes: [
      'Cuis les pâtes.',
      'Fais chauffer le coulis avec de l’ail et de l’origan 5 minutes.',
      'Ajoute le thon émietté et les olives, chauffe 2 minutes.',
      'Mélange avec les pâtes et parsème de parmesan.',
    ],
  },
  {
    id: 'wok-boeuf', nom: 'Wok de bœuf, brocoli & nouilles', emoji: '🥡', type: 'repas', minutes: 20, portions: 1,
    tags: ['masse', 'equilibre'],
    ingredients: [['rumsteck', 150], ['brocoli', 200], ['nouillesRiz', 70], ['soja', 20], ['huile', 10]],
    etapes: [
      'Fais tremper les nouilles 8 minutes dans l’eau très chaude.',
      'Coupe le bœuf en fines lamelles et saisis-le 2 minutes à feu très vif, puis réserve.',
      'Fais sauter le brocoli en petits bouquets 5 minutes avec un peu d’eau.',
      'Remets le bœuf, ajoute les nouilles et la sauce soja, mélange 1 minute.',
    ],
  },
  {
    id: 'saumon-quinoa-four', nom: 'Saumon & légumes rôtis au quinoa', emoji: '🐟', type: 'repas', minutes: 30, portions: 1,
    tags: ['equilibre'],
    ingredients: [['saumon', 140], ['quinoa', 60], ['courgette', 150], ['poivron', 100], ['huile', 5]],
    etapes: [
      'Préchauffe le four à 200 °C. Coupe la courgette et le poivron, mélange avec l’huile et des herbes.',
      'Enfourne les légumes 15 minutes, puis ajoute le saumon 12 minutes.',
      'Cuis le quinoa 12 minutes pendant ce temps.',
    ],
  },
  {
    id: 'tacos-dinde', nom: 'Tacos à la dinde', emoji: '🌮', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['tortilla', 120], ['dinde', 140], ['mais', 50], ['tomate', 60], ['avocat', 40], ['yaourtGrec', 40]],
    etapes: [
      'Coupe la dinde en lanières et poêle-la avec cumin, paprika et un peu de piment.',
      'Réchauffe les tortillas 20 secondes de chaque côté.',
      'Garnis avec la dinde, le maïs, la tomate et l’avocat.',
      'Ajoute une cuillère de yaourt grec en guise de crème.',
    ],
  },
  {
    id: 'soupe-lentilles', nom: 'Soupe de lentilles & carottes', emoji: '🥣', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'seche'],
    ingredients: [['lentilles', 70], ['carotte', 150], ['oignon', 50], ['coulis', 100], ['pain', 50], ['huile', 5]],
    etapes: [
      'Fais revenir l’oignon et les carottes en rondelles dans l’huile 5 minutes.',
      'Ajoute les lentilles rincées, le coulis, du cumin et 500 ml d’eau.',
      'Laisse cuire 20 minutes puis mixe (ou laisse en morceaux).',
      'Sers avec le pain.',
    ],
  },
  {
    id: 'hachis-parmentier', nom: 'Hachis parmentier léger', emoji: '🥔', type: 'repas', minutes: 45, portions: 1,
    tags: ['masse'],
    ingredients: [['boeuf', 150], ['pommeDeTerre', 250], ['lait', 60], ['emmental', 20], ['carotte', 80], ['oignon', 40]],
    etapes: [
      'Cuis les pommes de terre 20 minutes et écrase-les avec le lait chaud.',
      'Fais revenir l’oignon et la carotte râpée, ajoute le bœuf et fais-le dorer.',
      'Dans un plat, mets la viande puis la purée par-dessus et l’emmental.',
      'Gratine 15 minutes à 200 °C.',
    ],
    astuce: 'Prépare-en 4 d’un coup et congèle les portions.',
  },
  {
    id: 'riz-cantonais', nom: 'Riz cantonais protéiné', emoji: '🍚', type: 'repas', minutes: 20, portions: 1,
    tags: ['masse'],
    ingredients: [['riz', 80], ['oeuf', 110], ['jambon', 60], ['petitsPois', 80], ['crevettes', 80], ['soja', 10], ['huile', 10]],
    etapes: [
      'Cuis le riz (encore meilleur avec du riz de la veille, bien froid).',
      'Fais une omelette fine avec les 2 œufs, puis coupe-la en lanières.',
      'Fais sauter les crevettes, le jambon en dés et les petits pois 4 minutes dans l’huile.',
      'Ajoute le riz, l’omelette et la sauce soja, fais sauter 3 minutes à feu vif.',
    ],
  },
  {
    id: 'crevettes-ail-courgettes', nom: 'Crevettes à l’ail, courgettes & riz', emoji: '🦐', type: 'repas', minutes: 15, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['crevettes', 180], ['courgette', 200], ['riz', 60], ['huile', 10]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais dorer la courgette en dés 6 minutes dans la moitié de l’huile.',
      'Ajoute le reste de l’huile, 2 gousses d’ail hachées et les crevettes : 3 à 4 minutes jusqu’à ce qu’elles soient roses.',
      'Persil, citron, et c’est prêt.',
    ],
  },
  {
    id: 'gratin-pates-poulet', nom: 'Gratin de pâtes au poulet & brocoli', emoji: '🧀', type: 'repas', minutes: 35, portions: 1,
    tags: ['masse'],
    ingredients: [['pates', 90], ['poulet', 130], ['brocoli', 150], ['lait', 100], ['emmental', 30]],
    etapes: [
      'Cuis les pâtes et le brocoli ensemble dans l’eau bouillante (brocoli ajouté 5 minutes avant la fin).',
      'Poêle le poulet en dés.',
      'Mélange le tout dans un plat avec le lait, sel, poivre et muscade.',
      'Couvre d’emmental et gratine 15 minutes à 200 °C.',
    ],
  },

  // ---------- Collations ----------
  {
    id: 'shake-choco-cacahuete', nom: 'Shake chocolat-cacahuète prise de masse', emoji: '🥤', type: 'collation', minutes: 3, portions: 1,
    tags: ['masse', 'post', 'rapide'],
    ingredients: [['whey', 30], ['lait', 300], ['cacahuete', 20], ['banane', 100], ['avoine', 40], ['cacao', 5]],
    etapes: [
      'Mets tout dans un blender.',
      'Mixe 30 à 45 secondes jusqu’à ce que l’avoine soit bien fine.',
    ],
    astuce: 'Plus de 600 kcal en un verre : le meilleur ami de ceux qui ont du mal à manger assez.',
  },
  {
    id: 'yaourt-grec-miel', nom: 'Yaourt grec, miel & noix', emoji: '🍯', type: 'collation', minutes: 2, portions: 1,
    tags: ['equilibre', 'rapide', 'vege'],
    ingredients: [['yaourtGrec', 200], ['miel', 10], ['noix', 15]],
    etapes: ['Verse le yaourt dans un bol, ajoute le miel et les noix concassées.'],
  },
  {
    id: 'edamame', nom: 'Edamame au sel', emoji: '🫛', type: 'collation', minutes: 6, portions: 1,
    tags: ['seche', 'vege', 'rapide'],
    ingredients: [['edamame', 150]],
    etapes: [
      'Plonge les edamame 4 à 5 minutes dans l’eau bouillante salée.',
      'Égoutte et ajoute une pincée de fleur de sel (ou de piment).',
    ],
  },
  {
    id: 'houmous-crudites', nom: 'Houmous, crudités & pita', emoji: '🥕', type: 'collation', minutes: 5, portions: 1,
    tags: ['vege', 'equilibre', 'rapide'],
    ingredients: [['houmous', 60], ['carotte', 100], ['concombre', 100], ['pita', 40]],
    etapes: [
      'Coupe la carotte et le concombre en bâtonnets.',
      'Coupe le pain pita en triangles (tu peux le griller 2 minutes).',
      'Trempe le tout dans le houmous.',
    ],
  },
  {
    id: 'barres-proteinees', nom: 'Barres protéinées maison (6 barres)', emoji: '🍫', type: 'collation', minutes: 15, portions: 6,
    tags: ['masse', 'pre'],
    ingredients: [['avoine', 120], ['whey', 60], ['cacahuete', 80], ['miel', 50], ['chocolat', 30]],
    etapes: [
      'Mélange l’avoine et la whey dans un saladier.',
      'Fais tiédir le beurre de cacahuète et le miel 20 secondes au micro-ondes, puis incorpore-les.',
      'Tasse la pâte dans un plat recouvert de papier cuisson (2 cm d’épaisseur).',
      'Fais fondre le chocolat, étale-le dessus, laisse durcir 1 h au frigo puis coupe 6 barres.',
    ],
  },
  {
    id: 'oeufs-durs-pomme', nom: 'Œufs durs & pomme', emoji: '🥚', type: 'collation', minutes: 10, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['oeuf', 110], ['pomme', 150]],
    etapes: [
      'Plonge les 2 œufs 9 minutes dans l’eau bouillante, puis dans l’eau froide.',
      'Écale-les et sers avec la pomme.',
    ],
    astuce: 'Prépare 6 œufs durs d’un coup : ils se gardent 4 à 5 jours au frigo.',
  },
  {
    id: 'riz-au-lait-proteine', nom: 'Riz au lait protéiné', emoji: '🍮', type: 'collation', minutes: 30, portions: 1,
    tags: ['masse', 'post'],
    ingredients: [['riz', 50], ['lait', 300], ['whey', 20], ['miel', 10]],
    etapes: [
      'Fais cuire le riz dans le lait à feu très doux 25 minutes en remuant souvent (ajoute de la vanille ou de la cannelle).',
      'Hors du feu, laisse tiédir 5 minutes puis ajoute la whey et le miel.',
      'Se mange tiède ou froid.',
    ],
  },
  {
    id: 'dattes-amandes', nom: 'Dattes & amandes (énergie avant la séance)', emoji: '🌴', type: 'collation', minutes: 1, portions: 1,
    tags: ['pre', 'rapide', 'vege'],
    ingredients: [['dattes', 40], ['amandes', 15]],
    etapes: [
      'Prends 3 ou 4 dattes et une petite poignée d’amandes.',
      'À manger 30 à 45 minutes avant l’entraînement : sucres rapides des dattes, énergie durable des amandes.',
    ],
  },
  {
    id: 'skyr-mangue-chia', nom: 'Skyr, mangue & chia', emoji: '🥭', type: 'collation', minutes: 3, portions: 1,
    tags: ['seche', 'post', 'rapide'],
    ingredients: [['skyr', 200], ['mangue', 100], ['chia', 10]],
    etapes: ['Verse le skyr dans un bol, ajoute la mangue en dés et les graines de chia.'],
  },
  {
    id: 'tartine-cottage', nom: 'Tartine cottage cheese & tomate', emoji: '🍅', type: 'collation', minutes: 3, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['pain', 60], ['cottage', 100], ['tomate', 80]],
    etapes: [
      'Fais griller le pain.',
      'Étale le cottage cheese, ajoute la tomate en tranches, sel, poivre et basilic.',
    ],
  },
  {
    id: 'mug-cake', nom: 'Mug cake protéiné au chocolat', emoji: '☕', type: 'collation', minutes: 3, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['avoine', 30], ['whey', 25], ['oeuf', 55], ['cacao', 8], ['lait', 40], ['chocolat', 10]],
    etapes: [
      'Dans un grand mug, mélange à la fourchette l’avoine (mixée en poudre si possible), la whey, l’œuf, le cacao et le lait.',
      'Ajoute le chocolat en morceaux au centre.',
      'Micro-ondes 60 à 75 secondes : le centre doit rester légèrement fondant.',
    ],
  },
  {
    id: 'smoothie-vert', nom: 'Smoothie vert ananas & épinards', emoji: '🥬', type: 'collation', minutes: 4, portions: 1,
    tags: ['equilibre', 'post', 'rapide'],
    ingredients: [['epinards', 40], ['banane', 100], ['ananas', 80], ['yaourtGrec', 150], ['lait', 100]],
    etapes: [
      'Mets tout dans le blender, épinards en premier.',
      'Mixe jusqu’à ce que ce soit bien lisse. On ne sent presque pas les épinards !',
    ],
  },
  {
    id: 'sardines-tartines', nom: 'Tartines de sardines & concombre', emoji: '🐟', type: 'collation', minutes: 4, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['pain', 60], ['sardines', 60], ['concombre', 60]],
    etapes: [
      'Écrase les sardines avec un peu de citron et de poivre.',
      'Tartine sur le pain grillé et ajoute le concombre en rondelles.',
    ],
    astuce: 'Riches en oméga-3 et en calcium, et très bon marché.',
  },
];

// Quatrième série de recettes (mêmes champs que dans nutrition.js).
// type : petitdej | repas | collation · tags : seche, masse, equilibre, vege, rapide, pre, post
export const RECETTES_PLUS_3 = [
  // ---------- Petits-déjeuners ----------
  {
    id: 'pancakes-cottage', nom: 'Pancakes au cottage cheese & fraises', emoji: '🥞', type: 'petitdej', minutes: 15, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['cottage', 150], ['oeuf', 110], ['avoine', 50], ['fraises', 100]],
    etapes: [
      'Mixe le cottage cheese, les 2 œufs et l’avoine jusqu’à obtenir une pâte lisse.',
      'Fais cuire des petits pancakes dans une poêle antiadhésive, 2 minutes par face.',
      'Sers avec les fraises coupées.',
    ],
  },
  {
    id: 'avocado-toast-poche', nom: 'Avocado toast & œuf poché', emoji: '🥑', type: 'petitdej', minutes: 10, portions: 1,
    tags: ['equilibre', 'rapide', 'vege'],
    ingredients: [['pain', 70], ['avocat', 60], ['oeuf', 55], ['tomate', 40]],
    etapes: [
      'Fais griller le pain et écrase l’avocat avec citron, sel et piment.',
      'Fais frémir de l’eau avec un filet de vinaigre, crée un tourbillon et glisse l’œuf : 3 minutes.',
      'Tartine l’avocat, ajoute la tomate en tranches et l’œuf poché.',
    ],
  },
  {
    id: 'porridge-fraises-amande', nom: 'Porridge léger fraises & lait d’amande', emoji: '🍓', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['seche', 'vege'],
    ingredients: [['avoine', 50], ['laitAmande', 250], ['whey', 30], ['fraises', 120], ['amandes', 10]],
    etapes: [
      'Fais cuire l’avoine dans le lait d’amande 4 à 5 minutes.',
      'Hors du feu, ajoute la whey et mélange.',
      'Garnis avec les fraises et les amandes effilées.',
    ],
  },
  {
    id: 'omelette-jambon-fromage', nom: 'Omelette jambon-fromage & pain', emoji: '🍳', type: 'petitdej', minutes: 8, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['oeuf', 165], ['jambon', 50], ['emmental', 20], ['pain', 50]],
    etapes: [
      'Bats les 3 œufs avec sel et poivre.',
      'Verse dans une poêle chaude antiadhésive, ajoute le jambon en dés et l’emmental.',
      'Plie l’omelette quand le dessus est encore baveux. Sers avec le pain.',
    ],
  },
  {
    id: 'bowl-skyr-kiwi', nom: 'Bowl skyr, kiwi, fraises & granola', emoji: '🥝', type: 'petitdej', minutes: 3, portions: 1,
    tags: ['seche', 'rapide', 'vege'],
    ingredients: [['skyr', 250], ['kiwi', 100], ['fraises', 100], ['granola', 20]],
    etapes: ['Verse le skyr dans un bol, ajoute les fruits coupés et le granola.'],
  },
  {
    id: 'muesli-maison', nom: 'Muesli bircher pomme & noix', emoji: '🥣', type: 'petitdej', minutes: 5, portions: 1,
    tags: ['equilibre', 'vege'],
    ingredients: [['avoine', 50], ['lait', 200], ['pomme', 100], ['noix', 10], ['miel', 5]],
    etapes: [
      'La veille, fais tremper l’avoine dans le lait au frigo.',
      'Le matin, râpe la pomme dedans et ajoute les noix et le miel.',
    ],
    astuce: 'Une pincée de cannelle et c’est encore meilleur.',
  },
  {
    id: 'croque-proteine', nom: 'Croque-monsieur protéiné', emoji: '🥪', type: 'petitdej', minutes: 10, portions: 1,
    tags: ['masse', 'rapide'],
    ingredients: [['painMie', 80], ['jambon', 60], ['emmental', 25], ['oeuf', 55]],
    etapes: [
      'Monte le croque : pain, jambon, emmental, pain.',
      'Trempe-le rapidement dans l’œuf battu (façon pain perdu).',
      'Fais-le dorer 3 minutes par face à la poêle.',
    ],
  },
  {
    id: 'smoothie-orange-mangue', nom: 'Smoothie orange, mangue & yaourt grec', emoji: '🍊', type: 'petitdej', minutes: 4, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['orange', 150], ['mangue', 100], ['yaourtGrec', 150], ['whey', 15]],
    etapes: [
      'Pèle l’orange et coupe la mangue.',
      'Mixe tout avec quelques glaçons.',
    ],
  },

  // ---------- Plats ----------
  {
    id: 'poulet-teriyaki', nom: 'Poulet teriyaki, riz & brocoli', emoji: '🍱', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre', 'masse'],
    ingredients: [['poulet', 150], ['riz', 80], ['brocoli', 150], ['soja', 20], ['miel', 10], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz et du brocoli.',
      'Mélange la sauce soja, le miel, un peu de gingembre et 2 cuillères d’eau.',
      'Fais dorer le poulet en morceaux 6 minutes, verse la sauce et laisse caraméliser 2 minutes.',
      'Sers avec le riz et le brocoli, saupoudre de sésame si tu en as.',
    ],
  },
  {
    id: 'saumon-asperges', nom: 'Saumon, asperges & pommes de terre', emoji: '🐟', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre'],
    ingredients: [['saumon', 150], ['asperges', 200], ['pommeDeTerre', 200], ['huile', 5]],
    etapes: [
      'Cuis les pommes de terre 15 minutes à la vapeur.',
      'Coupe le bout dur des asperges et poêle-les 6 minutes avec l’huile.',
      'Cuis le saumon 4 minutes côté peau puis 2 minutes de l’autre côté.',
      'Citron, sel, poivre et c’est prêt.',
    ],
  },
  {
    id: 'polenta-ragout', nom: 'Polenta crémeuse & ragoût de bœuf', emoji: '🍲', type: 'repas', minutes: 30, portions: 1,
    tags: ['masse'],
    ingredients: [['polenta', 70], ['boeuf', 130], ['coulis', 150], ['champignons', 100], ['parmesan', 10]],
    etapes: [
      'Fais dorer le bœuf haché, ajoute les champignons puis le coulis et des herbes. Laisse mijoter 15 minutes.',
      'Porte 300 ml d’eau salée à ébullition, verse la polenta en pluie en fouettant.',
      'Cuis 5 minutes (polenta instantanée) en remuant, ajoute le parmesan.',
      'Sers le ragoût sur la polenta.',
    ],
  },
  {
    id: 'cassoulet-leger', nom: 'Cassoulet léger', emoji: '🫘', type: 'repas', minutes: 35, portions: 1,
    tags: ['equilibre'],
    ingredients: [['haricotsBlancs', 200], ['porc', 120], ['carotte', 80], ['coulis', 100], ['oignon', 40]],
    etapes: [
      'Coupe le porc en cubes et fais-le dorer dans une cocotte.',
      'Ajoute l’oignon, la carotte en rondelles, le thym et le laurier.',
      'Ajoute les haricots blancs, le coulis et 100 ml d’eau. Laisse mijoter 25 minutes.',
    ],
    astuce: 'Version de saison froide, rassasiante et beaucoup plus légère que l’original.',
  },
  {
    id: 'buddha-tempeh', nom: 'Buddha bowl tempeh, riz complet & betterave', emoji: '🥙', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['tempeh', 120], ['rizComplet', 70], ['betterave', 100], ['epinards', 50], ['avocat', 40], ['soja', 10]],
    etapes: [
      'Cuis le riz complet (environ 25 minutes).',
      'Coupe le tempeh en tranches et fais-le dorer 3 minutes par face avec la sauce soja.',
      'Dispose le riz, le tempeh, la betterave en dés, les épinards et l’avocat dans un bol.',
    ],
  },
  {
    id: 'salade-betterave-chevre', nom: 'Salade lentilles, betterave & chèvre', emoji: '🥗', type: 'repas', minutes: 25, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['lentillesVertes', 60], ['betterave', 150], ['chevreFrais', 40], ['noix', 10], ['salade', 50], ['huile', 8]],
    etapes: [
      'Cuis les lentilles 20 minutes puis laisse-les tiédir.',
      'Coupe la betterave en dés.',
      'Mélange lentilles, betterave et salade, émiette le chèvre et ajoute les noix.',
      'Assaisonne avec l’huile, du vinaigre balsamique, sel et poivre.',
    ],
  },
  {
    id: 'poulet-cajou', nom: 'Poulet sauté aux noix de cajou', emoji: '🥡', type: 'repas', minutes: 20, portions: 1,
    tags: ['masse'],
    ingredients: [['poulet', 150], ['cajou', 20], ['poivron', 100], ['oignon', 40], ['riz', 70], ['soja', 15], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais griller les noix de cajou 2 minutes à sec dans une poêle, puis réserve.',
      'Fais sauter le poulet en dés 5 minutes, ajoute poivron et oignon 4 minutes.',
      'Ajoute la sauce soja et les noix de cajou, mélange et sers sur le riz.',
    ],
  },
  {
    id: 'cabillaud-tomate', nom: 'Cabillaud à la tomate & riz complet', emoji: '🍅', type: 'repas', minutes: 30, portions: 1,
    tags: ['seche'],
    ingredients: [['cabillaud', 180], ['coulis', 120], ['olives', 15], ['rizComplet', 70], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz complet.',
      'Fais chauffer le coulis avec l’huile, de l’ail et les olives.',
      'Dépose le cabillaud dans la sauce, couvre et cuis 8 à 10 minutes à feu doux.',
    ],
  },
  {
    id: 'pates-pesto-mozza', nom: 'Pâtes pesto, tomates & mozzarella', emoji: '🍝', type: 'repas', minutes: 15, portions: 1,
    tags: ['vege', 'masse', 'rapide'],
    ingredients: [['pates', 100], ['pesto', 20], ['tomate', 120], ['mozzarella', 50]],
    etapes: [
      'Cuis les pâtes.',
      'Égoutte-les et mélange avec le pesto.',
      'Ajoute les tomates cerises coupées et la mozzarella en morceaux.',
    ],
  },
  {
    id: 'bourguignon-express', nom: 'Bœuf bourguignon express', emoji: '🥘', type: 'repas', minutes: 40, portions: 1,
    tags: ['equilibre'],
    ingredients: [['rumsteck', 150], ['carotte', 120], ['champignons', 100], ['oignon', 40], ['pommeDeTerre', 200], ['huile', 5]],
    etapes: [
      'Coupe le bœuf en cubes et fais-le dorer dans une cocotte avec l’huile.',
      'Ajoute l’oignon, les carottes, les champignons, thym, laurier et 300 ml de bouillon (ou moitié vin rouge).',
      'Laisse mijoter 25 à 30 minutes à couvert.',
      'Sers avec les pommes de terre cuites à la vapeur.',
    ],
  },
  {
    id: 'frittata-courgette', nom: 'Frittata courgette & feta', emoji: '🍳', type: 'repas', minutes: 20, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['oeuf', 220], ['courgette', 200], ['feta', 30], ['huile', 5], ['pain', 50]],
    etapes: [
      'Râpe ou coupe la courgette en fines rondelles et fais-la revenir 5 minutes.',
      'Verse les 4 œufs battus, émiette la feta par-dessus.',
      'Cuis 6 minutes à feu doux puis passe 3 minutes sous le grill du four.',
      'Sers avec le pain.',
    ],
  },
  {
    id: 'dinde-patate-epinards', nom: 'Dinde, patate douce & épinards', emoji: '🍠', type: 'repas', minutes: 25, portions: 1,
    tags: ['seche'],
    ingredients: [['dinde', 150], ['patateDouce', 200], ['epinards', 100], ['huile', 5]],
    etapes: [
      'Cuis la patate douce en cubes 15 minutes à la vapeur (ou 6 minutes au micro-ondes).',
      'Poêle la dinde en lanières avec l’huile et du paprika.',
      'Ajoute les épinards à la fin jusqu’à ce qu’ils fondent.',
    ],
  },
  {
    id: 'poke-thon-mangue', nom: 'Poke bowl thon & mangue', emoji: '🍣', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre', 'seche'],
    ingredients: [['rizComplet', 70], ['thon', 120], ['mangue', 80], ['edamame', 50], ['concombre', 60], ['soja', 15]],
    etapes: [
      'Cuis le riz complet et laisse-le tiédir.',
      'Cuis les edamame 4 minutes.',
      'Dispose le riz, le thon, la mangue, les edamame et le concombre en dés.',
      'Arrose de sauce soja.',
    ],
  },
  {
    id: 'chili-dinde', nom: 'Chili de dinde à la patate douce', emoji: '🌶️', type: 'repas', minutes: 30, portions: 1,
    tags: ['seche', 'equilibre'],
    ingredients: [['dinde', 130], ['patateDouce', 150], ['haricotsRouges', 100], ['coulis', 150], ['oignon', 40]],
    etapes: [
      'Fais revenir l’oignon puis la dinde coupée en petits dés.',
      'Ajoute la patate douce en petits cubes, les haricots, le coulis, du cumin et du piment.',
      'Laisse mijoter 20 minutes à couvert jusqu’à ce que la patate douce soit tendre.',
    ],
  },
  {
    id: 'wrap-saumon-fume', nom: 'Wraps saumon fumé & chèvre frais', emoji: '🌯', type: 'repas', minutes: 5, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['tortilla', 120], ['saumonFume', 70], ['chevreFrais', 30], ['salade', 40], ['concombre', 50]],
    etapes: [
      'Tartine les tortillas de fromage frais.',
      'Ajoute le saumon fumé, la salade et le concombre en bâtonnets.',
      'Roule serré.',
    ],
  },
  {
    id: 'lasagnes-courgettes', nom: 'Lasagnes de courgettes', emoji: '🧀', type: 'repas', minutes: 45, portions: 1,
    tags: ['seche'],
    ingredients: [['courgette', 300], ['boeuf', 130], ['coulis', 150], ['ricotta', 60], ['mozzarella', 30]],
    etapes: [
      'Coupe la courgette en fines lamelles dans la longueur.',
      'Fais dorer le bœuf haché avec ail et herbes, ajoute le coulis.',
      'Dans un plat, alterne courgettes, sauce et ricotta, termine par la mozzarella.',
      'Enfourne 30 minutes à 190 °C.',
    ],
    astuce: 'Les courgettes remplacent les pâtes : beaucoup moins de calories, toujours autant de goût.',
  },
  {
    id: 'curry-lentilles-patate', nom: 'Curry de lentilles corail & patate douce', emoji: '🍛', type: 'repas', minutes: 30, portions: 1,
    tags: ['vege', 'equilibre'],
    ingredients: [['lentilles', 70], ['patateDouce', 150], ['laitCoco', 100], ['epinards', 60], ['riz', 40]],
    etapes: [
      'Fais revenir de l’ail, du gingembre et 1 cuillère de curry.',
      'Ajoute la patate douce en cubes, les lentilles, le lait de coco et 200 ml d’eau.',
      'Laisse mijoter 20 minutes, ajoute les épinards à la fin.',
      'Sers avec le riz.',
    ],
  },
  {
    id: 'poulet-citron-quinoa', nom: 'Poulet au citron, quinoa & haricots verts', emoji: '🍋', type: 'repas', minutes: 25, portions: 1,
    tags: ['equilibre'],
    ingredients: [['poulet', 150], ['quinoa', 70], ['haricotsVerts', 150], ['huile', 8]],
    etapes: [
      'Fais mariner le poulet 10 minutes avec le jus d’un citron, ail et herbes.',
      'Cuis le quinoa 12 minutes et les haricots verts 8 minutes.',
      'Poêle le poulet 6 à 8 minutes avec l’huile.',
    ],
  },
  {
    id: 'crevettes-coco', nom: 'Crevettes au lait de coco & riz', emoji: '🥥', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre'],
    ingredients: [['crevettes', 150], ['laitCoco', 100], ['riz', 70], ['poivron', 80], ['huile', 5]],
    etapes: [
      'Lance la cuisson du riz.',
      'Fais revenir le poivron en lanières avec un peu de curry ou de pâte de curry.',
      'Ajoute le lait de coco et les crevettes, cuis 4 minutes.',
      'Ajoute de la coriandre et du citron vert.',
    ],
  },
  {
    id: 'steak-frites-four', nom: 'Steak-frites au four & salade', emoji: '🥩', type: 'repas', minutes: 35, portions: 1,
    tags: ['masse'],
    ingredients: [['rumsteck', 170], ['pommeDeTerre', 300], ['salade', 60], ['huile', 10]],
    etapes: [
      'Coupe les pommes de terre en frites, mélange avec l’huile et le sel, enfourne 30 minutes à 220 °C.',
      'Saisis le steak 2 à 4 minutes par face selon la cuisson voulue, laisse reposer 3 minutes.',
      'Sers avec la salade.',
    ],
  },
  {
    id: 'soupe-poulet-legumes', nom: 'Soupe de poulet aux légumes & petites pâtes', emoji: '🍜', type: 'repas', minutes: 30, portions: 1,
    tags: ['seche'],
    ingredients: [['poulet', 120], ['carotte', 100], ['poireau', 100], ['pommeDeTerre', 100], ['pates', 30]],
    etapes: [
      'Mets le poulet, la carotte, le poireau et la pomme de terre coupés dans 600 ml de bouillon.',
      'Laisse cuire 20 minutes.',
      'Retire le poulet, effiloche-le et remets-le avec les petites pâtes : 6 à 8 minutes.',
    ],
    astuce: 'Réconfortante, très rassasiante et légère : parfaite en sèche.',
  },
  {
    id: 'salade-pates-poulet', nom: 'Salade de pâtes au poulet & mozzarella', emoji: '🥗', type: 'repas', minutes: 20, portions: 1,
    tags: ['equilibre', 'masse'],
    ingredients: [['pates', 80], ['poulet', 120], ['tomate', 100], ['mais', 50], ['mozzarella', 30], ['huile', 5]],
    etapes: [
      'Cuis les pâtes, rince-les à l’eau froide.',
      'Poêle le poulet en dés et laisse-le refroidir.',
      'Mélange tout avec la tomate, le maïs et la mozzarella, assaisonne avec l’huile et du basilic.',
    ],
    astuce: 'Idéale en boîte pour emporter au travail ou à la fac.',
  },

  // ---------- Collations ----------
  {
    id: 'smoothie-fraise-banane', nom: 'Smoothie fraise-banane protéiné', emoji: '🍓', type: 'collation', minutes: 3, portions: 1,
    tags: ['post', 'rapide'],
    ingredients: [['fraises', 150], ['banane', 100], ['laitAmande', 250], ['whey', 25]],
    etapes: ['Mixe tout jusqu’à ce que ce soit bien lisse.'],
  },
  {
    id: 'orange-cajou', nom: 'Orange & noix de cajou', emoji: '🍊', type: 'collation', minutes: 1, portions: 1,
    tags: ['pre', 'rapide', 'vege'],
    ingredients: [['orange', 150], ['cajou', 20]],
    etapes: ['Pèle l’orange et accompagne-la d’une petite poignée de noix de cajou.'],
  },
  {
    id: 'oeufs-mimosa-thon', nom: 'Œufs mimosa au thon', emoji: '🥚', type: 'collation', minutes: 15, portions: 1,
    tags: ['seche'],
    ingredients: [['oeuf', 110], ['thon', 40], ['yaourtGrec', 20]],
    etapes: [
      'Cuis les 2 œufs 9 minutes, refroidis-les et coupe-les en deux.',
      'Écrase les jaunes avec le thon, le yaourt grec, un peu de moutarde, sel et poivre.',
      'Garnis les blancs avec ce mélange.',
    ],
  },
  {
    id: 'legumes-fromage-frais', nom: 'Bâtonnets de légumes & fromage frais', emoji: '🥕', type: 'collation', minutes: 4, portions: 1,
    tags: ['seche', 'vege', 'rapide'],
    ingredients: [['carotte', 100], ['concombre', 100], ['chevreFrais', 40]],
    etapes: [
      'Coupe la carotte et le concombre en bâtonnets.',
      'Mélange le fromage frais avec des herbes et trempe les légumes dedans.',
    ],
  },
  {
    id: 'brownie-proteine', nom: 'Brownie protéiné (6 parts)', emoji: '🟫', type: 'collation', minutes: 30, portions: 6,
    tags: ['equilibre'],
    ingredients: [['avoine', 100], ['cacao', 30], ['whey', 50], ['oeuf', 110], ['compote', 150], ['chocolat', 40], ['miel', 30]],
    etapes: [
      'Préchauffe le four à 180 °C.',
      'Mixe l’avoine en farine, puis mélange avec le cacao, la whey, les œufs, la compote et le miel.',
      'Ajoute le chocolat en morceaux, verse dans un petit moule chemisé.',
      'Enfourne 18 à 20 minutes : le centre doit rester fondant. Coupe en 6.',
    ],
  },
  {
    id: 'mini-pizzas-galettes', nom: 'Mini-pizzas sur galettes de riz', emoji: '🍕', type: 'collation', minutes: 8, portions: 1,
    tags: ['equilibre', 'rapide'],
    ingredients: [['galettesRiz', 30], ['coulis', 30], ['mozzarella', 30], ['jambon', 30]],
    etapes: [
      'Étale le coulis sur les 3 galettes, ajoute le jambon et la mozzarella.',
      'Passe 4 à 5 minutes sous le grill du four (ou 40 secondes au micro-ondes).',
    ],
  },
  {
    id: 'yaourt-fraises-cacao', nom: 'Yaourt grec, fraises & cacao', emoji: '🍫', type: 'collation', minutes: 2, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['yaourtGrec', 200], ['fraises', 100], ['cacao', 5]],
    etapes: ['Ajoute les fraises coupées sur le yaourt et saupoudre de cacao.'],
  },
  {
    id: 'tartine-banane-cacahuete', nom: 'Tartine banane & beurre de cacahuète', emoji: '🍞', type: 'collation', minutes: 3, portions: 1,
    tags: ['pre', 'rapide'],
    ingredients: [['pain', 60], ['cacahuete', 15], ['banane', 80]],
    etapes: ['Tartine le pain grillé de beurre de cacahuète et ajoute la banane en rondelles.'],
  },
  {
    id: 'roules-dinde', nom: 'Roulés de jambon, fromage frais & concombre', emoji: '🥒', type: 'collation', minutes: 4, portions: 1,
    tags: ['seche', 'rapide'],
    ingredients: [['jambon', 80], ['chevreFrais', 30], ['concombre', 50]],
    etapes: [
      'Tartine les tranches de jambon de fromage frais.',
      'Pose un bâtonnet de concombre au bord et roule.',
    ],
  },
  {
    id: 'chia-chocolat', nom: 'Pudding de chia au chocolat', emoji: '🍮', type: 'collation', minutes: 5, portions: 1,
    tags: ['seche', 'vege'],
    ingredients: [['chia', 25], ['laitAmande', 200], ['cacao', 8], ['miel', 10], ['whey', 15]],
    etapes: [
      'Mélange tous les ingrédients dans un pot en fouettant bien.',
      'Remue de nouveau après 10 minutes, puis laisse au frigo au moins 3 heures.',
    ],
  },
  {
    id: 'lassi-mangue', nom: 'Lassi mangue protéiné', emoji: '🥭', type: 'collation', minutes: 3, portions: 1,
    tags: ['post', 'rapide'],
    ingredients: [['mangue', 120], ['yaourtGrec', 150], ['lait', 100]],
    etapes: ['Mixe la mangue avec le yaourt et le lait, ajoute une pincée de cardamome si tu en as.'],
  },
];

import { etat, abonner, esc } from './store.js';
import { chargerExercices } from './exercices.js';
import { chargerCreditsRecettes } from './nutrition.js';
import { aller, chrono } from './nav.js';
import * as accueil from './vues/accueil.js';
import * as calendrier from './vues/calendrier.js';
import * as seance from './vues/seance.js';
import * as bibliotheque from './vues/bibliotheque.js';
import * as progres from './vues/progres.js';
import * as salles from './vues/salles.js';
import * as recompenses from './vues/recompenses.js';
import * as objectifs from './vues/objectifs.js';
import * as nutrition from './vues/nutrition.js';
import { besoinBienvenue, lancerBienvenue } from './vues/bienvenue.js';

// route -> [module, fonction, onglet, page racine ?]
const ROUTES = {
  accueil: [accueil, 'afficher', 'accueil', true],
  calendrier: [calendrier, 'afficher', 'calendrier', true],
  'seance-detail': [calendrier, 'afficherSeance', 'calendrier', false],
  seance: [seance, 'afficher', 'seance', true],
  exercices: [bibliotheque, 'afficher', 'exercices', true],
  exercice: [bibliotheque, 'afficherExercice', 'exercices', false],
  progres: [progres, 'afficher', 'progres', true],
  poids: [progres, 'afficherPoids', 'progres', false],
  charges: [progres, 'afficherCharges', 'progres', false],
  charge: [progres, 'afficherCharge', 'progres', false],
  reglages: [progres, 'afficherReglages', 'progres', false],
  salles: [salles, 'afficher', 'progres', false],
  salle: [salles, 'afficherSalle', 'progres', false],
  recompenses: [recompenses, 'afficher', 'progres', false],
  objectifs: [objectifs, 'afficher', 'progres', false],
  nutrition: [nutrition, 'afficher', 'progres', false],
  recettes: [nutrition, 'afficherRecettes', 'progres', false],
  recette: [nutrition, 'afficherRecette', 'progres', false],
};

const vue = document.getElementById('vue');
const actions = document.getElementById('actions-haut');
const retour = document.getElementById('btn-retour');
let nettoyage = null;
let routeCourante = '';

function lireRoute() {
  const [nom, ...params] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { nom: ROUTES[nom] ? nom : 'accueil', params };
}

function rendre({ garderDefilement = false } = {}) {
  const { nom, params } = lireRoute();
  const [mod, fn, onglet, racine] = ROUTES[nom];
  const y = window.scrollY;
  if (nettoyage) { try { nettoyage(); } catch { /* rien */ } nettoyage = null; }
  actions.innerHTML = '';
  retour.hidden = racine;
  document.querySelectorAll('.onglets a').forEach((a) => a.classList.toggle('actif', a.dataset.onglet === onglet));
  try {
    nettoyage = mod[fn](vue, params) || null;
  } catch (e) {
    console.error(e);
    vue.innerHTML = `<div class="vide-etat"><div class="grand">😵</div><p>Un problème est survenu.</p><p class="tres-discret">${esc(e.message)}</p></div>`;
  }
  window.scrollTo(0, garderDefilement ? y : 0);
  routeCourante = nom;
  majBandeau();
}

// ---------- Bandeau "séance en cours" ----------
const bandeau = document.getElementById('bandeau-seance');

function majBandeau() {
  const visible = !!etat.enCours && routeCourante !== 'seance';
  bandeau.hidden = !visible;
  document.body.classList.toggle('avec-bandeau', visible);
  if (visible) {
    bandeau.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/></svg>
      <div class="flex1">Séance en cours</div><div class="chrono">${chrono(etat.enCours.debutTs)}</div>`;
  }
}
bandeau.onclick = () => aller('seance');
setInterval(() => { if (!bandeau.hidden) bandeau.querySelector('.chrono').textContent = chrono(etat.enCours.debutTs); }, 1000);

retour.onclick = () => (history.length > 1 ? history.back() : aller('accueil'));

// ---------- Démarrage ----------
async function demarrer() {
  vue.innerHTML = '<div class="chargement"><div class="rond-charge"></div>Chargement…</div>';
  try {
    await Promise.all([chargerExercices(), chargerCreditsRecettes()]);
  } catch (e) {
    vue.innerHTML = '<div class="vide-etat"><div class="grand">📡</div><p>Impossible de charger les exercices. Vérifie ta connexion puis relance l’app.</p></div>';
    return;
  }
  window.addEventListener('hashchange', () => rendre());
  abonner(() => rendre({ garderDefilement: true }));
  // Chrome annonce que l'app est installable un peu après le chargement : on rafraîchit l'écran.
  window.addEventListener('muscu-installable', () => {
    if (['accueil', 'reglages'].includes(routeCourante) && document.getElementById('feuille').hidden) rendre({ garderDefilement: true });
  });
  rendre();
  if (besoinBienvenue()) lancerBienvenue(() => { location.hash = '#/accueil'; rendre(); });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});

demarrer();

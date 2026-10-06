// Assistant de premier lancement : profil, poids, objectif et salle.
import { etat, maj, esc, jour, uid, kg } from '../store.js';
import { ACTIVITES, OBJECTIFS_NUTRI, besoins } from '../nutrition.js';
import { definirObjectifPoids } from '../objectifs.js';
import { geocoder, maPosition, chercherSalles, statutOuverture } from '../salles.js';
import { ajouterXp } from '../xp.js';
import { ICONES, toast } from '../ui.js';

const XP_BIENVENUE = 50;

/** Vrai si l'app n'a encore aucune donnée et que l'accueil n'a jamais été fait. */
export function besoinBienvenue() {
  if (etat.bienvenueFaite) return false;
  const vide = !etat.seances.length && !etat.poids.length && !etat.salles.length && !etat.profil;
  if (!vide) maj((e) => (e.bienvenueFaite = true), { silencieux: true });
  return vide;
}

const lire = (v) => parseFloat(String(v).replace(',', '.'));
const nombre = (v) => String(Math.round(v * 10) / 10).replace('.', ',');

export function lancerBienvenue(quandFini) {
  const el = document.createElement('div');
  el.id = 'bienvenue';
  document.body.append(el);
  document.body.classList.add('en-bienvenue');

  // Réponses gardées pendant l'assistant, enregistrées à la fin de chaque étape.
  const r = {
    prenom: '', sexe: '', age: '', taille: '', activite: 'modere',
    poids: '', objectif: 'maintien', cible: '',
    salle: null, resultats: null, recherche: { lieu: '', nom: '' }, message: '',
  };
  const ETAPES = [etapeAccueil, etapeProfil, etapePoids, etapeSalle, etapeFin];
  let n = 0;

  const fermer = () => {
    // Pas de rappel de sauvegarde le jour même : il reviendra dans les jours qui suivent.
    maj((e) => { e.bienvenueFaite = true; e.rappelSauvegardeReporte = jour(); });
    el.remove();
    document.body.classList.remove('en-bienvenue');
    quandFini?.();
  };
  const aller = (i) => { n = i; dessiner(); el.scrollTop = 0; };

  function dessiner() {
    const { html, actions } = ETAPES[n]();
    el.innerHTML = `<div class="bv-contenu">
        ${n > 0 && n < ETAPES.length - 1 ? `<div class="bv-points">${ETAPES.slice(1, -1).map((_, i) => `<i class="${i < n ? 'ok' : ''}"></i>`).join('')}</div>` : ''}
        ${html}
      </div>
      <div class="bv-actions">${actions}</div>`;
    brancher();
  }

  // ---------- Étape 1 ----------
  function etapeAccueil() {
    return {
      html: `<div class="centre" style="margin-top:6vh">
          <img src="icons/icon-192.png" alt="" style="width:88px;height:88px;border-radius:22px;box-shadow:0 10px 30px rgba(255,106,61,.35)">
          <h1 style="font-size:28px;margin:18px 0 6px">Bienvenue dans Muscu 💪</h1>
          <p class="discret">On configure ton app en 1 minute.</p>
        </div>
        <div class="pile" style="margin-top:24px">
          ${[
            ['🏋️', 'Tes séances & tes charges', 'Programme, chrono de repos, historique de chaque machine.'],
            ['🏆', 'De l’XP et des récompenses', 'Monte de niveau et gagne des bons : boisson sucrée, soirée jeux vidéo…'],
            ['🥗', 'Nutrition & 150 recettes', 'Tes besoins du jour et des idées de repas adaptées.'],
            ['📍', 'Ta salle & ses horaires', 'Savoir si elle est ouverte avant d’y aller.'],
          ].map(([e, t, d]) => `<div class="carte ligne" style="margin:0;align-items:flex-start">
            <div style="font-size:26px">${e}</div><div class="flex1"><div style="font-weight:700">${t}</div><div class="discret">${d}</div></div></div>`).join('')}
        </div>
        <p class="tres-discret centre" style="margin-top:16px">🔒 Tes données restent uniquement sur ton téléphone.</p>`,
      actions: `<button class="btn btn-principal btn-plein" data-suivant>Commencer</button>
        <button class="btn-lien" data-passer-tout style="margin-top:6px">Passer l’introduction</button>`,
    };
  }

  // ---------- Étape 2 ----------
  function etapeProfil() {
    return {
      html: `<h1 class="bv-titre">Faisons connaissance 👋</h1>
        <p class="discret">Ça sert à calculer tes calories et tes besoins.</p>
        <div class="pile" style="margin-top:14px">
          <label class="champ">Prénom (facultatif)<input type="text" id="bv-prenom" value="${esc(r.prenom)}" autocomplete="given-name"></label>
          <div class="champ">Sexe
            <div class="grille-2" style="margin-top:4px">
              <button class="btn ${r.sexe === 'H' ? 'btn-principal' : ''}" data-sexe="H">Homme</button>
              <button class="btn ${r.sexe === 'F' ? 'btn-principal' : ''}" data-sexe="F">Femme</button>
            </div>
          </div>
          <div class="grille-2">
            <label class="champ">Âge<input type="number" inputmode="numeric" id="bv-age" value="${esc(r.age)}" min="12" max="100"></label>
            <label class="champ">Taille (cm)<input type="number" inputmode="numeric" id="bv-taille" value="${esc(r.taille)}" min="120" max="230"></label>
          </div>
          <label class="champ">Activité
            <select id="bv-act">${ACTIVITES.map((a) => `<option value="${a.id}" ${r.activite === a.id ? 'selected' : ''}>${a.nom}</option>`).join('')}</select>
          </label>
        </div>`,
      actions: `<button class="btn btn-principal btn-plein" data-suivant>Suivant</button>
        <div class="grille-2" style="margin-top:6px"><button class="btn" data-precedent>Retour</button><button class="btn" data-passer>Passer</button></div>`,
    };
  }

  // ---------- Étape 3 ----------
  function etapePoids() {
    const p = lire(r.poids);
    const suggestion = p > 0 ? (r.objectif === 'perte' ? p * 0.92 : r.objectif === 'prise' ? p * 1.05 : 0) : 0;
    return {
      html: `<h1 class="bv-titre">Ton poids & ton objectif ⚖️</h1>
        <p class="discret">Ta première pesée sert de point de départ pour suivre ta progression.</p>
        <div class="pile" style="margin-top:14px">
          <label class="champ">Poids actuel (kg)<input type="text" inputmode="decimal" id="bv-poids" value="${esc(r.poids)}" placeholder="ex. 78,5"></label>
          <div class="champ">Ton objectif
            <div class="pile" style="margin-top:4px">
              ${Object.entries(OBJECTIFS_NUTRI).map(([k, o]) => `<button class="btn btn-plein ${r.objectif === k ? 'btn-principal' : ''}" data-obj="${k}" style="justify-content:flex-start">${o.emoji} ${o.nom}</button>`).join('')}
            </div>
          </div>
          ${r.objectif !== 'maintien' ? `<label class="champ">Poids visé (kg, facultatif)
            <input type="text" inputmode="decimal" id="bv-cible" value="${esc(r.cible)}" placeholder="${suggestion ? 'ex. ' + nombre(suggestion) : ''}"></label>` : ''}
        </div>`,
      actions: `<button class="btn btn-principal btn-plein" data-suivant>Suivant</button>
        <div class="grille-2" style="margin-top:6px"><button class="btn" data-precedent>Retour</button><button class="btn" data-passer>Passer</button></div>`,
    };
  }

  // ---------- Étape 4 ----------
  function etapeSalle() {
    let liste = '';
    if (r.message) liste = `<p class="discret">${esc(r.message)}</p>`;
    else if (r.resultats && !r.resultats.length) liste = '<p class="discret">Aucune salle trouvée. Essaie une autre ville, ou passe cette étape : tu pourras l’ajouter plus tard.</p>';
    else if (r.resultats) {
      liste = `<div class="liste">${r.resultats.slice(0, 8).map((s, i) => {
        const st = statutOuverture(s.horaires);
        const choisie = r.salle && r.salle.osm === s.osm;
        return `<div class="item" data-salle="${i}" style="${choisie ? 'background:var(--accent-doux)' : ''}">
          <div class="flex1"><div class="titre">${esc(s.nom)}</div>
            <div class="sous">${nombre(s.distance)} km${s.adresse ? ' · ' + esc(s.adresse) : ''}${st ? ' · ' + esc(st.texte) : ''}</div></div>
          ${choisie ? '<span class="etiquette vert">✓ Choisie</span>' : ''}
        </div>`;
      }).join('')}</div>`;
    }
    return {
      html: `<h1 class="bv-titre">Ta salle de sport 📍</h1>
        <p class="discret">Pour voir ses horaires et savoir où tu t’entraînes.</p>
        <div class="pile" style="margin-top:14px">
          <label class="champ">Ville<input type="text" id="bv-lieu" value="${esc(r.recherche.lieu)}" placeholder="ex. Foetz" enterkeyhint="search"></label>
          <label class="champ">Nom de la salle (facultatif)<input type="text" id="bv-nom" value="${esc(r.recherche.nom)}" placeholder="ex. Basic-Fit" enterkeyhint="search"></label>
          <div class="grille-2">
            <button class="btn" id="bv-chercher">${ICONES.recherche} Rechercher</button>
            <button class="btn" id="bv-autour">${ICONES.cible} Autour de moi</button>
          </div>
          <div id="bv-res">${liste}</div>
        </div>`,
      actions: `<button class="btn btn-principal btn-plein" data-suivant>${r.salle ? 'Suivant' : 'Suivant sans salle'}</button>
        <div class="grille-2" style="margin-top:6px"><button class="btn" data-precedent>Retour</button><button class="btn" data-passer>Passer</button></div>`,
    };
  }

  // ---------- Étape 5 ----------
  function etapeFin() {
    const b = etat.profil ? besoins() : null;
    const prenom = etat.profil?.prenom;
    return {
      html: `<div class="centre" style="margin-top:5vh">
          <div style="font-size:64px">🎉</div>
          <h1 style="font-size:27px;margin:10px 0 4px">Tout est prêt${prenom ? ', ' + esc(prenom) : ''} !</h1>
          <p class="discret">+${XP_BIENVENUE} XP de bienvenue pour bien démarrer.</p>
        </div>
        <div class="pile" style="margin-top:18px">
          ${b && !b.poidsEstime ? `<div class="carte" style="margin:0">
            <div class="tres-discret">${OBJECTIFS_NUTRI[b.objectif].emoji} ${OBJECTIFS_NUTRI[b.objectif].nom}</div>
            <div style="font-size:26px;font-weight:850">${b.kcal.toLocaleString('fr-FR')} kcal / jour</div>
            <div class="discret">${b.p} g de protéines · ${b.g} g de glucides · ${b.l} g de lipides</div>
          </div>` : ''}
          ${etat.objectifs?.poids ? `<div class="carte" style="margin:0">🎯 Objectif : <strong>${kg(etat.objectifs.poids.cible)}</strong> (départ ${kg(etat.objectifs.poids.depart)})</div>` : ''}
          ${etat.salles[0] ? `<div class="carte" style="margin:0">📍 <strong>${esc(etat.salles[0].nom)}</strong>${etat.salles[0].horaires ? '' : '<div class="tres-discret">Pense à saisir ses horaires dans Progrès › Mes salles.</div>'}</div>` : ''}
          <div class="carte" style="margin:0"><div style="font-weight:700">Et maintenant ?</div>
            <div class="discret">Touche le bouton orange <strong>Séance</strong> en bas de l’écran pour lancer ton premier entraînement.</div></div>
        </div>`,
      actions: '<button class="btn btn-principal btn-plein" data-fin>C’est parti !</button>',
    };
  }

  // ---------- Enregistrement ----------
  function lireChamps() {
    const v = (id) => el.querySelector('#' + id)?.value;
    if (n === 1) {
      r.prenom = (v('bv-prenom') || '').trim();
      r.age = +v('bv-age') || '';
      r.taille = +v('bv-taille') || '';
      r.activite = v('bv-act') || r.activite;
    }
    if (n === 2) {
      r.poids = v('bv-poids') ?? r.poids;
      if (el.querySelector('#bv-cible')) r.cible = v('bv-cible');
    }
    if (n === 3) {
      r.recherche.lieu = (v('bv-lieu') || '').trim();
      r.recherche.nom = (v('bv-nom') || '').trim();
    }
  }

  /** Valide et enregistre l'étape courante. Retourne false si une saisie est invalide. */
  function enregistrer() {
    lireChamps();
    if (n === 1) {
      if (r.age && !(r.age >= 12 && r.age <= 100)) return toast('Âge invalide'), false;
      if (r.taille && !(r.taille >= 120 && r.taille <= 230)) return toast('Taille invalide (en cm)'), false;
      maj((e) => (e.profil = {
        ...(e.profil || {}), prenom: r.prenom, sexe: r.sexe, age: r.age, taille: r.taille, activite: r.activite,
        objectif: e.profil?.objectif || 'auto',
      }), { silencieux: true });
    }
    if (n === 2) {
      const p = lire(r.poids);
      const c = lire(r.cible);
      if (r.poids && !(p > 30 && p < 300)) return toast('Poids invalide'), false;
      if (r.cible && !(c > 30 && c < 300)) return toast('Poids visé invalide'), false;
      maj((e) => {
        if (p > 30) {
          e.poids = e.poids.filter((x) => x.date !== jour());
          e.poids.push({ date: jour(), kg: Math.round(p * 10) / 10 });
        }
        e.profil = { ...(e.profil || {}), objectif: r.objectif };
        if (p > 30 && c > 30 && r.objectif !== 'maintien') definirObjectifPoids(e, Math.round(c * 10) / 10);
      }, { silencieux: true });
    }
    if (n === 3 && r.salle && !etat.salles.some((s) => s.osm === r.salle.osm)) {
      const s = { id: uid(), ...r.salle };
      delete s.distance;
      maj((e) => { e.salles.push(s); e.salleParDefaut = s.id; }, { silencieux: true });
    }
    return true;
  }

  async function chercher(obtenirCentre) {
    lireChamps();
    r.message = '';
    el.querySelector('#bv-res').innerHTML = '<div class="chargement"><div class="rond-charge"></div>Recherche des salles…</div>';
    try {
      const centre = await obtenirCentre();
      if (!centre) throw new Error('Ville introuvable. Vérifie l’orthographe.');
      r.resultats = await chercherSalles({ ...centre, nom: r.recherche.nom, rayon: r.recherche.nom ? 15000 : 8000 });
    } catch (e) {
      r.resultats = null;
      r.message = /fetch|HTTP|abort/i.test(e.message + e.name) ? 'Le service de recherche ne répond pas. Réessaie, ou passe cette étape.' : e.message;
    }
    dessiner();
  }

  function brancher() {
    el.querySelectorAll('[data-suivant]').forEach((b) => (b.onclick = () => { if (enregistrer()) aller(n + 1); }));
    el.querySelectorAll('[data-precedent]').forEach((b) => (b.onclick = () => { lireChamps(); aller(n - 1); }));
    el.querySelectorAll('[data-passer]').forEach((b) => (b.onclick = () => aller(n + 1)));
    el.querySelectorAll('[data-passer-tout]').forEach((b) => (b.onclick = fermer));
    el.querySelectorAll('[data-sexe]').forEach((b) => (b.onclick = () => { lireChamps(); r.sexe = b.dataset.sexe; dessiner(); }));
    el.querySelectorAll('[data-obj]').forEach((b) => (b.onclick = () => { lireChamps(); r.objectif = b.dataset.obj; dessiner(); }));
    el.querySelectorAll('[data-salle]').forEach((b) => (b.onclick = () => { lireChamps(); r.salle = r.resultats[+b.dataset.salle]; dessiner(); }));
    const ch = el.querySelector('#bv-chercher');
    if (ch) {
      ch.onclick = () => {
        const lieu = el.querySelector('#bv-lieu').value.trim();
        if (!lieu) return toast('Indique une ville');
        chercher(() => geocoder(lieu));
      };
      el.querySelector('#bv-autour').onclick = () => chercher(maPosition);
      ['#bv-lieu', '#bv-nom'].forEach((s) => (el.querySelector(s).onkeydown = (e) => { if (e.key === 'Enter') ch.click(); }));
    }
    const fin = el.querySelector('[data-fin]');
    if (fin) fin.onclick = () => {
      maj((e) => ajouterXp(e, XP_BIENVENUE, 'Bienvenue'), { silencieux: true });
      fermer();
    };
  }

  dessiner();
}

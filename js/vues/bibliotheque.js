import { etat, esc, jour, historiqueExercice, kg, dateCourte } from '../store.js';
import { entete, aller } from '../nav.js';
import {
  tous, exo, image, normaliser, texteSerie, colonnes, GROUPES, MUSCLES, MATERIEL, CATEGORIES, NIVEAUX, variantes, muscleGroupe,
} from '../exercices.js';
import { ICONES, ouvrirFeuille, graphe } from '../ui.js';
import { ajouterALaSeance } from './seance.js';
import { metExercice, poidsA } from '../calories.js';

const filtres = { texte: '', groupe: '', materiel: '', essentiels: true };
const PAR_PAGE = 40;

function filtrer({ texte, groupe, materiel, essentiels }) {
  const q = normaliser(texte);
  const mots = q ? q.split(' ') : [];
  const g = groupe ? muscleGroupe(groupe) : null;
  return tous().filter((ex) => {
    if (essentiels && !q && !ex.ess) return false;
    if (g && !(g.categorie ? ex.c === g.categorie : ex.m.some((m) => g.muscles.includes(m)))) return false;
    if (materiel && ex.e !== materiel) return false;
    if (mots.length) {
      const cible = normaliser(`${ex.n} ${ex.en} ${ex.m.map((m) => MUSCLES[m]).join(' ')} ${MATERIEL[ex.e] || ''}`);
      return mots.every((m) => cible.includes(m));
    }
    return true;
  }).sort((a, b) => (b.ess - a.ess) || a.n.localeCompare(b.n, 'fr'));
}

function ligne(ex) {
  const img = image(ex);
  return `<a class="item" href="#/exercice/${encodeURIComponent(ex.id)}">
    ${img ? `<img class="vignette" src="${img}" alt="" loading="lazy">` : '<div class="vignette vide"></div>'}
    <div class="flex1">
      <div class="titre">${esc(ex.n)}</div>
      <div class="sous">${esc(ex.m.map((m) => MUSCLES[m] || m).join(', '))} · ${esc(MATERIEL[ex.e] || ex.e)}</div>
    </div>
    ${ex.ess ? '<span class="etiquette accent" title="Exercice essentiel">★</span>' : ''}
  </a>`;
}

export function afficher(el) {
  entete('Exercices');
  el.innerHTML = `
    <div class="recherche">${ICONES.recherche}<input type="search" id="q" placeholder="Rechercher (développé, curl, presse…)" value="${esc(filtres.texte)}" autocomplete="off"></div>
    <div class="puces defile" style="margin-top:10px">
      <button class="puce ${filtres.groupe ? '' : 'active'}" data-g="">Tous</button>
      ${GROUPES.map((g) => `<button class="puce ${filtres.groupe === g.id ? 'active' : ''}" data-g="${g.id}">${g.emoji} ${g.nom}</button>`).join('')}
    </div>
    <div class="ligne" style="margin-top:4px">
      <select id="mat" class="flex1">
        <option value="">Tout le matériel</option>
        ${Object.entries(MATERIEL).map(([k, v]) => `<option value="${k}" ${filtres.materiel === k ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
      <button class="puce ${filtres.essentiels ? 'active' : ''}" id="ess" style="min-height:46px">★ Essentiels</button>
    </div>
    <p class="tres-discret" id="compte" style="margin:10px 2px 6px"></p>
    <div class="liste" id="res"></div>
    <div id="fin" style="height:1px"></div>
  `;

  const res = el.querySelector('#res'), compte = el.querySelector('#compte');
  let resultats = [], affiches = 0;
  const plus = () => {
    res.insertAdjacentHTML('beforeend', resultats.slice(affiches, affiches + PAR_PAGE).map(ligne).join(''));
    affiches += PAR_PAGE;
  };
  const relancer = () => {
    resultats = filtrer(filtres);
    affiches = 0;
    res.innerHTML = '';
    res.hidden = !resultats.length;
    compte.textContent = resultats.length
      ? `${resultats.length} exercice${resultats.length > 1 ? 's' : ''}${filtres.essentiels && !filtres.texte ? ' essentiels · décoche ★ pour voir les 876' : ''}`
      : 'Aucun exercice ne correspond.';
    plus();
  };
  relancer();

  const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting && affiches < resultats.length) plus(); }, { rootMargin: '600px' });
  obs.observe(el.querySelector('#fin'));

  el.querySelector('#q').oninput = (e) => { filtres.texte = e.target.value; relancer(); };
  el.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => {
    filtres.groupe = b.dataset.g;
    el.querySelectorAll('[data-g]').forEach((x) => x.classList.toggle('active', x === b));
    relancer();
  }));
  el.querySelector('#mat').onchange = (e) => { filtres.materiel = e.target.value; relancer(); };
  el.querySelector('#ess').onclick = (e) => { filtres.essentiels = !filtres.essentiels; e.currentTarget.classList.toggle('active'); relancer(); };
  return () => obs.disconnect();
}

export function afficherExercice(el, [id]) {
  const ex = exo(id);
  if (!ex) { entete('Exercice'); el.innerHTML = '<p class="discret">Exercice introuvable.</p>'; return; }
  entete(ex.n);
  const h = historiqueExercice(ex.id);
  const record = h.length && colonnes(ex).mode === 'muscu' ? Math.max(...h.map((x) => x.max)) : 0;
  const vars = variantes(ex);
  const imgs = ex.i.map((_, i) => image(ex, i));
  const poids = poidsA(jour());
  const kcal10 = Math.round((metExercice(ex) * poids.kg * 10) / 60);

  el.innerHTML = `
    ${imgs.length ? `<div class="anim-ex">
      ${imgs.map((src, i) => `<img src="${src}" alt="${esc(ex.n)} – position ${i + 1}" style="opacity:${i ? 0 : 1}">`).join('')}
      ${imgs.length > 1 ? '<button class="lecture" id="lecture">⏸ Pause</button>' : ''}
    </div>` : ''}
    <div style="margin-top:12px">
      <div style="font-size:21px;font-weight:800;line-height:1.2">${esc(ex.n)}</div>
      <div class="tres-discret">${esc(ex.en)}</div>
    </div>
    <div class="puces" style="margin-top:10px">
      <span class="etiquette accent">${esc(CATEGORIES[ex.c] || ex.c)}</span>
      <span class="etiquette">${esc(MATERIEL[ex.e] || ex.e)}</span>
      <span class="etiquette">${esc(NIVEAUX[ex.l] || ex.l)}</span>
      ${ex.k ? `<span class="etiquette">${ex.k === 'compound' ? 'Polyarticulaire' : 'Isolation'}</span>` : ''}
    </div>

    <div class="carte" style="margin-top:12px"><div class="ligne">
      <div style="font-size:26px">🔥</div>
      <div class="flex1"><div style="font-weight:750">≈ ${kcal10} kcal pour 10 min d’effort</div>
      <div class="tres-discret">Intensité ${String(metExercice(ex)).replace('.', ',')} MET · ${poids.estime ? 'calcul pour 75 kg (ajoute une pesée)' : `pour ${String(poids.kg).replace('.', ',')} kg`}</div></div>
    </div></div>

    ${etat.enCours ? `<button class="btn btn-principal btn-plein" id="ajout-seance" style="margin-top:14px">${ICONES.plus} Ajouter à ma séance en cours</button>` : ''}

    <h2>Muscles</h2>
    <div class="carte">
      <div><span class="discret">Principaux :</span> <strong>${esc(ex.m.map((m) => MUSCLES[m] || m).join(', '))}</strong></div>
      ${ex.s.length ? `<div style="margin-top:4px"><span class="discret">Secondaires :</span> ${esc(ex.s.map((m) => MUSCLES[m] || m).join(', '))}</div>` : ''}
    </div>

    <h2>Comment faire</h2>
    ${ex.fr ? '' : '<p class="tres-discret">Consignes disponibles en anglais seulement pour cet exercice. Dans Safari, le bouton « aA » permet de traduire la page.</p>'}
    <ol class="etapes" ${ex.fr ? '' : 'lang="en"'}>${ex.t.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>

    <h2>${colonnes(ex).mode === 'muscu' ? 'Mes charges' : 'Mon historique'}</h2>
    ${h.length ? `<div class="carte cliquable" data-aller="charge/${encodeURIComponent(ex.id)}">
        <div class="grille-2">
          ${colonnes(ex).mode === 'muscu'
            ? `<div><div class="tres-discret">Record</div><div class="charge-plus">${record ? kg(record) : '–'}</div></div>`
            : `<div><div class="tres-discret">Séances</div><div class="charge-plus">${h.length}</div></div>`}
          <div><div class="tres-discret">Dernière fois (${dateCourte(h[h.length - 1].date)})</div>
            <div style="font-weight:700;margin-top:6px">${h[h.length - 1].series.map((x) => texteSerie(ex, x)).join(' · ')}</div></div>
        </div>
        ${h.length >= 2 && record ? graphe(h.map((x) => ({ date: x.date, y: x.max })), { unite: 'kg', hauteur: 140 }) : ''}
        <div class="btn-lien" style="text-align:right">Tout l’historique ›</div>
      </div>`
      : '<p class="discret">Tu n’as pas encore fait cet exercice. Tes charges apparaîtront ici après ta première séance.</p>'}

    ${vars.length ? `<h2>Variantes</h2><div class="liste">${vars.map(ligne).join('')}</div>` : ''}
  `;

  el.querySelectorAll('[data-aller]').forEach((b) => (b.onclick = () => aller(b.dataset.aller)));
  const ajout = el.querySelector('#ajout-seance');
  if (ajout) ajout.onclick = () => { ajouterALaSeance(ex); aller('seance'); };

  // Animation : alterne position de départ / position d'arrivée.
  const images = el.querySelectorAll('.anim-ex img');
  if (images.length < 2) return;
  let i = 0, enPause = false;
  const t = setInterval(() => {
    if (enPause) return;
    i = (i + 1) % images.length;
    images.forEach((im, k) => (im.style.opacity = k === i ? 1 : 0));
  }, 1100);
  el.querySelector('#lecture').onclick = (e) => {
    enPause = !enPause;
    e.currentTarget.textContent = enPause ? '▶ Lecture' : '⏸ Pause';
  };
  return () => clearInterval(t);
}

/** Feuille de choix d'un exercice. */
export function choisirExercice(rappel, { groupe = '' } = {}) {
  const f = { texte: '', groupe, materiel: '', essentiels: false };
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>Choisir un exercice</h2>
      <div class="recherche">${ICONES.recherche}<input type="search" id="pq" placeholder="Rechercher…" autocomplete="off"></div>
      <div class="puces defile" style="margin-top:10px">
        <button class="puce ${f.groupe ? '' : 'active'}" data-g="">Tous</button>
        ${GROUPES.map((g) => `<button class="puce ${f.groupe === g.id ? 'active' : ''}" data-g="${g.id}">${g.emoji} ${g.nom}</button>`).join('')}
      </div>
      <div class="liste" id="pres" style="margin-top:6px"></div>`;
    const res = el.querySelector('#pres');
    const relancer = () => {
      const r = filtrer({ ...f, essentiels: !f.texte && !f.groupe }).slice(0, 60);
      res.innerHTML = r.map((ex) => ligne(ex).replace('<a class="item" href=', '<a class="item" data-choix="' + esc(ex.id) + '" href=')).join('')
        || '<p class="discret" style="padding:14px">Aucun résultat.</p>';
      res.querySelectorAll('[data-choix]').forEach((a) => (a.onclick = (e) => {
        e.preventDefault();
        fermer();
        rappel(exo(a.dataset.choix));
      }));
    };
    el.querySelector('#pq').oninput = (e) => { f.texte = e.target.value; relancer(); };
    el.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => {
      f.groupe = b.dataset.g;
      el.querySelectorAll('[data-g]').forEach((x) => x.classList.toggle('active', x === b));
      relancer();
    }));
    relancer();
  });
}

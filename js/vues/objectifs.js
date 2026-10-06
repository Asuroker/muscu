import { etat, maj, esc, kg, dateCourte, jour } from '../store.js';
import { entete, aller } from '../nav.js';
import { exo, image } from '../exercices.js';
import { poidsA } from '../calories.js';
import {
  objectifs, progressionPoids, semainesEstimees, definirObjectifPoids, definirObjectifCharge, recordExercice,
  XP_OBJECTIF_CHARGE, XP_OBJECTIF_POIDS,
} from '../objectifs.js';
import { ICONES, ouvrirFeuille, confirmer, toast } from '../ui.js';
import { choisirExercice } from './bibliotheque.js';

const nombre = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
const lire = (s) => parseFloat(String(s).replace(',', '.'));

/** Carte de progression de l'objectif de poids (réutilisée sur l'accueil et la page poids). */
export function carteObjectifPoids({ compacte = false } = {}) {
  const p = progressionPoids();
  if (!p) return '';
  const sem = semainesEstimees(p);
  const verbe = p.sens === 'perte' ? 'à perdre' : 'à prendre';
  return `<div class="carte ${compacte ? 'cliquable' : ''}" ${compacte ? 'data-aller="objectifs"' : ''}>
    <div class="ligne-entre">
      <div><div class="tres-discret">Objectif de poids</div>
        <div style="font-weight:800;font-size:18px">${kg(p.actuel)} → ${kg(p.cible)}</div></div>
      ${p.atteint ? '<span class="etiquette vert">🏆 Atteint</span>' : `<span class="etiquette accent">${nombre(Math.abs(p.reste))} kg ${verbe}</span>`}
    </div>
    <div class="barre-xp"><div style="width:${p.atteint ? 100 : p.pct}%"></div></div>
    <div class="tres-discret" style="margin-top:6px">${p.atteint ? `Atteint le ${dateCourte(p.atteintLe)} 🎉`
      : `${Math.round(p.pct)} % du chemin · ${sem ? `≈ ${sem} semaine${sem > 1 ? 's' : ''} à un rythme sain` : ''}`}</div>
  </div>`;
}

export function afficher(el) {
  entete('Mes objectifs');
  const o = objectifs();
  const actifs = (o.charges || []).filter((c) => !c.atteintLe && exo(c.exId));
  const atteints = (o.charges || []).filter((c) => c.atteintLe && exo(c.exId)).sort((a, b) => b.atteintLe.localeCompare(a.atteintLe));

  el.innerHTML = `
    <h2>⚖️ Poids corporel</h2>
    ${o.poids ? carteObjectifPoids() + `<div class="ligne" style="margin-top:8px">
        <button class="btn btn-petit flex1" id="modif-poids">${ICONES.crayon} Modifier</button>
        <button class="btn btn-petit btn-danger" id="suppr-poids">${ICONES.poubelle} Retirer</button></div>`
      : `<div class="carte"><p class="discret" style="margin:0 0 10px">Fixe le poids que tu veux atteindre : l’app suit ta progression, adapte tes besoins nutritionnels et te donne <strong>+${XP_OBJECTIF_POIDS} XP</strong> quand tu y arrives.</p>
        <button class="btn btn-principal btn-plein" id="modif-poids">🎯 Fixer un objectif de poids</button></div>`}

    <h2>🏋️ Charges par exercice</h2>
    ${actifs.length ? `<div class="pile">${actifs.map(carteCharge).join('')}</div>`
      : `<p class="discret">Par exemple : développé couché à 80 kg, squat à 100 kg… Chaque objectif atteint rapporte <strong>+${XP_OBJECTIF_CHARGE} XP</strong>.</p>`}
    <button class="btn btn-plein ${actifs.length ? '' : 'btn-principal'}" id="ajout-charge" style="margin-top:10px">${ICONES.plus} Ajouter un objectif de charge</button>

    ${atteints.length ? `<h2>🏆 Objectifs atteints</h2><div class="liste">${atteints.map((c) => {
      const ex = exo(c.exId);
      return `<a class="item" href="#/exercice/${encodeURIComponent(ex.id)}">
        ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy">` : '<div class="vignette vide"></div>'}
        <div class="flex1"><div class="titre">${esc(ex.n)}</div><div class="sous">${kg(c.cible)} · atteint le ${dateCourte(c.atteintLe)}</div></div>
        <span class="etiquette or">🏆</span></a>`;
    }).join('')}</div>` : ''}
  `;

  el.querySelectorAll('[data-objectif]').forEach((b) => (b.onclick = () => editerObjectifCharge(b.dataset.objectif)));
  el.querySelectorAll('[data-voir]').forEach((b) => (b.onclick = () => aller('exercice/' + b.dataset.voir)));
  el.querySelector('#modif-poids').onclick = editerObjectifPoids;
  const s = el.querySelector('#suppr-poids');
  if (s) s.onclick = async () => {
    if (await confirmer('Retirer ton objectif de poids ?', { ok: 'Retirer', danger: true })) maj((e) => definirObjectifPoids(e, null));
  };
  el.querySelector('#ajout-charge').onclick = () => choisirExercice((ex) => editerObjectifCharge(ex.id));
}

function carteCharge(c) {
  const ex = exo(c.exId);
  const rec = recordExercice(c.exId);
  const pct = Math.min(100, (rec / c.cible) * 100);
  return `<div class="carte">
    <div class="ligne">
      ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy" data-voir="${ex.id}" style="cursor:pointer">` : '<div class="vignette vide"></div>'}
      <div class="flex1" data-voir="${ex.id}" style="cursor:pointer">
        <div style="font-weight:700">${esc(ex.n)}</div>
        <div class="discret">${rec ? `Record ${kg(rec)}` : 'Pas encore de charge notée'} · objectif <strong>${kg(c.cible)}</strong></div>
      </div>
      <button class="btn btn-icone" data-objectif="${ex.id}" aria-label="Modifier">${ICONES.crayon}</button>
    </div>
    <div class="barre-xp"><div style="width:${pct}%"></div></div>
    <div class="tres-discret" style="margin-top:6px">${rec ? `encore ${nombre(c.cible - rec)} kg · ${Math.round(pct)} %` : 'Fais l’exercice en séance pour suivre ta progression'}</div>
  </div>`;
}

export function editerObjectifPoids() {
  const o = objectifs().poids;
  const { kg: actuel, estime } = poidsA(jour());
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>🎯 Objectif de poids</h2>
      <div class="pile">
        ${estime ? `<p class="discret" style="margin:0">⚠️ Ajoute d’abord une pesée pour que l’objectif parte de ton vrai poids.</p>`
          : `<p class="discret" style="margin:0">Poids actuel : <strong>${kg(actuel)}</strong></p>`}
        <label class="champ">Poids visé (kg)<input type="text" inputmode="decimal" id="o-cible" value="${o ? nombre(o.cible) : ''}" placeholder="${nombre(actuel)}"></label>
        <p class="tres-discret" style="margin:0">Rythme sain : perte de 0,5 à 1 % du poids par semaine, prise de 0,25 à 0,5 %.</p>
        <button class="btn btn-principal btn-plein" id="o-ok">Enregistrer</button>
      </div>`;
    setTimeout(() => el.querySelector('#o-cible').focus(), 250);
    el.querySelector('#o-ok').onclick = () => {
      const v = lire(el.querySelector('#o-cible').value);
      if (!(v > 30 && v < 300)) return toast('Poids invalide');
      maj((e) => definirObjectifPoids(e, Math.round(v * 10) / 10));
      fermer();
      toast('Objectif enregistré 🎯');
    };
  });
}

export function editerObjectifCharge(exId) {
  const ex = exo(exId);
  const rec = recordExercice(exId);
  const actuel = (objectifs().charges || []).find((c) => c.exId === exId && !c.atteintLe);
  const propose = rec ? Math.ceil((rec * 1.1) / 2.5) * 2.5 : '';
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>🎯 ${esc(ex.n)}</h2>
      <div class="pile">
        <p class="discret" style="margin:0">${rec ? `Ton record actuel : <strong>${kg(rec)}</strong>` : 'Tu n’as pas encore de charge enregistrée sur cet exercice.'}</p>
        <label class="champ">Charge visée (kg)<input type="text" inputmode="decimal" id="c-cible" value="${actuel ? nombre(actuel.cible) : propose ? nombre(propose) : ''}"></label>
        ${rec ? `<div class="puces">${[1.05, 1.1, 1.2, 1.3].map((f) => {
          const v = Math.ceil((rec * f) / 2.5) * 2.5;
          return `<button class="puce" data-v="${v}">${nombre(v)} kg (+${Math.round((f - 1) * 100)} %)</button>`;
        }).join('')}</div>` : ''}
        <button class="btn btn-principal btn-plein" id="c-ok">Enregistrer</button>
        ${actuel ? `<button class="btn btn-plein btn-danger" id="c-suppr">${ICONES.poubelle} Retirer cet objectif</button>` : ''}
      </div>`;
    el.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => (el.querySelector('#c-cible').value = nombre(+b.dataset.v))));
    el.querySelector('#c-ok').onclick = () => {
      const v = lire(el.querySelector('#c-cible').value);
      if (!(v > 0 && v < 1000)) return toast('Charge invalide');
      if (rec && v <= rec) return toast('Choisis une charge au-dessus de ton record');
      maj((e) => definirObjectifCharge(e, exId, v));
      fermer();
      toast('Objectif enregistré 🎯');
    };
    const s = el.querySelector('#c-suppr');
    if (s) s.onclick = () => {
      maj((e) => (e.objectifs.charges = e.objectifs.charges.filter((c) => c.id !== actuel.id)));
      fermer();
    };
  });
}

/** Résumé pour la fiche d'un exercice. */
export function ligneObjectifExercice(exId) {
  const c = (objectifs().charges || []).find((x) => x.exId === exId && !x.atteintLe);
  const rec = recordExercice(exId);
  if (!c) return `<button class="btn btn-plein" data-objectif-ex="${esc(exId)}" style="margin-top:10px">🎯 Fixer un objectif de charge</button>`;
  const pct = Math.min(100, rec ? (rec / c.cible) * 100 : 0);
  return `<div class="carte cliquable" data-objectif-ex="${esc(exId)}" style="margin-top:10px">
    <div class="ligne-entre"><strong>🎯 Objectif : ${kg(c.cible)}</strong><span class="tres-discret">${Math.round(pct)} %</span></div>
    <div class="barre-xp"><div style="width:${pct}%"></div></div>
  </div>`;
}

import { etat, maj, esc, jour, kg } from '../store.js';
import { entete, aller } from '../nav.js';
import {
  RECETTES, INGREDIENTS, TYPES_REPAS, TAGS, ACTIVITES, OBJECTIFS_NUTRI, CONSEILS,
  recette, macrosRecette, besoins, profilComplet, objectifNutri, journeeType, vignetteRecette, imageRecette, creditRecette,
} from '../nutrition.js';
import { caloriesSeance, fmtKcal } from '../calories.js';
import { ICONES, ouvrirFeuille, toast } from '../ui.js';

let graine = 0; // pour "Autre proposition"
const filtresRecettes = { type: '', tag: '' };
const facteurs = {}; // quantité choisie par recette

const g = (n) => `${Math.round(n)} g`;

export function afficher(el) {
  entete('Nutrition', `<button class="btn btn-icone" id="profil" aria-label="Mon profil">${ICONES.reglages}</button>`);
  const b = besoins();
  const obj = OBJECTIFS_NUTRI[b.objectif];
  const kcalSalle = etat.seances.filter((s) => s.date === jour()).reduce((t, s) => t + caloriesSeance(s).total, 0);
  const journee = journeeType(graine);
  const totalJournee = journee.reduce((t, x) => t + macrosRecette(x.r).kcal, 0);
  const ajuste = b.kcal / totalJournee;
  const conseils = [...CONSEILS[b.objectif], ...CONSEILS.general];

  el.innerHTML = `
    ${profilComplet() ? '' : `<div class="carte" style="border-color:var(--accent);background:var(--accent-doux);margin-bottom:12px">
      <div style="font-weight:750">Complète ton profil pour des chiffres précis</div>
      <div class="discret">Sexe, âge, taille et activité servent à calculer tes besoins.</div>
      <button class="btn btn-principal btn-plein" id="completer" style="margin-top:10px">Compléter mon profil</button>
    </div>`}

    <div class="carte">
      <div class="ligne-entre">
        <div>
          <div class="tres-discret">Mon objectif</div>
          <div style="font-weight:800;font-size:18px">${obj.emoji} ${obj.nom}</div>
        </div>
        <button class="btn btn-petit" id="changer-obj">Changer</button>
      </div>
      <div class="separateur"></div>
      <div class="centre">
        <div class="tres-discret">À manger par jour</div>
        <div style="font-size:38px;font-weight:850;letter-spacing:-1px">${b.kcal.toLocaleString('fr-FR')} <span style="font-size:18px">kcal</span></div>
        <div class="tres-discret">Maintien ${b.maintien.toLocaleString('fr-FR')} kcal${b.objectif === 'perte' ? ' − déficit' : b.objectif === 'prise' ? ' + surplus' : ''} · calcul pour ${kg(b.poids)}${b.poidsEstime ? ' (par défaut)' : ''}</div>
      </div>
      <div class="grille-3" style="margin-top:12px">
        <div class="stat centre"><div class="val" style="color:var(--accent)">${b.p} g</div><div class="lib">Protéines</div></div>
        <div class="stat centre"><div class="val" style="color:var(--or)">${b.g} g</div><div class="lib">Glucides</div></div>
        <div class="stat centre"><div class="val" style="color:var(--bleu)">${b.l} g</div><div class="lib">Lipides</div></div>
      </div>
      <div class="ligne" style="margin-top:10px"><span style="font-size:20px">💧</span><span class="discret">Eau : environ <strong>${String(b.eau).replace('.', ',')} L</strong> par jour</span></div>
      ${kcalSalle ? `<div class="ligne" style="margin-top:6px"><span style="font-size:20px">🔥</span><span class="discret">Séance du jour : ${fmtKcal(kcalSalle)} (déjà comptées dans ton niveau d’activité)</span></div>` : ''}
    </div>

    <h2>🍽️ Idée de journée</h2>
    <div class="liste">${journee.map(({ moment, r }) => {
      const m = macrosRecette(r);
      return `<a class="item" href="#/recette/${r.id}">
        ${vignetteRecette(r)}
        <div class="flex1"><div class="tres-discret">${moment}</div><div class="titre">${esc(r.nom)}</div>
        <div class="sous">${Math.round(m.kcal)} kcal · ${Math.round(m.p)} g protéines</div></div>${ICONES.chevron}</a>`;
    }).join('')}</div>
    <p class="discret" style="margin-top:8px">Total ≈ <strong>${Math.round(totalJournee).toLocaleString('fr-FR')} kcal</strong>${Math.abs(ajuste - 1) > 0.08
      ? ` · pour atteindre ton objectif, ${ajuste > 1 ? 'augmente' : 'réduis'} les quantités d’environ <strong>${Math.abs(Math.round((ajuste - 1) * 100))} %</strong> (ou ${ajuste > 1 ? 'ajoute une collation' : 'retire la collation'}).`
      : ' · pile dans ton objectif 👌'}</p>
    <div class="grille-2" style="margin-top:8px">
      <button class="btn" id="autre">${ICONES.melanger} Autre idée</button>
      <button class="btn" data-aller="recettes">Toutes les recettes</button>
    </div>

    <h2>💡 Conseils</h2>
    <div class="pile">${conseils.map(([e, t, d]) => `<div class="carte"><div class="ligne" style="align-items:flex-start">
      <div style="font-size:24px">${e}</div><div class="flex1"><div style="font-weight:700">${esc(t)}</div><div class="discret">${esc(d)}</div></div>
    </div></div>`).join('')}</div>

    <p class="tres-discret" style="margin-top:18px">Estimations générales (formule de Mifflin-St Jeor) : ce ne sont pas des conseils médicaux. En cas de problème de santé ou de régime particulier, demande l’avis d’un médecin ou d’un diététicien.</p>
  `;

  el.querySelectorAll('[data-aller]').forEach((x) => (x.onclick = () => aller(x.dataset.aller)));
  el.querySelector('#autre').onclick = () => { graine++; afficher(el); };
  el.querySelector('#changer-obj').onclick = editerProfil;
  document.getElementById('profil').onclick = editerProfil;
  const c = el.querySelector('#completer');
  if (c) c.onclick = editerProfil;
}

export function editerProfil() {
  const p = { sexe: '', age: '', taille: '', activite: 'modere', objectif: 'auto', ...(etat.profil || {}) };
  ouvrirFeuille((el, fermer) => {
    const dessiner = () => {
      el.innerHTML = `<h2>Mon profil</h2>
        <div class="pile">
          <div class="champ">Sexe
            <div class="grille-2" style="margin-top:4px">
              <button class="btn ${p.sexe === 'H' ? 'btn-principal' : ''}" data-sexe="H">Homme</button>
              <button class="btn ${p.sexe === 'F' ? 'btn-principal' : ''}" data-sexe="F">Femme</button>
            </div>
          </div>
          <div class="grille-2">
            <label class="champ">Âge<input type="number" inputmode="numeric" id="p-age" value="${esc(p.age)}" min="12" max="100"></label>
            <label class="champ">Taille (cm)<input type="number" inputmode="numeric" id="p-taille" value="${esc(p.taille)}" min="120" max="230"></label>
          </div>
          <label class="champ">Activité
            <select id="p-act">${ACTIVITES.map((a) => `<option value="${a.id}" ${p.activite === a.id ? 'selected' : ''}>${a.nom}</option>`).join('')}</select>
          </label>
          <label class="champ">Objectif
            <select id="p-obj">
              <option value="auto" ${p.objectif === 'auto' ? 'selected' : ''}>Automatique (d’après mon objectif de poids)</option>
              ${Object.entries(OBJECTIFS_NUTRI).map(([k, o]) => `<option value="${k}" ${p.objectif === k ? 'selected' : ''}>${o.emoji} ${o.nom}</option>`).join('')}
            </select>
          </label>
          <p class="tres-discret" style="margin:0">Ton poids vient de ta dernière pesée.</p>
          <button class="btn btn-principal btn-plein" id="p-ok">Enregistrer</button>
        </div>`;
      el.querySelectorAll('[data-sexe]').forEach((b) => (b.onclick = () => { lireChamps(); p.sexe = b.dataset.sexe; dessiner(); }));
      el.querySelector('#p-ok').onclick = () => {
        lireChamps();
        if (p.age && !(p.age >= 12 && p.age <= 100)) return toast('Âge invalide');
        if (p.taille && !(p.taille >= 120 && p.taille <= 230)) return toast('Taille invalide (en cm)');
        maj((e) => (e.profil = { ...p }));
        fermer();
        toast('Profil enregistré');
      };
    };
    const lireChamps = () => {
      p.age = +el.querySelector('#p-age').value || '';
      p.taille = +el.querySelector('#p-taille').value || '';
      p.activite = el.querySelector('#p-act').value;
      p.objectif = el.querySelector('#p-obj').value;
    };
    dessiner();
  });
}

// ---------- Recettes ----------

export function afficherRecettes(el) {
  entete('Recettes');
  const f = filtresRecettes;
  const liste = RECETTES.filter((r) => (!f.type || r.type === f.type) && (!f.tag || r.tags.includes(f.tag)));
  el.innerHTML = `
    <div class="puces defile">
      <button class="puce ${f.type ? '' : 'active'}" data-type="">Tout</button>
      ${Object.entries(TYPES_REPAS).map(([k, v]) => `<button class="puce ${f.type === k ? 'active' : ''}" data-type="${k}">${v}</button>`).join('')}
    </div>
    <div class="puces defile">
      ${Object.entries(TAGS).map(([k, v]) => `<button class="puce ${f.tag === k ? 'active' : ''}" data-tag="${k}">${v}</button>`).join('')}
    </div>
    <p class="tres-discret" style="margin:8px 2px">${liste.length} recette${liste.length > 1 ? 's' : ''} · objectif actuel : ${OBJECTIFS_NUTRI[objectifNutri()].nom.toLowerCase()}</p>
    ${liste.length ? `<div class="liste">${liste.map((r) => {
      const m = macrosRecette(r);
      return `<a class="item" href="#/recette/${r.id}">
        ${vignetteRecette(r)}
        <div class="flex1"><div class="titre">${esc(r.nom)}</div>
          <div class="sous">${Math.round(m.kcal)} kcal · ${Math.round(m.p)} g prot. · ${r.minutes} min</div></div>${ICONES.chevron}</a>`;
    }).join('')}</div>` : '<p class="discret">Aucune recette avec ces filtres.</p>'}
  `;
  el.querySelectorAll('[data-type]').forEach((b) => (b.onclick = () => { f.type = b.dataset.type; afficherRecettes(el); }));
  el.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => { f.tag = f.tag === b.dataset.tag ? '' : b.dataset.tag; afficherRecettes(el); }));
}

export function afficherRecette(el, [id]) {
  const r = recette(id);
  if (!r) { entete('Recette'); el.innerHTML = '<p class="discret">Recette introuvable.</p>'; return; }
  entete(r.nom);
  const f = facteurs[id] || 1;
  const m = macrosRecette(r, r.portions > 1 ? 1 : f);
  const b = besoins();
  const qte = (grammes) => {
    const v = grammes * f;
    return v >= 20 ? `${Math.round(v / 5) * 5} g` : `${Math.round(v)} g`;
  };

  el.innerHTML = `
    ${imageRecette(r) ? `<div class="photo-recette"><img src="${imageRecette(r)}" alt="${esc(r.nom)}"><span>${r.emoji}</span></div>`
      : `<div class="centre" style="font-size:64px;line-height:1.1;margin-top:4px">${r.emoji}</div>`}
    <div class="centre" style="font-size:21px;font-weight:800;margin-top:10px">${esc(r.nom)}</div>
    <div class="puces" style="justify-content:center;margin-top:10px">
      <span class="etiquette accent">${TYPES_REPAS[r.type]}</span>
      <span class="etiquette">⏱ ${r.minutes} min</span>
      ${r.tags.map((t) => `<span class="etiquette">${TAGS[t]}</span>`).join('')}
    </div>

    <div class="grille-2" style="margin-top:14px;grid-template-columns:repeat(4,1fr)">
      <div class="stat centre"><div class="val" style="font-size:18px">${Math.round(m.kcal)}</div><div class="lib">kcal</div></div>
      <div class="stat centre"><div class="val" style="font-size:18px;color:var(--accent)">${Math.round(m.p)} g</div><div class="lib">Prot.</div></div>
      <div class="stat centre"><div class="val" style="font-size:18px;color:var(--or)">${Math.round(m.g)} g</div><div class="lib">Gluc.</div></div>
      <div class="stat centre"><div class="val" style="font-size:18px;color:var(--bleu)">${Math.round(m.l)} g</div><div class="lib">Lip.</div></div>
    </div>
    <p class="tres-discret centre" style="margin-top:6px">${r.portions > 1 ? `Valeurs pour 1 portion sur ${r.portions * f}` : `Soit ${Math.round((m.kcal / b.kcal) * 100)} % de tes ${b.kcal.toLocaleString('fr-FR')} kcal du jour`}</p>

    <h2 class="ligne-entre">Ingrédients
      <span class="ligne" style="gap:6px">
        <button class="btn btn-icone btn-petit" id="moins" aria-label="Moins">−</button>
        <span style="min-width:48px;text-align:center;font-size:15px">×${String(f).replace('.', ',')}</span>
        <button class="btn btn-icone btn-petit" id="plus" aria-label="Plus">+</button>
      </span>
    </h2>
    <div class="liste">${r.ingredients.map(([ing, grammes]) => `<div class="item" style="cursor:default">
      <div class="flex1">${esc(INGREDIENTS[ing][0])}</div><strong>${qte(grammes)}</strong></div>`).join('')}</div>

    <h2>Préparation</h2>
    <ol class="etapes">${r.etapes.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
    ${r.astuce ? `<div class="carte"><strong>💡 Astuce :</strong> ${esc(r.astuce)}</div>` : ''}

    <a class="btn btn-plein" style="margin-top:14px" href="https://www.youtube.com/results?search_query=${encodeURIComponent('recette ' + r.nom.replace(/\(.*?\)/g, ''))}" target="_blank" rel="noopener">▶️ Voir des vidéos de cette recette</a>
    <p class="tres-discret" style="margin-top:12px">Valeurs nutritionnelles approximatives, calculées à partir des ingrédients.</p>
    ${creditRecette(r) ? `<p class="tres-discret">Photo d’illustration (le plat peut légèrement différer) : ${esc(creditRecette(r).auteur)}, <a href="${esc(creditRecette(r).licenceUrl || creditRecette(r).page)}" target="_blank" rel="noopener" style="color:inherit">${esc(creditRecette(r).licence)}</a>, via <a href="${esc(creditRecette(r).page)}" target="_blank" rel="noopener" style="color:inherit">Wikimedia Commons</a>.</p>` : ''}
  `;
  const changer = (d) => { facteurs[id] = Math.max(0.5, Math.min(4, f + d)); afficherRecette(el, [id]); };
  el.querySelector('#moins').onclick = () => changer(-0.25);
  el.querySelector('#plus').onclick = () => changer(0.25);
}

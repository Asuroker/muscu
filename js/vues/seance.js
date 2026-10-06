import { etat, maj, esc, uid, jour, heure, duree, salle, dernieresSeries } from '../store.js';
import { entete, aller, chrono } from '../nav.js';
import {
  GROUPES, MODELES, FORMATS, exo, image, colonnes, texteSerie, genererSeance, candidats, famille, seriesParDefaut, nbExercicesPour,
} from '../exercices.js';
import { calculerXpSeance, ajouterXp } from '../xp.js';
import { caloriesSeance } from '../calories.js';
import { verifierCharges } from '../objectifs.js';
import { ICONES, ouvrirFeuille, confirmer, toast, vibrer } from '../ui.js';
import { choisirExercice } from './bibliotheque.js';
import { celebrer } from './recompenses.js';

// Brouillon de séance (avant de démarrer), gardé tant que l'app est ouverte.
const brouillon = { types: new Set(), minutes: 60, materiel: 'tout', proposition: null, salleId: undefined };

export function afficher(el) {
  return etat.enCours ? afficherEnCours(el) : afficherPreparation(el);
}

/** Format séries × répétitions choisi (null = automatique). */
const schemaActuel = () => etat.reglages.schema || null;
const memeSchema = (a, b) => (!a && !b) || (a && b && a.series === b.series && a.reps === b.reps);

/** Feuille de réglage « séries × répétitions ». */
function editeurSchema({ titre, series, reps }, valider) {
  const v = { series, reps };
  const borne = (k, x) => Math.max(1, Math.min(k === 'series' ? 10 : 50, Math.round(x) || 1));
  ouvrirFeuille((el, fermer) => {
    const dessiner = () => {
      el.innerHTML = `<h2>${esc(titre)}</h2>
        <div class="pile">
          ${[['series', 'Séries'], ['reps', 'Répétitions par série']].map(([k, lib]) => `
            <div class="ligne-entre">
              <strong>${lib}</strong>
              <span class="ligne" style="gap:8px">
                <button class="btn btn-icone" data-moins="${k}" aria-label="Moins">−</button>
                <input type="number" inputmode="numeric" data-champ-schema="${k}" value="${v[k]}" style="width:64px;text-align:center;font-weight:800">
                <button class="btn btn-icone" data-plus="${k}" aria-label="Plus">+</button>
              </span>
            </div>`).join('')}
          <div class="puces">${[5, 6, 8, 10, 12, 15, 20].map((n) => `<button class="puce ${v.reps === n ? 'active' : ''}" data-r="${n}">${n} reps</button>`).join('')}</div>
          <div class="centre" style="font-size:28px;font-weight:850">${v.series} × ${v.reps}</div>
          <button class="btn btn-principal btn-plein" id="schema-ok">Valider</button>
        </div>`;
      el.querySelectorAll('[data-moins]').forEach((b) => (b.onclick = () => { const k = b.dataset.moins; v[k] = borne(k, v[k] - 1); dessiner(); }));
      el.querySelectorAll('[data-plus]').forEach((b) => (b.onclick = () => { const k = b.dataset.plus; v[k] = borne(k, v[k] + 1); dessiner(); }));
      el.querySelectorAll('[data-champ-schema]').forEach((i) => (i.onchange = () => { const k = i.dataset.champSchema; v[k] = borne(k, +i.value); dessiner(); }));
      el.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { v.reps = +b.dataset.r; dessiner(); }));
      el.querySelector('#schema-ok').onclick = () => {
        el.querySelectorAll('[data-champ-schema]').forEach((i) => { const k = i.dataset.champSchema; v[k] = borne(k, +i.value); });
        fermer();
        valider({ series: v.series, reps: v.reps });
      };
    };
    dessiner();
  });
}

// =====================================================================
// Préparation
// =====================================================================

function afficherPreparation(el) {
  entete('Nouvelle séance');
  if (brouillon.salleId === undefined) brouillon.salleId = etat.salleParDefaut;
  const b = brouillon;
  const perso = schemaActuel() && !FORMATS.some((f) => memeSchema(f.schema, schemaActuel())) ? schemaActuel() : null;

  el.innerHTML = `
    <h2>Que veux-tu travailler ?</h2>
    <div class="puces">${GROUPES.map((g) => `<button class="puce ${b.types.has(g.id) ? 'active' : ''}" data-type="${g.id}">${g.emoji} ${g.nom}</button>`).join('')}</div>
    <p class="tres-discret" style="margin-top:10px">Raccourcis :</p>
    <div class="puces defile">${MODELES.map((m, i) => `<button class="puce" data-modele="${i}">${m.nom}</button>`).join('')}</div>

    <h2>Durée</h2>
    <div class="puces">${[30, 45, 60, 75, 90, 120].map((m) => `<button class="puce ${b.minutes === m ? 'active' : ''}" data-min="${m}">${duree(m)}</button>`).join('')}</div>
    <p class="tres-discret" style="margin-top:6px">≈ ${nbExercicesPour(b.minutes)} exercices</p>

    <h2>Séries & répétitions</h2>
    <div class="puces">
      ${FORMATS.map((f) => `<button class="puce ${memeSchema(f.schema, schemaActuel()) ? 'active' : ''}" data-format-global="${f.id}">${f.nom} <span style="opacity:.7">${f.detail}</span></button>`).join('')}
      <button class="puce ${perso ? 'active' : ''}" id="format-perso">✎ ${perso ? `Perso ${perso.series} × ${perso.reps}` : 'Perso…'}</button>
    </div>

    <h2>Matériel</h2>
    <div class="puces">
      ${[['tout', 'Tout'], ['machines', 'Machines & poulies'], ['libres', 'Poids libres'], ['corps', 'Poids du corps']]
        .map(([k, n]) => `<button class="puce ${b.materiel === k ? 'active' : ''}" data-mat="${k}">${n}</button>`).join('')}
    </div>

    ${etat.salles.length ? `<h2>Salle</h2>
      <select id="salle"><option value="">— Aucune —</option>
        ${etat.salles.map((s) => `<option value="${s.id}" ${s.id === b.salleId ? 'selected' : ''}>${esc(s.nom)}</option>`).join('')}
      </select>` : ''}

    <div class="pile" style="margin-top:18px">
      <button class="btn btn-principal btn-plein" id="generer" ${b.types.size ? '' : 'disabled'}>${ICONES.melanger} ${b.proposition ? 'Proposer une autre séance' : 'Composer ma séance'}</button>
    </div>

    <div id="proposition"></div>

    <div class="separateur"></div>
    <button class="btn btn-plein" id="libre">${ICONES.horloge} Séance libre (je choisis au fur et à mesure)</button>
  `;

  el.querySelectorAll('[data-type]').forEach((x) => (x.onclick = () => {
    b.types.has(x.dataset.type) ? b.types.delete(x.dataset.type) : b.types.add(x.dataset.type);
    afficherPreparation(el);
  }));
  el.querySelectorAll('[data-modele]').forEach((x) => (x.onclick = () => {
    b.types = new Set(MODELES[x.dataset.modele].groupes);
    b.proposition = genererSeance([...b.types], b.minutes, b.materiel, schemaActuel());
    afficherPreparation(el);
  }));
  el.querySelectorAll('[data-min]').forEach((x) => (x.onclick = () => { b.minutes = +x.dataset.min; afficherPreparation(el); }));
  el.querySelectorAll('[data-mat]').forEach((x) => (x.onclick = () => { b.materiel = x.dataset.mat; afficherPreparation(el); }));
  const choisirFormat = (schema) => {
    maj((e) => { if (schema) e.reglages.schema = schema; else delete e.reglages.schema; }, { silencieux: true });
    // Applique le format aux exercices de musculation déjà proposés.
    (b.proposition || []).forEach((p) => {
      const ex = exo(p.exId);
      if (colonnes(ex).mode === 'muscu') p.series = seriesParDefaut(ex, 15, schema);
    });
    afficherPreparation(el);
  };
  el.querySelectorAll('[data-format-global]').forEach((x) => (x.onclick = () => choisirFormat(FORMATS.find((f) => f.id === x.dataset.formatGlobal).schema)));
  el.querySelector('#format-perso').onclick = () => editeurSchema(
    { titre: 'Mon format', ...(schemaActuel() || { series: 4, reps: 10 }) },
    (schema) => choisirFormat(schema),
  );
  const sel = el.querySelector('#salle');
  if (sel) sel.onchange = () => (b.salleId = sel.value || null);
  el.querySelector('#generer').onclick = () => {
    b.proposition = genererSeance([...b.types], b.minutes, b.materiel, schemaActuel());
    afficherPreparation(el);
    el.querySelector('#proposition').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  el.querySelector('#libre').onclick = () => demarrer([]);

  if (b.proposition) dessinerProposition(el.querySelector('#proposition'), el);
}

function dessinerProposition(zone, el) {
  const p = brouillon.proposition;
  zone.innerHTML = `
    <h2>Ta séance · ${p.length} exercice${p.length > 1 ? 's' : ''}</h2>
    ${p.length ? `<div class="liste">${p.map((e, i) => {
      const ex = exo(e.exId), col = colonnes(ex);
      return `<div class="item" style="cursor:default">
        ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy" data-voir="${ex.id}">` : '<div class="vignette vide"></div>'}
        <div class="flex1" data-voir="${ex.id}" style="cursor:pointer">
          <div class="titre">${esc(ex.n)}</div>
          <div class="sous">${esc(nomMuscle(ex))}</div>
          ${col.mode === 'muscu'
            ? `<button class="btn btn-petit" data-format="${i}" style="margin-top:6px;min-height:32px">${e.series.length} × ${e.series[0].reps} reps ✎</button>`
            : `<div class="sous">${e.series.length} × ${e.series[0].reps} ${col.reps.toLowerCase()}</div>`}
        </div>
        <button class="btn btn-icone" data-echanger="${i}" aria-label="Changer d'exercice">${ICONES.echange}</button>
        <button class="btn btn-icone" data-retirer="${i}" aria-label="Retirer">${ICONES.poubelle}</button>
      </div>`;
    }).join('')}</div>` : '<p class="discret">Aucun exercice trouvé pour ces critères.</p>'}
    <button class="btn btn-plein" id="ajouter-ex" style="margin-top:10px">${ICONES.plus} Ajouter un exercice</button>
    <button class="btn btn-principal btn-plein" id="demarrer" style="margin-top:10px" ${p.length ? '' : 'disabled'}>C'est parti !</button>
  `;
  zone.querySelectorAll('[data-voir]').forEach((x) => (x.onclick = () => aller('exercice/' + x.dataset.voir)));
  zone.querySelectorAll('[data-retirer]').forEach((x) => (x.onclick = () => { p.splice(+x.dataset.retirer, 1); dessinerProposition(zone, el); }));
  zone.querySelectorAll('[data-echanger]').forEach((x) => (x.onclick = () => {
    const i = +x.dataset.echanger;
    const actuel = exo(p[i].exId);
    const nouveau = remplacant(actuel, p.map((e) => e.exId));
    if (!nouveau) return toast('Pas d’autre exercice similaire');
    p[i] = { exId: nouveau.id, series: seriesParDefaut(nouveau, 15, schemaActuel()) };
    dessinerProposition(zone, el);
  }));
  zone.querySelectorAll('[data-format]').forEach((x) => (x.onclick = (ev) => {
    ev.stopPropagation();
    const e = p[+x.dataset.format];
    editeurSchema({ titre: exo(e.exId).n, series: e.series.length, reps: e.series[0].reps }, (sch) => {
      e.series = Array.from({ length: sch.series }, () => ({ reps: sch.reps, kg: 0, faite: false }));
      dessinerProposition(zone, el);
    });
  }));
  zone.querySelector('#ajouter-ex').onclick = () => choisirExercice((ex) => { p.push({ exId: ex.id, series: seriesParDefaut(ex, 15, schemaActuel()) }); dessinerProposition(zone, el); });
  zone.querySelector('#demarrer').onclick = () => demarrer(p);
}

function nomMuscle(ex) {
  const g = GROUPES.find((g) => g.categorie === ex.c) || GROUPES.find((g) => g.muscles?.includes(ex.m[0]));
  return g ? g.nom : '';
}

/** Un autre exercice qui travaille le même muscle principal (autre mouvement si possible). */
function remplacant(ex, exclus) {
  const g = GROUPES.find((g) => g.categorie === ex.c) || GROUPES.find((g) => g.muscles?.includes(ex.m[0]));
  if (!g) return null;
  let c = candidats(g.id, brouillon.materiel).filter((x) => !exclus.includes(x.id) && x.m[0] === ex.m[0]);
  if (!c.length) c = candidats(g.id, brouillon.materiel).filter((x) => !exclus.includes(x.id));
  const autresFamilles = c.filter((x) => famille(x) !== famille(ex));
  const pool = autresFamilles.length ? autresFamilles : c;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

/** Garde les séries et répétitions prévues, et reprend les charges de la dernière fois. */
function prerempli(e) {
  const avant = dernieresSeries(e.exId);
  return e.series.map((s, i) => {
    const ref = avant ? avant[i] || avant[avant.length - 1] : null;
    return { reps: s.reps, kg: ref ? ref.kg || 0 : s.kg || 0, faite: false };
  });
}

function demarrer(exercices) {
  const maintenant = new Date();
  maj((e) => {
    e.enCours = {
      id: uid(), date: jour(maintenant), debut: heure(maintenant), debutTs: maintenant.getTime(),
      salleId: brouillon.salleId ?? e.salleParDefaut ?? null,
      types: [...brouillon.types], dureeVisee: brouillon.minutes,
      exercices: exercices.map((x) => ({ exId: x.exId, series: prerempli(x) })),
    };
  });
  brouillon.proposition = null;
  window.scrollTo(0, 0);
}

/** Ajoute un exercice à la séance en cours (utilisé aussi depuis la fiche exercice). */
export function ajouterALaSeance(ex) {
  if (!etat.enCours) return;
  maj((e) => e.enCours.exercices.push({ exId: ex.id, series: prerempli({ exId: ex.id, series: seriesParDefaut(ex, 15, schemaActuel()) }) }));
  toast('Ajouté à la séance');
}

// =====================================================================
// Séance en cours
// =====================================================================

function afficherEnCours(el) {
  const s = etat.enCours;
  entete('Séance en cours', `<button class="btn btn-petit btn-principal" id="terminer">Terminer</button>`);
  const minutes = (Date.now() - s.debutTs) / 60000;
  const total = s.exercices.reduce((t, e) => t + e.series.length, 0);
  const faites = s.exercices.reduce((t, e) => t + e.series.filter((x) => x.faite).length, 0);
  const exFinis = s.exercices.filter((e) => e.fini).length;

  el.innerHTML = `
    <div class="carte">
      <div class="ligne-entre">
        <div>
          <div class="tres-discret">Temps</div>
          <div id="chrono" style="font-size:30px;font-weight:800;font-variant-numeric:tabular-nums">${chrono(s.debutTs)}</div>
        </div>
        <div style="text-align:center">
          <div class="tres-discret">Calories</div>
          <div style="font-size:22px;font-weight:800;margin-top:5px">🔥 <span id="kcal-direct">${Math.round(kcalEnDirect())}</span></div>
        </div>
        <div style="text-align:right">
          <div class="tres-discret">Séries</div>
          <div style="font-size:30px;font-weight:800">${faites}<span class="discret" style="font-size:18px"> / ${total}</span></div>
        </div>
      </div>
      ${s.dureeVisee ? `<div class="barre-xp"><div id="jauge-temps" style="width:${Math.min(100, (minutes / s.dureeVisee) * 100)}%"></div></div>
        <div class="tres-discret" style="margin-top:4px">Objectif : ${duree(s.dureeVisee)}${salle(s.salleId) ? ' · ' + esc(salle(s.salleId).nom) : ''}</div>` : ''}
      <div class="ligne" style="margin-top:12px">
        <button class="btn btn-petit flex1" id="repos">${ICONES.horloge} Repos · ${texteDuree(etat.reglages.repos || 90)}</button>
        ${s.exercices.length ? `<span class="etiquette ${exFinis === s.exercices.length ? 'vert' : ''}" style="padding:8px 12px">✓ ${exFinis} / ${s.exercices.length} exercices</span>` : ''}
      </div>
    </div>

    <div style="margin-top:12px">${s.exercices.map((e, i) => carteEnCours(e, i, s.exercices.length)).join('')}</div>

    ${s.exercices.length ? '' : '<div class="vide-etat"><div class="grand">🏋️</div><p>Ajoute ton premier exercice.</p></div>'}
    <button class="btn btn-plein" id="ajouter" style="margin-top:12px">${ICONES.plus} Ajouter un exercice</button>
    <button class="btn btn-plein btn-danger" id="abandon" style="margin-top:24px">Abandonner la séance</button>
  `;

  // Saisie des répétitions / charges : sauvegarde sans redessiner pour garder le clavier ouvert.
  el.querySelectorAll('input[data-champ]').forEach((inp) => {
    inp.oninput = () => {
      const [i, j, champ] = inp.dataset.champ.split(':');
      const v = parseFloat(inp.value.replace(',', '.'));
      maj((e) => (e.enCours.exercices[i].series[j][champ] = Number.isFinite(v) ? v : 0), { silencieux: true });
    };
    inp.onfocus = () => inp.select();
  });
  el.querySelectorAll('[data-coche]').forEach((b) => (b.onclick = () => {
    const [i, j] = b.dataset.coche.split(':').map(Number);
    let faite;
    maj((e) => { const x = e.enCours.exercices[i].series[j]; x.faite = !x.faite; faite = x.faite; });
    if (faite && etat.reglages.reposAuto !== false) lancerRepos(etat.reglages.repos || 90);
  }));
  el.querySelectorAll('[data-fini]').forEach((b) => (b.onclick = () => {
    const i = +b.dataset.fini;
    let fini;
    maj((e) => {
      const x = e.enCours.exercices[i];
      x.fini = !x.fini;
      fini = x.fini;
      if (fini) x.series.forEach((y) => { if (y.reps > 0) y.faite = true; });
    });
    if (fini) {
      toast('Exercice terminé ✓');
      if (etat.reglages.reposAuto !== false) lancerRepos(etat.reglages.repos || 90);
    }
  }));
  el.querySelector('#repos').onclick = choisirRepos;
  el.querySelectorAll('[data-plus-serie]').forEach((b) => (b.onclick = () => maj((e) => {
    const series = e.enCours.exercices[+b.dataset.plusSerie].series;
    const der = series[series.length - 1] || { reps: 10, kg: 0 };
    series.push({ reps: der.reps, kg: der.kg, faite: false });
  })));
  el.querySelectorAll('[data-moins-serie]').forEach((b) => (b.onclick = () => maj((e) => {
    const series = e.enCours.exercices[+b.dataset.moinsSerie].series;
    if (series.length > 1) series.pop();
  })));
  el.querySelectorAll('[data-menu]').forEach((b) => (b.onclick = () => menuExercice(+b.dataset.menu)));
  el.querySelectorAll('[data-voir]').forEach((b) => (b.onclick = () => aller('exercice/' + b.dataset.voir)));
  el.querySelector('#ajouter').onclick = () => choisirExercice((ex) => ajouterALaSeance(ex));
  el.querySelector('#abandon').onclick = async () => {
    if (await confirmer('Abandonner la séance ? Rien ne sera enregistré.', { ok: 'Abandonner', danger: true })) {
      arreterRepos();
      maj((e) => (e.enCours = null));
    }
  };
  document.getElementById('terminer').onclick = () => terminer();
  afficherRepos();

  const minuteur = setInterval(() => {
    const c = el.querySelector('#chrono');
    if (!c || !etat.enCours) return;
    c.textContent = chrono(etat.enCours.debutTs);
    const k = el.querySelector('#kcal-direct');
    if (k) k.textContent = Math.round(kcalEnDirect());
    const j = el.querySelector('#jauge-temps');
    if (j) j.style.width = Math.min(100, ((Date.now() - etat.enCours.debutTs) / 60000 / etat.enCours.dureeVisee) * 100) + '%';
  }, 1000);
  return () => clearInterval(minuteur);
}

/** Calories depuis le début de la séance en cours (séries validées + temps écoulé). */
function kcalEnDirect() {
  const s = etat.enCours;
  return caloriesSeance({ ...s, duree: (Date.now() - s.debutTs) / 60000 }).total;
}

function carteEnCours(e, i, n) {
  const ex = exo(e.exId);
  const col = colonnes(ex);
  const avant = dernieresSeries(e.exId, etat.enCours.id);
  const toutesFaites = e.series.length && e.series.every((x) => x.faite);
  const fmt = (v) => (v ? String(v).replace('.', ',') : '');
  const boutonFini = `<button class="coche rond ${e.fini ? 'ok' : ''}" data-fini="${i}" aria-label="${e.fini ? 'Rouvrir l’exercice' : 'Exercice terminé'}">${ICONES.coche}</button>`;
  if (e.fini) {
    const faites = e.series.filter((x) => x.faite);
    return `<div class="ex-carte termine replie">
      <div class="ligne">
        ${image(ex) ? `<img class="vignette petite" src="${image(ex)}" alt="" loading="lazy">` : ''}
        <div class="flex1">
          <div style="font-weight:700;line-height:1.25;text-decoration:line-through;text-decoration-color:var(--vert)">${esc(ex?.n || e.exId)}</div>
          <div class="tres-discret">${faites.length ? faites.map((x) => texteSerie(ex, x)).join(' · ') : 'Aucune série'}</div>
        </div>
        ${boutonFini}
      </div>
    </div>`;
  }
  return `<div class="ex-carte ${toutesFaites ? 'termine' : ''}">
    <div class="ligne">
      ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy" data-voir="${ex.id}" style="cursor:pointer">` : '<div class="vignette vide"></div>'}
      <div class="flex1" data-voir="${ex.id}" style="cursor:pointer">
        <div style="font-weight:700;line-height:1.25">${esc(ex?.n || e.exId)}</div>
        <div class="tres-discret">${avant ? 'Dernière fois : ' + avant.map((x) => texteSerie(ex, x)).join(' · ') : 'Première fois 💥'}</div>
      </div>
      <button class="btn btn-icone" data-menu="${i}" aria-label="Options">⋯</button>
      ${boutonFini}
    </div>
    <table class="series">
      <thead><tr><th>Série</th>${col.kg ? `<th>${col.kg}</th>` : ''}<th>${col.reps}</th><th></th></tr></thead>
      <tbody>
        ${e.series.map((x, j) => `<tr class="${x.faite ? 'faite' : ''}">
          <td>${j + 1}</td>
          ${col.kg ? `<td><input type="text" inputmode="decimal" data-champ="${i}:${j}:kg" value="${fmt(x.kg)}" placeholder="0"></td>` : ''}
          <td><input type="text" inputmode="numeric" data-champ="${i}:${j}:reps" value="${fmt(x.reps)}" placeholder="0"></td>
          <td style="width:50px"><button class="coche ${x.faite ? 'ok' : ''}" data-coche="${i}:${j}" aria-label="Valider la série">${ICONES.coche}</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    <div class="ligne" style="margin-top:4px">
      <button class="btn btn-petit flex1" data-plus-serie="${i}">${ICONES.plus} Série</button>
      ${e.series.length > 1 ? `<button class="btn btn-petit" data-moins-serie="${i}">− Série</button>` : ''}
    </div>
  </div>`;
}

function menuExercice(i) {
  const s = etat.enCours;
  const ex = exo(s.exercices[i].exId);
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>${esc(ex.n)}</h2>
      <div class="pile">
        <button class="btn btn-plein" data-a="voir">Voir comment faire l'exercice</button>
        ${colonnes(ex).mode === 'muscu' ? '<button class="btn btn-plein" data-a="format">✎ Séries & répétitions</button>' : ''}
        <button class="btn btn-plein" data-a="remplacer">${ICONES.echange} Remplacer (machine prise…)</button>
        ${i > 0 ? `<button class="btn btn-plein" data-a="monter">${ICONES.haut} Monter</button>` : ''}
        ${i < s.exercices.length - 1 ? `<button class="btn btn-plein" data-a="descendre">${ICONES.bas} Descendre</button>` : ''}
        <button class="btn btn-plein btn-danger" data-a="retirer">${ICONES.poubelle} Retirer de la séance</button>
      </div>`;
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => {
      fermer();
      const a = b.dataset.a;
      if (a === 'voir') return aller('exercice/' + ex.id);
      if (a === 'format') {
        const series = s.exercices[i].series;
        const restante = series.find((x) => !x.faite) || series[series.length - 1];
        return editeurSchema({ titre: ex.n, series: series.length, reps: restante?.reps || 10 }, (sch) => maj((e) => {
          const l = e.enCours.exercices[i].series;
          // Les séries déjà validées ne bougent pas ; les autres prennent les nouvelles répétitions.
          l.forEach((x) => { if (!x.faite) x.reps = sch.reps; });
          while (l.length < sch.series) l.push({ reps: sch.reps, kg: l[l.length - 1]?.kg || 0, faite: false });
          while (l.length > sch.series && l.length > 1 && !l[l.length - 1].faite) l.pop();
        }));
      }
      if (a === 'remplacer') {
        return choisirExercice((nv) => maj((e) => {
          e.enCours.exercices[i] = { exId: nv.id, series: prerempli({ exId: nv.id, series: seriesParDefaut(nv, 15, schemaActuel()) }) };
        }), { groupe: GROUPES.find((g) => g.muscles?.includes(ex.m[0]) || g.categorie === ex.c)?.id });
      }
      maj((e) => {
        const l = e.enCours.exercices;
        if (a === 'retirer') l.splice(i, 1);
        if (a === 'monter') [l[i - 1], l[i]] = [l[i], l[i - 1]];
        if (a === 'descendre') [l[i + 1], l[i]] = [l[i], l[i + 1]];
      });
    }));
  });
}

function terminer() {
  const s = etat.enCours;
  const minutes = Math.max(1, Math.round((Date.now() - s.debutTs) / 60000));
  const faites = s.exercices.reduce((t, e) => t + e.series.filter((x) => x.faite).length, 0);
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>Terminer la séance</h2>
      <div class="pile">
        ${faites ? '' : '<p class="discret">Aucune série validée. La séance sera quand même comptée comme une visite.</p>'}
        <label class="champ">Durée (minutes)<input type="number" inputmode="numeric" id="t-duree" value="${minutes}" min="1"></label>
        <label class="champ">Note (facultatif)<textarea id="t-note" placeholder="Forme, sensations…"></textarea></label>
        <button class="btn btn-principal btn-plein" id="t-ok">Enregistrer la séance</button>
        <button class="btn btn-plein" id="t-annuler">Continuer la séance</button>
      </div>`;
    el.querySelector('#t-annuler').onclick = fermer;
    el.querySelector('#t-ok').onclick = () => {
      const d = Math.max(1, Math.round(+el.querySelector('#t-duree').value || minutes));
      const types = s.types.length ? s.types : deduireTypes(s.exercices);
      const seance = {
        id: s.id, date: s.date, debut: s.debut, duree: d, salleId: s.salleId, types,
        exercices: s.exercices
          .map((e) => ({ exId: e.exId, series: e.series.filter((x) => x.faite) }))
          .filter((e) => e.series.length),
        note: el.querySelector('#t-note').value.trim(), source: 'suivie',
      };
      const calcul = calculerXpSeance(seance);
      seance.xp = calcul.total;
      let gain;
      arreterRepos();
      maj((e) => {
        e.seances.push(seance);
        e.enCours = null;
        const atteints = verifierCharges(e);
        calcul.lignes.push(...atteints);
        calcul.total += atteints.reduce((t, l) => t + l.xp, 0);
        seance.xp = calcul.total;
        gain = ajouterXp(e, calcul.total, 'Séance', seance.date, { seanceId: seance.id });
      });
      fermer();
      brouillon.types = new Set();
      celebrer({ ...calcul, ...gain, kcal: caloriesSeance(seance) });
      aller('seance-detail/' + seance.id);
    };
  });
}

function deduireTypes(exercices) {
  const t = new Set();
  for (const e of exercices) {
    const ex = exo(e.exId);
    const g = GROUPES.find((g) => g.categorie === ex?.c) || GROUPES.find((g) => g.muscles?.includes(ex?.m[0]));
    if (g) t.add(g.id);
  }
  return [...t];
}

// =====================================================================
// Minuteur de repos
// =====================================================================

let repos = null; // {el, timer} — l'état (fin, début…) est gardé dans etat.enCours.repos
let audio = null;

export const DUREES_REPOS = [30, 45, 60, 90, 120, 150, 180, 240, 300];
export const texteDuree = (sec) => (sec < 60 ? `${sec} s` : `${Math.floor(sec / 60)} min${sec % 60 ? ' ' + (sec % 60) : ''}`);
const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

function debloquerAudio() {
  // Sur iPhone, le son doit être activé pendant un geste de l'utilisateur.
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch { /* rien */ }
}

function bip() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((t) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.25, audio.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t + 0.2);
      o.connect(g).connect(audio.destination);
      o.start(audio.currentTime + t);
      o.stop(audio.currentTime + t + 0.22);
    });
  } catch { /* pas de son */ }
}

/** Compte à rebours de repos. */
function lancerRepos(secondes) {
  debloquerAudio();
  maj((e) => { if (e.enCours) e.enCours.repos = { mode: 'decompte', fin: Date.now() + secondes * 1000, total: secondes }; }, { silencieux: true });
  afficherRepos();
}

/** Chronomètre libre (compte à l'endroit). */
function lancerChrono() {
  debloquerAudio();
  maj((e) => { if (e.enCours) e.enCours.repos = { mode: 'chrono', debut: Date.now() }; }, { silencieux: true });
  afficherRepos();
}

/** Affiche la barre de repos d'après l'état sauvegardé (y compris après une fermeture de l'app). */
function afficherRepos() {
  const r = etat.enCours?.repos;
  if (!r) return masquerRepos();
  if (!repos) {
    const el = document.createElement('div');
    el.className = 'repos';
    document.body.append(el);
    repos = { el, timer: setInterval(() => dessinerRepos(), 1000) };
    document.body.classList.add('avec-repos');
  }
  dessinerRepos(true);
}

function dessinerRepos(complet = false) {
  const r = etat.enCours?.repos;
  if (!r || !repos) return masquerRepos();
  const el = repos.el;
  if (r.mode === 'chrono') {
    const ecoule = Math.max(0, Math.floor((Date.now() - r.debut) / 1000));
    if (complet) {
      el.innerHTML = `<div><div class="tres-discret">Chrono repos</div><div class="temps"></div></div><div class="flex1"></div>
        <button class="btn btn-petit" data-r="zero">↺ 0</button><button class="btn btn-petit btn-principal" data-r="stop">Stop</button>`;
      brancherBoutons();
    }
    el.querySelector('.temps').textContent = mmss(ecoule);
    return;
  }
  const reste = Math.max(0, Math.round((r.fin - Date.now()) / 1000));
  if (complet) {
    el.innerHTML = `<div><div class="tres-discret">Repos</div><div class="temps"></div></div>
      <div class="jauge"><div></div></div>
      <button class="btn btn-petit" data-r="-15">−15</button><button class="btn btn-petit" data-r="15">+15</button>
      <button class="btn btn-petit btn-principal" data-r="stop">OK</button>`;
    brancherBoutons();
  }
  el.querySelector('.temps').textContent = mmss(reste);
  el.querySelector('.jauge div').style.width = `${Math.min(100, (reste / r.total) * 100)}%`;
  if (reste <= 0) {
    bip();
    vibrer([200, 100, 200]);
    toast('Repos terminé, série suivante 💪');
    arreterRepos();
  }
}

function brancherBoutons() {
  repos.el.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => {
    const a = b.dataset.r;
    if (a === 'stop') return arreterRepos();
    maj((e) => {
      const r = e.enCours?.repos;
      if (!r) return;
      if (a === 'zero') r.debut = Date.now();
      else {
        r.fin += +a * 1000;
        r.total = Math.max(r.total, Math.round((r.fin - Date.now()) / 1000));
      }
    }, { silencieux: true });
    dessinerRepos();
  }));
}

function masquerRepos() {
  if (!repos) return;
  clearInterval(repos.timer);
  repos.el.remove();
  repos = null;
  document.body.classList.remove('avec-repos');
}

function arreterRepos() {
  masquerRepos();
  if (etat.enCours?.repos) maj((e) => { delete e.enCours.repos; }, { silencieux: true });
}

/** Feuille pour lancer le repos à la main ou le chronomètre. */
function choisirRepos() {
  ouvrirFeuille((el, fermer) => {
    const actuel = etat.reglages.repos || 90;
    const auto = etat.reglages.reposAuto !== false;
    el.innerHTML = `<h2>⏱ Temps de repos</h2>
      <p class="discret">Touche une durée pour lancer le compte à rebours. Elle devient ta durée par défaut.</p>
      <div class="grille-3">${DUREES_REPOS.map((d) => `<button class="btn ${d === actuel ? 'btn-principal' : ''}" data-d="${d}">${texteDuree(d)}</button>`).join('')}</div>
      <button class="btn btn-plein" id="chrono-libre" style="margin-top:10px">${ICONES.horloge} Chronomètre libre (compte à l’endroit)</button>
      <label class="ligne carte" style="margin-top:14px;cursor:pointer">
        <input type="checkbox" id="auto" ${auto ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent)">
        <span class="flex1">Lancer le repos automatiquement quand je valide une série</span>
      </label>`;
    el.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => {
      const d = +b.dataset.d;
      maj((e) => (e.reglages.repos = d), { silencieux: true });
      fermer();
      lancerRepos(d);
    }));
    el.querySelector('#chrono-libre').onclick = () => { fermer(); lancerChrono(); };
    el.querySelector('#auto').onchange = (ev) => maj((e) => (e.reglages.reposAuto = ev.target.checked), { silencieux: true });
  });
}

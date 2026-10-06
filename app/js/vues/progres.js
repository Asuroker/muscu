import {
  etat, maj, esc, jour, kg, dateCourte, dateLongue, duree, historiqueExercice, remplacerEtat, reinitialiser,
} from '../store.js';
import { entete, aller } from '../nav.js';
import { exo, image, colonnes, texteSerie } from '../exercices.js';
import { ajouterXp } from '../xp.js';
import { ICONES, ouvrirFeuille, confirmer, toast, graphe } from '../ui.js';
import { carteNiveau } from './accueil.js';
import { celebrer } from './recompenses.js';
import { totalCalories } from '../calories.js';

export function afficher(el) {
  entete('Progrès');
  const nb = etat.seances.length;
  const minutes = etat.seances.reduce((t, s) => t + (s.duree || 0), 0);
  const volume = etat.seances.reduce((t, s) => t + (s.exercices || []).reduce((u, e) =>
    u + (colonnes(exo(e.exId)).mode === 'muscu' ? e.series.reduce((v, x) => v + (x.kg || 0) * x.reps, 0) : 0), 0), 0);
  const bons = etat.bons.filter((b) => !b.utiliseLe).length;
  const nbExos = exercicesFaits().length;

  el.innerHTML = `
    ${carteNiveau()}
    <div class="grille-2" style="margin-top:10px">
      <div class="stat"><div class="val">${nb}</div><div class="lib">Séances</div></div>
      <div class="stat"><div class="val">${minutes ? duree(minutes) : '0'}</div><div class="lib">Au total</div></div>
      <div class="stat"><div class="val">${Math.round(totalCalories(etat.seances)).toLocaleString('fr-FR')}</div><div class="lib">kcal</div></div>
      <div class="stat"><div class="val">${volume >= 1000 ? (Math.round(volume / 100) / 10).toLocaleString('fr-FR') + ' t' : Math.round(volume) + ' kg'}</div><div class="lib">Soulevés</div></div>
    </div>
    <div class="liste" style="margin-top:16px">
      <a class="item" href="#/recompenses"><div class="vignette vide" style="font-size:26px">🎁</div>
        <div class="flex1"><div class="titre">Récompenses & niveaux</div><div class="sous">${bons ? `${bons} bon${bons > 1 ? 's' : ''} à utiliser` : 'Tes bons et les règles des récompenses'}</div></div>${ICONES.chevron}</a>
      <a class="item" href="#/charges"><div class="vignette vide" style="font-size:26px">🏋️</div>
        <div class="flex1"><div class="titre">Mes charges</div><div class="sous">${nbExos ? `${nbExos} exercice${nbExos > 1 ? 's' : ''} suivi${nbExos > 1 ? 's' : ''}` : 'Historique des poids par machine'}</div></div>${ICONES.chevron}</a>
      <a class="item" href="#/poids"><div class="vignette vide" style="font-size:26px">⚖️</div>
        <div class="flex1"><div class="titre">Poids corporel</div><div class="sous">${etat.poids.length ? `${etat.poids.length} pesée${etat.poids.length > 1 ? 's' : ''}` : 'Suis l’évolution de ton poids'}</div></div>${ICONES.chevron}</a>
      <a class="item" href="#/salles"><div class="vignette vide" style="font-size:26px">📍</div>
        <div class="flex1"><div class="titre">Mes salles de sport</div><div class="sous">${etat.salles.length ? esc(etat.salles.map((s) => s.nom).join(', ')) : 'Recherche et horaires d’ouverture'}</div></div>${ICONES.chevron}</a>
      <a class="item" href="#/reglages"><div class="vignette vide" style="font-size:26px">⚙️</div>
        <div class="flex1"><div class="titre">Réglages & sauvegarde</div><div class="sous">Temps de repos, export des données</div></div>${ICONES.chevron}</a>
    </div>
  `;
  el.querySelectorAll('[data-aller]').forEach((b) => (b.onclick = () => aller(b.dataset.aller)));
}

// ---------- Poids corporel ----------

export function ajouterPoids() {
  const tries = [...etat.poids].sort((a, b) => a.date.localeCompare(b.date));
  const dernier = tries[tries.length - 1];
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>Nouvelle pesée</h2>
      <div class="pile">
        <div class="grille-2">
          <label class="champ">Poids (kg)<input type="text" inputmode="decimal" id="p-kg" placeholder="${dernier ? String(dernier.kg).replace('.', ',') : '75,0'}"></label>
          <label class="champ">Date<input type="date" id="p-date" value="${jour()}" max="${jour()}"></label>
        </div>
        <button class="btn btn-principal btn-plein" id="p-ok">Enregistrer</button>
      </div>`;
    const champ = el.querySelector('#p-kg');
    setTimeout(() => champ.focus(), 250);
    el.querySelector('#p-ok').onclick = () => {
      const v = parseFloat(champ.value.replace(',', '.'));
      const d = el.querySelector('#p-date').value || jour();
      if (!(v > 20 && v < 400)) return toast('Poids invalide');
      const premiereDuJour = !etat.xp.some((x) => x.raison === 'Pesée' && x.date === d);
      let gain;
      maj((e) => {
        e.poids = e.poids.filter((p) => p.date !== d);
        e.poids.push({ date: d, kg: Math.round(v * 10) / 10 });
        if (premiereDuJour) gain = ajouterXp(e, 5, 'Pesée', d);
      });
      fermer();
      if (gain?.niveaux.length) celebrer({ total: 5, lignes: [{ lib: 'Pesée', xp: 5 }], ...gain });
      else toast(premiereDuJour ? 'Pesée enregistrée · +5 XP' : 'Pesée enregistrée');
    };
  });
}

export function afficherPoids(el) {
  entete('Poids corporel', `<button class="btn btn-icone" id="ajout" aria-label="Ajouter">${ICONES.plus}</button>`);
  const p = [...etat.poids].sort((a, b) => a.date.localeCompare(b.date));
  document.getElementById('ajout').onclick = ajouterPoids;
  if (!p.length) {
    el.innerHTML = `<div class="vide-etat"><div class="grand">⚖️</div><p>Aucune pesée pour l’instant.</p>
      <button class="btn btn-principal" id="prem">${ICONES.plus} Ajouter ma première pesée</button></div>`;
    el.querySelector('#prem').onclick = ajouterPoids;
    return;
  }
  const premier = p[0], dernier = p[p.length - 1];
  const diff = dernier.kg - premier.kg;
  el.innerHTML = `
    <div class="grille-3">
      <div class="stat"><div class="val">${kg(dernier.kg)}</div><div class="lib">Actuel</div></div>
      <div class="stat"><div class="val">${diff > 0 ? '+' : diff < 0 ? '−' : ''}${kg(Math.abs(diff))}</div><div class="lib">Depuis le début</div></div>
      <div class="stat"><div class="val">${kg(Math.min(...p.map((x) => x.kg)))}</div><div class="lib">Minimum</div></div>
    </div>
    <div class="carte" style="margin-top:10px">${graphe(p.map((x) => ({ date: x.date, y: x.kg })), { unite: 'kg' })}</div>
    <h2>Historique</h2>
    <div class="liste">${[...p].reverse().map((x, i, t) => {
      const avant = t[i + 1];
      const d = avant ? x.kg - avant.kg : 0;
      return `<div class="item" style="cursor:default">
        <div class="flex1"><div class="titre">${kg(x.kg)}</div><div class="sous">${dateLongue(x.date)}</div></div>
        ${avant ? `<span class="etiquette ${d > 0 ? 'rouge' : d < 0 ? 'vert' : ''}">${d > 0 ? '+' : d < 0 ? '−' : '='}${d ? kg(Math.abs(d)) : ''}</span>` : ''}
        <button class="btn btn-icone" data-suppr="${x.date}" aria-label="Supprimer">${ICONES.poubelle}</button>
      </div>`;
    }).join('')}</div>`;
  el.querySelectorAll('[data-suppr]').forEach((b) => (b.onclick = async () => {
    if (await confirmer('Supprimer cette pesée ?', { ok: 'Supprimer', danger: true })) {
      maj((e) => (e.poids = e.poids.filter((x) => x.date !== b.dataset.suppr)));
    }
  }));
}

// ---------- Charges ----------

function exercicesFaits() {
  const ids = new Set();
  etat.seances.forEach((s) => (s.exercices || []).forEach((e) => ids.add(e.exId)));
  return [...ids].map((id) => ({ ex: exo(id), h: historiqueExercice(id) })).filter((x) => x.ex && x.h.length);
}

export function afficherCharges(el) {
  entete('Mes charges');
  const liste = exercicesFaits().sort((a, b) => b.h[b.h.length - 1].date.localeCompare(a.h[a.h.length - 1].date));
  if (!liste.length) {
    el.innerHTML = `<div class="vide-etat"><div class="grand">🏋️</div><p>Tes charges apparaîtront ici après ta première séance suivie.</p>
      <button class="btn btn-principal" data-aller="seance">Commencer une séance</button></div>`;
    el.querySelector('[data-aller]').onclick = () => aller('seance');
    return;
  }
  el.innerHTML = `<div class="liste">${liste.map(({ ex, h }) => {
    const muscu = colonnes(ex).mode === 'muscu';
    const rec = muscu ? Math.max(...h.map((x) => x.max)) : 0;
    const der = h[h.length - 1];
    const prog = muscu && h.length > 1 ? der.max - h[0].max : 0;
    const cumul = muscu ? '' : texteCumul(ex, h) + ' · ';
    return `<a class="item" href="#/charge/${encodeURIComponent(ex.id)}">
      ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy">` : '<div class="vignette vide"></div>'}
      <div class="flex1"><div class="titre">${esc(ex.n)}</div>
        <div class="sous">${cumul}${rec ? 'Record ' + kg(rec) + ' · ' : ''}${h.length} séance${h.length > 1 ? 's' : ''} · ${dateCourte(der.date)}</div></div>
      ${prog > 0 ? `<span class="etiquette vert">+${kg(prog)}</span>` : ''}
    </a>`;
  }).join('')}</div>`;
}

export function afficherCharge(el, [id]) {
  const ex = exo(id);
  if (!ex) { entete('Charges'); el.innerHTML = '<p class="discret">Exercice introuvable.</p>'; return; }
  entete(ex.n);
  const h = historiqueExercice(id);
  const col = colonnes(ex);
  const muscu = col.mode === 'muscu';
  const rec = muscu && h.length ? Math.max(...h.map((x) => x.max)) : 0;
  const unRM = muscu && h.length ? Math.max(...h.map((x) => x.unRM)) : 0;
  const minutes = (x) => x.series.reduce((t, s) => t + (s.reps || 0), 0) / (col.mode === 'etirement' ? 60 : 1);
  const km = (x) => x.series.reduce((t, s) => t + (s.kg || 0), 0);
  const kmTotal = h.reduce((t, x) => t + km(x), 0);
  el.innerHTML = `
    ${muscu ? `<div class="grille-2">
      <div class="stat"><div class="val">${rec ? kg(rec) : '–'}</div><div class="lib">Record</div></div>
      <div class="stat"><div class="val">${unRM ? kg(Math.round(unRM)) : '–'}</div><div class="lib">1RM estimé</div></div>
    </div>` : `<div class="grille-2">
      <div class="stat"><div class="val">${duree(h.reduce((t, x) => t + minutes(x), 0))}</div><div class="lib">Temps total</div></div>
      <div class="stat"><div class="val">${col.kg && kmTotal ? String(Math.round(kmTotal * 10) / 10).replace('.', ',') + ' km' : h.length}</div><div class="lib">${col.kg && kmTotal ? 'Distance totale' : 'Séances'}</div></div>
    </div>`}
    ${!muscu && h.length > 1 ? `<h2>${col.kg && kmTotal ? 'Distance' : 'Durée'} par séance</h2><div class="carte">${graphe(h.map((x) => ({ date: x.date, y: col.kg && kmTotal ? km(x) : minutes(x) })), { unite: col.kg && kmTotal ? 'km' : 'min' })}</div>` : ''}
    ${muscu && h.length > 1 ? `<h2>Charge max par séance</h2><div class="carte">${graphe(h.map((x) => ({ date: x.date, y: x.max })), { unite: 'kg' })}</div>
      <h2>Volume par séance</h2><div class="carte">${graphe(h.map((x) => ({ date: x.date, y: x.volume })), { unite: 'kg' })}</div>` : ''}
    <h2>Historique</h2>
    ${h.length ? `<div class="liste">${[...h].reverse().map((x) => `<a class="item" href="#/seance-detail/${x.seanceId}">
        <div class="flex1"><div class="titre">${dateLongue(x.date)}</div>
        <div class="sous">${x.series.map((s) => texteSerie(ex, s)).join(' · ')}</div></div>
        ${x.max === rec && rec ? '<span class="etiquette or">🏆</span>' : ''}
      </a>`).join('')}</div>` : '<p class="discret">Aucune donnée.</p>'}
    <button class="btn btn-plein" style="margin-top:14px" data-aller="exercice/${encodeURIComponent(ex.id)}">Voir la fiche de l’exercice</button>
  `;
  el.querySelector('[data-aller]').onclick = (e) => aller(e.currentTarget.dataset.aller);
}

function texteCumul(ex, h) {
  const col = colonnes(ex);
  const min = h.reduce((t, x) => t + x.series.reduce((u, s) => u + (s.reps || 0), 0), 0) / (col.mode === 'etirement' ? 60 : 1);
  const km = h.reduce((t, x) => t + x.series.reduce((u, s) => u + (s.kg || 0), 0), 0);
  return duree(min) + (km ? ` · ${String(Math.round(km * 10) / 10).replace('.', ',')} km` : '');
}

// ---------- Réglages ----------

export function afficherReglages(el) {
  entete('Réglages');
  const r = etat.reglages.repos || 90;
  el.innerHTML = `
    <h2>Temps de repos entre les séries</h2>
    <div class="puces">${[45, 60, 90, 120, 150, 180].map((s) => `<button class="puce ${r === s ? 'active' : ''}" data-repos="${s}">${s < 60 ? s + ' s' : (s / 60).toString().replace('.', ',') + ' min'}</button>`).join('')}</div>

    <h2>Sauvegarde</h2>
    <p class="discret">Tes données restent sur ce téléphone. Exporte-les de temps en temps (dans Fichiers ou iCloud) pour ne rien perdre.</p>
    <div class="pile">
      <button class="btn btn-plein" id="exporter">Exporter mes données</button>
      <label class="btn btn-plein" style="cursor:pointer">Importer une sauvegarde<input type="file" id="importer" accept="application/json,.json" hidden></label>
    </div>

    <h2>Installer sur l’iPhone</h2>
    <div class="carte">
      <ol class="etapes" style="margin-top:6px">
        <li>Ouvre cette page dans <strong>Safari</strong>.</li>
        <li>Touche le bouton <strong>Partager</strong> (carré avec une flèche).</li>
        <li>Choisis <strong>Sur l’écran d’accueil</strong>, puis <strong>Ajouter</strong>.</li>
      </ol>
      <p class="tres-discret" style="margin:0">L’app s’ouvre alors en plein écran, comme une app normale.</p>
    </div>

    <h2>Zone de danger</h2>
    <button class="btn btn-plein btn-danger" id="reset">Tout effacer</button>

    <p class="tres-discret" style="margin-top:24px">Exercices et photos : free-exercise-db (domaine public). Salles et horaires : © contributeurs OpenStreetMap.</p>
  `;
  el.querySelectorAll('[data-repos]').forEach((b) => (b.onclick = () => maj((e) => (e.reglages.repos = +b.dataset.repos))));
  el.querySelector('#exporter').onclick = exporter;
  el.querySelector('#importer').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const donnees = JSON.parse(await f.text());
      if (!Array.isArray(donnees.seances)) throw new Error();
      if (!(await confirmer(`Remplacer tes données actuelles par cette sauvegarde (${donnees.seances.length} séances) ?`, { ok: 'Importer' }))) return;
      remplacerEtat(donnees);
      toast('Sauvegarde importée');
    } catch {
      toast('Fichier de sauvegarde invalide');
    }
  };
  el.querySelector('#reset').onclick = async () => {
    if (await confirmer('Effacer toutes tes séances, pesées, salles, XP et bons ? C’est définitif.', { ok: 'Tout effacer', danger: true })) {
      reinitialiser();
      toast('Données effacées');
    }
  };
}

async function exporter() {
  const nom = `muscu-sauvegarde-${jour()}.json`;
  const blob = new Blob([JSON.stringify(etat, null, 1)], { type: 'application/json' });
  const fichier = new File([blob], nom, { type: 'application/json' });
  if (navigator.canShare?.({ files: [fichier] })) {
    try { await navigator.share({ files: [fichier], title: 'Sauvegarde Muscu' }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

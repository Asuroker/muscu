import { etat, maj, esc, uid, jour, heure, dateLongue, dateDepuisJour, duree, kg, salle } from '../store.js';
import { entete, aller } from '../nav.js';
import { GROUPES, nomGroupe, exo, image, colonnes, texteSerie } from '../exercices.js';
import { calculerXpSeance, ajouterXp } from '../xp.js';
import { caloriesSeance, totalCalories, fmtKcal } from '../calories.js';
import { ICONES, ouvrirFeuille, confirmer, toast } from '../ui.js';
import { celebrer } from './recompenses.js';
import { demarrerModele, planifierPour } from './seance.js';
import { htmlChoixCategories, brancherChoixCategories } from './categories.js';

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
let mois = null;      // Date du 1er du mois affiché
let choisi = jour();  // jour sélectionné

export function afficher(el) {
  entete('Calendrier', `<button class="btn btn-icone" id="ajout-haut" aria-label="Ajouter une séance">${ICONES.plus}</button>`);
  if (!mois) { const d = new Date(); mois = new Date(d.getFullYear(), d.getMonth(), 1); }

  const parJour = {};
  etat.seances.forEach((s) => (parJour[s.date] = parJour[s.date] || []).push(s));

  const premier = new Date(mois);
  const decalage = (premier.getDay() + 6) % 7;
  const debut = new Date(premier); debut.setDate(1 - decalage);
  const cases = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(debut); d.setDate(debut.getDate() + i);
    if (i >= 35 && d.getMonth() !== mois.getMonth()) break;
    cases.push(d);
  }
  const auj = jour();
  const duMois = etat.seances.filter((s) => { const d = dateDepuisJour(s.date); return d.getMonth() === mois.getMonth() && d.getFullYear() === mois.getFullYear(); });
  const minutesMois = duMois.reduce((t, s) => t + (s.duree || 0), 0);
  const ceJour = (parJour[choisi] || []).sort((a, b) => a.debut.localeCompare(b.debut));
  const prevus = {};
  (etat.modeles || []).filter((m) => m.date).forEach((m) => (prevus[m.date] = prevus[m.date] || []).push(m));
  const prevusCeJour = prevus[choisi] || [];

  el.innerHTML = `
    <div class="ligne-entre" style="margin-bottom:12px">
      <button class="btn btn-icone" id="prec" aria-label="Mois précédent"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div style="font-weight:800;font-size:18px">${MOIS[mois.getMonth()]} ${mois.getFullYear()}</div>
      <button class="btn btn-icone" id="suiv" aria-label="Mois suivant"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
    <div class="cal-entete">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((j) => `<div>${j}</div>`).join('')}</div>
    <div class="cal-grille">
      ${cases.map((d) => {
        const k = jour(d), n = (parJour[k] || []).length, p = (prevus[k] || []).length;
        const cls = ['cal-jour', d.getMonth() !== mois.getMonth() && 'hors', k === auj && 'aujourdhui', n && 'fait', k === choisi && 'choisi'].filter(Boolean).join(' ');
        return `<button class="${cls}" data-jour="${k}">${d.getDate()}<span class="cal-points">${'<i></i>'.repeat(Math.min(n, 3))}${'<i class="prevu"></i>'.repeat(Math.min(p, 2))}</span></button>`;
      }).join('')}
    </div>
    <div class="grille-3" style="margin-top:12px">
      <div class="stat"><div class="val">${duMois.length}</div><div class="lib">Séances</div></div>
      <div class="stat"><div class="val">${minutesMois ? duree(minutesMois) : '0'}</div><div class="lib">Temps</div></div>
      <div class="stat"><div class="val">${duMois.length ? Math.round(totalCalories(duMois)).toLocaleString('fr-FR') : '0'}</div><div class="lib">kcal ce mois</div></div>
    </div>

    <h2>${dateLongue(choisi)}</h2>
    ${prevusCeJour.length ? `<div class="liste" style="margin-bottom:10px">${prevusCeJour.map((m) => `<div class="item" data-prevue="${m.id}">
        <div class="vignette vide" style="font-size:24px">📅</div>
        <div class="flex1"><div class="titre">Prévue : ${esc(m.nom)}</div>
          <div class="sous">${m.exercices.length} exercice${m.exercices.length > 1 ? 's' : ''}${choisi < auj ? ' · pas encore faite' : ''}</div></div>
        ${choisi <= auj && !etat.enCours ? `<button class="btn btn-petit btn-principal" data-go="${m.id}">▶ Démarrer</button>` : ''}
      </div>`).join('')}</div>` : ''}
    ${ceJour.length ? `<div class="liste">${ceJour.map(ligneSeance).join('')}</div>`
      : prevusCeJour.length ? '' : `<p class="discret">Pas de séance ce jour-là.</p>`}
    ${choisi >= auj ? `<button class="btn btn-plein" id="planifier" style="margin-top:12px">📌 Planifier une séance ce jour</button>` : ''}
    ${choisi <= auj ? `<button class="btn btn-plein" id="ajout" style="margin-top:12px">${ICONES.plus} Noter une séance faite ce jour</button>` : ''}
  `;

  el.querySelector('#prec').onclick = () => { mois.setMonth(mois.getMonth() - 1); afficher(el); };
  el.querySelector('#suiv').onclick = () => { mois.setMonth(mois.getMonth() + 1); afficher(el); };
  el.querySelectorAll('[data-jour]').forEach((b) => (b.onclick = () => {
    choisi = b.dataset.jour;
    const d = dateDepuisJour(choisi);
    if (d.getMonth() !== mois.getMonth()) mois = new Date(d.getFullYear(), d.getMonth(), 1);
    afficher(el);
  }));
  el.querySelectorAll('[data-seance]').forEach((b) => (b.onclick = () => aller('seance-detail/' + b.dataset.seance)));
  const ajout = el.querySelector('#ajout');
  if (ajout) ajout.onclick = () => ajouterSeanceManuelle(choisi);
  const planifier = el.querySelector('#planifier');
  if (planifier) planifier.onclick = () => planifierPour(choisi);
  el.querySelectorAll('[data-go]').forEach((b) => (b.onclick = (ev) => { ev.stopPropagation(); demarrerModele(b.dataset.go); }));
  el.querySelectorAll('[data-prevue]').forEach((b) => (b.onclick = () => aller('seance')));
  document.getElementById('ajout-haut').onclick = () => (choisi > auj ? planifierPour(choisi) : ajouterSeanceManuelle(choisi));
}

function ligneSeance(s) {
  const sa = salle(s.salleId);
  const nbEx = (s.exercices || []).length;
  return `<div class="item" data-seance="${s.id}">
    <div class="vignette vide" style="font-weight:800;font-size:13px;color:var(--accent)">${esc(s.debut)}</div>
    <div class="flex1">
      <div class="titre">${esc((s.types || []).map(nomGroupe).join(' · ') || 'Séance')}</div>
      <div class="sous">${duree(s.duree)} · 🔥 ${fmtKcal(caloriesSeance(s).total)}${sa ? ' · ' + esc(sa.nom) : ''}${nbEx ? ` · ${nbEx} exercice${nbEx > 1 ? 's' : ''}` : ''}</div>
    </div>
    ${ICONES.chevron}
  </div>`;
}

function finDe(s) {
  const [h, m] = s.debut.split(':').map(Number);
  const t = h * 60 + m + Math.round(s.duree || 0);
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

export function afficherSeance(el, [id]) {
  const s = etat.seances.find((x) => x.id === id);
  if (!s) { entete('Séance'); el.innerHTML = '<p class="discret">Séance introuvable.</p>'; return; }
  entete('Séance', `<button class="btn btn-icone" id="modif" aria-label="Modifier">${ICONES.crayon}</button>`);
  const sa = salle(s.salleId);
  const kcal = caloriesSeance(s);
  const totalSeries = (s.exercices || []).reduce((t, e) => t + e.series.filter((x) => x.faite).length, 0);
  const volume = (s.exercices || []).reduce((t, e) => t + e.series.filter((x) => x.faite && colonnes(exo(e.exId)).mode === 'muscu').reduce((u, x) => u + x.reps * (x.kg || 0), 0), 0);

  el.innerHTML = `
    <div class="carte">
      <div style="font-weight:800;font-size:18px">${dateLongue(s.date)}</div>
      <div class="discret">${esc(s.debut)} – ${finDe(s)} · ${duree(s.duree)}</div>
      ${sa ? `<div class="ligne" style="margin-top:8px;cursor:pointer" data-aller="salle/${sa.id}">${ICONES.lieu}<span>${esc(sa.nom)}</span></div>` : ''}
      <div class="puces" style="margin-top:10px">
        ${(s.types || []).map((t) => `<span class="etiquette">${esc(nomGroupe(t))}</span>`).join('')}
        <span class="etiquette or">+${s.xp || 0} XP</span>
      </div>
      ${s.note ? `<p style="margin-top:10px">${esc(s.note)}</p>` : ''}
    </div>
    <div class="grille-${totalSeries ? 3 : 1}" style="margin-top:10px">
      <div class="stat"><div class="val">🔥 ${Math.round(kcal.total).toLocaleString('fr-FR')}</div><div class="lib">kcal dépensées</div></div>
      ${totalSeries ? `<div class="stat"><div class="val">${totalSeries}</div><div class="lib">Séries</div></div>
      <div class="stat"><div class="val">${volume ? Math.round(volume).toLocaleString('fr-FR') + ' kg' : '–'}</div><div class="lib">Volume</div></div>` : ''}
    </div>
    <p class="tres-discret" style="margin-top:6px">${kcal.estime
      ? 'Calories estimées pour 75 kg : <a href="#/poids" style="color:var(--accent)">ajoute ta pesée</a> pour un calcul précis.'
      : `Calories estimées pour ${String(kcal.poids).replace('.', ',')} kg (méthode MET).`}</p>
    ${(s.exercices || []).length ? `<h2>Exercices</h2>${s.exercices.map((e, i) => carteExercice(e, kcal.parExercice[i])).join('')}` : ''}
    <button class="btn btn-plein btn-danger" id="suppr" style="margin-top:20px">${ICONES.poubelle} Supprimer la séance</button>
  `;
  el.querySelectorAll('[data-aller]').forEach((b) => (b.onclick = () => aller(b.dataset.aller)));
  document.getElementById('modif').onclick = () => ajouterSeanceManuelle(s.date, s);
  el.querySelector('#suppr').onclick = async () => {
    if (!(await confirmer('Supprimer cette séance ? L’XP gagnée avec elle sera retirée.', { ok: 'Supprimer', danger: true }))) return;
    maj((e) => {
      e.seances = e.seances.filter((x) => x.id !== s.id);
      e.xp = e.xp.filter((x) => x.seanceId !== s.id);
    }, { silencieux: true });
    toast('Séance supprimée');
    history.back();
  };
}

function carteExercice(e, kcal) {
  const ex = exo(e.exId);
  const col = colonnes(ex);
  const faites = e.series.filter((x) => x.faite);
  return `<div class="carte cliquable" data-aller="exercice/${e.exId}">
    <div class="ligne">
      ${image(ex) ? `<img class="vignette" src="${image(ex)}" alt="" loading="lazy">` : '<div class="vignette vide"></div>'}
      <div class="flex1">
        <div class="ligne-entre"><div style="font-weight:700">${esc(ex?.n || e.exId)}</div>${kcal ? `<span class="etiquette accent" style="white-space:nowrap">${fmtKcal(kcal)}</span>` : ''}</div>
        <div class="discret">${faites.length ? faites.map((x) => texteSerie(ex, x)).join(' · ') : 'Aucune série validée'}</div>
      </div>
    </div>
  </div>`;
}

/** Feuille d'ajout / modification d'une séance (visite à la salle). */
export function ajouterSeanceManuelle(date, existante = null) {
  const types = new Set(existante?.types || []);
  ouvrirFeuille((el, fermer) => {
    const maintenant = new Date();
    el.innerHTML = `
      <h2>${existante ? 'Modifier la séance' : 'Noter une visite'}</h2>
      <div class="pile">
        <div class="grille-2">
          <label class="champ">Date<input type="date" id="f-date" value="${existante?.date || date}" max="${jour()}"></label>
          <label class="champ">Arrivée<input type="time" id="f-debut" value="${existante?.debut || heure(new Date(maintenant.getTime() - 3600000))}"></label>
        </div>
        <label class="champ">Durée (minutes)<input type="number" id="f-duree" inputmode="numeric" min="5" max="400" value="${existante?.duree ?? 60}"></label>
        <div class="puces">${[30, 45, 60, 75, 90, 120].map((m) => `<button class="puce" data-duree="${m}">${duree(m)}</button>`).join('')}</div>
        <label class="champ">Salle
          <select id="f-salle">
            <option value="">— Aucune —</option>
            ${etat.salles.map((s) => `<option value="${s.id}" ${s.id === (existante ? existante.salleId : etat.salleParDefaut) ? 'selected' : ''}>${esc(s.nom)}</option>`).join('')}
          </select>
        </label>
        ${etat.salles.length ? '' : '<button class="btn-lien" id="f-chercher" style="align-self:flex-start">+ Ajouter ma salle de sport</button>'}
        <div class="champ">Ce que j’ai travaillé
          <div id="f-cat" style="margin-top:4px">${htmlChoixCategories(types)}</div>
        </div>
        <label class="champ">Note<textarea id="f-note" placeholder="Ressenti, forme du jour…">${esc(existante?.note || '')}</textarea></label>
        <button class="btn btn-principal btn-plein" id="f-ok">${existante ? 'Enregistrer' : 'Ajouter la séance'}</button>
      </div>`;
    el.querySelectorAll('[data-duree]').forEach((b) => (b.onclick = () => (el.querySelector('#f-duree').value = b.dataset.duree)));
    const zoneCat = el.querySelector('#f-cat');
    const majCat = () => { zoneCat.innerHTML = htmlChoixCategories(types); brancherChoixCategories(zoneCat, types, majCat); };
    brancherChoixCategories(zoneCat, types, majCat);
    const ch = el.querySelector('#f-chercher');
    if (ch) ch.onclick = () => { fermer(); aller('salles'); };
    el.querySelector('#f-ok').onclick = () => {
      const d = el.querySelector('#f-date').value;
      const minutes = Math.round(+el.querySelector('#f-duree').value);
      if (!d) return toast('Choisis une date');
      if (!(minutes > 0)) return toast('Indique une durée');
      const champs = {
        date: d, debut: el.querySelector('#f-debut').value || '18:00', duree: minutes,
        salleId: el.querySelector('#f-salle').value || null, types: [...types], note: el.querySelector('#f-note').value.trim(),
      };
      if (existante) {
        maj((e) => Object.assign(e.seances.find((x) => x.id === existante.id), champs));
        fermer();
        toast('Séance modifiée');
        return;
      }
      const seance = { id: uid(), ...champs, exercices: [], source: 'manuelle' };
      const calcul = calculerXpSeance(seance);
      seance.xp = calcul.total;
      let gain;
      maj((e) => {
        e.seances.push(seance);
        gain = ajouterXp(e, calcul.total, 'Séance', d, { seanceId: seance.id });
      });
      fermer();
      celebrer({ ...calcul, ...gain, kcal: caloriesSeance(seance) });
    };
  });
}

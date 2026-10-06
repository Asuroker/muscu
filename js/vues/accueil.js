import { etat, maj, esc, jour, duree, kg, salle, seancesTriees, dateCourte } from '../store.js';
import { entete, aller } from '../nav.js';
import { niveauActuel, titreNiveau, seancesSemaine, serieSemaines } from '../xp.js';
import { statutOuverture } from '../salles.js';
import { nomGroupe } from '../exercices.js';
import { ICONES } from '../ui.js';
import { totalCalories } from '../calories.js';
import { ajouterPoids, exporter, joursDepuisSauvegarde } from './progres.js';
import { ajouterSeanceManuelle } from './calendrier.js';
import { carteObjectifPoids } from './objectifs.js';
import { besoins, OBJECTIFS_NUTRI } from '../nutrition.js';

export function carteNiveau() {
  const n = niveauActuel();
  const pct = Math.round((n.xpDansNiveau / n.besoin) * 100);
  return `<div class="carte-niveau cliquable" data-aller="recompenses">
    <div class="ligne">
      <div class="badge-niveau"><div><small>NIV.</small>${n.niveau}</div></div>
      <div class="flex1">
        <div style="font-weight:800;font-size:19px">${esc(titreNiveau(n.niveau))}</div>
        <div class="discret">${n.total} XP au total</div>
      </div>
    </div>
    <div class="barre-xp"><div style="width:${pct}%"></div></div>
    <div class="ligne-entre tres-discret" style="margin-top:6px">
      <span>${n.xpDansNiveau} / ${n.besoin} XP</span><span>encore ${n.besoin - n.xpDansNiveau} XP pour le niveau ${n.niveau + 1}</span>
    </div>
  </div>`;
}

export function afficher(el) {
  entete('Accueil', `<button class="btn btn-icone" data-aller="reglages" aria-label="Réglages">${ICONES.reglages}</button>`);

  const semaine = seancesSemaine(jour());
  const minutesSemaine = semaine.reduce((t, s) => t + (s.duree || 0), 0);
  const serie = serieSemaines();
  const bons = etat.bons.filter((b) => !b.utiliseLe);
  const derniere = seancesTriees()[0];
  const sf = salle(etat.salleParDefaut);
  const statut = sf ? statutOuverture(sf.horaires) : null;
  const poids = [...etat.poids].sort((a, b) => a.date.localeCompare(b.date));
  const dernierPoids = poids[poids.length - 1];

  el.innerHTML = `
    ${bandeauSauvegarde()}
    ${carteNiveau()}

    ${bons.length ? `<div class="bon cliquable" style="margin-top:10px" data-aller="recompenses">
      <div class="emoji">${bons[0].emoji}</div>
      <div class="flex1"><div style="font-weight:700">${bons.length} bon${bons.length > 1 ? 's' : ''} à utiliser</div>
      <div class="discret">${esc(bons.map((b) => b.titre).slice(0, 2).join(', '))}${bons.length > 2 ? '…' : ''}</div></div>
      ${ICONES.chevron}
    </div>` : ''}

    <div class="pile" style="margin-top:14px">
      ${etat.enCours
        ? `<button class="btn btn-principal btn-plein" data-aller="seance">${ICONES.haltere} Reprendre la séance en cours</button>`
        : `<button class="btn btn-principal btn-plein" data-aller="seance">${ICONES.haltere} Commencer une séance</button>
           <button class="btn btn-plein" id="visite">${ICONES.plus} Noter une visite à la salle</button>`}
    </div>

    <h2>Cette semaine</h2>
    <div class="grille-2">
      <div class="stat"><div class="val">${semaine.length}</div><div class="lib">Séances</div></div>
      <div class="stat"><div class="val">${minutesSemaine ? duree(minutesSemaine) : '0'}</div><div class="lib">Temps</div></div>
      <div class="stat"><div class="val">${semaine.length ? Math.round(totalCalories(semaine)).toLocaleString('fr-FR') : '0'}</div><div class="lib">kcal dépensées</div></div>
      <div class="stat"><div class="val">${serie}${serie ? ' 🔥' : ''}</div><div class="lib">Sem. d'affilée</div></div>
    </div>

    <h2>Objectifs & nutrition</h2>
    ${etat.objectifs?.poids ? carteObjectifPoids({ compacte: true }) + '<div style="height:10px"></div>' : ''}
    <div class="grille-2">
      <div class="carte cliquable" data-aller="objectifs" style="margin:0">
        <div style="font-size:24px">🎯</div><div style="font-weight:700">Objectifs</div>
        <div class="tres-discret">${nbObjectifs() ? `${nbObjectifs()} en cours` : 'Poids, charges…'}</div>
      </div>
      <div class="carte cliquable" data-aller="nutrition" style="margin:0">
        <div style="font-size:24px">${OBJECTIFS_NUTRI[besoins().objectif].emoji}</div><div style="font-weight:700">Nutrition</div>
        <div class="tres-discret">${besoins().kcal.toLocaleString('fr-FR')} kcal / jour</div>
      </div>
    </div>

    <h2>Ma salle</h2>
    ${sf ? `<div class="carte cliquable" data-aller="salle/${sf.id}">
        <div class="ligne">
          <div class="vignette vide">${ICONES.lieu}</div>
          <div class="flex1">
            <div style="font-weight:700">${esc(sf.nom)}</div>
            <div class="${statut ? (statut.ouvert ? 'statut-ouvert' : 'statut-ferme') : 'discret'}" style="font-size:14px">
              ${statut ? esc(statut.texte) : 'Horaires non renseignés · touche pour les ajouter'}</div>
          </div>
          ${ICONES.chevron}
        </div>
      </div>`
      : `<div class="carte cliquable" data-aller="salles"><div class="ligne">
          <div class="vignette vide">${ICONES.recherche}</div>
          <div class="flex1"><div style="font-weight:700">Choisir ma salle de sport</div>
          <div class="discret">Recherche par ville ou autour de toi, avec les horaires.</div></div>${ICONES.chevron}</div></div>`}

    <h2>Poids corporel</h2>
    <div class="carte"><div class="ligne">
      <div class="flex1">
        ${dernierPoids
          ? `<div class="charge-plus">${kg(dernierPoids.kg)}</div><div class="discret">${dateCourte(dernierPoids.date)}${evolution(poids)}</div>`
          : '<div class="discret">Aucune pesée pour le moment.</div>'}
      </div>
      <button class="btn btn-petit" id="pesee">${ICONES.plus} Pesée</button>
      ${poids.length ? `<button class="btn btn-petit" data-aller="poids">Historique</button>` : ''}
    </div></div>

    ${derniere ? `<h2>Dernière séance</h2>
      <div class="carte cliquable" data-aller="seance-detail/${derniere.id}">
        <div class="ligne-entre"><strong>${dateCourte(derniere.date)} · ${esc(derniere.debut)}</strong><span class="etiquette accent">+${derniere.xp || 0} XP</span></div>
        <div class="discret">${duree(derniere.duree)}${salle(derniere.salleId) ? ' · ' + esc(salle(derniere.salleId).nom) : ''}</div>
        <div class="puces" style="margin-top:8px">${(derniere.types || []).map((t) => `<span class="etiquette">${esc(nomGroupe(t))}</span>`).join('')}</div>
      </div>` : ''}
  `;

  el.querySelectorAll('[data-aller]').forEach((b) => (b.onclick = () => aller(b.dataset.aller)));
  document.querySelectorAll('#actions-haut [data-aller]').forEach((b) => (b.onclick = () => aller(b.dataset.aller)));
  el.querySelector('#pesee').onclick = () => ajouterPoids();
  const sauv = el.querySelector('#sauvegarder');
  if (sauv) {
    sauv.onclick = () => exporter();
    el.querySelector('#plus-tard').onclick = () => maj((e) => (e.rappelSauvegardeReporte = jour()));
  }
  const v = el.querySelector('#visite');
  if (v) v.onclick = () => ajouterSeanceManuelle(jour());
}

/** Rappel si la dernière sauvegarde date de plus de 7 jours (ou n'a jamais été faite). */
function bandeauSauvegarde() {
  const aDesDonnees = etat.seances.length || etat.poids.length;
  const j = joursDepuisSauvegarde();
  if (!aDesDonnees || (j !== null && j < 7) || etat.rappelSauvegardeReporte === jour()) return '';
  return `<div class="carte" style="margin-bottom:12px;border-color:var(--or);background:var(--or-doux)">
    <div class="ligne" style="align-items:flex-start">
      <div style="font-size:28px">💾</div>
      <div class="flex1">
        <div style="font-weight:750">${j === null ? 'Sauvegarde tes données' : `Dernière sauvegarde il y a ${j} jours`}</div>
        <div class="discret">Tes séances sont seulement sur ce téléphone. Enregistre une copie dans <strong>Fichiers › iCloud Drive</strong>.</div>
      </div>
    </div>
    <div class="ligne" style="margin-top:10px">
      <button class="btn btn-or flex1" id="sauvegarder">Sauvegarder maintenant</button>
      <button class="btn" id="plus-tard">Plus tard</button>
    </div>
  </div>`;
}

const nbObjectifs = () => (etat.objectifs?.charges || []).filter((c) => !c.atteintLe).length + (etat.objectifs?.poids && !etat.objectifs.poids.atteintLe ? 1 : 0);

function evolution(poids) {
  if (poids.length < 2) return '';
  const d = poids[poids.length - 1].kg - poids[poids.length - 2].kg;
  if (Math.abs(d) < 0.05) return ' · stable';
  return ` · ${d > 0 ? '+' : '−'}${kg(Math.abs(d))}`;
}

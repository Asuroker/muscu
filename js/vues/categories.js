// Sélecteurs de catégories musculaires : groupes (Bras, Dos…) puis muscles précis.
import { GROUPES, ZONES, enfantsDe, MUSCLES_SEULS, estChoisi, basculerCategorie } from '../exercices.js';

const puce = (g, actif, attr) => `<button class="puce ${actif ? 'active' : ''}" ${attr}="${g.id}">${g.emoji} ${g.nom}</button>`;

/** Choix multiple (préparation de séance, séance notée à la main). */
export function htmlChoixCategories(sel) {
  const lignes = ZONES.filter((z) => enfantsDe(z.id).length).map((z) => [z.nom, enfantsDe(z.id)]);
  if (MUSCLES_SEULS.length) lignes.push(['Autres', MUSCLES_SEULS]);
  return `
    <div class="puces">${ZONES.map((z) => puce(z, sel.has(z.id), 'data-cat')).join('')}</div>
    <p class="tres-discret" style="margin:12px 2px 6px">Ou un muscle précis :</p>
    ${lignes.map(([nom, muscles]) => `<div class="ligne-cat">
      <span class="tres-discret">${nom}</span>
      <div class="puces defile">${muscles.map((m) => puce(m, estChoisi(sel, m.id), 'data-cat')).join('')}</div>
    </div>`).join('')}`;
}

export function brancherChoixCategories(conteneur, sel, apres) {
  conteneur.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => {
    basculerCategorie(sel, b.dataset.cat);
    apres();
  }));
}

/** Filtre à choix unique (bibliothèque d'exercices) : groupes, puis muscles du groupe choisi. */
export function htmlFiltreCategorie(actif) {
  const g = GROUPES.find((x) => x.id === actif);
  const zone = g ? (g.parent || (enfantsDe(g.id).length ? g.id : null)) : null;
  const zoneActive = g?.parent || g?.id || '';
  return `
    <div class="puces defile">
      <button class="puce ${actif ? '' : 'active'}" data-g="">Tous</button>
      ${ZONES.map((z) => puce(z, zoneActive === z.id, 'data-g')).join('')}
      ${MUSCLES_SEULS.map((m) => puce(m, actif === m.id, 'data-g')).join('')}
    </div>
    ${zone ? `<div class="puces defile" style="margin-top:2px">
      <button class="puce ${actif === zone ? 'active' : ''}" data-g="${zone}">Tout</button>
      ${enfantsDe(zone).map((m) => puce(m, actif === m.id, 'data-g')).join('')}
    </div>` : ''}`;
}

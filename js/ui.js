// Petits composants d'interface partagés.
import { esc, dateCourte } from './store.js';

export const ICONES = {
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  chevron: '<svg class="chevron" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  coche: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  poubelle: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  crayon: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  lieu: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  horloge: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  recherche: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  cible: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  melanger: '<svg viewBox="0 0 24 24"><path d="M4 7h3l10 10h3M4 17h3l3-3M14 10l3-3h3M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
  echange: '<svg viewBox="0 0 24 24"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
  haut: '<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>',
  bas: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  balance: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9a4 4 0 0 1 8 0zM12 9l1.5-2"/></svg>',
  haltere: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/></svg>',
  cadeau: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/></svg>',
  reglages: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  externe: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  etoile: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>',
};

export function toast(texte, type = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = texte;
  document.getElementById('toasts').append(el);
  setTimeout(() => el.remove(), 2600);
}

/** Ouvre une feuille en bas de l'écran. `remplir(el, fermer)` construit son contenu. */
export function ouvrirFeuille(remplir) {
  const fond = document.getElementById('feuille');
  fond.innerHTML = '<div class="feuille" role="dialog" aria-modal="true"><div class="poignee"></div><div class="contenu"></div></div>';
  fond.hidden = false;
  const fermer = () => { fond.hidden = true; fond.innerHTML = ''; fond.onclick = null; };
  fond.onclick = (e) => { if (e.target === fond) fermer(); };
  remplir(fond.querySelector('.contenu'), fermer);
  return fermer;
}

export function confirmer(message, { ok = 'Confirmer', danger = false } = {}) {
  return new Promise((resoudre) => {
    ouvrirFeuille((el, fermer) => {
      el.innerHTML = `<p style="font-size:17px;font-weight:600;margin:6px 0 16px">${esc(message)}</p>
        <div class="pile">
          <button class="btn btn-plein ${danger ? 'btn-danger' : 'btn-principal'}" data-r="1">${esc(ok)}</button>
          <button class="btn btn-plein" data-r="0">Annuler</button>
        </div>`;
      el.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => { fermer(); resoudre(b.dataset.r === '1'); }));
    });
  });
}

/** Graphique en courbe simple. points : [{date:'AAAA-MM-JJ', y:Number}] */
export function graphe(points, { unite = '', hauteur = 180 } = {}) {
  if (points.length < 2) {
    return '<p class="discret centre" style="padding:20px 0">Il faut au moins 2 valeurs pour afficher la courbe.</p>';
  }
  const L = 340, H = hauteur, mg = 34, mh = 12, mb = 24;
  const ys = points.map((p) => p.y);
  let min = Math.min(...ys), max = Math.max(...ys);
  if (min === max) { min -= 1; max += 1; }
  const marge = (max - min) * 0.12;
  min -= marge; max += marge;
  const t0 = new Date(points[0].date).getTime(), t1 = new Date(points[points.length - 1].date).getTime();
  const span = Math.max(1, t1 - t0);
  const X = (d) => mg + ((new Date(d).getTime() - t0) / span) * (L - mg - 8);
  const Y = (v) => mh + (1 - (v - min) / (max - min)) * (H - mh - mb);
  const chemin = points.map((p, i) => `${i ? 'L' : 'M'}${X(p.date).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const aire = `${chemin} L${X(points[points.length - 1].date).toFixed(1)},${H - mb} L${X(points[0].date).toFixed(1)},${H - mb} Z`;
  const graduations = [0, 0.5, 1].map((f) => min + marge + f * (max - min - 2 * marge));
  const fmt = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
  return `<div class="graphe"><svg viewBox="0 0 ${L} ${H}" role="img" aria-label="Évolution">
    ${graduations.map((v) => `<line class="axe" x1="${mg}" x2="${L - 4}" y1="${Y(v)}" y2="${Y(v)}" stroke-dasharray="3 4"/>
      <text class="texte-axe" x="${mg - 6}" y="${Y(v) + 4}" text-anchor="end">${fmt(v)}</text>`).join('')}
    <path class="aire" d="${aire}"/>
    <path class="courbe" d="${chemin}"/>
    ${points.length <= 40 ? points.map((p) => `<circle class="point" cx="${X(p.date)}" cy="${Y(p.y)}" r="4"><title>${dateCourte(p.date)} : ${fmt(p.y)} ${unite}</title></circle>`).join('') : ''}
    <text class="texte-axe" x="${mg}" y="${H - 6}">${dateCourte(points[0].date)}</text>
    <text class="texte-axe" x="${L - 4}" y="${H - 6}" text-anchor="end">${dateCourte(points[points.length - 1].date)}</text>
  </svg></div>`;
}

/** Fait vibrer le téléphone si possible (Android ; iOS ignore). */
export function vibrer(ms = 200) {
  try { navigator.vibrate?.(ms); } catch { /* rien */ }
}

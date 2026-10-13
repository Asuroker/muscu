// Emblèmes de prestige façon « métal » (inspirés des prestiges de Black Ops 2).
// Dessinés en SVG : forme de base en métal brossé, champ gravé, symbole en relief, reflet.

// Dégradés de métal : sombre → clair → reflet → clair → sombre.
const METAUX = {
  bronze: ['#3b2410', '#9a6a3a', '#f0bd86', '#a8733f', '#4e3218'],
  fer: ['#1b1f24', '#58616b', '#b3bcc6', '#5a626b', '#202429'],
  acier: ['#232c38', '#7a8ca2', '#eef5fc', '#8196ad', '#2a3442'],
  argent: ['#454a52', '#c4cbd3', '#ffffff', '#99a1aa', '#50565e'],
  or: ['#553805', '#d29e26', '#fff3b5', '#c18d1b', '#523606'],
  platine: ['#36414a', '#b4c3cd', '#f7fdff', '#a5b5c0', '#3e4a53'],
  obsidienne: ['#0d0709', '#4f121c', '#e0405a', '#661824', '#110809'],
  diamant: ['#0f2a40', '#4fb6f5', '#f2fdff', '#4b9ed6', '#12304a'],
};

export const PRESTIGES = [
  null,
  { nom: 'Prestige 1', metal: 'bronze', forme: 'bouclier', symbole: 'chevron', detail: 'Bronze' },
  { nom: 'Prestige 2', metal: 'bronze', forme: 'bouclier', symbole: 'deuxChevrons', ornement: 'etoiles', detail: 'Bronze gravé' },
  { nom: 'Prestige 3', metal: 'fer', forme: 'hexagone', symbole: 'haltere', detail: 'Fer' },
  { nom: 'Prestige 4', metal: 'acier', forme: 'hexagone', symbole: 'haltere', ornement: 'ailes', detail: 'Acier ailé' },
  { nom: 'Prestige 5', metal: 'argent', forme: 'etoile', symbole: 'haltere', detail: 'Argent' },
  { nom: 'Prestige 6', metal: 'argent', forme: 'bouclier', symbole: 'etoile', ornement: 'ailes', detail: 'Argent ailé' },
  { nom: 'Prestige 7', metal: 'or', forme: 'hexagone', symbole: 'haltere', ornement: 'laurier', detail: 'Or' },
  { nom: 'Prestige 8', metal: 'or', forme: 'etoile', symbole: 'couronne', ornement: 'ailes', detail: 'Or ailé' },
  { nom: 'Prestige 9', metal: 'platine', forme: 'bouclier', symbole: 'flamme', ornement: 'rayons', detail: 'Platine' },
  { nom: 'Prestige 10', metal: 'obsidienne', forme: 'etoile', symbole: 'crane', ornement: 'rayonsAiles', detail: 'Obsidienne' },
  { nom: 'Maître du prestige', metal: 'diamant', forme: 'losange', symbole: 'gemme', ornement: 'maitre', detail: 'Diamant' },
];

// ---------- Formes ----------
function etoile(cx, cy, R, r, branches, rotation = -90) {
  const pts = [];
  for (let i = 0; i < branches * 2; i++) {
    const a = ((rotation + (i * 180) / branches) * Math.PI) / 180;
    const rayon = i % 2 ? r : R;
    pts.push(`${(cx + rayon * Math.cos(a)).toFixed(1)},${(cy + rayon * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

const FORMES = {
  bouclier: 'M50 7 L85 18 V47 C85 70 69 86 50 94 C31 86 15 70 15 47 V18 Z',
  hexagone: 'M50 6 L88 28 V72 L50 94 L12 72 V28 Z',
  etoile: etoile(50, 53, 46, 22, 5),
  losange: 'M50 4 L92 50 L50 96 L8 50 Z',
};

// Réduit une forme autour du centre pour le champ gravé intérieur.
const interieur = (d, f = 0.78) => `<path d="${d}" transform="translate(${50 * (1 - f)} ${52 * (1 - f)}) scale(${f})"/>`;

// ---------- Symboles en relief ----------
const SYMBOLES = {
  chevron: '<path d="M33 40 L50 53 L67 40 L67 51 L50 64 L33 51 Z"/>',
  deuxChevrons: '<path d="M33 33 L50 45 L67 33 L67 42 L50 54 L33 42 Z"/><path d="M33 50 L50 62 L67 50 L67 59 L50 71 L33 59 Z"/>',
  haltere: '<rect x="31" y="48" width="38" height="5" rx="1.5"/><rect x="31" y="37" width="7" height="27" rx="2"/><rect x="62" y="37" width="7" height="27" rx="2"/><rect x="26" y="42" width="5" height="17" rx="1.5"/><rect x="69" y="42" width="5" height="17" rx="1.5"/>',
  etoile: `<path d="${etoile(50, 51, 17, 7, 5)}"/>`,
  couronne: '<path d="M31 63 L29 41 L40 50 L50 34 L60 50 L71 41 L69 63 Z"/><rect x="30" y="64" width="40" height="5" rx="1.5"/>',
  flamme: '<path d="M50 29 C59 39 67 46 63 58 C61 66 55 71 50 71 C44 71 38 67 37 59 C36 51 42 46 44 40 C46 46 48 48 50 49 C48 42 48 36 50 29 Z"/>',
  crane: '<path d="M50 31 C40 31 34 38 34 47 C34 53 37 57 41 59 V65 H59 V59 C63 57 66 53 66 47 C66 38 60 31 50 31 Z"/><g fill="#0b0b0d"><circle cx="43.5" cy="47" r="4.6"/><circle cx="56.5" cy="47" r="4.6"/><path d="M50 52 L47.5 57 H52.5 Z"/><rect x="44" y="61" width="2" height="4"/><rect x="49" y="61" width="2" height="4"/><rect x="54" y="61" width="2" height="4"/></g>',
  gemme: '<path d="M50 30 L64 45 L50 70 L36 45 Z"/><path d="M36 45 H64 M50 30 L45 45 L50 70 L55 45 Z" fill="none" stroke="#0b2236" stroke-width="1.2" opacity=".6"/>',
};

// ---------- Ornements derrière la forme ----------
const AILE = 'M37 40 C26 29 12 27 1 30 C9 34 13 38 15 42 C9 42 5 44 1 49 C11 48 17 50 21 52 C15 55 11 59 9 64 C19 61 28 58 36 56 Z';
const ailes = (m) => `<g fill="url(#${m})" stroke="#000" stroke-opacity=".45" stroke-width="1"><path d="${AILE}"/><path d="${AILE}" transform="translate(100 0) scale(-1 1)"/></g>`;

function laurier(m) {
  let feuilles = '';
  for (let i = 0; i < 7; i++) {
    const a = ((140 + i * 15) * Math.PI) / 180;
    const x = 50 + 47 * Math.cos(a), y = 55 + 42 * Math.sin(a);
    const rot = 140 + i * 15 + 90;
    feuilles += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="3.2" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return `<g fill="url(#${m})" stroke="#000" stroke-opacity=".4" stroke-width=".8">${feuilles}<g transform="translate(100 0) scale(-1 1)">${feuilles}</g></g>`;
}

const rayons = (m) => `<path d="${etoile(50, 52, 50, 36, 12, -90)}" fill="url(#${m})" stroke="#000" stroke-opacity=".45" stroke-width="1"/>`;

const ORNEMENTS = {
  ailes,
  laurier,
  rayons,
  etoiles: (m) => `<g fill="url(#${m})" stroke="#000" stroke-opacity=".4" stroke-width=".8"><path d="${etoile(11, 22, 8, 3.5, 5)}"/><path d="${etoile(89, 22, 8, 3.5, 5)}"/></g>`,
  rayonsAiles: (m) => rayons(m) + ailes(m),
  maitre: (m) => `${laurier('or-orn')}${ailes(m)}<path d="M33 9 L36 1 L43 6 L50 0 L57 6 L64 1 L67 9 Z" fill="url(#or-orn)" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>`,
};

function degrade(id, couleurs, angle = 35) {
  const stops = couleurs.map((c, i) => `<stop offset="${(i / (couleurs.length - 1)) * 100}%" stop-color="${c}"/>`).join('');
  return `<linearGradient id="${id}" gradientTransform="rotate(${angle} .5 .5)">${stops}</linearGradient>`;
}

/** SVG de l'emblème d'un rang de prestige (1 à 11). `verrouille` : version grisée. */
export function embleme(rang, taille = 64, { verrouille = false } = {}) {
  const p = PRESTIGES[rang];
  if (!p) return '';
  const metal = METAUX[p.metal];
  const id = `pm${rang}`;
  const sombre = metal.map((c) => c).reverse();
  const forme = FORMES[p.forme];
  const defs = `<defs>
      ${degrade(id, metal)}
      ${degrade(id + 'c', [sombre[0], sombre[1], sombre[0]], 90)}
      ${degrade(id + 's', [metal[2], metal[1], metal[3], metal[2]], 120)}
      ${degrade('or-orn', METAUX.or)}
      <radialGradient id="${id}r" cx=".3" cy=".2" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>`;
  return `<svg class="embleme${verrouille ? ' verrouille' : ''}" viewBox="0 0 100 100" width="${taille}" height="${taille}" style="width:${taille}px;height:${taille}px" role="img" aria-label="${p.nom}">
    ${defs}
    ${p.ornement ? ORNEMENTS[p.ornement](id) : ''}
    <path d="${forme}" fill="url(#${id})" stroke="#000" stroke-opacity=".55" stroke-width="2"/>
    <g fill="url(#${id}c)" stroke="${metal[2]}" stroke-opacity=".5" stroke-width="1.2">${interieur(forme)}</g>
    <g fill="url(#${id}s)" stroke="#000" stroke-opacity=".5" stroke-width="1">${SYMBOLES[p.symbole]}</g>
    <path d="${forme}" fill="url(#${id}r)"/>
  </svg>`;
}

export const nomPrestige = (rang) => PRESTIGES[rang]?.nom || '';

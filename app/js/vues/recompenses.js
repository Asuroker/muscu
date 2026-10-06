import { etat, maj, esc, dateCourte, jour } from '../store.js';
import { entete } from '../nav.js';
import { niveauActuel, recompensePourNiveau, titreNiveau } from '../xp.js';
import { ICONES, ouvrirFeuille, confirmer, toast } from '../ui.js';
import { carteNiveau } from './accueil.js';
import { fmtKcal } from '../calories.js';

const fmtDate = (iso) => dateCourte(jour(new Date(iso)));

export function afficher(el) {
  entete('Récompenses');
  const dispo = etat.bons.filter((b) => !b.utiliseLe).sort((a, b) => a.niveau - b.niveau);
  const utilises = etat.bons.filter((b) => b.utiliseLe).sort((a, b) => b.utiliseLe.localeCompare(a.utiliseLe));
  const n = niveauActuel().niveau;
  const prochains = Array.from({ length: 5 }, (_, i) => n + 1 + i).map((niv) => ({ niv, r: recompensePourNiveau(niv) })).filter((x) => x.r);

  el.innerHTML = `
    ${carteNiveau()}

    <h2>Mes bons ${dispo.length ? `<span class="etiquette or">${dispo.length}</span>` : ''}</h2>
    ${dispo.length ? `<div class="pile">${dispo.map((b) => `<div class="bon">
        <div class="emoji">${esc(b.emoji)}</div>
        <div class="flex1"><div style="font-weight:750">${esc(b.titre)}</div><div class="tres-discret">Gagné au niveau ${b.niveau} · ${fmtDate(b.gagneLe)}</div></div>
        <button class="btn btn-petit btn-or" data-utiliser="${b.id}">Utiliser</button>
      </div>`).join('')}</div>`
      : '<p class="discret">Pas de bon pour le moment. Va à la salle pour gagner de l’XP et monter de niveau 💪</p>'}

    <h2>Prochaines récompenses</h2>
    <div class="liste">${prochains.map(({ niv, r }) => `<div class="item" style="cursor:default">
      <div class="vignette vide" style="font-size:24px">${esc(r.emoji)}</div>
      <div class="flex1"><div class="titre">${esc(r.titre)}</div><div class="sous">Niveau ${niv} · ${esc(titreNiveau(niv))}</div></div>
    </div>`).join('')}</div>

    <h2>Comment gagner de l’XP</h2>
    <div class="carte"><table class="horaires">
      <tr><td>Aller à la salle (séance)</td><td>+50 XP</td></tr>
      <tr><td>Chaque minute d’entraînement (max. 120)</td><td>+1 XP</td></tr>
      <tr><td>Chaque série validée (max. 40)</td><td>+5 XP</td></tr>
      <tr><td>Nouveau record sur un exercice</td><td>+25 XP</td></tr>
      <tr><td>3e séance de la semaine</td><td>+50 XP</td></tr>
      <tr><td>Pesée (1 par jour)</td><td>+5 XP</td></tr>
      <tr><td>Toute première séance</td><td>+100 XP</td></tr>
    </table></div>

    <h2>Règles des récompenses</h2>
    <p class="discret">À chaque niveau gagné, tu reçois un bon. La règle avec le plus grand « tous les » qui tombe juste l’emporte.</p>
    <div class="liste">${[...etat.regles].sort((a, b) => b.tous - a.tous).map((r) => `<div class="item" data-regle="${etat.regles.indexOf(r)}">
      <div class="vignette vide" style="font-size:24px">${esc(r.emoji)}</div>
      <div class="flex1"><div class="titre">${esc(r.titre)}</div><div class="sous">${r.tous === 1 ? 'À chaque niveau' : `Tous les ${r.tous} niveaux`}</div></div>
      ${ICONES.crayon}
    </div>`).join('')}</div>
    <button class="btn btn-plein" id="nouvelle" style="margin-top:10px">${ICONES.plus} Nouvelle récompense</button>

    ${utilises.length ? `<h2>Bons utilisés</h2><div class="pile">${utilises.slice(0, 30).map((b) => `<div class="bon utilise">
      <div class="emoji">${esc(b.emoji)}</div>
      <div class="flex1"><div style="font-weight:700">${esc(b.titre)}</div><div class="tres-discret">Utilisé le ${fmtDate(b.utiliseLe)}</div></div>
    </div>`).join('')}</div>` : ''}
  `;

  el.querySelectorAll('[data-utiliser]').forEach((b) => (b.onclick = async () => {
    const bon = etat.bons.find((x) => x.id === b.dataset.utiliser);
    if (!(await confirmer(`Utiliser ton bon « ${bon.titre} » maintenant ? Profite bien 😋`, { ok: 'Utiliser le bon' }))) return;
    maj((e) => (e.bons.find((x) => x.id === bon.id).utiliseLe = new Date().toISOString()));
    toast(`${bon.emoji} Bon utilisé, régale-toi !`, 'or');
  }));
  el.querySelectorAll('[data-regle]').forEach((b) => (b.onclick = () => editerRegle(+b.dataset.regle)));
  el.querySelector('#nouvelle').onclick = () => editerRegle(-1);
}

function editerRegle(i) {
  const r = i >= 0 ? etat.regles[i] : { tous: 2, emoji: '🍦', titre: '' };
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>${i >= 0 ? 'Modifier la récompense' : 'Nouvelle récompense'}</h2>
      <div class="pile">
        <div class="grille-2" style="grid-template-columns:90px 1fr">
          <label class="champ">Emoji<input type="text" id="r-emoji" value="${esc(r.emoji)}" maxlength="4" style="text-align:center;font-size:22px"></label>
          <label class="champ">Récompense<input type="text" id="r-titre" value="${esc(r.titre)}" placeholder="ex. Glace"></label>
        </div>
        <label class="champ">Tous les combien de niveaux ?<input type="number" id="r-tous" inputmode="numeric" min="1" max="100" value="${r.tous}"></label>
        <button class="btn btn-principal btn-plein" id="r-ok">Enregistrer</button>
        ${i >= 0 ? `<button class="btn btn-plein btn-danger" id="r-suppr">${ICONES.poubelle} Supprimer</button>` : ''}
      </div>`;
    el.querySelector('#r-ok').onclick = () => {
      const nv = {
        emoji: el.querySelector('#r-emoji').value.trim() || '🎁',
        titre: el.querySelector('#r-titre').value.trim(),
        tous: Math.max(1, Math.round(+el.querySelector('#r-tous').value || 1)),
      };
      if (!nv.titre) return toast('Donne un nom à la récompense');
      maj((e) => (i >= 0 ? (e.regles[i] = nv) : e.regles.push(nv)));
      fermer();
    };
    const s = el.querySelector('#r-suppr');
    if (s) s.onclick = () => { maj((e) => e.regles.splice(i, 1)); fermer(); };
  });
}

/** Écran de fin : XP gagnée, niveaux et bons. */
export function celebrer({ lignes = [], total = 0, niveaux = [], bons = [], kcal = null }) {
  ouvrirFeuille((el, fermer) => {
    const n = niveauActuel();
    el.innerHTML = `
      <div class="celebration">
        <div class="grand">${niveaux.length ? '🏆' : '💪'}</div>
        <div style="font-size:24px;font-weight:850;margin-top:4px">${niveaux.length ? `Niveau ${niveaux[niveaux.length - 1]} atteint !` : 'Bien joué !'}</div>
        <div class="discret">${niveaux.length ? esc(titreNiveau(niveaux[niveaux.length - 1])) : `Niveau ${n.niveau} · encore ${n.besoin - n.xpDansNiveau} XP`}</div>
      </div>
      ${kcal ? `<div class="stat centre" style="margin-top:10px"><div class="val">🔥 ${fmtKcal(kcal.total)}</div>
        <div class="lib">dépensées${kcal.estime ? ' · estimation pour 75 kg, ajoute une pesée' : ` · pour ${String(kcal.poids).replace('.', ',')} kg`}</div></div>` : ''}
      <div class="carte" style="margin-top:10px">
        <table class="horaires">${lignes.map((l) => `<tr><td>${esc(l.lib)}</td><td>+${l.xp} XP</td></tr>`).join('')}
          <tr><td><strong>Total</strong></td><td><strong style="color:var(--or)">+${total} XP</strong></td></tr></table>
      </div>
      ${bons.length ? `<h2>Nouveau${bons.length > 1 ? 'x' : ''} bon${bons.length > 1 ? 's' : ''} débloqué${bons.length > 1 ? 's' : ''} 🎁</h2>
        <div class="pile">${bons.map((b) => `<div class="bon"><div class="emoji">${esc(b.emoji)}</div><div class="flex1"><div style="font-weight:750">${esc(b.titre)}</div><div class="tres-discret">À utiliser quand tu veux</div></div></div>`).join('')}</div>` : ''}
      <button class="btn btn-principal btn-plein" id="c-ok" style="margin-top:16px">Super !</button>`;
    el.querySelector('#c-ok').onclick = fermer;
  });
}

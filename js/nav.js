// Navigation et barre du haut, partagées par toutes les vues.

/** Définit le titre et les boutons de la barre du haut. */
export function entete(texte, boutonsHtml = '') {
  document.getElementById('titre-page').textContent = texte;
  document.title = texte === 'Accueil' ? 'Muscu' : `${texte} · Muscu`;
  document.getElementById('actions-haut').innerHTML = boutonsHtml;
}

export function aller(chemin) {
  location.hash = '#/' + chemin;
}

/** Temps écoulé depuis un horodatage, au format 12:34 ou 1:02:03. */
export function chrono(debutTs) {
  const s = Math.max(0, Math.floor((Date.now() - debutTs) / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const z = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${z(m)}:${z(sec)}` : `${z(m)}:${z(sec)}`;
}

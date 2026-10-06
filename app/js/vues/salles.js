import { etat, maj, esc, uid } from '../store.js';
import { entete, aller } from '../nav.js';
import {
  geocoder, maPosition, chercherSalles, statutOuverture, texteJour, JOURS, horairesVides,
  lienPlans, lienRechercheHoraires, lireHorairesOsm,
} from '../salles.js';
import { ICONES, ouvrirFeuille, confirmer, toast } from '../ui.js';
import { urlSure } from '../validation.js';

const recherche = { lieu: '', nom: '', resultats: null, message: '', enCours: false };

function statutHtml(s) {
  const st = statutOuverture(s.horaires);
  if (!st) return '<span class="discret">Horaires non renseignés</span>';
  return `<span class="${st.ouvert ? 'statut-ouvert' : 'statut-ferme'}">${esc(st.texte)}</span>`;
}

export function afficher(el) {
  entete('Mes salles');
  el.innerHTML = `
    ${etat.salles.length ? `<div class="liste">${etat.salles.map((s) => `<a class="item" href="#/salle/${s.id}">
        <div class="vignette vide">${s.id === etat.salleParDefaut ? '⭐' : ICONES.lieu}</div>
        <div class="flex1"><div class="titre">${esc(s.nom)}</div><div class="sous">${statutHtml(s)}</div></div>${ICONES.chevron}
      </a>`).join('')}</div>` : ''}

    <h2>Trouver une salle</h2>
    <div class="pile">
      <label class="champ">Ville ou adresse<input type="text" id="lieu" placeholder="ex. Foetz, Esch-sur-Alzette…" value="${esc(recherche.lieu)}" enterkeyhint="search"></label>
      <label class="champ">Nom de la salle (facultatif)<input type="text" id="nom" placeholder="ex. Basic-Fit" value="${esc(recherche.nom)}" enterkeyhint="search"></label>
      <div class="grille-2">
        <button class="btn btn-principal" id="go">${ICONES.recherche} Rechercher</button>
        <button class="btn" id="autour">${ICONES.cible} Autour de moi</button>
      </div>
    </div>
    <div id="resultats" style="margin-top:14px"></div>
    <p class="tres-discret" style="margin-top:16px">Données © contributeurs OpenStreetMap. Si ta salle n’apparaît pas, tu peux l’ajouter à la main.</p>
    <button class="btn btn-plein" id="manuel">${ICONES.plus} Ajouter une salle à la main</button>
  `;

  const zone = el.querySelector('#resultats');
  const dessiner = () => {
    if (recherche.enCours) { zone.innerHTML = '<div class="chargement"><div class="rond-charge"></div>Recherche des salles…</div>'; return; }
    if (recherche.message) { zone.innerHTML = `<p class="discret">${esc(recherche.message)}</p>`; return; }
    if (!recherche.resultats) { zone.innerHTML = ''; return; }
    if (!recherche.resultats.length) { zone.innerHTML = '<p class="discret">Aucune salle trouvée. Essaie une autre ville, sans nom, ou ajoute-la à la main.</p>'; return; }
    zone.innerHTML = `<div class="liste">${recherche.resultats.slice(0, 30).map((s, i) => {
      const deja = etat.salles.some((x) => x.osm === s.osm);
      return `<div class="item" style="cursor:default">
        <div class="flex1">
          <div class="titre">${esc(s.nom)}</div>
          <div class="sous">${s.distance.toFixed(1).replace('.', ',')} km${s.adresse ? ' · ' + esc(s.adresse) : ''}</div>
          <div class="sous">${statutHtml(s)}</div>
        </div>
        ${deja ? '<span class="etiquette vert">Ajoutée</span>' : `<button class="btn btn-petit btn-principal" data-ajout="${i}">Ajouter</button>`}
      </div>`;
    }).join('')}</div>`;
    zone.querySelectorAll('[data-ajout]').forEach((b) => (b.onclick = () => {
      const r = recherche.resultats[+b.dataset.ajout];
      const nouvelle = { id: uid(), ...r };
      delete nouvelle.distance;
      maj((e) => {
        e.salles.push(nouvelle);
        if (!e.salleParDefaut) e.salleParDefaut = nouvelle.id;
      }, { silencieux: true });
      toast(nouvelle.horaires ? 'Salle ajoutée' : 'Salle ajoutée · ajoute ses horaires');
      aller('salle/' + nouvelle.id);
    }));
  };
  dessiner();

  const lancer = async (obtenirCentre) => {
    recherche.lieu = el.querySelector('#lieu').value.trim();
    recherche.nom = el.querySelector('#nom').value.trim();
    recherche.enCours = true; recherche.message = ''; dessiner();
    try {
      const centre = await obtenirCentre();
      if (!centre) throw new Error('Lieu introuvable. Vérifie l’orthographe.');
      recherche.resultats = await chercherSalles({ ...centre, nom: recherche.nom, rayon: recherche.nom ? 15000 : 8000 });
    } catch (e) {
      recherche.resultats = null;
      recherche.message = e.name === 'AbortError' || e.message === 'Failed to fetch' || e.message.startsWith('HTTP')
        ? 'Le service de recherche ne répond pas. Vérifie ta connexion et réessaie dans un instant.'
        : e.message;
    }
    recherche.enCours = false;
    dessiner();
  };
  el.querySelector('#go').onclick = () => {
    const lieu = el.querySelector('#lieu').value.trim();
    if (!lieu) return toast('Indique une ville ou une adresse');
    lancer(() => geocoder(lieu));
  };
  el.querySelector('#autour').onclick = () => lancer(maPosition);
  ['#lieu', '#nom'].forEach((s) => (el.querySelector(s).onkeydown = (e) => { if (e.key === 'Enter') el.querySelector('#go').click(); }));
  el.querySelector('#manuel').onclick = () => editerInfos(null);
}

export function afficherSalle(el, [id]) {
  const s = etat.salles.find((x) => x.id === id);
  if (!s) { entete('Salle'); el.innerHTML = '<p class="discret">Salle introuvable.</p>'; return; }
  entete('Salle', `<button class="btn btn-icone" id="modif" aria-label="Modifier">${ICONES.crayon}</button>`);
  const auj = (new Date().getDay() + 6) % 7;
  const visites = etat.seances.filter((x) => x.salleId === s.id);
  el.innerHTML = `
    <div class="carte">
      <div style="font-size:20px;font-weight:800">${esc(s.nom)}</div>
      ${s.adresse ? `<div class="discret">${esc(s.adresse)}</div>` : ''}
      <div style="margin-top:8px">${statutHtml(s)}</div>
      ${s.id === etat.salleParDefaut ? '<span class="etiquette or" style="margin-top:8px">⭐ Ma salle principale</span>' : ''}
    </div>

    <h2>Horaires d’ouverture</h2>
    ${s.horaires ? `<div class="carte"><table class="horaires">${JOURS.map((j, i) => `<tr class="${i === auj ? 'auj' : ''}"><td>${j}</td><td>${esc(texteJour(s.horaires[i]))}</td></tr>`).join('')}</table></div>`
      : `<div class="carte"><p class="discret" style="margin:0">Les horaires de cette salle ne sont pas connus d’OpenStreetMap${s.horairesOsm ? ` (« ${esc(s.horairesOsm)} » non reconnu)` : ''}. Saisis-les une fois, l’app s’en souviendra.</p></div>`}
    <div class="grille-2" style="margin-top:10px">
      <button class="btn" id="horaires">${ICONES.horloge} ${s.horaires ? 'Modifier' : 'Saisir'} les horaires</button>
      <a class="btn" href="${lienRechercheHoraires(s)}" target="_blank" rel="noopener">${ICONES.externe} Voir en ligne</a>
    </div>

    <h2>Infos</h2>
    <div class="liste">
      ${s.lat ? `<a class="item" href="${lienPlans(s)}" target="_blank" rel="noopener">${ICONES.lieu}<div class="flex1">Itinéraire dans Plans</div>${ICONES.chevron}</a>` : ''}
      ${urlSure(s.site) ? `<a class="item" href="${esc(urlSure(s.site))}" target="_blank" rel="noopener">${ICONES.externe}<div class="flex1">Site web</div>${ICONES.chevron}</a>` : ''}
      ${s.tel ? `<a class="item" href="tel:${esc(s.tel.replace(/\s/g, ''))}">📞<div class="flex1">${esc(s.tel)}</div>${ICONES.chevron}</a>` : ''}
      <div class="item" style="cursor:default">🏋️<div class="flex1">${visites.length} séance${visites.length > 1 ? 's' : ''} dans cette salle</div></div>
    </div>

    <div class="pile" style="margin-top:16px">
      ${s.id === etat.salleParDefaut ? '' : `<button class="btn btn-plein" id="defaut">⭐ En faire ma salle principale</button>`}
      <button class="btn btn-plein btn-danger" id="suppr">${ICONES.poubelle} Retirer cette salle</button>
    </div>
  `;
  el.querySelector('#horaires').onclick = () => editerHoraires(s);
  document.getElementById('modif').onclick = () => editerInfos(s);
  const d = el.querySelector('#defaut');
  if (d) d.onclick = () => maj((e) => (e.salleParDefaut = s.id));
  el.querySelector('#suppr').onclick = async () => {
    if (!(await confirmer(`Retirer « ${s.nom} » ? Tes séances passées sont conservées.`, { ok: 'Retirer', danger: true }))) return;
    maj((e) => {
      e.salles = e.salles.filter((x) => x.id !== s.id);
      if (e.salleParDefaut === s.id) e.salleParDefaut = e.salles[0]?.id || null;
    }, { silencieux: true });
    history.back();
  };
}

function editerHoraires(s) {
  const h = (s.horaires || horairesVides()).map((p) => (p.length ? [...p[0]] : null));
  ouvrirFeuille((el, fermer) => {
    const dessiner = () => {
      el.innerHTML = `<h2>Horaires · ${esc(s.nom)}</h2>
        <div class="puces" style="margin-bottom:12px">
          <button class="puce" id="h24">24 h/24, 7 j/7</button>
          <button class="puce" id="copier">Copier lundi sur lun.–ven.</button>
        </div>
        ${JOURS.map((j, i) => `<div class="bouton-carte-jour">
          <strong style="font-size:14px">${j.slice(0, 3)}.</strong>
          ${h[i] ? `<div class="grille-2"><input type="time" data-o="${i}" value="${h[i][0]}"><input type="time" data-f="${i}" value="${h[i][1] === '24:00' ? '23:59' : h[i][1]}"></div>`
            : '<div class="discret">Fermé</div>'}
          <button class="btn btn-petit" data-bascule="${i}">${h[i] ? 'Fermé' : 'Ouvert'}</button>
        </div>`).join('')}
        <p class="tres-discret">Astuce : les horaires exacts sont sur le site de ta salle (bouton « Voir en ligne »).</p>
        <button class="btn btn-principal btn-plein" id="ok">Enregistrer</button>`;
      el.querySelectorAll('[data-o]').forEach((x) => (x.onchange = () => (h[x.dataset.o][0] = x.value)));
      el.querySelectorAll('[data-f]').forEach((x) => (x.onchange = () => (h[x.dataset.f][1] = x.value)));
      el.querySelectorAll('[data-bascule]').forEach((b) => (b.onclick = () => {
        const i = +b.dataset.bascule;
        h[i] = h[i] ? null : ['08:00', '22:00'];
        dessiner();
      }));
      el.querySelector('#h24').onclick = () => { for (let i = 0; i < 7; i++) h[i] = ['00:00', '24:00']; dessiner(); };
      el.querySelector('#copier').onclick = () => { for (let i = 1; i < 5; i++) h[i] = h[0] ? [...h[0]] : null; dessiner(); };
      el.querySelector('#ok').onclick = () => {
        maj((e) => {
          const x = e.salles.find((y) => y.id === s.id);
          x.horaires = h.map((p) => (p ? [[p[0], p[1] === '23:59' ? '24:00' : p[1]]] : []));
        });
        fermer();
        toast('Horaires enregistrés');
      };
    };
    dessiner();
  });
}

function editerInfos(s) {
  ouvrirFeuille((el, fermer) => {
    el.innerHTML = `<h2>${s ? 'Modifier la salle' : 'Nouvelle salle'}</h2>
      <div class="pile">
        <label class="champ">Nom<input type="text" id="i-nom" value="${esc(s?.nom || '')}" placeholder="ex. Basic-Fit Foetz"></label>
        <label class="champ">Adresse<input type="text" id="i-adr" value="${esc(s?.adresse || '')}"></label>
        <label class="champ">Site web<input type="text" id="i-site" value="${esc(s?.site || '')}" placeholder="https://…" inputmode="url"></label>
        <label class="champ">Horaires au format OpenStreetMap (facultatif)<input type="text" id="i-osm" value="${esc(s?.horairesOsm || '')}" placeholder="Mo-Fr 06:00-22:00; Sa,Su 08:00-20:00"></label>
        <button class="btn btn-principal btn-plein" id="i-ok">Enregistrer</button>
      </div>`;
    el.querySelector('#i-ok').onclick = () => {
      const nom = el.querySelector('#i-nom').value.trim();
      if (!nom) return toast('Donne un nom à la salle');
      const osmTxt = el.querySelector('#i-osm').value.trim();
      let site = el.querySelector('#i-site').value.trim();
      if (site && !/^https?:\/\//i.test(site)) site = 'https://' + site;
      if (site && !urlSure(site)) return toast('Adresse du site invalide');
      const champs = { nom, adresse: el.querySelector('#i-adr').value.trim(), site: urlSure(site) };
      if (osmTxt !== (s?.horairesOsm || '')) {
        const lu = lireHorairesOsm(osmTxt);
        if (osmTxt && !lu) return toast('Format d’horaires non reconnu');
        champs.horairesOsm = osmTxt;
        champs.horaires = lu;
      }
      let id = s?.id;
      maj((e) => {
        if (s) Object.assign(e.salles.find((x) => x.id === s.id), champs);
        else {
          id = uid();
          e.salles.push({ id, osm: null, marque: '', ville: '', lat: null, lon: null, tel: '', horairesOsm: '', horaires: null, ...champs });
          if (!e.salleParDefaut) e.salleParDefaut = id;
        }
      }, { silencieux: !s });
      fermer();
      if (!s) aller('salle/' + id);
    };
  });
}

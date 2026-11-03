// Marche dehors : saisie des pas (à la main ou collés depuis un Raccourci Apple qui lit l'app Santé).
import { etat, maj, esc, uid, jour, heure } from '../store.js';
import { aller } from '../nav.js';
import { calculerXpSeance, ajouterXp } from '../xp.js';
import { caloriesSeance, fmtKcal } from '../calories.js';
import { ouvrirFeuille, toast, estIOS } from '../ui.js';
import { celebrer } from './recompenses.js';

export const PAS_PAR_MINUTE = 100; // rythme de marche moyen

/** Longueur d'un pas (m) : ≈ 41,5 % de la taille, sinon 0,75 m. */
export const foulee = () => (etat.profil?.taille ? (etat.profil.taille * 0.415) / 100 : 0.75);
export const kmDepuisPas = (pas) => Math.round(((pas * foulee()) / 1000) * 100) / 100;

const nombre = (v) => String(v).replace('.', ',');
const lire = (v) => {
  const n = parseFloat(String(v).replace(/[\s  ]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Lit le texte copié par le Raccourci (« MUSCU;pas=8423;km=6,1;min=72 »)
 * ou, à défaut, un simple texte contenant le nombre de pas puis la distance.
 */
export function lireTexteSante(texte) {
  const t = String(texte || '');
  const champ = (nom) => {
    // Chiffres, virgule ou point, et espaces de milliers (pas de retour à la ligne).
    const m = t.match(new RegExp(`${nom}\\s*[=:]\\s*([\\d \\u202f\\u00a0.,]+)`, 'i'));
    return m ? lire(m[1]) : 0;
  };
  let pas = champ('pas'), km = champ('km'), min = champ('min');
  if (!pas) {
    const nombres = (t.match(/\d[\d   ]*(?:[.,]\d+)?/g) || []).map(lire);
    pas = nombres.find((n) => n >= 100) || 0;
    km = km || nombres.find((n) => n > 0 && n < 100) || 0;
  }
  return { pas: Math.round(pas), km: Math.round(km * 100) / 100, min: Math.round(min) };
}

/** Feuille d'ajout / modification d'une marche dehors. */
export function ajouterMarche(date = jour(), existante = null) {
  const m = existante?.marche || {};
  const v = {
    date: existante?.date || date,
    debut: existante?.debut || heure(new Date(Date.now() - 3600000)),
    pas: m.pas || '', km: m.km || '', duree: existante?.duree || '', note: existante?.note || '', source: m.source || 'manuel',
  };

  ouvrirFeuille((el, fermer) => {
    const dessiner = () => {
      const pas = lire(v.pas);
      const km = lire(v.km) || (pas ? kmDepuisPas(pas) : 0);
      const minutes = lire(v.duree) || (pas ? Math.round(pas / PAS_PAR_MINUTE) : 0);
      const apercu = pas || km ? estimation({ date: v.date, pas, km, minutes }) : null;
      el.innerHTML = `<h2>🚶 Marche dehors</h2>
        <div class="pile">
          <button class="btn btn-plein" id="m-coller">📋 Coller depuis Santé</button>
          <div class="grille-2">
            <label class="champ">Nombre de pas<input type="text" inputmode="numeric" id="m-pas" value="${esc(v.pas)}" placeholder="ex. 8 400"></label>
            <label class="champ">Distance (km)<input type="text" inputmode="decimal" id="m-km" value="${esc(v.km)}" placeholder="${pas ? '≈ ' + nombre(kmDepuisPas(pas)) : 'facultatif'}"></label>
          </div>
          <div class="grille-3">
            <label class="champ">Date<input type="date" id="m-date" value="${esc(v.date)}" max="${jour()}"></label>
            <label class="champ">Départ<input type="time" id="m-debut" value="${esc(v.debut)}"></label>
            <label class="champ">Durée (min)<input type="text" inputmode="numeric" id="m-duree" value="${esc(v.duree)}" placeholder="${pas ? '≈ ' + Math.round(pas / PAS_PAR_MINUTE) : ''}"></label>
          </div>
          <label class="champ">Note (facultatif)<input type="text" id="m-note" value="${esc(v.note)}" placeholder="Parcours, météo…" maxlength="200"></label>
          ${apercu ? `<div class="carte centre" style="margin:0">
            <div style="font-size:22px;font-weight:850">${nombre(apercu.km)} km · 🔥 ${fmtKcal(apercu.kcal)}</div>
            <div class="tres-discret">${apercu.vitesse ? nombre(apercu.vitesse) + ' km/h · ' : ''}+${apercu.xp} XP${etat.profil?.taille ? '' : ' · distance estimée avec un pas de 75 cm'}</div>
          </div>` : ''}
          <button class="btn btn-principal btn-plein" id="m-ok">${existante ? 'Enregistrer' : 'Ajouter la marche'}</button>
          <details class="carte" style="margin:0"><summary style="font-weight:700;cursor:pointer">Récupérer mes pas depuis l’app Santé</summary>
            ${aideRaccourci()}
          </details>
        </div>`;
      const lireChamps = () => {
        v.pas = el.querySelector('#m-pas').value; v.km = el.querySelector('#m-km').value;
        v.date = el.querySelector('#m-date').value; v.debut = el.querySelector('#m-debut').value;
        v.duree = el.querySelector('#m-duree').value; v.note = el.querySelector('#m-note').value;
      };
      ['#m-pas', '#m-km', '#m-duree'].forEach((s) => (el.querySelector(s).onchange = () => { lireChamps(); dessiner(); }));
      el.querySelector('#m-coller').onclick = async () => {
        lireChamps();
        let texte = '';
        try { texte = await navigator.clipboard.readText(); } catch { /* refusé ou indisponible */ }
        const r = lireTexteSante(texte);
        if (!r.pas && !r.km) return toast('Rien à coller : lance d’abord ton Raccourci Santé (voir l’aide en bas)');
        v.pas = r.pas || v.pas; v.km = r.km || v.km; v.duree = r.min || v.duree; v.source = 'sante';
        toast(`${r.pas.toLocaleString('fr-FR')} pas récupérés ✓`);
        dessiner();
      };
      el.querySelector('#m-ok').onclick = () => {
        lireChamps();
        const pas = Math.round(lire(v.pas));
        const kmSaisi = lire(v.km);
        if (!pas && !kmSaisi) return toast('Indique le nombre de pas (ou la distance)');
        if (pas > 200000 || kmSaisi > 200) return toast('Valeur trop grande');
        if (!v.date) return toast('Choisis une date');
        const km = kmSaisi || kmDepuisPas(pas);
        const duree = Math.round(lire(v.duree)) || Math.max(1, Math.round((pas || (km * 1000) / foulee()) / PAS_PAR_MINUTE));
        const champs = {
          date: v.date, debut: v.debut || '18:00', duree, salleId: null, types: ['marche'], exercices: [],
          note: v.note.trim(), marche: { pas, km, source: v.source },
        };
        fermer();
        if (existante) {
          maj((e) => Object.assign(e.seances.find((x) => x.id === existante.id), champs));
          return toast('Marche modifiée');
        }
        const seance = { id: uid(), ...champs, source: 'marche' };
        const calcul = calculerXpSeance(seance);
        seance.xp = calcul.total;
        let gain;
        maj((e) => {
          e.seances.push(seance);
          gain = ajouterXp(e, calcul.total, 'Marche', seance.date, { seanceId: seance.id });
        });
        celebrer({ ...calcul, ...gain, kcal: caloriesSeance(seance) });
        aller('seance-detail/' + seance.id);
      };
    };
    dessiner();
  });
}

function estimation({ date, pas, km, minutes }) {
  const s = { date, duree: minutes, types: ['marche'], exercices: [], marche: { pas, km } };
  const kcal = caloriesSeance(s).total;
  const xp = calculerXpSeance(s).total;
  return { km, kcal, xp, vitesse: minutes ? Math.round((km / (minutes / 60)) * 10) / 10 : 0 };
}

function aideRaccourci() {
  if (!estIOS) {
    return `<p class="discret" style="margin-top:8px">L’app Santé d’Apple n’existe que sur iPhone. Sur Android, recopie le nombre de pas affiché par ton appli de pas (Google Fit, Samsung Health…).</p>`;
  }
  // Noms des actions en français, avec l'anglais entre parenthèses (iPhone réglé en anglais).
  const en = (t) => ` <span class="tres-discret">(${t})</span>`;
  return `<p class="discret" style="margin-top:8px">Une app web ne peut pas lire Santé directement. Un <strong>Raccourci</strong> (app Raccourcis${en('Shortcuts')}) peut copier tes pas du jour, puis « Coller depuis Santé » les récupère ici. À créer une seule fois :</p>
    <ol class="etapes" style="margin-top:8px">
      <li>Ouvre l’app <strong>Raccourcis</strong>${en('Shortcuts')}, touche <strong>+</strong>, nomme le raccourci « Pas pour Muscu ».</li>
      <li>Ajoute <strong>Rechercher des échantillons de santé</strong>${en('Find Health Samples')} : type <strong>Nombre de pas</strong>${en('Steps')}, filtre <strong>Date de début · est aujourd’hui</strong>${en('Start Date · is today')}, <strong>Regrouper par · Jour</strong>${en('Group By · Day')}.</li>
      <li>Ajoute <strong>Calculer les statistiques</strong>${en('Calculate Statistics')} : <strong>Somme</strong>${en('Sum')}.</li>
      <li>Ajoute <strong>Définir la variable</strong>${en('Set Variable')} : nom <strong>Pas</strong>, valeur <strong>Statistiques</strong>${en('Statistics')}.</li>
      <li>Refais les étapes 2 à 4 avec le type <strong>Distance de marche + course</strong>${en('Walking + Running Distance')} et une variable nommée <strong>Distance</strong>.</li>
      <li>Ajoute <strong>Texte</strong>${en('Text')} : <code>MUSCU;pas=</code> puis la variable <strong>Pas</strong>, <code>;km=</code> puis la variable <strong>Distance</strong>.</li>
      <li>Ajoute <strong>Copier dans le presse-papiers</strong>${en('Copy to Clipboard')}.</li>
    </ol>
    <p class="tres-discret" style="margin:0 0 6px">Après ta marche : lance le raccourci (ou « Dis Siri, pas pour Muscu »${en('Hey Siri')}), puis ici « Coller depuis Santé » et touche <strong>Autoriser le collage</strong>${en('Allow Paste')}.</p>
    <p class="tres-discret" style="margin:0">Si les pas sont doublés (iPhone + Apple Watch), ajoute aux 2 recherches un filtre <strong>Source</strong> sur un seul appareil. La distance doit être en km : app Santé › Parcourir › Activité › Distance › Unité${en('Health › Browse › Activity › Unit')}.</p>`;
}

/** Résumé d'une marche pour les listes : « 8 423 pas · 6,1 km ». */
export function texteMarche(s) {
  const m = s.marche || {};
  return [m.pas ? `${m.pas.toLocaleString('fr-FR')} pas` : '', m.km ? `${nombre(m.km)} km` : ''].filter(Boolean).join(' · ');
}


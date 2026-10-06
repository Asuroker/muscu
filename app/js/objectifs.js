// Objectifs : poids corporel et charges par exercice.
import { etat, jour, uid, historiqueExercice } from './store.js';
import { poidsA } from './calories.js';

export const XP_OBJECTIF_CHARGE = 100;
export const XP_OBJECTIF_POIDS = 150;

export const objectifs = () => etat.objectifs || { poids: null, charges: [] };

export function recordExercice(exId) {
  const h = historiqueExercice(exId);
  return h.length ? Math.max(...h.map((x) => x.max)) : 0;
}

/** Progression vers l'objectif de poids : { cible, depart, actuel, sens, pct, reste, atteint }. */
export function progressionPoids() {
  const o = objectifs().poids;
  if (!o) return null;
  const actuel = poidsA(jour()).kg;
  const sens = o.cible < o.depart ? 'perte' : o.cible > o.depart ? 'prise' : 'maintien';
  const total = Math.abs(o.cible - o.depart) || 1;
  const fait = sens === 'perte' ? o.depart - actuel : actuel - o.depart;
  const pct = Math.max(0, Math.min(100, (fait / total) * 100));
  return { ...o, actuel, sens, pct, reste: Math.round((o.cible - actuel) * 10) / 10, atteint: !!o.atteintLe };
}

/** Semaines estimées pour atteindre l'objectif de poids, d'après un rythme sain. */
export function semainesEstimees(prog) {
  if (!prog || prog.atteint) return 0;
  const rythme = prog.sens === 'perte' ? prog.actuel * 0.0075 : prog.actuel * 0.0035; // kg / semaine
  return Math.ceil(Math.abs(prog.reste) / rythme);
}

export function definirObjectifPoids(e, cible) {
  const depart = poidsA(jour()).kg;
  e.objectifs = e.objectifs || { poids: null, charges: [] };
  e.objectifs.poids = cible ? { cible, depart, debut: jour(), atteintLe: null } : null;
}

export function definirObjectifCharge(e, exId, cible) {
  e.objectifs = e.objectifs || { poids: null, charges: [] };
  const existant = e.objectifs.charges.find((c) => c.exId === exId && !c.atteintLe);
  if (existant) existant.cible = cible;
  else e.objectifs.charges.push({ id: uid(), exId, cible, creeLe: jour(), atteintLe: null });
}

/** Objectifs de charge atteints (à appeler dans maj() après avoir ajouté la séance). */
export function verifierCharges(e) {
  const lignes = [];
  for (const c of e.objectifs?.charges || []) {
    if (c.atteintLe) continue;
    if (recordExercice(c.exId) >= c.cible) {
      c.atteintLe = jour();
      lignes.push({ lib: `🎯 Objectif atteint : ${String(c.cible).replace('.', ',')} kg`, xp: XP_OBJECTIF_CHARGE, exId: c.exId });
    }
  }
  return lignes;
}

/** Objectif de poids atteint après une pesée (à appeler dans maj()). */
export function verifierPoids(e) {
  const o = e.objectifs?.poids;
  if (!o || o.atteintLe) return [];
  const actuel = poidsA(jour()).kg;
  const ok = o.cible < o.depart ? actuel <= o.cible : o.cible > o.depart ? actuel >= o.cible : false;
  if (!ok) return [];
  o.atteintLe = jour();
  return [{ lib: `🎯 Objectif de poids atteint : ${String(o.cible).replace('.', ',')} kg`, xp: XP_OBJECTIF_POIDS }];
}

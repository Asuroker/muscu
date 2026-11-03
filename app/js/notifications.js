// Notifications de fin de repos (Web Push), envoyées par le serveur Cloudflare du dossier notifications/.
// Quand l'app est en arrière-plan ou l'écran verrouillé, l'iPhone la met en pause : seul un serveur
// peut alors déclencher la notification à l'heure. Sans réseau, on retombe sur le bip dans l'app.

export const URL_SERVEUR = 'https://muscu-notif.asuroker.workers.dev';
const CLE_PUBLIQUE = 'BO0nxe1xzjuiFhgaCPFiWkEB9xOYxTo6rVJhZqwlAxd-eytldt4rd06jouQUSF-QAJI8onYiv6NV8QuEAjOQyks';
const CLE_ACTIVE = 'muscu.notifRepos';

const deB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

/** Le téléphone sait-il recevoir des notifications d'une app web ? (iPhone : app installée, iOS 16.4+) */
export const notifPossibles = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export function notifActives() {
  try {
    return notifPossibles() && Notification.permission === 'granted' && localStorage.getItem(CLE_ACTIVE) === '1';
  } catch {
    return false;
  }
}

/** Demande l'autorisation et abonne le téléphone. À appeler depuis un toucher (exigé par iOS). */
export async function activerNotifications() {
  if (!notifPossibles()) throw new Error('non-supporte');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('refuse');
  const reg = await navigator.serviceWorker.ready;
  const abonnement = (await reg.pushManager.getSubscription())
    || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: deB64url(CLE_PUBLIQUE) }));
  try { localStorage.setItem(CLE_ACTIVE, '1'); } catch { /* rien */ }
  return abonnement;
}

export function desactiverNotifications() {
  try { localStorage.setItem(CLE_ACTIVE, '0'); } catch { /* rien */ }
}

async function appeler(chemin, donnees) {
  if (!notifActives()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const abonnement = await reg.pushManager.getSubscription();
    if (!abonnement) return;
    await fetch(URL_SERVEUR + chemin, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ abonnement: abonnement.toJSON(), ...donnees }),
    });
  } catch { /* pas de réseau : le bip dans l'app reste là */ }
}

/** Programme la notification de fin de repos (fin = horodatage en ms). */
export const programmerRepos = (fin, exercice = '') => appeler('/repos', { fin, exercice });
export const annulerRepos = () => appeler('/annuler', {});

/** Notification de test, dans quelques secondes. */
export const testerNotification = () => appeler('/repos', { fin: Date.now() + 5000, exercice: 'Test de notification' });

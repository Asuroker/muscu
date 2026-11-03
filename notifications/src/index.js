// Serveur de notifications de fin de repos pour Muscu (Cloudflare Worker + Durable Object).
//
// POST /repos   { abonnement, fin, exercice? } : programme la notification à l'heure `fin` (ms)
// POST /annuler { abonnement }                  : annule la notification programmée
//
// Une seule notification programmée par téléphone (une nouvelle remplace l'ancienne).
// Le texte est construit ici : le serveur ne relaie jamais un texte arbitraire.
// Rien d'autre n'est stocké que l'abonnement et l'heure de fin, effacés après l'envoi.

const ORIGINES = ['https://asuroker.github.io', 'http://localhost:8765'];
const SERVICES_PUSH = /^https:\/\/([a-z0-9-]+\.)*(push\.apple\.com|fcm\.googleapis\.com|push\.services\.mozilla\.com|notify\.windows\.com)\//;
const DELAI_MAX = 30 * 60 * 1000; // un repos dure au plus 30 min

// ---------- Utilitaires ----------
const enc = (s) => new TextEncoder().encode(s);
const b64url = (octets) => btoa(String.fromCharCode(...new Uint8Array(octets))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const concat = (...t) => { const r = new Uint8Array(t.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of t) { r.set(x, i); i += x.length; } return r; };

async function hkdf(sel, ikm, info, longueur) {
  const cle = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: sel, info }, cle, longueur * 8));
}

// ---------- Chiffrement du message (RFC 8291, aes128gcm) ----------
async function chiffrer(abonnement, texte) {
  const clePubliqueTel = deB64url(abonnement.keys.p256dh);
  const auth = deB64url(abonnement.keys.auth);
  const locale = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const clePubliqueLocale = new Uint8Array(await crypto.subtle.exportKey('raw', locale.publicKey));
  const tel = await crypto.subtle.importKey('raw', clePubliqueTel, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const secret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: tel }, locale.privateKey, 256));
  const ikm = await hkdf(auth, secret, concat(enc('WebPush: info\0'), clePubliqueTel, clePubliqueLocale), 32);
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(sel, ikm, enc('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(sel, ikm, enc('Content-Encoding: nonce\0'), 12);
  const cle = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, cle, concat(enc(texte), new Uint8Array([2]))));
  return concat(sel, new Uint8Array([0, 0, 16, 0]), new Uint8Array([clePubliqueLocale.length]), clePubliqueLocale, chiffre);
}

// ---------- Signature VAPID ----------
async function enteteVapid(endpoint, env) {
  const jwk = JSON.parse(env.VAPID_PRIVE);
  const cle = await crypto.subtle.importKey('jwk', { ...jwk, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const morceau = (o) => b64url(enc(JSON.stringify(o)));
  const corps = `${morceau({ typ: 'JWT', alg: 'ES256' })}.${morceau({
    aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.VAPID_SUJET,
  })}`;
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cle, enc(corps));
  return `vapid t=${corps}.${b64url(signature)}, k=${env.VAPID_PUBLIQUE}`;
}

async function envoyerPush(abonnement, message, env) {
  const corps = await chiffrer(abonnement, JSON.stringify(message));
  return fetch(abonnement.endpoint, {
    method: 'POST',
    headers: {
      Authorization: await enteteVapid(abonnement.endpoint, env),
      'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '120', Urgency: 'high',
    },
    body: corps,
  });
}

// ---------- Un objet durable par téléphone : il garde le rappel et se réveille à l'heure ----------
export class RappelRepos {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(requete) {
    const { action, abonnement, fin, message } = await requete.json();
    if (action === 'annuler') {
      await this.state.storage.deleteAlarm();
      await this.state.storage.deleteAll();
      return new Response('ok');
    }
    await this.state.storage.put('rappel', { abonnement, message });
    await this.state.storage.setAlarm(fin);
    return new Response('ok');
  }

  async alarm() {
    const rappel = await this.state.storage.get('rappel');
    await this.state.storage.deleteAll();
    if (!rappel) return;
    const r = await envoyerPush(rappel.abonnement, rappel.message, this.env);
    // Journal visible avec « wrangler tail » : 201 = accepté par Apple / Google.
    console.log('push', new URL(rappel.abonnement.endpoint).host, r.status, r.status >= 400 ? await r.text() : '');
  }
}

// ---------- Point d'entrée ----------
function cors(requete) {
  const origine = requete.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': ORIGINES.includes(origine) ? origine : ORIGINES[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin',
  };
}

function abonnementValide(a) {
  return a && typeof a.endpoint === 'string' && a.endpoint.length < 1000 && SERVICES_PUSH.test(a.endpoint)
    && typeof a.keys?.p256dh === 'string' && a.keys.p256dh.length < 200 && typeof a.keys?.auth === 'string' && a.keys.auth.length < 100;
}

export default {
  async fetch(requete, env) {
    const entetes = cors(requete);
    if (requete.method === 'OPTIONS') return new Response(null, { headers: entetes });
    const reponse = (texte, statut = 200) => new Response(texte, { status: statut, headers: entetes });
    if (requete.method !== 'POST') return reponse('Muscu notifications', 200);

    const chemin = new URL(requete.url).pathname;
    let donnees;
    try { donnees = await requete.json(); } catch { return reponse('JSON invalide', 400); }
    const { abonnement } = donnees;
    if (!abonnementValide(abonnement)) return reponse('Abonnement invalide', 400);
    const objet = env.RAPPELS.get(env.RAPPELS.idFromName(abonnement.endpoint));

    if (chemin === '/annuler') {
      await objet.fetch('https://rappel/', { method: 'POST', body: JSON.stringify({ action: 'annuler' }) });
      return reponse('ok');
    }
    if (chemin === '/repos') {
      const fin = Number(donnees.fin);
      const maintenant = Date.now();
      if (!Number.isFinite(fin) || fin < maintenant - 5000 || fin > maintenant + DELAI_MAX) return reponse('Heure de fin invalide', 400);
      const exercice = typeof donnees.exercice === 'string' ? donnees.exercice.replace(/[<>]/g, '').slice(0, 60) : '';
      const message = {
        titre: '⏱️ Repos terminé',
        texte: exercice ? `Série suivante : ${exercice} 💪` : 'Série suivante 💪',
        tag: 'muscu-repos',
      };
      await objet.fetch('https://rappel/', { method: 'POST', body: JSON.stringify({ action: 'programmer', abonnement, fin: Math.max(fin, maintenant + 500), message }) });
      return reponse('ok');
    }
    return reponse('Introuvable', 404);
  },
};

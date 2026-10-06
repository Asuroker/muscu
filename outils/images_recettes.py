"""Trouve une photo libre (Wikimedia Commons) pour chaque recette.

- Recherches : outils/images_requetes.json  (id -> [requête 1, requête 2…])
- Corrections : outils/images_choix.json    (id -> {"fichier": "File:…"} | {"rang": n} | null pour aucune image)
- Sortie      : app/img/recettes/<id>.jpg  +  app/data/credits-recettes.json
- Contrôle    : planches de vignettes dans le dossier passé avec --planches

Usage : python outils/images_recettes.py [--seulement id1,id2] [--planches DOSSIER] [--forcer]
"""
import argparse
import html
import io
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw

ICI = Path(__file__).parent
APP = ICI.parent / "app"
DOSSIER_IMG = APP / "img" / "recettes"
CREDITS = APP / "data" / "credits-recettes.json"
API = "https://commons.wikimedia.org/w/api.php"
ENTETES = {"User-Agent": "MuscuRecettes/1.0 (https://asuroker.github.io/muscu/; images libres pour une app perso)"}
MOTS_EXCLUS = re.compile(r"logo|map|diagram|label|packag|menu|sign|poster|icon|svg|drawing|illustration|cartoon|stamp", re.I)


def appel(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    for essai in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=ENTETES), timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception:
            time.sleep(2 + essai * 3)
    raise RuntimeError("API Commons injoignable")


def nettoyer(texte):
    texte = re.sub(r"<[^>]+>", "", texte or "")
    return html.unescape(texte).strip()


def candidats(requete):
    donnees = appel({
        "action": "query", "generator": "search", "gsrnamespace": 6, "gsrlimit": 20,
        "gsrsearch": f"{requete} filetype:bitmap",
        "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 800,
    })
    pages = sorted(donnees.get("query", {}).get("pages", []), key=lambda p: p.get("index", 99))
    res = []
    for p in pages:
        info = (p.get("imageinfo") or [{}])[0]
        if info.get("mime") not in ("image/jpeg", "image/png", "image/webp"):
            continue
        l, h = info.get("width", 0), info.get("height", 0)
        if l < 500 or h < 350 or not (0.65 <= l / h <= 2.2):
            continue
        if MOTS_EXCLUS.search(p["title"]):
            continue
        meta = info.get("extmetadata", {})
        licence = nettoyer(meta.get("LicenseShortName", {}).get("value"))
        if not licence:
            continue
        res.append({
            "titre": p["title"],
            "vignette": info.get("thumburl") or info["url"],
            "page": info.get("descriptionurl"),
            "auteur": nettoyer(meta.get("Artist", {}).get("value"))[:80] or "Auteur inconnu",
            "licence": licence,
            "licenceUrl": meta.get("LicenseUrl", {}).get("value", ""),
        })
    return res


def fichier_precis(titre):
    donnees = appel({"action": "query", "titles": titre, "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 800})
    p = donnees["query"]["pages"][0]
    info = p["imageinfo"][0]
    meta = info.get("extmetadata", {})
    return {
        "titre": p["title"], "vignette": info.get("thumburl") or info["url"], "page": info.get("descriptionurl"),
        "auteur": nettoyer(meta.get("Artist", {}).get("value"))[:80] or "Auteur inconnu",
        "licence": nettoyer(meta.get("LicenseShortName", {}).get("value")),
        "licenceUrl": meta.get("LicenseUrl", {}).get("value", ""),
    }


def telecharger(url, destination):
    with urllib.request.urlopen(urllib.request.Request(url, headers=ENTETES), timeout=60) as r:
        img = Image.open(io.BytesIO(r.read())).convert("RGB")
    # recadrage 4:3 centré puis 640 × 480
    l, h = img.size
    if l / h > 4 / 3:
        nl = int(h * 4 / 3)
        img = img.crop(((l - nl) // 2, 0, (l - nl) // 2 + nl, h))
    else:
        nh = int(l * 3 / 4)
        img = img.crop((0, (h - nh) // 2, l, (h - nh) // 2 + nh))
    img = img.resize((640, 480), Image.LANCZOS)
    img.save(destination, "JPEG", quality=78, optimize=True, progressive=True)


def planches(ids, dossier):
    dossier.mkdir(parents=True, exist_ok=True)
    par_planche, cols = 30, 6
    for n in range(0, len(ids), par_planche):
        lot = ids[n:n + par_planche]
        rangs = (len(lot) + cols - 1) // cols
        feuille = Image.new("RGB", (cols * 240, rangs * 205), "white")
        d = ImageDraw.Draw(feuille)
        for i, rid in enumerate(lot):
            x, y = (i % cols) * 240, (i // cols) * 205
            f = DOSSIER_IMG / f"{rid}.jpg"
            if f.exists():
                feuille.paste(Image.open(f).resize((232, 174)), (x + 4, y + 4))
            d.text((x + 6, y + 182), f"{n + i + 1}. {rid}"[:38], fill="black")
        feuille.save(dossier / f"planche-{n // par_planche + 1}.jpg", quality=80)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--seulement", default="")
    a.add_argument("--planches", default="")
    a.add_argument("--forcer", action="store_true")
    args = a.parse_args()

    requetes = json.loads((ICI / "images_requetes.json").read_text(encoding="utf-8"))
    chemin_choix = ICI / "images_choix.json"
    choix = json.loads(chemin_choix.read_text(encoding="utf-8")) if chemin_choix.exists() else {}
    credits = json.loads(CREDITS.read_text(encoding="utf-8")) if CREDITS.exists() else {}
    DOSSIER_IMG.mkdir(parents=True, exist_ok=True)

    cibles = [i for i in args.seulement.split(",") if i] or list(requetes)
    pris = {c["page"] for k, c in credits.items() if k not in cibles}
    manquantes = []
    for rid in cibles:
        dest = DOSSIER_IMG / f"{rid}.jpg"
        if rid in choix and choix[rid] is None:
            dest.unlink(missing_ok=True)
            credits.pop(rid, None)
            print(f"-  {rid} : sans image (choix)")
            continue
        if dest.exists() and rid in credits and not args.forcer and rid not in choix:
            pris.add(credits[rid]["page"])
            continue
        c = choix.get(rid) or {}
        retenu = None
        if c.get("fichier"):
            retenu = fichier_precis(c["fichier"])
        else:
            liste = []
            for q in ([c["requete"]] if c.get("requete") else []) + requetes[rid]:
                liste += [x for x in candidats(q) if x["page"] not in pris and x not in liste]
                time.sleep(0.3)
                if len(liste) > c.get("rang", 0):
                    break
            if len(liste) > c.get("rang", 0):
                retenu = liste[c.get("rang", 0)]
        if not retenu:
            manquantes.append(rid)
            print(f"?  {rid} : aucune photo trouvée")
            continue
        try:
            telecharger(retenu["vignette"], dest)
        except Exception as e:
            manquantes.append(rid)
            print(f"!  {rid} : échec du téléchargement ({e})")
            continue
        pris.add(retenu["page"])
        credits[rid] = {k: retenu[k] for k in ("titre", "page", "auteur", "licence", "licenceUrl")}
        print(f"ok {rid} <- {retenu['titre']} ({retenu['licence']})")
        time.sleep(0.3)

    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(credits)} images, {len(manquantes)} sans photo : {manquantes}")
    if args.planches:
        planches(list(requetes), Path(args.planches))


if __name__ == "__main__":
    main()

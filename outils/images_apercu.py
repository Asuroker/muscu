"""Planches de 8 propositions par recette, pour choisir les photos à la main.

Usage : python outils/images_apercu.py DOSSIER
Lit outils/images_revue.json, écrit DOSSIER/apercu-N.jpg et DOSSIER/candidats.json
(id -> liste de titres de fichiers, dans l'ordre des numéros affichés).
Le choix se reporte ensuite dans outils/images_choix.json : {"id": {"fichier": "File:…"}}.
"""
import io
import json
import sys
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).parent))
from images_recettes import ENTETES, candidats  # noqa: E402

ICI = Path(__file__).parent
sortie = Path(sys.argv[1])
sortie.mkdir(parents=True, exist_ok=True)
revue = json.loads((ICI / "images_revue.json").read_text(encoding="utf-8"))
tous = {}
for rid, requetes in revue.items():
    liste = []
    for q in requetes:
        for c in candidats(q):
            if c["titre"] not in [x["titre"] for x in liste]:
                liste.append(c)
        time.sleep(0.3)
    tous[rid] = liste[:8]
    print(rid, len(tous[rid]), flush=True)

(sortie / "candidats.json").write_text(json.dumps({k: [c["titre"] for c in v] for k, v in tous.items()}, ensure_ascii=False, indent=1), encoding="utf-8")

ids = list(tous)
for p in range(0, len(ids), 5):
    lot = ids[p:p + 5]
    feuille = Image.new("RGB", (8 * 200, len(lot) * 175), "white")
    d = ImageDraw.Draw(feuille)
    for r, rid in enumerate(lot):
        d.text((4, r * 175 + 2), rid, fill="red")
        for i, c in enumerate(tous[rid]):
            try:
                url = c["vignette"]
                with urllib.request.urlopen(urllib.request.Request(url, headers=ENTETES), timeout=60) as rep:
                    im = Image.open(io.BytesIO(rep.read())).convert("RGB")
                im.thumbnail((196, 150))
                feuille.paste(im, (i * 200 + 2, r * 175 + 16))
            except Exception:
                pass
            d.text((i * 200 + 4, r * 175 + 160), str(i), fill="black")
    feuille.save(sortie / f"apercu-{p // 5 + 1}.jpg", quality=80)
print("fini")

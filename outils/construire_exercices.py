"""Construit app/data/exercices.json à partir de free-exercise-db (domaine public)
et des traductions françaises du dossier outils/.

Usage : python outils/construire_exercices.py [chemin/vers/exercises.json]
Sans argument, le fichier source est téléchargé depuis GitHub.
"""
import json
import sys
import urllib.request
from pathlib import Path

ICI = Path(__file__).parent
SORTIE = ICI.parent / "app" / "data" / "exercices.json"
SOURCE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"


def charger(nom):
    return json.loads((ICI / nom).read_text(encoding="utf-8"))


def main():
    if len(sys.argv) > 1:
        source = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    else:
        with urllib.request.urlopen(SOURCE_URL) as r:
            source = json.loads(r.read().decode("utf-8"))

    noms = {**charger("noms_fr_1.json"), **charger("noms_fr_2.json")}
    consignes = {**charger("consignes_fr_1.json"), **charger("consignes_fr_2.json"), **charger("consignes_fr_3.json")}

    inconnus = [n for n in consignes if n not in {e["name"] for e in source}]
    if inconnus:
        raise SystemExit(f"Consignes sans exercice correspondant : {inconnus}")

    sortie = []
    for e in source:
        fr = consignes.get(e["name"])
        sortie.append({
            "id": e["id"],
            "n": noms.get(e["name"], e["name"]),
            "en": e["name"],
            "m": e["primaryMuscles"],
            "s": e["secondaryMuscles"],
            "e": e.get("equipment") or "other",
            "c": e["category"],
            "l": e["level"],
            "k": e.get("mechanic"),
            "f": e.get("force"),
            "i": e["images"],
            "t": fr or e["instructions"],
            "fr": bool(fr),
            "ess": bool(fr),
        })
    sortie.sort(key=lambda x: x["n"].lower())
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(json.dumps(sortie, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(sortie)} exercices, {sum(x['ess'] for x in sortie)} essentiels -> {SORTIE}")


if __name__ == "__main__":
    main()

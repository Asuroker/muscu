# Application Musculation (« Muscu »)

Web app (PWA) pour iPhone et Android, en ligne sur https://asuroker.github.io/muscu/
- iPhone : ouvrir dans Safari › Partager › Sur l'écran d'accueil.
- Android : ouvrir dans Chrome › menu ⋮ › Installer l'application (ou bouton « Installer » dans l'app).
Aucun Mac, compte Apple Developer ni Google Play n'est nécessaire.

Mise en ligne : commit sur `main`, puis `git push origin $(git subtree split --prefix app):gh-pages`.

## Contenu

- `app/` : l'application à mettre en ligne (HTML, CSS, JS, sans compilation).
  - `js/vues/` : un fichier par écran (accueil, calendrier, séance, exercices, progrès, salles, récompenses).
  - `data/exercices.json` : 876 exercices générés (ne pas modifier à la main).
- `outils/` : traductions françaises et scripts.
  - `noms_fr_*.json` : nom français de chaque exercice.
  - `consignes_fr_*.json` : consignes en français des exercices « essentiels ».
  - `construire_exercices.py` : régénère `app/data/exercices.json`.
  - `creer_icones.py` : régénère les icônes.

## Tester sur le PC

```
python -m http.server 8765 --directory app
```

puis ouvrir http://localhost:8765

## Données

Tout est stocké sur le téléphone (localStorage). Penser à exporter une sauvegarde
depuis Progrès › Réglages & sauvegarde.

## Sources

- Exercices et photos : free-exercise-db (domaine public), photos servies par jsDelivr.
- Salles et horaires : OpenStreetMap (Nominatim + Overpass), © contributeurs OpenStreetMap.

"""Génère les icônes de l'app (dégradé orange + haltère blanc)."""
from pathlib import Path
from PIL import Image, ImageDraw

DOSSIER = Path(__file__).parent.parent / "app" / "icons"


def icone(taille):
    s = 4  # sur-échantillonnage pour des bords lisses
    T = taille * s
    img = Image.new("RGB", (T, T))
    haut, bas = (255, 140, 66), (232, 64, 40)
    px = img.load()
    for y in range(T):
        f = y / (T - 1)
        c = tuple(round(haut[i] + (bas[i] - haut[i]) * f) for i in range(3))
        for x in range(T):
            px[x, y] = c
    d = ImageDraw.Draw(img)
    blanc = (255, 255, 255)
    cy = T / 2
    r = T * 0.035
    # barre
    d.rounded_rectangle([T * 0.24, cy - T * 0.035, T * 0.76, cy + T * 0.035], radius=r, fill=blanc)
    # disques
    for x0, l, h in [(0.17, 0.09, 0.40), (0.27, 0.07, 0.28)]:
        for gauche in (True, False):
            x = T * x0 if gauche else T - T * x0 - T * l
            d.rounded_rectangle([x, cy - T * h / 2, x + T * l, cy + T * h / 2], radius=T * 0.025, fill=blanc)
    return img.resize((taille, taille), Image.LANCZOS)


DOSSIER.mkdir(parents=True, exist_ok=True)
for nom, t in [("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)]:
    icone(t).save(DOSSIER / nom)
print("Icônes créées dans", DOSSIER)

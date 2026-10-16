"""Descarga y optimiza las fotografías con licencia libre verificada (Wikimedia Commons).

Licencias, autores y fuentes: src/content/credits.ts (fuente de verdad para la web).
Uso: python scripts/prepare_photos.py
Los originales se guardan en source-assets/fotos/ (no se versionan); la web usa public/media/fotos/.
Sin retoques de color. Solo redimensionado y, cuando se indica, recorte (documentado en los créditos).
"""
from pathlib import Path
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-assets" / "fotos"
OUT = ROOT / "public" / "media" / "fotos"
UA = {"User-Agent": "EstoriaWeb/1.0 (prepare_photos.py)"}

# id: (URL del original en Commons, recorte opcional (izq, arriba, der, abajo) en fracciones)
PHOTOS = {
    "briones": ("https://upload.wikimedia.org/wikipedia/commons/f/f8/Briones_02.jpg", None),
    "elvillar-pueblo": ("https://upload.wikimedia.org/wikipedia/commons/8/86/Vi%C3%B1edos_en_oto%C3%B1o%2C_Elvillar_5.jpg", None),
    "elvillar-hileras": ("https://upload.wikimedia.org/wikipedia/commons/0/0c/Vi%C3%B1edos_en_oto%C3%B1o%2C_Elvillar_6.jpg", None),
    "elvillar-sierra": ("https://upload.wikimedia.org/wikipedia/commons/c/cf/Vi%C3%B1edos_en_oto%C3%B1o%2C_Elvillar_4.jpg", None),
    "san-vicente": ("https://upload.wikimedia.org/wikipedia/commons/2/20/San_Vicente_de_la_Sonsierra_%282020%29_3.jpg", None),
    # Recorte superior para excluir a una persona que aparece al fondo
    "mesa-flores": ("https://upload.wikimedia.org/wikipedia/commons/d/d1/Legant_table_setting_with_white_floral_centerpiece.jpg", (0, 0.3, 1, 1)),
    "mesa-velas": ("https://upload.wikimedia.org/wikipedia/commons/2/28/Pixella15317_%2824030634680%29.jpg", None),
    "pinchos-laguardia": ("https://upload.wikimedia.org/wikipedia/commons/6/6e/Pinchos_laguardia.jpg", None),
}


def fetch(pid: str, url: str) -> Path:
    SRC.mkdir(parents=True, exist_ok=True)
    dest = SRC / f"{pid}{Path(url.split('?')[0]).suffix.lower()}"
    if dest.exists():
        return dest
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA)) as r:
                dest.write_bytes(r.read())
            time.sleep(3)  # respeto al límite de peticiones de Wikimedia
            return dest
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(f"No se pudo descargar {url}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, (url, crop) in PHOTOS.items():
        im = Image.open(fetch(pid, url))
        im = im.convert("RGB")
        if crop:
            w, h = im.size
            im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
        for suffix, width in (("", 2400), ("-sm", 1200)):
            copy = im.copy()
            if copy.width > width:
                copy = copy.resize((width, round(copy.height * width / copy.width)), Image.LANCZOS)
            copy.save(OUT / f"{pid}{suffix}.webp", "WEBP", quality=84, method=6)
        print(pid, im.size)


if __name__ == "__main__":
    main()

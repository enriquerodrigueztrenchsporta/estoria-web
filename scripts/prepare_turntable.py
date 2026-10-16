"""Prepara la vista 360° de una botella a partir de fotografías reales sobre base giratoria.

Uso:
    python scripts/prepare_turntable.py tempranillo [--altura 1600] [--frontal N]

Entrada: source-assets/giro/<vino>/
    - Una sola altura de cámara: las fotos directamente en la carpeta.
    - Varias alturas: una subcarpeta por altura, con nombres que ordenen de la cámara más baja
      a la más alta (p. ej. 1-baja, 2-media, 3-alta). Todas con el mismo número de fotos.
    Las fotos se ordenan por nombre de archivo y deben seguir el sentido de giro de la base.

Salida:
    public/media/giro/<vino>/f<fila>-<fotograma>.webp
    src/content/turntables.json (entrada del vino; la web la usa automáticamente)

No retoca las fotos: solo las escala y, si se indica --recorte, las recorta igual a todas.
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source-assets" / "giro"
OUT = ROOT / "public" / "media" / "giro"
MANIFEST = ROOT / "src" / "content" / "turntables.json"
EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}


def photos_in(folder: Path) -> list[Path]:
    return sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS)


def rows_of(folder: Path) -> list[list[Path]]:
    subfolders = sorted(p for p in folder.iterdir() if p.is_dir())
    rows = [photos_in(s) for s in subfolders] if subfolders else [photos_in(folder)]
    rows = [r for r in rows if r]
    if not rows:
        sys.exit(f"No hay fotos en {folder}")
    counts = {len(r) for r in rows}
    if len(counts) != 1:
        sys.exit(f"Todas las alturas deben tener el mismo número de fotos; hay {sorted(counts)}")
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("vino", help="slug del vino (tempranillo, viura)")
    parser.add_argument("--altura", type=int, default=1600, help="alto de cada fotograma en píxeles")
    parser.add_argument("--frontal", type=int, help="fila con la cámara a la altura de la etiqueta (por defecto, la central)")
    parser.add_argument("--recorte", help="recorte común izquierda,arriba,derecha,abajo en píxeles de la foto original")
    parser.add_argument("--calidad", type=int, default=82)
    args = parser.parse_args()

    rows = rows_of(SOURCE / args.vino)
    frames = len(rows[0])
    front = args.frontal if args.frontal is not None else len(rows) // 2
    if not 0 <= front < len(rows):
        sys.exit(f"--frontal debe estar entre 0 y {len(rows) - 1}")
    box = tuple(int(v) for v in args.recorte.split(",")) if args.recorte else None

    target = OUT / args.vino
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True)

    size: tuple[int, int] | None = None
    for r, row in enumerate(rows):
        for f, path in enumerate(row):
            with Image.open(path) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                if box:
                    im = im.crop(box)
                w = round(im.width * args.altura / im.height)
                im = im.resize((w, args.altura), Image.LANCZOS)
                if size and im.size != size:
                    sys.exit(f"{path.name} tiene otras proporciones; todas las fotos deben tener el mismo encuadre")
                size = im.size
                im.save(target / f"f{r}-{f:03d}.webp", "WEBP", quality=args.calidad, method=6)
        print(f"Altura {r}: {frames} fotogramas")

    assert size
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest[args.vino] = {
        "dir": f"/media/giro/{args.vino}",
        "frames": frames,
        "rows": len(rows),
        "frontRow": front,
        "width": size[0],
        "height": size[1],
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Listo: {frames * len(rows)} fotogramas de {size[0]}×{size[1]} en {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

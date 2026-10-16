"""Genera los recursos web de ESTORIA a partir de los originales en source-assets/.

Reglas: no se reescala hacia arriba, no se retoca ni se regenera ningún píxel.
Solo se extrae, se recorta y se codifica a WebP de alta calidad.
"""
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-assets"
OUT = ROOT / "public" / "media"
OUT.mkdir(parents=True, exist_ok=True)


def extract_label() -> Image.Image:
    doc = pymupdf.open(SRC / "ESTORIA_original_para_imprenta.pdf")
    xref = doc[0].get_images(full=True)[0][0]
    pix = pymupdf.Pixmap(doc, xref)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return knock_out_surround(img)


def knock_out_surround(img: Image.Image, threshold: int = 40) -> Image.Image:
    """Hace transparente solo el negro exterior al borde troquelado del papel.

    Relleno por inundación desde los bordes: los píxeles oscuros conectados con
    el exterior pasan a alfa 0. Las letras negras interiores no se tocan.
    """
    w, h = img.size
    lum = img.convert("L").load()
    alpha = Image.new("L", (w, h), 255)
    a = alpha.load()
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    seen = set()
    while stack:
        x, y = stack.pop()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        seen.add((x, y))
        if lum[x, y] > threshold:
            continue
        a[x, y] = 0
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    # Antialias de 1 px en el contorno para evitar halos
    from PIL import ImageFilter
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    rgba = img.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def crop_photo() -> Image.Image:
    im = Image.open(SRC / "estoria-tempranillo-foto-whatsapp.jpeg").convert("RGB")
    gray = im.convert("L")
    w, h = gray.size
    rows = [y for y in range(h) if sum(gray.crop((0, y, w, y + 1)).tobytes()) / w > 12]
    return im.crop((0, rows[0], w, rows[-1] + 1))


def save(img: Image.Image, name: str, quality: int = 92) -> None:
    img.save(OUT / f"{name}.webp", "WEBP", quality=quality, method=6)
    print(f"{name}.webp {img.size}")


if __name__ == "__main__":
    label = extract_label()
    save(label, "etiqueta-tempranillo", 94)
    save(label.resize((label.width // 2, label.height // 2), Image.LANCZOS), "etiqueta-tempranillo-sm", 90)
    photo = crop_photo()
    save(photo, "botella-tempranillo", 92)
    # Imagen Open Graph: etiqueta centrada sobre vino profundo (sin alterar la etiqueta)
    og = Image.new("RGB", (1200, 630), (53, 29, 34))
    thumb = label.resize((int(label.width * 580 / label.height), 580), Image.LANCZOS)
    og.paste(thumb, ((1200 - thumb.width) // 2, 25), thumb)
    og.save(OUT / "og-estoria.jpg", "JPEG", quality=88)

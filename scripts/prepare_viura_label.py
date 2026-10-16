"""Etiqueta de ESTORIA Viura a partir de la etiqueta original del Tempranillo.

Petición de la marca (16/10/2026): la etiqueta del Viura es igual que la del Tempranillo,
pero con «VIURA» en lugar de «TEMPRANILLO». Es una adaptación digital, no un diseño nuevo:
1. Se borra solo «TEMPRANILLO»: los píxeles de las letras se rellenan con la luminosidad local
   del papel y el grano de la textura de los márgenes a la misma altura.
2. Se compone «VIURA» con la misma altura de mayúscula, el mismo color de tinta (medido en el
   original), el mismo interletraje y centrada en el mismo eje. Tipografía: Cinzel SemiBold
   (SIL Open Font License), la más parecida a la de la etiqueta entre las comparadas.
Ningún otro píxel de la etiqueta cambia.

Uso: python scripts/prepare_viura_label.py   (requiere public/media/etiqueta-tempranillo.webp)
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "public" / "media"
FONT = ROOT / "source-assets" / "fuentes" / "Cinzel-wght.ttf"
FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf"
WEIGHT = 600

# Geometría de «TEMPRANILLO» en la etiqueta original (1122 × 1402 px)
BAND = (320, 1150, 805, 1206)  # x0, y0, x1, y1: zona donde se borra
CAP_TOP, CAP_BOTTOM = 1162, 1196  # altura de mayúscula
CENTER_X = (332 + 791) / 2  # eje de la palabra original
MARGIN_SHIFT = 285  # desplazamiento hasta el papel liso de los márgenes
GAP = {("V", "I"): 17, ("I", "U"): 17, ("U", "R"): 17, ("R", "A"): 14}  # interletraje medido en el original


def blur(a: np.ndarray, s: int) -> np.ndarray:
    k = np.exp(-0.5 * (np.arange(-3 * s, 3 * s + 1) / s) ** 2)
    k /= k.sum()

    def b2(x: np.ndarray) -> np.ndarray:
        x = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 0, x)
        return np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 1, x)

    return np.dstack([b2(a[..., c]) for c in range(a.shape[2])]) if a.ndim == 3 else b2(a)


def glyph(font: ImageFont.FreeTypeFont, ch: str, cap_h: int) -> np.ndarray:
    """Letra antialiasada, escalada para que su altura de mayúscula sea `cap_h`."""
    img = Image.new("L", (700, 700), 0)
    ImageDraw.Draw(img).text((100, 100), ch, font=font, fill=255)
    ref = Image.new("L", (700, 700), 0)
    ImageDraw.Draw(ref).text((100, 100), "H", font=font, fill=255)
    a = np.asarray(img)
    ys, xs = np.where(a > 0)
    hy = np.where(np.asarray(ref) > 0)[0]
    scale = cap_h / (hy.max() - hy.min() + 1)
    crop = img.crop((xs.min(), hy.min(), xs.max() + 1, max(ys.max(), hy.max()) + 1))
    out = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.LANCZOS)
    return np.asarray(out) / 255.0


def main() -> None:
    if not FONT.exists():
        FONT.parent.mkdir(parents=True, exist_ok=True)
        FONT.write_bytes(urllib.request.urlopen(FONT_URL).read())

    src = Image.open(MEDIA / "etiqueta-tempranillo.webp").convert("RGBA")
    rgba = np.asarray(src).astype(float)
    rgb, alpha_channel = rgba[..., :3].copy(), rgba[..., 3]
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    x0, y0, x1, y1 = BAND

    # 1. Máscara de la tinta roja de «TEMPRANILLO»
    redness = np.clip(((r - g) - 18) / 60, 0, 1) * (r - b > 20)
    band = np.zeros(r.shape, bool)
    band[y0:y1, x0:x1] = True
    letters = (redness > 0.05) & band
    erase = np.asarray(Image.fromarray((letters * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
    soft = np.asarray(Image.fromarray((erase * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))) / 255.0
    soft = np.maximum(soft, erase * 1.0)
    ink = rgb[(redness > 0.85) & band].mean(0)

    # 2. Relleno del papel: luminosidad local + grano de los márgenes a la misma altura
    tex = rgb.copy()
    for x in range(x0, x1):
        tex[:, x] = rgb[:, x - MARGIN_SHIFT if x < CENTER_X else x + MARGIN_SHIFT]
    win = (slice(y0 - 40, y1 + 40), slice(x0 - 40, x1 + 40))
    keep = (~erase).astype(np.float64)[win]
    low = blur(rgb[win] * keep[..., None], 10) / np.maximum(blur(keep, 10), 1e-3)[..., None]
    fill = rgb.copy()
    fill[win] = low + (tex[win] - blur(tex[win], 10))
    clean = rgb * (1 - soft[..., None]) + fill * soft[..., None]

    # 3. «VIURA» en la misma línea, tamaño, color e interletraje
    font = ImageFont.truetype(str(FONT), 400)
    font.set_variation_by_axes([WEIGHT])
    word = "VIURA"
    cap_h = CAP_BOTTOM - CAP_TOP + 1
    glyphs = [glyph(font, ch, cap_h) for ch in word]
    total = sum(gl.shape[1] for gl in glyphs) + sum(GAP[(word[i], word[i + 1])] for i in range(len(word) - 1))
    x = round(CENTER_X - total / 2)
    alpha = np.zeros(r.shape)
    for i, gl in enumerate(glyphs):
        h, w = gl.shape
        alpha[CAP_TOP : CAP_TOP + h, x : x + w] = np.maximum(alpha[CAP_TOP : CAP_TOP + h, x : x + w], gl)
        x += w + (GAP[(word[i], word[i + 1])] if i < len(word) - 1 else 0)
    lum = clean.mean(2, keepdims=True)
    tone = lum / lum[y0:y1, x0:x1].mean()
    ink_map = np.clip(ink[None, None, :] * (0.85 + 0.15 * tone), 0, 255)
    out = clean * (1 - alpha[..., None]) + ink_map * alpha[..., None]

    label = Image.fromarray(np.dstack([out, alpha_channel]).clip(0, 255).astype(np.uint8), "RGBA")
    label.save(MEDIA / "etiqueta-viura.webp", "WEBP", quality=94, method=6)
    label.resize((label.width // 2, label.height // 2), Image.LANCZOS).save(MEDIA / "etiqueta-viura-sm.webp", "WEBP", quality=90, method=6)
    print("etiqueta-viura.webp", label.size, "tinta", ink.round())


if __name__ == "__main__":
    main()

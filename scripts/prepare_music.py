"""Genera la música de fondo del recorrido «Ver la historia».

Música: Erik Satie, Gymnopédie n.º 1, interpretación al piano de Teknopazzo, CC0 (Wikimedia Commons):
https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg

Recorta los primeros segundos, aplica fundidos de entrada y salida, normaliza el volumen y escribe:
    public/media/audio/historia.mp3
    src/content/soundtrack.json  (duración del recorrido y ruta del audio)

Requisitos (fuera del proyecto): `pip install imageio-ffmpeg` (o ffmpeg en el PATH).
Uso:
    python scripts/prepare_music.py --musica ruta/Gymnopedie_No._1..ogg [--segundos 20]
"""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media" / "audio" / "historia.mp3"
MANIFEST = ROOT / "src" / "content" / "soundtrack.json"


def ffmpeg_exe() -> str:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--musica", required=True)
    parser.add_argument("--segundos", type=int, default=20)
    args = parser.parse_args()
    total = args.segundos

    OUT.parent.mkdir(parents=True, exist_ok=True)
    chain = (
        f"aresample=44100,atrim=0:{total},asetpts=N/SR/TB,"
        "loudnorm=I=-20:TP=-2:LRA=11,"
        f"afade=t=in:d=1.5,afade=t=out:st={total - 3}:d=3"
    )
    subprocess.run(
        [ffmpeg_exe(), "-y", "-i", args.musica, "-af", chain, "-t", str(total), "-ar", "44100", "-ac", "2", "-b:a", "128k", str(OUT)],
        check=True,
        capture_output=True,
    )
    MANIFEST.write_text(json.dumps({"duration": total, "audio": "/media/audio/historia.mp3"}, indent=2) + "\n", encoding="utf-8")
    print(f"Listo: {total}s -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

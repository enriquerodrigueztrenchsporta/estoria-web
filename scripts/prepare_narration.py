"""Genera el audio del recorrido «Ver la historia»: voz narrada + música de fondo.

- Voz: Piper TTS (https://github.com/OHF-Voice/piper1-gpl), modelo es_ES «sharvard» (medium), voz femenina.
  Datos de entrenamiento: Sharvard corpus (Universidad de Edimburgo), CC BY 3.0 → se acredita en /creditos/.
- Música: Erik Satie, Gymnopédie n.º 1, interpretación de Teknopazzo, CC0 (Wikimedia Commons).

Lee el guion de src/content/narration.json, sintetiza cada frase, calcula la duración mínima del
recorrido para que cada frase suene dentro de su escena y escribe:
    public/media/audio/historia.mp3
    src/content/narration.generated.json  (duración total y tiempos de cada subtítulo)

Requisitos (fuera del proyecto): `pip install piper-tts imageio-ffmpeg` y el modelo de voz:
    https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_ES/sharvard/medium
Uso:
    python scripts/prepare_narration.py --modelo ruta/es_ES-sharvard-medium.onnx --musica ruta/Gymnopedie_No._1..ogg
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "content" / "narration.json"
GENERATED = ROOT / "src" / "content" / "narration.generated.json"
OUT = ROOT / "public" / "media" / "audio" / "historia.mp3"

SPEAKER_F = 1  # sharvard: {"M": 0, "F": 1}
LENGTH_SCALE = 1.12  # algo más pausada que la velocidad por defecto
LEAD = 0.25  # margen dentro de la ventana antes de empezar a hablar (s)
TAIL = 0.6  # margen tras cada frase (s)
MUSIC_GAIN_DB = -2  # música de fondo; baja sola mientras habla la voz (sidechain)
MIN_SECONDS = 20


def ffmpeg_exe() -> str:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def duration(path: Path) -> float:
    with wave.open(str(path)) as w:
        return w.getnframes() / w.getframerate()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--modelo", required=True)
    parser.add_argument("--musica", required=True)
    args = parser.parse_args()

    lines = json.loads(SCRIPT.read_text(encoding="utf-8"))["lines"]
    tmp = Path(tempfile.mkdtemp(prefix="estoria-voz-"))

    clips = []
    for i, line in enumerate(lines):
        wav = tmp / f"linea-{i}.wav"
        subprocess.run(
            [sys.executable, "-m", "piper", "-m", args.modelo, "-s", str(SPEAKER_F), "--length-scale", str(LENGTH_SCALE), "-f", str(wav), "--", line["say"]],
            check=True,
            capture_output=True,
        )
        clips.append((wav, duration(wav)))
        print(f"{i}: {clips[-1][1]:.2f}s  {line['say'][:60]}")

    # Duración mínima para que cada frase quepa en su ventana
    total = MIN_SECONDS
    for line, (_, d) in zip(lines, clips):
        start, end = line["window"]
        total = max(total, (d + LEAD + TAIL) / (end - start))
    total = round(total + 0.5)

    cues = []
    for line, (_, d) in zip(lines, clips):
        t0 = line["window"][0] * total + LEAD
        cues.append({"start": round(t0, 2), "end": round(t0 + d, 2), "text": line["text"]})

    # Mezcla: música con fundidos + cada frase en su instante
    ff = ffmpeg_exe()
    inputs = ["-i", args.musica]
    filters = [f"[0:a]aresample=44100,atrim=0:{total},asetpts=N/SR/TB,volume={MUSIC_GAIN_DB}dB,afade=t=in:d=2,afade=t=out:st={total - 3}:d=3[m]"]
    labels = ["[m]"]
    for i, ((wav, _), cue) in enumerate(zip(clips, cues), start=1):
        inputs += ["-i", str(wav)]
        ms = int(cue["start"] * 1000)
        filters.append(f"[{i}:a]aresample=44100,pan=stereo|c0=c0|c1=c0,adelay={ms}|{ms}[v{i}]")
        labels.append(f"[v{i}]")
    voices = labels[1:]
    filters.append(f"{''.join(voices)}amix=inputs={len(voices)}:normalize=0,asplit=2[voz][llave]")
    filters.append("[m][llave]sidechaincompress=threshold=0.02:ratio=6:attack=80:release=900[fondo]")
    filters.append("[fondo][voz]amix=inputs=2:normalize=0,alimiter=limit=0.9[out]")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [ff, "-y", *inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-t", str(total), "-ar", "44100", "-ac", "2", "-b:a", "128k", str(OUT)],
        check=True,
        capture_output=True,
    )

    GENERATED.write_text(json.dumps({"duration": total, "audio": "/media/audio/historia.mp3", "cues": cues}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Listo: {total}s -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

import { media } from "@/content/media";
import { asset } from "@/lib/asset";

type Props = {
  /** Centro del recorte en coordenadas normalizadas de la etiqueta */
  cx: number;
  cy: number;
  /** Fracción del ancho de la etiqueta visible en el recorte */
  span: number;
  /** Proporción ancho/alto del marco */
  ratio: number;
  className?: string;
  alt?: string;
};

/**
 * Recorte de la etiqueta original sin generar archivos nuevos: misma imagen, encuadrada con CSS.
 * Nunca amplía por encima de lo que permite el archivo (el marco controla el tamaño en pantalla).
 */
export function LabelCrop({ cx, cy, span, ratio, className = "", alt = "" }: Props) {
  const label = media.tempranilloLabel;
  const aspect = label.width / label.height;
  const widthPct = 100 / span; // ancho de la etiqueta respecto al marco
  const heightPct = (widthPct / aspect) * ratio; // alto de la etiqueta respecto al alto del marco
  const left = 50 - cx * widthPct;
  const top = 50 - cy * heightPct;
  return (
    <div className={`relative overflow-hidden bg-papel ${className}`} style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(label.src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none"
        style={{ width: `${widthPct}%`, left: `${left}%`, top: `${top}%` }}
        draggable={false}
      />
    </div>
  );
}

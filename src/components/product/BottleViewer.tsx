"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Wine } from "@/content/types";
import { asset } from "@/lib/asset";
import { usePrefersReducedMotion } from "@/lib/hooks";

/*
 * Botella 3D giratoria en cualquier dirección (360° horizontal y vertical).
 * Unidades: 1 = 100 mm. Bordelesa de 75 cl: 300 mm de alto y 75 mm de diámetro.
 * La etiqueta es el archivo original, a su tamaño real de imprenta (100 × 125 mm).
 * Forma, vidrio y cápsula son una representación ilustrativa (no hay modelo 3D del fabricante).
 */
const BODY_R = 0.375;
const LABEL_W = 1.0; // 100 mm
const LABEL_H = 1.25; // 125 mm
const LABEL_Y = 1.2; // centro de la etiqueta sobre la base
const LABEL_R = BODY_R + 0.003;

const PROFILE: [number, number][] = [
  [0, 0.012],
  [0.3, 0],
  [0.36, 0.01],
  [0.375, 0.045],
  [0.375, 2.02],
  [0.367, 2.12],
  [0.338, 2.24],
  [0.28, 2.34],
  [0.205, 2.42],
  [0.158, 2.5],
  [0.148, 2.6],
  [0.148, 2.86],
  [0.16, 2.875],
  [0.16, 2.97],
  [0.15, 3],
  [0, 3],
];

/** pdx/pdy: giro pendiente del arrastre; vx/vy: velocidad (inercia y botones). */
type Spin = { pdx: number; pdy: number; vx: number; vy: number; dragging: boolean };

function useBottleGeometry(scale = 1) {
  return useMemo(() => {
    const pts = PROFILE.map(([r, y]) => new THREE.Vector2(r * scale, y));
    return new THREE.LatheGeometry(pts, 128);
  }, [scale]);
}

/** Etiqueta provisional (Viura): solo tipografía, rotulada como provisional. */
function useProvisionalLabel(variety: string) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 1000;
    const g = c.getContext("2d")!;
    g.fillStyle = "#f6f1e4";
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = "#846b53";
    g.setLineDash([14, 10]);
    g.lineWidth = 4;
    g.strokeRect(30, 30, c.width - 60, c.height - 60);
    g.textAlign = "center";
    g.fillStyle = "#5e5248";
    g.font = "500 30px Georgia, serif";
    g.fillText("DOCa RIOJA", c.width / 2, 300);
    g.fillStyle = "#24201d";
    g.font = "600 104px Georgia, serif";
    g.fillText("ESTORIA", c.width / 2, 450);
    g.fillStyle = "#ac8958";
    g.fillRect(c.width / 2 - 60, 500, 120, 3);
    g.fillStyle = "#24201d";
    g.font = "400 64px Georgia, serif";
    g.fillText(variety.toUpperCase(), c.width / 2, 620);
    g.fillStyle = "#8e1f2a";
    g.font = "500 28px Georgia, serif";
    g.fillText("ETIQUETA EN DESARROLLO", c.width / 2, 840);
    g.fillText("· PROVISIONAL ·", c.width / 2, 880);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [variety]);
}

function Label({ texture }: { texture: THREE.Texture }) {
  const theta = LABEL_W / LABEL_R;
  return (
    <mesh position={[0, LABEL_Y, 0]}>
      <cylinderGeometry args={[LABEL_R, LABEL_R, LABEL_H, 128, 1, true, -theta / 2, theta]} />
      <meshStandardMaterial map={texture} roughness={0.82} metalness={0} transparent alphaTest={0.4} side={THREE.FrontSide} />
    </mesh>
  );
}

function OriginalLabel({ src }: { src: string }) {
  const texture = useTexture(asset(src));
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);
  return <Label texture={texture} />;
}

function ProvisionalLabelMesh({ variety }: { variety: string }) {
  const texture = useProvisionalLabel(variety);
  return texture ? <Label texture={texture} /> : null;
}

function Bottle({
  wine,
  spin,
  autoRotate,
  resetSignal,
  onReady,
}: {
  wine: Wine;
  spin: React.RefObject<Spin>;
  autoRotate: boolean;
  resetSignal: number;
  onReady?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  // Se ejecuta cuando la etiqueta ya está cargada (el componente sale de Suspense)
  useEffect(() => onReady?.(), [onReady]);
  const glassGeo = useBottleGeometry();
  const wineGeo = useMemo(() => {
    const pts = PROFILE.filter(([, y]) => y <= 2.3).map(([r, y]) => new THREE.Vector2(Math.max(0, r - 0.02), Math.max(0.03, y)));
    pts.push(new THREE.Vector2(0, 2.3));
    return new THREE.LatheGeometry(pts, 96);
  }, []);
  const target = useRef<THREE.Quaternion | null>(null);
  const X = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const Y = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    if (resetSignal > 0) target.current = new THREE.Quaternion();
  }, [resetSignal]);

  useFrame((_, delta) => {
    const g = group.current;
    const s = spin.current;
    if (!g || !s) return;
    if (target.current) {
      g.quaternion.slerp(target.current, Math.min(1, delta * 5));
      if (g.quaternion.angleTo(target.current) < 0.002) target.current = null;
      return;
    }
    const rotate = (dx: number, dy: number) => {
      g.quaternion.premultiply(q.setFromAxisAngle(Y, dx));
      g.quaternion.premultiply(q.setFromAxisAngle(X, dy));
    };
    if (s.pdx || s.pdy) {
      rotate(s.pdx, s.pdy);
      s.pdx = 0;
      s.pdy = 0;
    } else if (!s.dragging && (s.vx || s.vy)) {
      // inercia
      rotate(s.vx, s.vy);
      s.vx *= 0.9;
      s.vy *= 0.9;
      if (Math.abs(s.vx) < 1e-4) s.vx = 0;
      if (Math.abs(s.vy) < 1e-4) s.vy = 0;
    } else if (autoRotate && !s.dragging) {
      g.quaternion.premultiply(q.setFromAxisAngle(Y, delta * 0.35));
    }
  });

  const { glass, translucent, wine: wineColor, capsule } = wine.bottle3d;

  return (
    <group ref={group}>
      <group position={[0, -1.5, 0]}>
        <mesh geometry={glassGeo}>
          {translucent ? (
            <meshPhysicalMaterial
              color={glass}
              transparent
              opacity={0.32}
              roughness={0.04}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.03}
              envMapIntensity={2.2}
              depthWrite={false}
            />
          ) : (
            <meshPhysicalMaterial color={glass} roughness={0.12} metalness={0.05} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={1.4} />
          )}
        </mesh>
        {translucent && wineColor && (
          <mesh geometry={wineGeo}>
            <meshPhysicalMaterial color={wineColor} roughness={0.15} clearcoat={0.6} envMapIntensity={0.8} />
          </mesh>
        )}
        {/* Cápsula */}
        <mesh position={[0, 2.775, 0]}>
          <cylinderGeometry args={[0.164, 0.153, 0.47, 96]} />
          <meshStandardMaterial color={capsule} roughness={0.45} metalness={0.55} />
        </mesh>
        {wine.label ? <OriginalLabel src={wine.label.src} /> : <ProvisionalLabelMesh variety={wine.variety} />}
      </group>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#fff4e6" />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#ffe0c0" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color="#fff1dc" position={[-4, 1, 3]} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[4.5, 0.5, 2]} scale={[1.2, 7, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9a8" position={[0, 6, -2]} scale={[6, 1, 1]} />
        <Lightformer form="circle" intensity={0.8} position={[0, -5, 0]} scale={4} />
      </Environment>
    </>
  );
}

const STEP = Math.PI / 8;

export default function BottleViewer({ wine, onReady }: { wine: Wine; onReady?: () => void }) {
  const reduced = usePrefersReducedMotion();
  const spin = useRef<Spin>({ pdx: 0, pdy: 0, vx: 0, vy: 0, dragging: false });
  const [interacted, setInteracted] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  // Sin dibujar cuando no está en pantalla (rendimiento y batería)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nudge = (dx: number, dy: number) => {
    setInteracted(true);
    // velocidad inicial cuya suma geométrica (factor 0,9) equivale al ángulo pedido
    spin.current.vx += dx * 0.1;
    spin.current.vy += dy * 0.1;
  };

  // Vista frontal: detiene el giro automático y la inercia
  const reset = () => {
    setInteracted(true);
    spin.current.vx = 0;
    spin.current.vy = 0;
    setResetSignal((n) => n + 1);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    spin.current.dragging = true;
    spin.current.vx = 0;
    spin.current.vy = 0;
    setInteracted(true);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const k = 0.009;
    const dx = (e.clientX - d.x) * k;
    const dy = (e.clientY - d.y) * k;
    spin.current.pdx += dx;
    spin.current.pdy += dy;
    spin.current.vx = dx;
    spin.current.vy = dy;
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) {
      drag.current = null;
      spin.current.dragging = false;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const m = map[e.key];
    if (m) {
      e.preventDefault();
      nudge(m[0], m[1]);
    } else if (e.key === "Home" || e.key === "Escape") {
      e.preventDefault();
      reset();
    }
  };

  const label = `Botella de ${wine.name} ${wine.variety} en 3D. Arrastra o usa las flechas del teclado para girarla en cualquier dirección.`;

  return (
    <div className="relative h-full w-full">
      <div
        ref={wrap}
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 7.4], fov: 28 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          fallback={<p className="p-6 text-sm">Tu navegador no permite mostrar la botella en 3D.</p>}
        >
          <Lights />
          <Suspense fallback={null}>
            <Bottle wine={wine} spin={spin} autoRotate={!interacted && !reduced} resetSignal={resetSignal} onReady={onReady} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-2">
        <div className="pointer-events-auto flex gap-1" role="group" aria-label="Girar la botella">
          {(
            [
              ["←", "Girar a la izquierda", -STEP, 0],
              ["→", "Girar a la derecha", STEP, 0],
              ["↑", "Girar hacia arriba", 0, -STEP],
              ["↓", "Girar hacia abajo", 0, STEP],
            ] as const
          ).map(([glyph, name, dx, dy]) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              onClick={() => nudge(dx, dy)}
              className="flex h-10 w-10 items-center justify-center border border-current/30 bg-current/[0.03] text-sm backdrop-blur-sm transition-colors hover:bg-current/10"
            >
              <span aria-hidden>{glyph}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="eyebrow pointer-events-auto h-10 whitespace-nowrap border border-current/30 px-3 backdrop-blur-sm transition-colors hover:bg-current/10"
        >
          Vista frontal
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ORANGE = new THREE.Color("#ff7a3d");
const SAND = new THREE.Color("#f0cfa0");
const WHITE = new THREE.Color("#ffffff");

/** Small deterministic PRNG so the shard layout is stable between renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round, soft-edged sprite for the particles (squares look cheap). */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** Wireframe edges of a polyhedron as line segments. */
function WirePoly({
  geometry,
  color,
  opacity,
  additive,
}: {
  geometry: THREE.BufferGeometry;
  color: THREE.Color;
  opacity: number;
  additive?: boolean;
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </lineSegments>
  );
}

/**
 * Long thin triangles drifting across the portrait, like the ones in the
 * reference design. Each shard is three line segments.
 */
function Shards({ count = 7 }: { count?: number }) {
  const geometry = useMemo(() => {
    const rand = mulberry32(7);
    const pts: number[] = [];
    for (let i = 0; i < count; i++) {
      const cx = (rand() - 0.5) * 3.2;
      const cy = (rand() - 0.5) * 3.2;
      const cz = (rand() - 0.5) * 1.5;
      const r = 1.2 + rand() * 1.8;
      const a0 = rand() * Math.PI * 2;
      const v = [0, 1, 2].map((k) => {
        const a = a0 + (k * Math.PI * 2) / 3 + (rand() - 0.5) * 1.1;
        return new THREE.Vector3(
          cx + Math.cos(a) * r,
          cy + Math.sin(a) * r * 0.8,
          cz + (rand() - 0.5),
        );
      });
      for (let k = 0; k < 3; k++) {
        const p = v[k];
        const q = v[(k + 1) % 3];
        pts.push(p.x, p.y, p.z, q.x, q.y, q.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [count]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={WHITE} transparent opacity={0.14} depthWrite={false} />
    </lineSegments>
  );
}

/** Dust of orange, sand and white points on a loose spherical shell. */
function Particles({ count = 520 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const map = useDotTexture();
  const geometry = useMemo(() => {
    const rand = mulberry32(42);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniform direction, radius biased outward
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = 2.2 + Math.pow(rand(), 0.6) * 3.2;
      pos.set([s * Math.cos(t) * r, u * r * 0.85, s * Math.sin(t) * r], i * 3);
      const roll = rand();
      const c = roll < 0.3 ? ORANGE : roll < 0.5 ? SAND : WHITE;
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        map={map}
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Pointer position normalized to the viewport (-1..1), shared with the rig. */
const pointerNdc = { x: 0, y: 0 };

function Rig() {
  const group = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);

  const ico = useMemo(() => new THREE.IcosahedronGeometry(2.25, 1), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const pointer = pointerNdc;
    // Scroll progress through the first screen: shapes tip back and sink.
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);

    if (group.current) {
      const g = group.current;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.45, 3, dt);
      g.rotation.x = THREE.MathUtils.damp(
        g.rotation.x,
        -pointer.y * 0.3 + scroll * 0.8,
        3,
        dt,
      );
      g.position.y = THREE.MathUtils.damp(g.position.y, -scroll * 1.2, 4, dt);
    }
    if (outer.current) {
      outer.current.rotation.y = t * 0.08;
      outer.current.rotation.z = t * 0.03;
    }
  });

  return (
    <group ref={group}>
      <group ref={outer}>
        <WirePoly geometry={ico} color={WHITE} opacity={0.12} />
        <Shards />
      </group>
      <Particles />
    </group>
  );
}

/**
 * Hero 3D layer. Transparent canvas, so it composites over the portrait.
 * Stops rendering when scrolled out of view, and renders a single still
 * frame when the user prefers reduced motion.
 */
export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNdc.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reduce ? "demand" : visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // Pointer is tracked on window, so the canvas never blocks clicks.
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 1, 4]} intensity={25} color="#ff7a3d" />
        {/* Warm sand fill from the opposite side rims the gem */}
        <pointLight position={[-4, -2, 2]} intensity={18} color="#f0cfa0" />
        <Rig />
      </Canvas>
    </div>
  );
}

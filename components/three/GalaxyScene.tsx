"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Small deterministic PRNG so the galaxy is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft round sprite; square points look cheap. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

const CORE = new THREE.Color("#fff1dc");
const MID = new THREE.Color("#ff8a4a");
const EDGE = new THREE.Color("#4f7fd8");

/**
 * Spiral galaxy as a point cloud: three arms, stars pulled toward the
 * arm centre line, colour running warm at the core to cool at the rim.
 */
function Galaxy({ count = 32000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const map = useDotTexture();

  const geometry = useMemo(() => {
    const rand = mulberry32(2024);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const branches = 3;
    const radius = 5.2;
    const spin = 1.1;
    const power = 2.6;
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = Math.pow(rand(), 1.4) * radius;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const angle = branch + r * spin;
      const spread = 0.22 + r * 0.1;
      const rx = Math.pow(rand(), power) * (rand() < 0.5 ? 1 : -1) * spread;
      const ry = Math.pow(rand(), power) * (rand() < 0.5 ? 1 : -1) * spread * 0.35;
      const rz = Math.pow(rand(), power) * (rand() < 0.5 ? 1 : -1) * spread;

      pos[i * 3] = Math.cos(angle) * r + rx;
      pos[i * 3 + 1] = ry;
      pos[i * 3 + 2] = Math.sin(angle) * r + rz;

      const t = r / radius;
      if (t < 0.3) c.copy(CORE).lerp(MID, t / 0.3);
      else c.copy(MID).lerp(EDGE, (t - 0.3) / 0.7);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        map={map}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Thin dust of white stars far behind the galaxy. */
function Backdrop({ count = 600 }: { count?: number }) {
  const map = useDotTexture();
  const geometry = useMemo(() => {
    const rand = mulberry32(9);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([(rand() - 0.5) * 30, (rand() - 0.5) * 14, -6 - rand() * 10], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.05}
        map={map}
        color="#ffffff"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

type PlanetSpec = {
  radius: number;
  size: number;
  speed: number;
  start: number;
  color: string;
  ring?: boolean;
};

const PLANETS: PlanetSpec[] = [
  { radius: 1.6, size: 0.07, speed: 0.3, start: 0.4, color: "#e3cfae" },
  { radius: 2.3, size: 0.12, speed: 0.2, start: 2.6, color: "#d08552", ring: true },
  { radius: 3.05, size: 0.09, speed: 0.15, start: 4.4, color: "#7fa9e0" },
  { radius: 3.8, size: 0.14, speed: 0.1, start: 1.3, color: "#a39cc2" },
];

/** Lit sphere with a faint atmosphere, orbiting the core in the galactic plane. */
function Planet({ radius, size, speed, start, color, ring }: PlanetSpec) {
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pivot.current) pivot.current.rotation.y = start + t * speed;
    if (body.current) body.current.rotation.y = t * 0.6;
  });
  return (
    <group ref={pivot}>
      <group position={[radius, 0, 0]}>
        <mesh ref={body}>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
        </mesh>
        {/* Atmosphere: slightly larger back-face shell, additive */}
        <mesh scale={1.12}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {ring && (
          <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.1, 64]} />
            <meshBasicMaterial
              color="#e8c9a0"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Bright core: light source plus a soft additive halo behind the button. */
function Core() {
  const map = useDotTexture();
  const halo = useRef<THREE.Sprite>(null);
  useFrame((state) => {
    if (halo.current) {
      const s = 3 + Math.sin(state.clock.elapsedTime * 1.4) * 0.1;
      halo.current.scale.set(s, s, 1);
    }
  });
  return (
    <group>
      <pointLight intensity={16} color="#ffb070" distance={9} decay={1.6} />
      <sprite ref={halo}>
        <spriteMaterial
          map={map}
          color="#ff7a3d"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

const pointerNdc = { x: 0, y: 0 };

/** Camera drifts slightly with the pointer, always looking at the core. */
function CameraRig() {
  useFrame((state, dt) => {
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointerNdc.x * 0.8, 2.5, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 3.6 - pointerNdc.y * 0.5, 2.5, dt);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Galaxy behind the "Hire Me" call to action. Transparent canvas; pauses
 * when scrolled out of view; still frame under reduced motion.
 */
export default function GalaxyScene() {
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
        camera={{ position: [0, 3.6, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.3} />
        <hemisphereLight args={["#5a6f9a", "#1a0f0a", 0.5]} />
        <Backdrop />
        <Galaxy />
        <Core />
        {PLANETS.map((p) => (
          <Planet key={p.radius} {...p} />
        ))}
        <CameraRig />
      </Canvas>
    </div>
  );
}

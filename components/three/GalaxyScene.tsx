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

/* ------------------------------------------------------------------ *
 * Shared GLSL                                                         *
 * ------------------------------------------------------------------ */

/** Hash-based 3D value noise + fbm. Cheap enough for a few small meshes. */
const NOISE_GLSL = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + 7.1;
      a *= 0.5;
    }
    return v;
  }
`;

/** Sun surface: slow-boiling plasma, brighter cells, darker seams. */
const SUN_VERT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SUN_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uBoost;
  varying vec3 vPos;
  varying vec3 vNormal;
  ${NOISE_GLSL}
  void main() {
    vec3 p = normalize(vPos) * 2.6;
    float t = uTime * 0.12;
    float n = fbm(p + vec3(t, -t * 0.7, t * 0.4));
    float cells = fbm(p * 2.4 - vec3(t * 0.6, t, -t * 0.3));
    float v = smoothstep(0.25, 0.85, n * 0.7 + cells * 0.5);
    vec3 deep = vec3(0.72, 0.18, 0.02);
    vec3 mid = vec3(1.0, 0.48, 0.14);
    vec3 hot = vec3(1.0, 0.93, 0.78);
    vec3 col = mix(deep, mid, v);
    col = mix(col, hot, smoothstep(0.65, 1.0, v));
    // Limb darkening: edges fall off like a real photosphere
    float limb = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 0.45);
    col *= mix(0.55, 1.0, limb);
    col *= 1.0 + uBoost * 0.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Fresnel glow shell: bright at the silhouette, clear in the middle. */
const GLOW_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

/** Planet ring: alpha from a radial profile so it reads as bands of dust. */
const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const RING_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vPos;
  ${NOISE_GLSL}
  void main() {
    float r = length(vPos.xy);
    float t = (r - uInner) / (uOuter - uInner);
    if (t < 0.0 || t > 1.0) discard;
    float bands = 0.55 + 0.45 * sin(t * 48.0) * sin(t * 13.0 + 1.3);
    float grain = fbm(vec3(r * 60.0, 0.0, 0.0));
    float edge = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.85, 1.0, t));
    float gap = 1.0 - 0.8 * smoothstep(0.52, 0.56, t) * (1.0 - smoothstep(0.6, 0.64, t));
    float a = edge * gap * (0.35 + 0.5 * bands) * (0.7 + 0.3 * grain);
    gl_FragColor = vec4(uColor, a);
  }
`;

/* ------------------------------------------------------------------ *
 * Textures                                                            *
 * ------------------------------------------------------------------ */

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

/** Wide, soft corona sprite with a hot centre. */
function useCoronaTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,230,200,1)");
    g.addColorStop(0.12, "rgba(255,160,90,0.9)");
    g.addColorStop(0.3, "rgba(255,110,50,0.45)");
    g.addColorStop(0.6, "rgba(255,90,40,0.12)");
    g.addColorStop(1, "rgba(255,80,40,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

type PlanetKind = "rocky" | "banded" | "icy";

/**
 * Procedural planet surface: value noise in a palette, optional latitude
 * bands for gas giants. Returns colour map + bump map.
 */
function makePlanetTextures(seed: number, kind: PlanetKind, palette: string[]) {
  const w = 512;
  const h = 256;
  const rand = mulberry32(seed);
  const cols = palette.map((c) => new THREE.Color(c));

  // Value noise on a small grid, upsampled with smooth interpolation
  const grid = 24;
  const cells = Array.from({ length: (grid + 1) * (grid / 2 + 1) }, () => rand());
  const cellAt = (x: number, y: number) =>
    cells[((y + grid / 2 + 1) % (grid / 2 + 1)) * (grid + 1) + ((x + grid + 1) % (grid + 1))];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = (u: number, v: number) => {
    const x = u * grid;
    const y = v * (grid / 2);
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = smooth(x - xi);
    const fy = smooth(y - yi);
    const a = cellAt(xi, yi);
    const b = cellAt(xi + 1, yi);
    const c = cellAt(xi, yi + 1);
    const d = cellAt(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  const fbm = (u: number, v: number) => {
    let s = 0;
    let amp = 0.5;
    let f = 1;
    for (let i = 0; i < 4; i++) {
      s += amp * noise((u * f) % 1, (v * f) % 1);
      amp *= 0.5;
      f *= 2;
    }
    return s;
  };

  const color = document.createElement("canvas");
  color.width = w;
  color.height = h;
  const bump = document.createElement("canvas");
  bump.width = w;
  bump.height = h;
  const ci = color.getContext("2d")!.createImageData(w, h);
  const bi = bump.getContext("2d")!.createImageData(w, h);
  const tmp = new THREE.Color();

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      let n = fbm(u, v);
      if (kind === "banded") {
        const band = 0.5 + 0.5 * Math.sin(v * Math.PI * 14 + fbm(u, v) * 4);
        n = n * 0.35 + band * 0.65;
      } else if (kind === "icy") {
        const cap = Math.pow(Math.abs(v - 0.5) * 2, 3);
        n = Math.min(1, n + cap);
      }
      const t = Math.min(0.9999, Math.max(0, n)) * (cols.length - 1);
      const i0 = Math.floor(t);
      tmp.copy(cols[i0]).lerp(cols[i0 + 1], t - i0);
      const idx = (y * w + x) * 4;
      ci.data[idx] = tmp.r * 255;
      ci.data[idx + 1] = tmp.g * 255;
      ci.data[idx + 2] = tmp.b * 255;
      ci.data[idx + 3] = 255;
      const bv = kind === "banded" ? 128 : n * 255;
      bi.data[idx] = bi.data[idx + 1] = bi.data[idx + 2] = bv;
      bi.data[idx + 3] = 255;
    }
  }
  color.getContext("2d")!.putImageData(ci, 0, 0);
  bump.getContext("2d")!.putImageData(bi, 0, 0);

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(bump);
  return { map, bumpMap };
}

/* ------------------------------------------------------------------ *
 * Scene parts                                                         *
 * ------------------------------------------------------------------ */

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
function Backdrop({ count = 700 }: { count?: number }) {
  const map = useDotTexture();
  const geometry = useMemo(() => {
    const rand = mulberry32(9);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([(rand() - 0.5) * 34, (rand() - 0.5) * 16, -6 - rand() * 10], i * 3);
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
  seed: number;
  kind: PlanetKind;
  palette: string[];
  atmosphere: string;
  radius: number;
  size: number;
  speed: number;
  start: number;
  tilt: number;
  ring?: string;
};

const PLANETS: PlanetSpec[] = [
  {
    seed: 1,
    kind: "rocky",
    palette: ["#5a4634", "#9c7a5a", "#d9c3a3", "#f0e4d0"],
    atmosphere: "#f0cfa0",
    radius: 1.6,
    size: 0.1,
    speed: 0.3,
    start: 0.4,
    tilt: 0.2,
  },
  {
    seed: 2,
    kind: "banded",
    palette: ["#8a4a24", "#c9803f", "#e8b98a", "#b86a35", "#f3dcbf"],
    atmosphere: "#ffb77a",
    radius: 2.35,
    size: 0.18,
    speed: 0.2,
    start: 2.6,
    tilt: 0.42,
    ring: "#e8c9a0",
  },
  {
    seed: 3,
    kind: "icy",
    palette: ["#1e3f6e", "#3a6fb0", "#7fb0e6", "#e8f2ff"],
    atmosphere: "#8fc4ff",
    radius: 3.1,
    size: 0.13,
    speed: 0.15,
    start: 4.4,
    tilt: 0.1,
  },
  {
    seed: 4,
    kind: "banded",
    palette: ["#4a3d6b", "#7d6ea3", "#b9add6", "#6b5c93", "#e6dff5"],
    atmosphere: "#c7b9ff",
    radius: 3.85,
    size: 0.16,
    speed: 0.1,
    start: 1.3,
    tilt: -0.3,
  },
];

/** Textured, lit sphere with a fresnel atmosphere, orbiting the core. */
function Planet(p: PlanetSpec) {
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makePlanetTextures(p.seed, p.kind, p.palette), [p.seed, p.kind, p.palette]);
  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(p.atmosphere) },
      uPower: { value: 3.0 },
      uStrength: { value: 0.9 },
    }),
    [p.atmosphere],
  );
  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(p.ring ?? "#fff") },
      uInner: { value: p.size * 1.35 },
      uOuter: { value: p.size * 2.3 },
    }),
    [p.ring, p.size],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pivot.current) pivot.current.rotation.y = p.start + t * p.speed;
    if (body.current) body.current.rotation.y = t * 0.25;
  });

  return (
    <group ref={pivot}>
      <group position={[p.radius, 0, 0]} rotation={[0, 0, p.tilt]}>
        <mesh ref={body}>
          <sphereGeometry args={[p.size, 64, 64]} />
          <meshStandardMaterial
            map={tex.map}
            bumpMap={tex.bumpMap}
            bumpScale={p.kind === "banded" ? 0 : 0.004}
            roughness={p.kind === "icy" ? 0.45 : 0.85}
            metalness={0}
          />
        </mesh>
        {/* Atmosphere: fresnel shell, visible only at the limb */}
        <mesh scale={1.06}>
          <sphereGeometry args={[p.size, 48, 48]} />
          <shaderMaterial
            vertexShader={GLOW_VERT}
            fragmentShader={GLOW_FRAG}
            uniforms={glowUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.FrontSide}
          />
        </mesh>
        {p.ring && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[p.size * 1.35, p.size * 2.3, 128]} />
            <shaderMaterial
              vertexShader={RING_VERT}
              fragmentShader={RING_FRAG}
              uniforms={ringUniforms}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Hover state shared with the HTML click target over the sun. */
export const sunHover = { on: false };

/**
 * The star at the core: plasma shader surface, fresnel glow shell, a wide
 * additive corona, and the light that lights the planets. Brightens and
 * swells slightly while the pointer is over its click target.
 */
function Sun() {
  const corona = useCoronaTexture();
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const surface = useRef<THREE.ShaderMaterial>(null);
  const shell = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uBoost: { value: 0 } }),
    [],
  );
  const glow = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff8a3d") },
      uPower: { value: 2.2 },
      uStrength: { value: 1.1 },
    }),
    [],
  );
  const boost = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    boost.current = THREE.MathUtils.damp(boost.current, sunHover.on ? 1 : 0, 6, dt);
    if (surface.current) {
      surface.current.uniforms.uTime.value = t;
      surface.current.uniforms.uBoost.value = boost.current;
    }
    if (shell.current) shell.current.uniforms.uStrength.value = 1.1 + boost.current * 0.5;
    if (group.current) {
      const s = 1 + boost.current * 0.08 + Math.sin(t * 1.6) * 0.008;
      group.current.scale.setScalar(s);
      group.current.rotation.y = t * 0.05;
    }
    if (light.current) light.current.intensity = 18 + boost.current * 10;
  });

  return (
    <group ref={group}>
      <pointLight ref={light} intensity={18} color="#ffb070" distance={10} decay={1.5} />
      <mesh>
        <sphereGeometry args={[0.46, 96, 96]} />
        <shaderMaterial ref={surface} vertexShader={SUN_VERT} fragmentShader={SUN_FRAG} uniforms={uniforms} />
      </mesh>
      {/* Chromosphere glow hugging the limb */}
      <mesh scale={1.12}>
        <sphereGeometry args={[0.46, 64, 64]} />
        <shaderMaterial
          ref={shell}
          vertexShader={GLOW_VERT}
          fragmentShader={GLOW_FRAG}
          uniforms={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Wide corona */}
      <sprite scale={[3.4, 3.4, 1]}>
        <spriteMaterial
          map={corona}
          transparent
          opacity={0.75}
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
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#7a8fb8", "#2a1810", 0.6]} />
        <Backdrop />
        <Galaxy />
        <Sun />
        {PLANETS.map((p) => (
          <Planet key={p.seed} {...p} />
        ))}
        <CameraRig />
      </Canvas>
    </div>
  );
}

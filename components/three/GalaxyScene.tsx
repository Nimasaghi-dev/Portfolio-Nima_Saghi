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
    col *= mix(0.8, 1.0, limb);
    // Edge heats up toward the flame base colour so the two read as one body
    col = mix(col, vec3(1.0, 0.5, 0.12), pow(1.0 - limb, 2.0) * 0.7);
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
  uniform float uStrength;
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
    float a = edge * gap * (0.35 + 0.5 * bands) * (0.7 + 0.3 * grain) * uStrength;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * Flame shell: an outer sphere displaced by rising turbulence, drawn
 * additively so the licks fade into the hot stars around the core.
 */
const FLAME_VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vDisp;
  ${NOISE_GLSL}
  void main() {
    vec3 n = normalize(position);
    float rise = uTime * 0.25;
    float d = fbm(n * 2.2 + vec3(0.0, -rise, 0.0) + fbm(n * 4.0 + rise * 0.4) * 0.6);
    vDisp = d;
    // Only push outward, so every tongue is anchored on the photosphere
    float lift = max(d - 0.38, 0.0);
    vec3 displaced = position + normal * lift * 0.34;
    vPos = n;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const FLAME_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  varying float vDisp;
  ${NOISE_GLSL}
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    float t = uTime * 0.3;
    // Tongues of fire: turbulence advected upward along the sphere
    float n = fbm(vPos * 3.0 + vec3(0.0, -t, 0.0) + fbm(vPos * 5.5 - t * 0.5) * 0.9);
    float tongue = smoothstep(0.5, 0.85, n + vDisp * 0.3);
    vec3 ember = vec3(1.0, 0.28, 0.04);
    vec3 flame = vec3(1.0, 0.62, 0.22);
    vec3 hot = vec3(1.0, 0.92, 0.72);
    vec3 col = mix(ember, flame, tongue);
    col = mix(col, hot, smoothstep(0.75, 1.0, n));
    float a = tongue * fres * uStrength * 0.85;
    gl_FragColor = vec4(col * a, a);
  }
`;

/**
 * Corona billboard: noisy rays radiating from the star. Same palette as
 * the core stars so the two blend into one bright region.
 */
const CORONA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv - 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const CORONA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float r = length(vUv) * 2.0;
    if (r > 1.0) discard;
    float ang = atan(vUv.y, vUv.x);
    float t = uTime * 0.12;
    // Rays: noise in polar space, stretched along the radius
    float rays = fbm(vec3(ang * 2.2, r * 1.5 - t * 0.8, t));
    float wisps = fbm(vec3(vUv * 6.0, t * 1.5));
    float falloff = pow(1.0 - r, 2.2);
    float a = falloff * (0.45 + 0.55 * rays) * (0.7 + 0.3 * wisps);
    a += pow(1.0 - r, 9.0) * 0.8; // hot centre
    vec3 inner = vec3(1.0, 0.86, 0.68);
    vec3 outer = vec3(1.0, 0.45, 0.18);
    vec3 col = mix(inner, outer, smoothstep(0.1, 0.7, r));
    a *= uStrength;
    gl_FragColor = vec4(col * a, a);
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
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
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

type PlanetKind = "rocky" | "banded" | "smooth" | "earth";

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
  const cells = Array.from({ length: (grid + 1) * (grid / 2 + 1) }, () =>
    rand(),
  );
  const cellAt = (x: number, y: number) =>
    cells[
      ((y + grid / 2 + 1) % (grid / 2 + 1)) * (grid + 1) +
        ((x + grid + 1) % (grid + 1))
    ];
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
      } else if (kind === "smooth") {
        // Ice giants: faint, wide bands, almost no surface detail
        const band = 0.5 + 0.5 * Math.sin(v * Math.PI * 6 + fbm(u, v) * 1.5);
        n = n * 0.15 + band * 0.25 + 0.3;
      } else if (kind === "earth") {
        // Below the threshold is ocean, above it land; caps at the poles
        const cap = Math.pow(Math.abs(v - 0.5) * 2, 6);
        n = n + cap * 1.2;
      }
      let t: number;
      if (kind === "earth") {
        // Palette: [deep ocean, shallow ocean, lowland, highland, ice]
        if (n < 0.52) t = n / 0.52;
        else if (n < 0.95) t = 1 + ((n - 0.52) / 0.43) * 2;
        else t = 3 + Math.min(1, (n - 0.95) / 0.25);
      } else {
        t = n * (cols.length - 1);
      }
      t = Math.min(cols.length - 1.0001, Math.max(0, t));
      const i0 = Math.floor(t);
      tmp.copy(cols[i0]).lerp(cols[i0 + 1], t - i0);
      const idx = (y * w + x) * 4;
      ci.data[idx] = tmp.r * 255;
      ci.data[idx + 1] = tmp.g * 255;
      ci.data[idx + 2] = tmp.b * 255;
      ci.data[idx + 3] = 255;
      const bv =
        kind === "banded" || kind === "smooth" ? 128 : Math.min(255, n * 255);
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
      const ry =
        Math.pow(rand(), power) * (rand() < 0.5 ? 1 : -1) * spread * 0.35;
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
    <points ref={ref} geometry={geometry} raycast={() => null}>
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
      pos.set(
        [(rand() - 0.5) * 34, (rand() - 0.5) * 16, -6 - rand() * 10],
        i * 3,
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geometry} raycast={() => null}>
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
  name: string;
  seed: number;
  kind: PlanetKind;
  palette: string[];
  atmosphere: string;
  atmoStrength: number;
  radius: number;
  size: number;
  start: number;
  tilt: number;
  ring?: { color: string; inner: number; outer: number; strength: number };
};

/**
 * The eight planets, Mercury to Neptune. Sizes keep the real ordering
 * (gas giants largest) but are compressed so the small ones stay
 * visible. Orbital speed falls off with distance, as it does in the sky.
 */
const PLANETS: PlanetSpec[] = [
  {
    name: "Mercury",
    seed: 11,
    kind: "rocky",
    palette: ["#5c5852", "#8c877f", "#b5b0a8", "#d8d3cb"],
    atmosphere: "#c9c4bc",
    atmoStrength: 0.25,
    radius: 1.15,
    size: 0.055,
    start: 0.6,
    tilt: 0.02,
  },
  {
    name: "Venus",
    seed: 12,
    kind: "smooth",
    palette: ["#b8893f", "#d9b06a", "#efd4a0", "#f6e6c4"],
    atmosphere: "#f3d9a4",
    atmoStrength: 1.1,
    radius: 1.5,
    size: 0.085,
    start: 2.1,
    tilt: 0.05,
  },
  {
    name: "Earth",
    seed: 13,
    kind: "earth",
    palette: ["#0b2d5c", "#1f5fa8", "#3f7d3a", "#8a7a4c", "#f2f6fa"],
    atmosphere: "#7cb8ff",
    atmoStrength: 1.2,
    radius: 1.9,
    size: 0.09,
    start: 3.9,
    tilt: 0.41,
  },
  {
    name: "Mars",
    seed: 14,
    kind: "rocky",
    palette: ["#6b2d15", "#a8482a", "#d2744a", "#e9a883"],
    atmosphere: "#e8a07a",
    atmoStrength: 0.4,
    radius: 2.3,
    size: 0.065,
    start: 5.2,
    tilt: 0.44,
  },
  {
    name: "Jupiter",
    seed: 15,
    kind: "banded",
    palette: ["#8a5a3a", "#c89a72", "#ead8c0", "#b26e4a", "#f1e4d2"],
    atmosphere: "#e8c6a6",
    atmoStrength: 0.8,
    radius: 2.9,
    size: 0.21,
    start: 1.2,
    tilt: 0.05,
  },
  {
    name: "Saturn",
    seed: 16,
    kind: "banded",
    palette: ["#a8884e", "#d6b878", "#f0e0b4", "#c9a662", "#f7ecd0"],
    atmosphere: "#f0dcaa",
    atmoStrength: 0.8,
    radius: 3.55,
    size: 0.17,
    start: 4.6,
    tilt: 0.47,
    ring: { color: "#e3cfa3", inner: 1.3, outer: 2.2, strength: 0.9 },
  },
  {
    name: "Uranus",
    seed: 17,
    kind: "smooth",
    palette: ["#7fc4d6", "#a9dfe9", "#cdeef4", "#e4f6f8"],
    atmosphere: "#b8ecf4",
    atmoStrength: 0.9,
    radius: 4.15,
    size: 0.15,
    start: 0.2,
    tilt: 1.7,
    ring: { color: "#c9e6ea", inner: 1.6, outer: 1.85, strength: 0.22 },
  },
  {
    name: "Neptune",
    seed: 18,
    kind: "smooth",
    palette: ["#1d3f9c", "#2f5fd0", "#5a8ae6", "#8fb3f0"],
    atmosphere: "#7aa0ff",
    atmoStrength: 1,
    radius: 4.7,
    size: 0.145,
    start: 2.9,
    tilt: 0.49,
  },
];

/** DOM label elements, one per planet, positioned from inside the scene. */
const labelEls = new Map<string, HTMLSpanElement>();
const labelAnchor = new THREE.Vector3();

/** Textured, lit sphere with a fresnel atmosphere, orbiting the core. */
function Planet(p: PlanetSpec) {
  const pivot = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const scaler = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const lift = useRef(0);
  const tex = useMemo(
    () => makePlanetTextures(p.seed, p.kind, p.palette),
    [p.seed, p.kind, p.palette],
  );
  // Kepler-ish: angular speed ~ r^-1.5, scaled so Earth takes ~40s
  const speed = useMemo(() => 0.42 * Math.pow(1.9 / p.radius, 1.5), [p.radius]);
  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(p.atmosphere) },
      uPower: { value: 3.0 },
      uStrength: { value: p.atmoStrength },
    }),
    [p.atmosphere, p.atmoStrength],
  );
  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(p.ring?.color ?? "#fff") },
      uInner: { value: p.size * (p.ring?.inner ?? 1) },
      uOuter: { value: p.size * (p.ring?.outer ?? 1) },
      uStrength: { value: p.ring?.strength ?? 1 },
    }),
    [p.ring, p.size],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (pivot.current) pivot.current.rotation.y = p.start + t * speed;
    if (body.current) body.current.rotation.y = t * 0.25;
    lift.current = THREE.MathUtils.damp(lift.current, hover ? 1 : 0, 8, dt);
    if (scaler.current) scaler.current.scale.setScalar(1 + lift.current * 0.18);

    // Project the point just above the planet into the canvas and move the label there
    const el = labelEls.get(p.name);
    if (el && scaler.current) {
      scaler.current.getWorldPosition(labelAnchor);
      labelAnchor.y += p.size * 1.9 + 0.08;
      labelAnchor.project(state.camera);
      const x = (labelAnchor.x * 0.5 + 0.5) * state.size.width;
      const y = (-labelAnchor.y * 0.5 + 0.5) * state.size.height;
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - lift.current * 4}px)`;
      el.style.opacity = String(lift.current);
    }
  });

  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  const rough = p.kind === "earth" ? 0.55 : p.kind === "smooth" ? 0.6 : 0.85;

  return (
    <group ref={pivot}>
      <group position={[p.radius, 0, 0]}>
        {/* Generous invisible hit target; small planets are hard to catch otherwise */}
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={() => setHover(false)}
          visible={false}
        >
          <sphereGeometry args={[Math.max(p.size * 2.4, 0.2), 16, 16]} />
          <meshBasicMaterial />
        </mesh>
        <group ref={scaler} rotation={[0, 0, p.tilt]}>
          <mesh ref={body}>
            <sphereGeometry args={[p.size, 64, 64]} />
            <meshStandardMaterial
              map={tex.map}
              bumpMap={tex.bumpMap}
              bumpScale={p.kind === "rocky" || p.kind === "earth" ? 0.004 : 0}
              roughness={rough}
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
              <ringGeometry
                args={[p.size * p.ring.inner, p.size * p.ring.outer, 128]}
              />
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
    </group>
  );
}

/** Hover state shared with the HTML click target over the sun. */
export const sunHover = { on: false };

/**
 * The star at the core: plasma surface, flames rooted on it, and a noisy
 * corona that merges with the surrounding stars. Brightens and swells while the pointer is over its click target.
 */
function Sun() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const surface = useRef<THREE.ShaderMaterial>(null);
  const flames = useRef<THREE.ShaderMaterial>(null);
  const corona = useRef<THREE.ShaderMaterial>(null);
  const coronaMesh = useRef<THREE.Mesh>(null);
  const boost = useRef(0);

  const surfaceU = useMemo(
    () => ({ uTime: { value: 0 }, uBoost: { value: 0 } }),
    [],
  );
  const flameU = useMemo(
    () => ({ uTime: { value: 0 }, uStrength: { value: 1 } }),
    [],
  );
  const coronaU = useMemo(
    () => ({ uTime: { value: 0 }, uStrength: { value: 1 } }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const b = (boost.current = THREE.MathUtils.damp(
      boost.current,
      sunHover.on ? 1 : 0,
      6,
      dt,
    ));
    if (surface.current) {
      surface.current.uniforms.uTime.value = t;
      surface.current.uniforms.uBoost.value = b;
    }
    if (flames.current) {
      flames.current.uniforms.uTime.value = t;
      flames.current.uniforms.uStrength.value = 1 + b * 0.8;
    }
    if (corona.current) {
      corona.current.uniforms.uTime.value = t;
      corona.current.uniforms.uStrength.value = 1 + b * 0.6;
    }
    if (coronaMesh.current)
      coronaMesh.current.quaternion.copy(state.camera.quaternion);
    if (group.current) {
      const s = 1 + b * 0.08 + Math.sin(t * 1.6) * 0.008;
      group.current.scale.setScalar(s);
      group.current.rotation.y = t * 0.05;
    }
    if (light.current) light.current.intensity = 18 + b * 10;
  });

  return (
    <group ref={group}>
      <pointLight
        ref={light}
        intensity={18}
        color="#ffb070"
        distance={10}
        decay={1.5}
      />
      <mesh>
        <sphereGeometry args={[0.46, 96, 96]} />
        <shaderMaterial
          ref={surface}
          vertexShader={SUN_VERT}
          fragmentShader={SUN_FRAG}
          uniforms={surfaceU}
        />
      </mesh>
      {/* Flames: tongues displaced out of the surface, additive so they dissolve into the stars */}
      <mesh>
        <sphereGeometry args={[0.468, 160, 160]} />
        <shaderMaterial
          ref={flames}
          vertexShader={FLAME_VERT}
          fragmentShader={FLAME_FRAG}
          uniforms={flameU}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Corona: camera-facing plane behind the star */}
      <mesh ref={coronaMesh} position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 4.2]} />
        <shaderMaterial
          ref={corona}
          vertexShader={CORONA_VERT}
          fragmentShader={CORONA_FRAG}
          uniforms={coronaU}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

const pointerNdc = { x: 0, y: 0 };

/** Camera drifts slightly with the pointer, always looking at the core. */
function CameraRig() {
  useFrame((state, dt) => {
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(
      cam.position.x,
      pointerNdc.x * 0.8,
      2.5,
      dt,
    );
    cam.position.y = THREE.MathUtils.damp(
      cam.position.y,
      3.6 - pointerNdc.y * 0.5,
      2.5,
      dt,
    );
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
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        // Planets are hoverable; the canvas never swallows wheel scrolling.
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#8a9cc4", "#3a2418", 0.9]} />
        <Backdrop />
        <Galaxy />
        <Sun />
        {PLANETS.map((p) => (
          <Planet key={p.name} {...p} />
        ))}
        <CameraRig />
      </Canvas>
      {/* Planet name labels; the scene positions them every frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {PLANETS.map((p) => (
          <span
            key={p.name}
            ref={(el) => {
              if (el) labelEls.set(p.name, el);
              else labelEls.delete(p.name);
            }}
            style={{ opacity: 0 }}
            className="absolute left-0 top-0 block select-none whitespace-nowrap rounded-full border border-fg/20 bg-bg/70 px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] text-fg uppercase backdrop-blur will-change-transform"
          >
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}

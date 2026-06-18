// Exempt dir. WebGL paper-deboss scene (React Three Fiber).
// A fullscreen quad shades real scanned paper (color + normal + roughness maps) and
// presses the wordmark into it: a height field from rendered text → deboss normal,
// RNM-blended with the paper grain normal so fiber continues into the cavity, plus
// cavity ambient occlusion and a raking directional light. (Aave-style: generate a
// map, drive real per-pixel lighting.)
"use client"
import { Canvas } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"

const RES_W = 1600
const RES_H = 900

function makeDebossTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = RES_W
  c.height = RES_H
  const ctx = c.getContext("2d")!
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.colorSpace = THREE.NoColorSpace

  const draw = () => {
    ctx.filter = "none"
    ctx.fillStyle = "#fff" // white = paper surface
    ctx.fillRect(0, 0, RES_W, RES_H)
    ctx.filter = "blur(2.5px)" // thinner cavity walls → narrower relief curves
    ctx.fillStyle = "#000" // black = pressed-in letters
    ctx.font = `700 170px "JetBrains Mono", ui-monospace, monospace`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, RES_W / 2, RES_H / 2)
    t.needsUpdate = true
  }
  draw()
  // redraw once the webfont is actually available (canvas uses fallback metrics otherwise)
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(draw)
  }
  return t
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uColor;
  uniform sampler2D uNormal;
  uniform sampler2D uRough;
  uniform sampler2D uDeboss;
  uniform vec2 uTexel;     // 1 / deboss resolution
  uniform vec2 uTile;      // paper tiling factor (aspect-corrected)
  uniform vec3 uLightDir;  // normalized, toward light
  uniform float uDebossStr;
  uniform float uDispScale;
  uniform float uInk;

  vec3 unpackN(vec3 n){ return normalize(n * 2.0 - 1.0); }

  void main() {
    // --- deboss height field + neighbours ---
    float hC = texture2D(uDeboss, vUv).r;
    float hL = texture2D(uDeboss, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uDeboss, vUv + vec2(uTexel.x, 0.0)).r;
    float hD = texture2D(uDeboss, vUv - vec2(0.0, uTexel.y)).r;
    float hU = texture2D(uDeboss, vUv + vec2(0.0, uTexel.y)).r;

    // height gradient drives both the relief normal and a texture displacement
    vec2 grad = vec2(hL - hR, hD - hU);

    // deboss tangent-space normal from the height gradient
    vec3 dN = normalize(vec3(grad * uDebossStr, 1.0));

    // displace the paper UVs by the bevel slope so the fiber warps INTO the cavity
    vec2 pUv = vUv * uTile + grad * uDispScale;

    // real paper grain normal (continues across the whole sheet)
    vec3 pN = unpackN(texture2D(uNormal, pUv).xyz);

    // RNM blend: reorient the deboss normal into the paper-grain tangent frame
    vec3 n1 = pN + vec3(0.0, 0.0, 1.0);
    vec3 n2 = dN * vec3(-1.0, -1.0, 1.0);
    vec3 N = normalize(n1 * dot(n1, n2) / n1.z - n2);

    // --- lighting ---
    vec3 L = normalize(uLightDir);
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float NdotL = max(dot(N, L), 0.0);
    float NdotH = max(dot(N, H), 0.0);

    // cavity ambient occlusion: concavity (positive laplacian) + letter interior
    float lap = hL + hR + hD + hU - 4.0 * hC;
    float inLetter = 1.0 - smoothstep(0.35, 0.65, hC);
    float ao = clamp(1.0 - max(lap, 0.0) * 5.0, 0.72, 1.0);
    ao *= mix(1.0, 0.92, inLetter);

    // --- material ---
    vec3 paper = texture2D(uColor, pUv).rgb;
    paper *= vec3(1.0, 0.965, 0.88);      // warm the white scan toward cream
    float rough = texture2D(uRough, pUv).r;

    vec3 ambient = paper * 0.64;
    vec3 diffuse = paper * NdotL * 0.42;
    float spec = pow(NdotH, mix(8.0, 26.0, 1.0 - rough)) * (1.0 - rough) * 0.014;

    vec3 col = (ambient + diffuse) * ao + spec;
    // faint ink left in the impression
    col = mix(col, col * vec3(0.86, 0.84, 0.78), inLetter * uInk);

    gl_FragColor = vec4(col, 1.0);
  }
`

function PaperQuad({ text }: { text: string }) {
  // Load + configure textures we construct ourselves (R3F renders continuously, so
  // they appear once decoded). Tiled with RepeatWrapping; correct color spaces.
  const { color, normal, rough } = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const mk = (url: string, srgb: boolean) => {
      const t = loader.load(url)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
      t.anisotropy = 8 // keep the zoomed grain crisp at the displaced/curved edges
      return t
    }
    return {
      color: mk("/paper/surface.jpg", true),
      normal: mk("/paper/normal.jpg", false),
      rough: mk("/paper/roughness.jpg", false),
    }
  }, [])

  const deboss = useMemo(() => makeDebossTexture(text), [text])

  const uniforms = useMemo(
    () => ({
      uColor: { value: color },
      uNormal: { value: normal },
      uRough: { value: rough },
      uDeboss: { value: deboss },
      uTexel: { value: new THREE.Vector2(1 / RES_W, 1 / RES_H) },
      uTile: { value: new THREE.Vector2((RES_W / RES_H) * 1.3, 1.3) },
      uLightDir: { value: new THREE.Vector3(-0.55, 0.62, 0.56).normalize() },
      uDebossStr: { value: 2.4 },
      uDispScale: { value: 0.04 },
      uInk: { value: 0.2 },
    }),
    [color, normal, rough, deboss],
  )

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

export default function PaperDebossScene({ text = "LayoutPick" }: { text?: string }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], near: 0, far: 1 }}
      gl={{ antialias: true }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <PaperQuad text={text} />
    </Canvas>
  )
}

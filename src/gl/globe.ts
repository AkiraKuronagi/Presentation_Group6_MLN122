import * as THREE from 'three'
import { type GLScene, anchorCamera, clamp01, easeInOut, easeOut, lerp, seg } from './stage'

export interface GlobeDots {
  land: number[]
  vn: number[]
}

export interface ArcSpec {
  from: [number, number]
  to: [number, number]
  kind: 'in' | 'out'
}

export interface GlobeTheme {
  dot: string
  vn: string
  gold: string
  red: string
  atmo: string
}

const DEG = Math.PI / 180

/** lat/lon (độ) → điểm trên mặt cầu bán kính r. lon=0,lat=0 hướng về +z (về phía camera). */
export function ll2v(lat: number, lon: number, r = 1) {
  const la = lat * DEG
  const lo = lon * DEG
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo))
}

const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180

const DOT_VERT = /* glsl */ `
  attribute float aRand;
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;
  uniform float uTwinkle;
  varying float vFacing;
  varying float vRand;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * position);
    vFacing = dot(n, normalize(cameraPosition - world.xyz));
    vRand = aRand;
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float tw = 1.0 + uTwinkle * 0.35 * sin(uTime * (1.2 + aRand * 2.0) + aRand * 40.0);
    gl_PointSize = min(uSize * uScale * tw / -mv.z, 18.0 * uScale);
  }
`
const DOT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFacing;
  varying float vRand;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.22, d);
    float face = smoothstep(-0.05, 0.4, vFacing);
    gl_FragColor = vec4(uColor, a * face * uAlpha * (0.75 + 0.25 * vRand));
  }
`

const ARC_VERT = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ARC_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDraw;
  uniform float uTime;
  uniform float uAlpha;
  uniform float uOffset;
  varying float vT;
  void main() {
    if (vT > uDraw) discard;
    float head = fract(uTime * 0.28 + uOffset);
    float dd = vT - head;
    float pulse = exp(-dd * dd * 900.0);
    float tip = smoothstep(uDraw - 0.06, uDraw, vT) * step(uDraw, 0.999);
    float base = 0.32 + 0.25 * vT;
    gl_FragColor = vec4(uColor * (base + pulse * 2.2 + tip * 1.5), uAlpha * (base + pulse + tip));
  }
`

const ATMO_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), 3.2);
    gl_FragColor = vec4(uColor, f * uAlpha);
  }
`

interface Params {
  lat: number
  lon: number
  dist: number
  offset: number
  arcsIn: number
  arcsOut: number
  vnGlow: number
  landAlpha: number
}

export class Globe implements GLScene {
  readonly name = 'globe'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100)
  private root = new THREE.Group()
  private landMat: THREE.ShaderMaterial
  private vnMat: THREE.ShaderMaterial
  private atmoMat: THREE.ShaderMaterial
  private gridMat: THREE.LineBasicMaterial
  private arcs: Array<{ mesh: THREE.Mesh; mat: THREE.ShaderMaterial; kind: 'in' | 'out'; delay: number }> = []
  private w = 1
  private h = 1
  /** điểm neo (px khung nhìn) & tỉ lệ sân khấu — do Stage cấp mỗi khung hình */
  private ax = -1
  private ay = -1
  private k = 1
  private cur: Params = { lat: 8, lon: -20, dist: 4.6, offset: 0, arcsIn: 0, arcsOut: 0, vnGlow: 0, landAlpha: 1 }
  private target: Params = { ...this.cur }
  private first = true
  /** nhãn HTML (do section quản lý) đọc vị trí màn hình qua project() */
  mode = 'hero'
  p = 0

  constructor(dots: GlobeDots, arcs: ArcSpec[], theme: GlobeTheme) {
    this.scene.add(this.root)
    this.root.rotation.order = 'XYZ'

    // Quả cầu che khuất (chỉ ghi depth) — giấu chấm ở mặt sau
    const occ = new THREE.Mesh(
      new THREE.SphereGeometry(0.985, 64, 48),
      new THREE.MeshBasicMaterial({ colorWrite: false }),
    )
    occ.renderOrder = -1
    this.root.add(occ)

    // Lưới kinh – vĩ tuyến rất mờ
    const gridPts: THREE.Vector3[] = []
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 3) gridPts.push(ll2v(lat, lon, 1.001), ll2v(lat, lon + 3, 1.001))
    }
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -84; lat < 84; lat += 3) gridPts.push(ll2v(lat, lon, 1.001), ll2v(lat + 3, lon, 1.001))
    }
    this.gridMat = new THREE.LineBasicMaterial({ color: theme.dot, transparent: true, opacity: 0.06, depthWrite: false })
    this.root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), this.gridMat))

    const mkPoints = (arr: number[], r: number, color: string, size: number, twinkle: number) => {
      const n = arr.length / 2
      const pos = new Float32Array(n * 3)
      const rnd = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        const v = ll2v(arr[i * 2], arr[i * 2 + 1], r)
        pos[i * 3] = v.x
        pos[i * 3 + 1] = v.y
        pos[i * 3 + 2] = v.z
        rnd[i] = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1))
      const m = new THREE.ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uSize: { value: size },
          uScale: { value: 1 },
          uTime: { value: 0 },
          uTwinkle: { value: twinkle },
          uAlpha: { value: 1 },
        },
      })
      this.root.add(new THREE.Points(g, m))
      return m
    }
    this.landMat = mkPoints(dots.land, 1.0, theme.dot, 7.5, 0.25)
    this.vnMat = mkPoints(dots.vn, 1.003, theme.vn, 6.5, 1)

    // Khí quyển (glow viền)
    this.atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(theme.atmo) }, uAlpha: { value: 0.9 } },
    })
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 48), this.atmoMat)
    this.scene.add(atmo) // không xoay theo root

    // Cung vốn (vào) & hàng hóa (ra)
    arcs.forEach((a, i) => this.addArc(a, i, theme))
  }

  private addArc(a: ArcSpec, i: number, theme: GlobeTheme) {
    const p0 = ll2v(a.from[0], a.from[1])
    const p1 = ll2v(a.to[0], a.to[1])
    const ang = p0.angleTo(p1)
    const lift = 0.06 + 0.32 * (ang / Math.PI)
    const pts: THREE.Vector3[] = []
    const N = 72
    for (let k = 0; k <= N; k++) {
      const t = k / N
      const v = new THREE.Vector3().copy(p0).lerp(p1, t).normalize()
      // slerp chính xác cho cung lớn
      if (ang > 0.001) {
        const s = Math.sin(ang)
        v.copy(p0).multiplyScalar(Math.sin((1 - t) * ang) / s).add(p1.clone().multiplyScalar(Math.sin(t * ang) / s))
      }
      v.multiplyScalar(1.004 + lift * Math.sin(Math.PI * t))
      pts.push(v)
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    const geo = new THREE.TubeGeometry(curve, 96, a.kind === 'in' ? 0.0042 : 0.0034, 6, false)
    const mat = new THREE.ShaderMaterial({
      vertexShader: ARC_VERT,
      fragmentShader: ARC_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(a.kind === 'in' ? theme.gold : theme.red) },
        uDraw: { value: 0 },
        uTime: { value: 0 },
        uAlpha: { value: 1 },
        uOffset: { value: (i * 0.137) % 1 },
      },
    })
    const mesh = new THREE.Mesh(geo, mat)
    this.root.add(mesh)
    this.arcs.push({ mesh, mat, kind: a.kind, delay: (i % 7) * 0.06 })
  }

  setPalette(theme: GlobeTheme, light: boolean) {
    this.landMat.uniforms.uColor.value.set(theme.dot)
    this.vnMat.uniforms.uColor.value.set(theme.vn)
    this.atmoMat.uniforms.uColor.value.set(theme.atmo)
    this.atmoMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending
    this.atmoMat.uniforms.uAlpha.value = light ? 0.35 : 0.9
    this.gridMat.color.set(theme.dot)
    this.arcs.forEach((a) => {
      a.mat.uniforms.uColor.value.set(a.kind === 'in' ? theme.gold : theme.red)
      a.mat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending
      a.mat.needsUpdate = true
    })
    this.atmoMat.needsUpdate = true
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.camera.aspect = w / h
    this.applyOffset()
    const s = h / 900
    this.landMat.uniforms.uScale.value = s * this.dpr()
    this.vnMat.uniforms.uScale.value = s * this.dpr()
  }

  private dpr() {
    return Math.min(window.devicePixelRatio || 1, 1.75)
  }

  setAnchor(x: number, y: number, k: number) {
    this.ax = x
    this.ay = y
    this.k = k
  }

  private applyOffset() {
    const x = this.ax < 0 ? this.w / 2 : this.ax
    const y = this.ay < 0 ? this.h / 2 : this.ay
    anchorCamera(this.camera, this.w, this.h, x + this.cur.offset * this.w, y)
  }

  /** Trạng thái đích theo chế độ + tiến độ cuộn */
  private compute(mode: string, p: number, t: number): Params {
    const narrow = this.w < 760
    if (mode === 'hero') {
      const a = seg(p, 0, 0.42)
      const b = seg(p, 0.28, 0.66)
      const c = seg(p, 0.62, 1)
      const start = wrap180(-25 + t * 3 * (1 - a))
      const delta = wrap180(106 - start)
      return {
        lon: start + delta * easeInOut(a),
        lat: lerp(6, 16, easeInOut(a)),
        dist: lerp(lerp(narrow ? 6.2 : 4.4, 3.0, easeInOut(a)), 1.62, easeInOut(c)),
        offset: 0,
        arcsIn: easeOut(b),
        arcsOut: easeOut(seg(p, 0.42, 0.78)),
        vnGlow: seg(p, 0.35, 0.8),
        landAlpha: 1 - 0.35 * c,
      }
    }
    if (mode === 'cover') {
      // bìa: quay từ Ấn Độ Dương về châu Á rồi đung đưa quanh Việt Nam (lệch phải tâm cầu), cung vốn – hàng hóa vẽ dần theo p
      const a = easeInOut(seg(p, 0, 1))
      return {
        lon: lerp(55, 94 + Math.sin(t * 0.12) * 7, a),
        lat: lerp(8, 14, a),
        dist: 3.25,
        offset: 0,
        arcsIn: easeOut(seg(p, 0.2, 0.8)),
        arcsOut: easeOut(seg(p, 0.45, 1)),
        vnGlow: seg(p, 0.3, 0.9),
        landAlpha: 1,
      }
    }
    if (mode === 'tariff') {
      // biên giới mềm: nhìn từ Thái Bình Dương thấy cả Việt Nam lẫn Bắc Mỹ, cung hàng hóa đỏ nổi bật
      return {
        lon: 172 + Math.sin(t * 0.15) * 4,
        lat: 24,
        dist: narrow ? 6 : 4.5,
        offset: 0,
        arcsIn: 0.15,
        arcsOut: easeOut(seg(p, 0, 1)),
        vnGlow: 1,
        landAlpha: 0.8,
      }
    }
    if (mode === 'fdi') {
      return {
        lon: 104 + Math.sin(t * 0.2) * 5,
        lat: 20,
        dist: narrow ? 4.6 : 3.05,
        offset: 0,
        arcsIn: 1,
        arcsOut: clamp01(p * 3),
        vnGlow: 1,
        landAlpha: 0.9,
      }
    }
    // footer — vòng lặp liền mạch
    return {
      lon: wrap180(106 + t * 7),
      lat: 14,
      dist: narrow ? 5.2 : 3.5,
      offset: 0,
      arcsIn: 1,
      arcsOut: 1,
      vnGlow: 1,
      landAlpha: 0.85,
    }
  }

  update(dt: number, t: number, mode: string, p: number) {
    this.mode = mode
    this.p = p
    this.target = this.compute(mode, p, t)
    const k = this.first ? 1 : 1 - Math.exp(-dt * 7)
    this.first = false
    const c = this.cur
    const g = this.target
    c.lon = c.lon + wrap180(g.lon - c.lon) * k
    c.lat = lerp(c.lat, g.lat, k)
    c.dist = lerp(c.dist, g.dist, k)
    c.offset = lerp(c.offset, g.offset, k)
    c.arcsIn = lerp(c.arcsIn, g.arcsIn, k)
    c.arcsOut = lerp(c.arcsOut, g.arcsOut, k)
    c.vnGlow = lerp(c.vnGlow, g.vnGlow, k)
    c.landAlpha = lerp(c.landAlpha, g.landAlpha, k)

    this.root.rotation.set(c.lat * DEG, -c.lon * DEG, 0)
    this.camera.position.set(0, 0, c.dist / Math.max(0.35, this.k))
    this.camera.lookAt(0, 0, 0)
    this.applyOffset()

    this.landMat.uniforms.uTime.value = t
    this.landMat.uniforms.uAlpha.value = c.landAlpha
    this.vnMat.uniforms.uTime.value = t
    this.vnMat.uniforms.uAlpha.value = 0.25 + 0.75 * c.vnGlow
    this.vnMat.uniforms.uSize.value = 6.5 + 4 * c.vnGlow

    for (const a of this.arcs) {
      const src = a.kind === 'in' ? c.arcsIn : c.arcsOut
      a.mat.uniforms.uDraw.value = clamp01((src - a.delay) / (1 - a.delay)) * 1.001
      a.mat.uniforms.uTime.value = t
      a.mesh.visible = src > 0.001
    }
  }

  /** Chiếu một điểm lat/lon ra toạ độ màn hình (px). front=false nếu ở mặt sau quả cầu. */
  project(lat: number, lon: number, r = 1.01) {
    const v = ll2v(lat, lon, r).applyMatrix4(this.root.matrixWorld)
    const n = v.clone().normalize()
    const toCam = this.camera.position.clone().sub(v).normalize()
    const front = n.dot(toCam) > 0.12
    v.project(this.camera)
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h, front }
  }
}

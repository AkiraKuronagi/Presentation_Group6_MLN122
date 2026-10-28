import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { type GLScene, anchorCamera, easeInOut, easeOut, lerp, seg } from './stage'

/**
 * "Những đế chế lớn hơn cả một quốc gia" — 4 tháp dữ liệu 3D, thang tuyến tính (tỷ USD).
 * Mỗi tháp là chồng lát kim loại mỏng; MỖI LÁT = 514,7 tỷ USD = đúng một GDP Việt Nam 2025,
 * nên tháp Việt Nam chỉ là 1 lát, còn tháp BlackRock ≈ 27 lát.
 *
 * mode 'rise': p 0→1 các tháp mọc lần lượt (Việt Nam, Apple trước; rồi 2 tháp khổng lồ vươn cao).
 */

type Tone = 'red' | 'steel' | 'blue' | 'gold'

export interface TowerSpec {
  id: string
  /** tỷ USD */
  value: number
  tone: Tone
  /** đoạn p mà tháp mọc */
  from: number
  to: number
}

export const TOWERS: TowerSpec[] = [
  { id: 'vn', value: 514.7, tone: 'red', from: 0.03, to: 0.2 }, // GDP Việt Nam 2025
  { id: 'apple', value: 416.2, tone: 'steel', from: 0.11, to: 0.28 }, // doanh thu Apple năm tài chính 2025
  { id: 'top100', value: 12677, tone: 'blue', from: 0.32, to: 0.86 }, // doanh thu 100 TNC phi tài chính lớn nhất 2025
  { id: 'blackrock', value: 14042, tone: 'gold', from: 0.38, to: 0.97 }, // tài sản BlackRock quản lý 31/12/2025
]

/** giá trị một lát (tỷ USD) = GDP Việt Nam 2025 */
export const SLICE_VALUE = 514.7

const MAX_H = 3.2
const UNIT = MAX_H / Math.max(...TOWERS.map((s) => s.value)) // đơn vị cảnh / tỷ USD
const PITCH = SLICE_VALUE * UNIT // bước một lát
const GAP = PITCH * 0.2 // khe giữa hai lát
const PLATE_T = PITCH - GAP
const SIDE = 0.44 // cạnh lát
const PLINTH_SIDE = 0.6 // cạnh bệ
const PLINTH_T = 0.04
const SPACING = 0.8
const RIG_Y = -1.5 // hạ cả cụm để tâm thị giác nằm ở gốc toạ độ (điểm neo)
const YAW = 0.5 // góc chéo 3/4
const ELEV = 0.3 // góc nhìn từ trên xuống (rad)
const DIST = 11.8

// thứ tự góc hộp (để ghi cạnh mà không tạo mảng mới)
const CX = [-1, 1, 1, -1]
const CZ = [-1, -1, 1, 1]

interface Palette {
  ink: string
  edge: Record<Tone, string>
  body: Record<Tone, string>
  plinth: string
  /** độ đậm nét lát, độ sáng cộng thêm khi có xung, vũng sáng dưới chân, quầng ở đỉnh, quầng nền */
  edgeA: number
  boost: number
  pool: number
  /** màu vũng dưới chân: null = theo màu tháp (phát sáng), còn lại = bóng đổ */
  poolTint: string | null
  flare: number
  grid: number
  dust: number
  halo: string
  haloA: number
  metal: number
  env: number
}

const DARK: Palette = {
  ink: '#ede6d6',
  edge: { red: '#e5383b', steel: '#8fa3b8', blue: '#4f8fcf', gold: '#e9b44c' },
  body: { red: '#9e2427', steel: '#3a4550', blue: '#1c3a5e', gold: '#6e5019' },
  plinth: '#111316',
  edgeA: 0.38,
  boost: 1,
  pool: 0.3,
  poolTint: null,
  flare: 0.85,
  grid: 0.2,
  dust: 0.55,
  halo: '#e9b44c',
  haloA: 0.08,
  metal: 0.82,
  env: 1.0,
}

const LIGHT: Palette = {
  ink: '#15130f',
  edge: { red: '#c2202b', steel: '#3d5368', blue: '#2f68a6', gold: '#9c6a12' },
  body: { red: '#c2202b', steel: '#6f8396', blue: '#2f68a6', gold: '#b5852c' },
  plinth: '#e9e3d6',
  edgeA: 0.55,
  boost: 0,
  pool: 0.12,
  poolTint: '#15130f',
  flare: 0,
  grid: 0.2,
  dust: 0.35,
  halo: '#ffffff',
  haloA: 0,
  metal: 0.55,
  env: 1.0,
}

// ── Shader nét viền lát: có xung sáng chạy dọc thân tháp ("dòng vốn" dâng lên liên tục) ──
const EDGE_VS = /* glsl */ `
  varying float vY;
  void main() {
    vY = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const EDGE_FS = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSpan;
  uniform float uPhase;
  uniform float uBoost;
  varying float vY;
  void main() {
    float span = uSpan + 1.2;
    float py = mod(uTime * 0.3 + uPhase * span, span) - 0.6;
    float band = exp(-pow((vY - py) / 0.16, 2.0));
    vec3 c = uColor * (1.0 + band * 1.1 * uBoost);
    gl_FragColor = vec4(c, clamp(uOpacity * (1.0 + band * 0.9), 0.0, 1.0));
    #include <colorspace_fragment>
  }
`

// ── Shader sàn lưới mảnh, mờ dần theo hình elip ──
const GRID_VS = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const GRID_FS = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform vec2 uRadius;
  varying vec2 vP;
  float lines(vec2 p, float stepSize, float width) {
    vec2 g = abs(fract(p / stepSize - 0.5) - 0.5) * stepSize;
    vec2 fw = fwidth(p) * width;
    vec2 l = 1.0 - smoothstep(vec2(0.0), fw, g);
    return max(l.x, l.y);
  }
  void main() {
    float minor = lines(vP, 0.2, 1.0);
    float major = lines(vP, 0.8, 1.4);
    float d = length(vP / uRadius);
    float fade = 1.0 - smoothstep(0.25, 1.0, d);
    float a = max(minor * 0.45, major) * fade * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`

// ── Bụi sáng lơ lửng trôi lên chậm (chiều sâu điện ảnh); vị trí tính trong shader theo uTime ──
const DUST_VS = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.03 + aSeed * 0.05), 3.4);
    p.x += sin(uTime * 0.15 + aSeed * 6.2832) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed) / -mv.z;
    vA = smoothstep(0.0, 0.5, p.y) * (1.0 - smoothstep(2.6, 3.4, p.y)) * (0.3 + 0.7 * aSeed);
  }
`
const DUST_FS = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vA * uOpacity);
    #include <colorspace_fragment>
  }
`
const DUST_COUNT = 80

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(255,255,255,0.4)')
  grd.addColorStop(0.65, 'rgba(255,255,255,0.08)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Ghi 12 cạnh của hộp vuông nửa cạnh a, cao y0..y1 (tâm ở trục y) vào mảng; trả về chỉ số tiếp theo */
function writeBox(arr: Float32Array, o: number, a: number, y0: number, y1: number) {
  let i = o
  for (let c = 0; c < 4; c++) {
    const n = (c + 1) & 3
    const x0 = CX[c] * a
    const z0 = CZ[c] * a
    const x1 = CX[n] * a
    const z1 = CZ[n] * a
    // cạnh đáy
    arr[i++] = x0; arr[i++] = y0; arr[i++] = z0
    arr[i++] = x1; arr[i++] = y0; arr[i++] = z1
    // cạnh đỉnh
    arr[i++] = x0; arr[i++] = y1; arr[i++] = z0
    arr[i++] = x1; arr[i++] = y1; arr[i++] = z1
    // cạnh đứng
    arr[i++] = x0; arr[i++] = y0; arr[i++] = z0
    arr[i++] = x0; arr[i++] = y1; arr[i++] = z0
  }
  return i
}

interface Tower {
  spec: TowerSpec
  group: THREE.Group
  /** chiều cao cuối (đơn vị cảnh, tính từ mặt bệ) */
  height: number
  /** [y0, y1] của từng lát, từ dưới lên */
  plates: Array<[number, number]>
  mesh: THREE.InstancedMesh
  bodyMat: THREE.MeshStandardMaterial
  edgePos: THREE.BufferAttribute
  edges: THREE.LineSegments
  edgeMat: THREE.ShaderMaterial
  cap: THREE.LineSegments
  capMat: THREE.LineBasicMaterial
  flare: THREE.Mesh
  flareMat: THREE.MeshBasicMaterial
  poolMat: THREE.MeshBasicMaterial
  /** tiến độ mọc đã làm mượt 0..1 */
  g: number
  /** chiều cao đã ghi vào buffer (bỏ qua cập nhật thừa) */
  drawn: number
}

export class Towers implements GLScene {
  readonly name = 'towers'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(28, 1, 0.1, 80)
  private rig = new THREE.Group()
  private towers: Tower[] = []
  private gridMat: THREE.ShaderMaterial
  private plinthMat: THREE.MeshBasicMaterial
  private plinthEdgeMat: THREE.LineBasicMaterial
  private halo: THREE.Sprite
  private dustMat: THREE.ShaderMaterial
  private renderer: THREE.WebGLRenderer
  private haloMat: THREE.SpriteMaterial
  private pal: Palette = DARK
  private w = 1
  private h = 1
  private ax = -1
  private ay = -1
  private k = 1
  private sm = { yaw: YAW + 0.3, dist: 0.8, look: -1.15 }
  private first = true
  private m4 = new THREE.Matrix4()
  private v = new THREE.Vector3()
  private c = new THREE.Vector3()

  constructor(renderer: THREE.WebGLRenderer, light: boolean) {
    this.renderer = renderer
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    this.scene.environment = pmrem.fromScene(room, 0.04).texture
    room.dispose()
    pmrem.dispose()
    this.scene.add(this.rig)

    // ánh sáng: chính (trước-phải), viền ấm (sau-trái), phụ lạnh
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(4, 2.2, 5)
    const rim = new THREE.DirectionalLight(0xffc27a, 1.6)
    rim.position.set(-4, 1.2, -2.5)
    const fill = new THREE.DirectionalLight(0x8fb0d8, 0.35)
    fill.position.set(-3, 0.5, 3)
    this.scene.add(key, rim, fill)

    const glowTex = makeGlowTexture()

    // ── Sàn lưới ──
    this.gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color() },
        uOpacity: { value: 0.15 },
        uRadius: { value: new THREE.Vector2(2.3, 1.35) },
      },
      vertexShader: GRID_VS,
      fragmentShader: GRID_FS,
      transparent: true,
      depthWrite: false,
    })
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), this.gridMat)
    grid.rotation.x = -Math.PI / 2
    grid.renderOrder = -2
    this.rig.add(grid)

    // ── Quầng sáng mờ phía sau hai tháp lớn (chiều sâu, ánh viền) ──
    this.haloMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    this.halo = new THREE.Sprite(this.haloMat)
    this.halo.position.set(SPACING, 1.9, -1.4)
    this.halo.scale.set(4.2, 4.6, 1)
    this.halo.renderOrder = -3
    this.rig.add(this.halo)

    // ── Bụi sáng ──
    const dustPos = new Float32Array(DUST_COUNT * 3)
    const dustSeed = new Float32Array(DUST_COUNT)
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 2.8
      dustPos[i * 3 + 1] = Math.random() * 3.4
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 1.8
      dustSeed[i] = Math.random()
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1))
    this.dustMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color() },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 40 },
      },
      vertexShader: DUST_VS,
      fragmentShader: DUST_FS,
      transparent: true,
      depthWrite: false,
    })
    const dust = new THREE.Points(dustGeo, this.dustMat)
    dust.frustumCulled = false
    this.rig.add(dust)

    // ── Bệ (dùng chung hình học & vật liệu) ──
    this.plinthMat = new THREE.MeshBasicMaterial({ toneMapped: false })
    this.plinthEdgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28, toneMapped: false })
    const plinthGeo = new THREE.BoxGeometry(PLINTH_SIDE, PLINTH_T, PLINTH_SIDE)
    const plinthEdgeGeo = new THREE.EdgesGeometry(plinthGeo)
    const plateGeo = new RoundedBoxGeometry(SIDE, PLATE_T, SIDE, 2, 0.012)
    const capGeo = new THREE.BufferGeometry()
    const capArr = new Float32Array(4 * 6)
    const ca = SIDE / 2 + 0.014
    for (let c = 0; c < 4; c++) {
      const n = (c + 1) & 3
      capArr.set([CX[c] * ca, 0, CZ[c] * ca, CX[n] * ca, 0, CZ[n] * ca], c * 6)
    }
    capGeo.setAttribute('position', new THREE.BufferAttribute(capArr, 3))
    const flareGeo = new THREE.PlaneGeometry(SIDE * 2.4, SIDE * 2.4)
    flareGeo.rotateX(-Math.PI / 2)
    const poolGeo = new THREE.PlaneGeometry(1.5, 1.5)
    poolGeo.rotateX(-Math.PI / 2)

    const n = TOWERS.length
    TOWERS.forEach((spec, i) => {
      const group = new THREE.Group()
      group.position.set((i - (n - 1) / 2) * SPACING, PLINTH_T, 0)
      this.rig.add(group)

      const plinth = new THREE.Mesh(plinthGeo, this.plinthMat)
      plinth.position.y = -PLINTH_T / 2
      const plinthEdge = new THREE.LineSegments(plinthEdgeGeo, this.plinthEdgeMat)
      plinthEdge.position.y = -PLINTH_T / 2
      group.add(plinth, plinthEdge)

      // các lát: [i·PITCH + GAP, (i+1)·PITCH], lát cuối cắt đúng chiều cao số liệu
      const height = spec.value * UNIT
      const plates: Array<[number, number]> = []
      const count = Math.ceil(height / PITCH - 1e-6)
      for (let j = 0; j < count; j++) {
        const y0 = j * PITCH + GAP
        const y1 = Math.min((j + 1) * PITCH, height)
        if (y1 - y0 < 0.006 && plates.length) plates[plates.length - 1][1] = height
        else plates.push([y0, y1])
      }

      const bodyMat = new THREE.MeshStandardMaterial({ metalness: 0.78, roughness: 0.3 })
      const mesh = new THREE.InstancedMesh(plateGeo, bodyMat, plates.length)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      mesh.count = 0
      // lát dưới tối hơn một chút (như bóng đổ tích tụ), lát trên sáng dần
      const col = new THREE.Color()
      plates.forEach((_, j) => {
        const f = plates.length > 1 ? j / (plates.length - 1) : 1
        const jitter = 0.97 + 0.06 * Math.abs(Math.sin(j * 12.9898 + i * 4.1))
        col.setScalar((0.38 + 0.62 * f * f) * jitter)
        mesh.setColorAt(j, col)
      })
      group.add(mesh)

      const edgeArr = new Float32Array(plates.length * 24 * 3)
      const edgePos = new THREE.BufferAttribute(edgeArr, 3)
      edgePos.setUsage(THREE.DynamicDrawUsage)
      const edgeGeo = new THREE.BufferGeometry()
      edgeGeo.setAttribute('position', edgePos)
      edgeGeo.setDrawRange(0, 0)
      const edgeMat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color() },
          uOpacity: { value: 0.5 },
          uTime: { value: 0 },
          uSpan: { value: height },
          uPhase: { value: i * 0.31 },
          uBoost: { value: 1 },
        },
        vertexShader: EDGE_VS,
        fragmentShader: EDGE_FS,
        transparent: true,
        depthWrite: false,
      })
      const edges = new THREE.LineSegments(edgeGeo, edgeMat)
      edges.frustumCulled = false
      group.add(edges)

      // khung sáng ở đỉnh: là "mặt cắt đang in" khi tháp mọc, là nắp sáng khi đứng yên
      const capMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, toneMapped: false })
      const cap = new THREE.LineSegments(capGeo, capMat)
      cap.frustumCulled = false
      const flareMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })
      const flare = new THREE.Mesh(flareGeo, flareMat)
      flare.frustumCulled = false
      group.add(cap, flare)

      // vũng sáng màu dưới chân tháp
      const poolMat = new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })
      const pool = new THREE.Mesh(poolGeo, poolMat)
      pool.position.y = -PLINTH_T + 0.002
      pool.renderOrder = -1
      group.add(pool)

      this.towers.push({ spec, group, height, plates, mesh, bodyMat, edgePos, edges, edgeMat, cap, capMat, flare, flareMat, poolMat, g: 0, drawn: -1 })
    })

    this.setTheme(light)
  }

  setTheme(light: boolean) {
    const P = (this.pal = light ? LIGHT : DARK)
    const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending
    this.gridMat.uniforms.uColor.value.set(P.ink)
    this.gridMat.uniforms.uOpacity.value = P.grid
    this.plinthMat.color.set(P.plinth)
    this.plinthEdgeMat.color.set(P.ink)
    this.haloMat.color.set(P.halo)
    this.dustMat.uniforms.uColor.value.set(P.ink)
    for (const T of this.towers) {
      const tone = T.spec.tone
      T.bodyMat.color.set(P.body[tone])
      T.bodyMat.metalness = P.metal
      T.bodyMat.envMapIntensity = P.env
      T.edgeMat.uniforms.uColor.value.set(P.edge[tone])
      T.edgeMat.uniforms.uOpacity.value = P.edgeA
      T.edgeMat.uniforms.uBoost.value = P.boost
      T.capMat.color.set(P.edge[tone])
      T.flareMat.color.set(P.edge[tone])
      T.poolMat.color.set(P.poolTint ?? P.edge[tone])
      if (T.flareMat.blending !== blend) {
        T.flareMat.blending = blend
        T.poolMat.blending = blend
        T.flareMat.needsUpdate = true
        T.poolMat.needsUpdate = true
      }
    }
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  setAnchor(x: number, y: number, k: number) {
    this.ax = x
    this.ay = y
    this.k = k
  }

  /** Dựng lại các lát + nét viền của một tháp ở chiều cao hiện tại hc */
  private build(T: Tower, hc: number) {
    const arr = T.edgePos.array as Float32Array
    const a = SIDE / 2 + 0.002
    let vis = 0
    let o = 0
    for (let j = 0; j < T.plates.length; j++) {
      const y0 = T.plates[j][0]
      const y1 = T.plates[j][1]
      if (y0 >= hc - 0.0005) break
      const top = Math.min(y1, hc)
      this.m4.makeScale(1, (top - y0) / PLATE_T, 1)
      this.m4.setPosition(0, (y0 + top) / 2, 0)
      T.mesh.setMatrixAt(vis, this.m4)
      o = writeBox(arr, o, a, y0, top)
      vis++
    }
    T.mesh.count = vis
    T.mesh.instanceMatrix.needsUpdate = true
    T.edgePos.needsUpdate = true
    T.edges.geometry.setDrawRange(0, vis * 24)
    T.drawn = hc
  }

  /**
   * mode 'rise' (mặc định cho mọi mode): p 0→1
   *  0.03–0.28  tháp Việt Nam rồi Apple mọc (camera đang gần, nhìn thấp vào hai tháp nhỏ)
   *  0.26–0.92  camera lùi & ngẩng lên; 0.32–0.97 hai tháp khổng lồ vươn cao
   *  p = 1      giữ nguyên; nền: xoay rất chậm quanh trục đứng, xung sáng chạy dọc thân tháp
   */
  update(dt: number, t: number, _mode: string, p: number) {
    const kk = this.first ? 1 : 1 - Math.exp(-dt * 8)
    this.first = false
    const P = this.pal

    const pull = easeInOut(seg(p, 0.26, 0.92))
    const s = this.sm
    s.yaw = lerp(s.yaw, YAW + 0.3 * (1 - easeInOut(seg(p, 0, 0.95))), kk)
    s.dist = lerp(s.dist, lerp(0.8, 1, pull), kk)
    s.look = lerp(s.look, lerp(-1.15, 0, pull), kk)

    this.rig.rotation.y = s.yaw + Math.sin(t * 0.09) * 0.1
    this.rig.position.y = RIG_Y

    // quầng nền hiện theo hai tháp lớn
    this.haloMat.opacity = P.haloA * easeInOut(seg(p, 0.35, 1))
    this.halo.visible = this.haloMat.opacity > 0.001
    const du = this.dustMat.uniforms
    du.uTime.value = t
    du.uOpacity.value = P.dust * easeInOut(seg(p, 0.25, 1))
    du.uSize.value = 0.04 * this.h * this.renderer.getPixelRatio() // kích thước hạt theo chiều cao khung nhìn

    for (let i = 0; i < this.towers.length; i++) {
      const T = this.towers[i]
      const big = T.spec.value > 5000
      const e = seg(p, T.spec.from, T.spec.to)
      const tg = big ? easeInOut(e) : easeOut(e)
      T.g = Math.abs(tg - T.g) < 1e-4 ? tg : lerp(T.g, tg, kk)
      const hc = T.g * T.height
      if (Math.abs(hc - T.drawn) > 1e-5) this.build(T, hc)

      const on = T.g > 0.001
      const growing = on && T.g < 0.999 ? Math.sin(Math.PI * Math.min(1, T.g * 1.15)) : 0
      // nhịp đập nhẹ ở tháp Việt Nam để kéo ánh nhìn
      const beat = T.spec.id === 'vn' ? 0.5 + 0.5 * Math.sin(t * 2.4) : 0
      T.cap.visible = on
      T.cap.position.y = hc + 0.003
      T.capMat.opacity = lerp(0.75, 1, growing) * (1 - 0.35 * beat * (1 - growing))
      T.flare.visible = on && P.flare > 0
      T.flare.position.y = hc + 0.004
      T.flareMat.opacity = P.flare * (growing * 0.9 + 0.12 + 0.18 * beat)
      T.poolMat.opacity = P.pool * Math.min(1, T.g * 3) * (1 + 0.6 * beat)
      T.edgeMat.uniforms.uTime.value = t
    }

    this.camera.position.set(0, Math.sin(ELEV), Math.cos(ELEV)).multiplyScalar((DIST * s.dist) / Math.max(0.35, this.k))
    this.camera.position.y += s.look
    this.camera.lookAt(0, s.look, 0)
    anchorCamera(this.camera, this.w, this.h, this.ax < 0 ? this.w / 2 : this.ax, this.ay < 0 ? this.h / 2 : this.ay)
    this.scene.updateMatrixWorld()
    this.camera.updateMatrixWorld()
  }

  /**
   * Toạ độ px khung nhìn để gắn nhãn HTML.
   *  'vn' | 'apple' | 'top100' | 'blackrock'  → đỉnh tháp (theo chiều cao đang mọc; y = điểm cao nhất của nắp trên màn hình)
   *  'base-…'                                 → chân tháp (y = điểm thấp nhất của bệ trên màn hình)
   * front = tháp đã bắt đầu mọc (với chân tháp luôn true).
   */
  project(id: string): { x: number; y: number; front?: boolean } {
    const base = id.startsWith('base-')
    const key = base ? id.slice(5) : id
    let T: Tower | null = null
    for (const tw of this.towers) if (tw.spec.id === key) T = tw
    if (!T) return { x: 0, y: 0, front: false }
    const y = base ? -PLINTH_T : T.g * T.height + 0.003
    const a = base ? PLINTH_SIDE / 2 : SIDE / 2 + 0.014
    // tâm → x
    this.c.set(0, y, 0)
    T.group.localToWorld(this.c)
    this.c.project(this.camera)
    // 4 góc → điểm cao nhất (đỉnh) / thấp nhất (chân) trên màn hình
    let sy = base ? -Infinity : Infinity
    for (let i = 0; i < 4; i++) {
      this.v.set(CX[i] * a, y, CZ[i] * a)
      T.group.localToWorld(this.v)
      this.v.project(this.camera)
      sy = base ? Math.max(sy, this.v.y * -1) : Math.min(sy, this.v.y * -1)
    }
    return {
      x: (this.c.x * 0.5 + 0.5) * this.w,
      y: (sy * 0.5 + 0.5) * this.h,
      front: base ? true : T.g > 0.02,
    }
  }
}

export function create(renderer: THREE.WebGLRenderer, light: boolean): GLScene {
  return new Towers(renderer, light)
}

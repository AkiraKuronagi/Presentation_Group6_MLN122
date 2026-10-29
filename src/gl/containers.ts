import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { type GLScene, anchorCamera, clamp01, easeOut, lerp, seg, smooth } from './stage'

/**
 * "Xuất khẩu lớn — nhập khẩu còn lớn hơn" (máy vi tính, sản phẩm điện tử & linh kiện).
 * Ba nhóm năm 2016 · 2024 · 2025 trên một bến cảng tối giản; mỗi nhóm 2 chồng container:
 * XUẤT KHẨU (vàng, phía trước) và NHẬP KHẨU (xanh, phía sau).
 * Quy ước 1 container = 10 tỷ USD; container trên cùng là phần lẻ (co chiều cao đúng tỷ lệ)
 * nên chiều cao mỗi chồng đúng bằng số liệu.
 *
 * mode 'stack': p 0→1 container rơi xuống xếp chồng lần lượt 2016 → 2024 → 2025 (mỗi năm XK rồi NK).
 * project(): 'x2016' 'n2016' 'x2024' 'n2024' 'x2025' 'n2025' = đỉnh chồng (bám theo chồng đang cao dần),
 *            'y2016' 'y2024' 'y2025' = chân nhóm năm (mép bến phía trước).
 */

// ── Số liệu (tỷ USD) ──
const YEARS = ['2016', '2024', '2025']
const EXPORT = [18.5, 72.6, 107.7]
const IMPORT = [27.8, 107.1, 150.7]
const UNIT = 10 // 1 container = 10 tỷ USD

// ── Container 40ft (12,19 × 2,59 × 2,44 m) thu nhỏ 1/10: dài theo x, cao theo y, rộng theo z ──
const CL = 1.219
const CH = 0.2591
const CW = 0.2438
/** tâm nhóm năm theo x · vị trí chồng XK (trước) / NK (sau) theo z */
const GX = [-1.86, 0, 1.86]
const ZX = 0.19
const ZN = -0.19
/** mép bến phía trước (z) */
const QUAY_FRONT = 0.78

// ── Nhịp rơi (theo p) ──
const DUR = 0.1 // mỗi container rơi trong 0.1 đơn vị p
const FALL = 0.66 // phần rơi tự do; phần còn lại là giảm chấn
const DROP = 1.25 // độ cao bắt đầu rơi so với chỗ đậu
const P0 = 0.02
const P1 = 0.88 // container cuối bắt đầu rơi tại đây

interface Theme {
  line: string
  gold: string
  steel: string
  xk: string
  nk: string
  floor: string
  face: string
  bg: string
  shadow: number
  env: number
  key: number
  rim: number
  fill: number
  lineA: number
  glow: number
}

const DARK: Theme = {
  line: '#ede6d6',
  gold: '#e9b44c',
  steel: '#8fa3b8',
  xk: '#b5852c',
  nk: '#4f8fcf',
  floor: '#262a30',
  face: '#121317',
  bg: '#0a0b0d',
  shadow: 0.75,
  env: 0.42,
  key: 2.1,
  rim: 2.4,
  fill: 0.6,
  lineA: 1,
  glow: 0.14,
}

const LIGHT: Theme = {
  line: '#15130f',
  gold: '#9c6a12',
  steel: '#3d5368',
  xk: '#b5852c',
  nk: '#2f68a6',
  floor: '#e9e3d6',
  face: '#cfc6b4',
  bg: '#f3eee3',
  shadow: 0.42,
  env: 0.75,
  key: 1.9,
  rim: 1.2,
  fill: 0.5,
  lineA: 0.8,
  glow: 0,
}

interface Stack {
  id: string
  x: number
  z: number
  kind: 0 | 1
  /** chiều cao hiện tại (đã làm mượt) — để gắn nhãn */
  top: number
  /** biến tạm cộng dồn chiều cao đã đáp */
  acc: number
  shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
}

interface Box {
  s: number
  y0: number
  h: number
  start: number
  shade: number
}

// ───────────────────────── Texture thủ tục ─────────────────────────

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { c, g: c.getContext('2d')! }
}

function toTex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Mặt hông: vân sóng dọc, ray trên/dưới, cột góc */
function sideCanvas() {
  const W = 1024
  const H = 224
  const { c, g } = canvas(W, H)
  const post = 20
  const rail = 13
  g.fillStyle = '#c8c8c8'
  g.fillRect(0, 0, W, H)
  const n = 34
  const pw = (W - post * 2) / n
  for (let i = 0; i < n; i++) {
    const x = post + i * pw
    const gr = g.createLinearGradient(x, 0, x + pw, 0)
    gr.addColorStop(0, '#8a8a8a')
    gr.addColorStop(0.16, '#d2d2d2')
    gr.addColorStop(0.42, '#ececec')
    gr.addColorStop(0.58, '#bdbdbd')
    gr.addColorStop(0.78, '#9c9c9c')
    gr.addColorStop(1, '#8a8a8a')
    g.fillStyle = gr
    g.fillRect(x, rail, pw + 0.5, H - rail * 2)
  }
  // ray trên / dưới
  g.fillStyle = '#a9a9a9'
  g.fillRect(0, 0, W, rail)
  g.fillRect(0, H - rail, W, rail)
  g.fillStyle = '#6c6c6c'
  g.fillRect(0, rail - 2, W, 2)
  g.fillRect(0, H - rail, W, 2)
  // cột góc + khối góc đúc
  g.fillStyle = '#b0b0b0'
  g.fillRect(0, 0, post, H)
  g.fillRect(W - post, 0, post, H)
  g.fillStyle = '#6a6a6a'
  g.fillRect(post - 2, 0, 2, H)
  g.fillRect(W - post, 0, 2, H)
  g.fillStyle = '#5c5c5c'
  ;[
    [0, 0],
    [W - post, 0],
    [0, H - rail - 6],
    [W - post, H - rail - 6],
  ].forEach(([x, y]) => g.fillRect(x + 3, y + 3, post - 6, rail))
  // viền tối: đường ngăn giữa các container khi xếp chồng
  g.strokeStyle = 'rgba(0,0,0,0.6)'
  g.lineWidth = 4
  g.strokeRect(2, 2, W - 4, H - 4)
  return c
}

/** Mặt đầu: 2 cánh cửa, 4 thanh khoá, khung cửa */
function doorCanvas() {
  const W = 256
  const H = 272
  const { c, g } = canvas(W, H)
  const post = 18
  const head = 20
  const sill = 18
  g.fillStyle = '#c6c6c6'
  g.fillRect(0, 0, W, H)
  const dw = W - post * 2
  const dh = H - head - sill
  // tấm cửa: gân ngang
  for (let leaf = 0; leaf < 2; leaf++) {
    const lx = post + (leaf * dw) / 2
    for (let k = 0; k < 5; k++) {
      const y = head + (k * dh) / 5
      const gr = g.createLinearGradient(0, y, 0, y + dh / 5)
      gr.addColorStop(0, '#dedede')
      gr.addColorStop(0.5, '#c4c4c4')
      gr.addColorStop(1, '#9e9e9e')
      g.fillStyle = gr
      g.fillRect(lx + 3, y + 2, dw / 2 - 6, dh / 5 - 4)
    }
  }
  // khe giữa hai cánh
  g.fillStyle = '#4f4f4f'
  g.fillRect(W / 2 - 2, head, 4, dh)
  // thanh khoá + tay nắm
  for (let leaf = 0; leaf < 2; leaf++) {
    const lx = post + (leaf * dw) / 2
    ;[0.26, 0.72].forEach((f) => {
      const x = lx + (dw / 2) * f
      g.fillStyle = '#5e5e5e'
      g.fillRect(x + 2, head - 4, 3, dh + 8)
      g.fillStyle = '#f2f2f2'
      g.fillRect(x - 2, head - 4, 4, dh + 8)
      g.fillStyle = '#7a7a7a'
      g.fillRect(x - 4, head - 8, 9, 8)
      g.fillRect(x - 4, H - sill, 9, 8)
      g.fillStyle = '#ededed'
      g.fillRect(x - 1, head + dh * 0.56, 12, 5)
    })
  }
  // khung cửa
  g.fillStyle = '#a2a2a2'
  g.fillRect(0, 0, post, H)
  g.fillRect(W - post, 0, post, H)
  g.fillRect(0, 0, W, head - 6)
  g.fillRect(0, H - sill + 6, W, sill - 6)
  g.fillStyle = '#5c5c5c'
  g.fillRect(post - 2, 0, 2, H)
  g.fillRect(W - post, 0, 2, H)
  g.strokeStyle = 'rgba(0,0,0,0.6)'
  g.lineWidth = 4
  g.strokeRect(2, 2, W - 4, H - 4)
  return c
}

/** Nóc: gân ngang mảnh */
function roofCanvas() {
  const W = 1024
  const H = 208
  const { c, g } = canvas(W, H)
  g.fillStyle = '#8e8e8e'
  g.fillRect(0, 0, W, H)
  for (let x = 22; x < W - 22; x += 14) {
    g.fillStyle = 'rgba(255,255,255,0.18)'
    g.fillRect(x, 10, 4, H - 20)
    g.fillStyle = 'rgba(0,0,0,0.12)'
    g.fillRect(x + 6, 10, 3, H - 20)
  }
  g.strokeStyle = '#7e7e7e'
  g.lineWidth = 10
  g.strokeRect(5, 5, W - 10, H - 10)
  return c
}

/** Mặt bến: khe tấm bê tông, mờ dần về phía sau & hai bên (mép trước sắc nét) */
function floorCanvas() {
  const W = 1024
  const H = 512
  const { c, g } = canvas(W, H)
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, W, H)
  g.strokeStyle = 'rgba(0,0,0,0.13)'
  g.lineWidth = 2
  for (let x = 0; x <= W; x += W / 16) {
    g.beginPath()
    g.moveTo(x, 0)
    g.lineTo(x, H)
    g.stroke()
  }
  for (let y = H; y >= 0; y -= H / 6) {
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(W, y)
    g.stroke()
  }
  // mặt nạ alpha
  g.globalCompositeOperation = 'destination-in'
  const gx = g.createLinearGradient(0, 0, W, 0)
  gx.addColorStop(0, 'rgba(0,0,0,0)')
  gx.addColorStop(0.16, 'rgba(0,0,0,1)')
  gx.addColorStop(0.84, 'rgba(0,0,0,1)')
  gx.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gx
  g.fillRect(0, 0, W, H)
  const gy = g.createLinearGradient(0, 0, 0, H)
  gy.addColorStop(0, 'rgba(0,0,0,0)')
  gy.addColorStop(0.45, 'rgba(0,0,0,1)')
  gy.addColorStop(1, 'rgba(0,0,0,1)')
  g.fillStyle = gy
  g.fillRect(0, 0, W, H)
  return c
}

/** Dải mờ hai đầu (cho mép bến, vạch kẻ) */
function fadeXCanvas() {
  const { c, g } = canvas(256, 4)
  const gx = g.createLinearGradient(0, 0, 256, 0)
  gx.addColorStop(0, 'rgba(255,255,255,0)')
  gx.addColorStop(0.16, 'rgba(255,255,255,1)')
  gx.addColorStop(0.84, 'rgba(255,255,255,1)')
  gx.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gx
  g.fillRect(0, 0, 256, 4)
  return c
}

/** Bóng tiếp xúc mềm dưới chân chồng */
function shadowCanvas() {
  const W = 512
  const H = 128
  const { c, g } = canvas(W, H)
  g.filter = 'blur(14px)'
  g.fillStyle = 'rgba(0,0,0,1)'
  g.fillRect(44, 34, W - 88, H - 68)
  g.filter = 'none'
  return c
}

/** Quầng sáng tròn mềm (hậu cảnh) */
function glowCanvas() {
  const { c, g } = canvas(256, 256)
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  // suy giảm kiểu Gauss để không lộ vành
  const e = Math.exp(-4.5)
  for (let i = 0; i <= 12; i++) {
    const a = (Math.exp(-((i / 12) ** 2) * 4.5) - e) / (1 - e)
    gr.addColorStop(i / 12, `rgba(255,255,255,${a.toFixed(4)})`)
  }
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  return c
}

/** Chữ vạch thang đo (CanvasTexture) */
function tickCanvas(text: string) {
  const { c, g } = canvas(512, 96)
  g.fillStyle = '#ffffff'
  g.font = '500 54px "Roboto Condensed", sans-serif'
  g.textBaseline = 'middle'
  g.fillText(text, 6, 50)
  return c
}

// ───────────────────────── Cảnh ─────────────────────────

export class Containers implements GLScene {
  readonly name = 'containers'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  private rig = new THREE.Group()
  private mesh: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshStandardMaterial[]>
  private alpha: THREE.InstancedBufferAttribute
  private stacks: Stack[] = []
  private boxes: Box[] = []
  private floorMat: THREE.MeshStandardMaterial
  private faceMat: THREE.MeshBasicMaterial
  private edgeMat: THREE.MeshBasicMaterial
  private lineMat: THREE.LineBasicMaterial
  private gridMat: THREE.LineDashedMaterial
  private tickMats: THREE.MeshBasicMaterial[] = []
  private ticks: THREE.Mesh[] = []
  private glow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  /** viền mảnh quanh mỗi chồng (cao dần theo chồng) */
  private outlinePos: THREE.BufferAttribute
  private outlineMat: THREE.LineBasicMaterial
  /** ánh nước lấp lánh trước mép bến: RGBA từng đỉnh */
  private waterCol: THREE.BufferAttribute
  private waterSeed: number[] = []
  private key: THREE.DirectionalLight
  private rim: THREE.DirectionalLight
  private fill: THREE.DirectionalLight
  private fog = new THREE.Fog(0x0a0b0d, 15, 32)
  private theme: Theme = DARK
  private w = 1
  private h = 1
  private ax = -1
  private ay = -1
  private k = 1
  private first = true
  private sm = { yaw: 0.62, el: 0.34, dist: 16.2, ground: 0 }
  // dùng lại mỗi khung hình (không tạo object mới trong update)
  private m4 = new THREE.Matrix4()
  private pos = new THREE.Vector3()
  private scl = new THREE.Vector3()
  private quat = new THREE.Quaternion()
  private col = new THREE.Color()
  private v = new THREE.Vector3()

  constructor(renderer: THREE.WebGLRenderer, light: boolean) {
    const pmrem = new THREE.PMREMGenerator(renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.scene.fog = this.fog
    this.scene.add(this.rig)

    // ánh sáng: key trước-trái-trên (mặt hông), viền ấm từ phải-sau (sáng mép đầu cửa), phụ lạnh thấp phía trước-phải
    this.key = new THREE.DirectionalLight(0xffffff, 2)
    this.key.position.set(-2, 6, 7)
    this.rim = new THREE.DirectionalLight(0xffc27a, 2)
    this.rim.position.set(7, 2.5, -2.5)
    this.fill = new THREE.DirectionalLight(0x9fc3ff, 0.6)
    this.fill.position.set(5, 1, 6)
    this.scene.add(this.key, this.rim, this.fill)

    this.buildData()

    // ── Container: 1 InstancedMesh, 4 vật liệu theo mặt (đầu cửa · nóc · đáy · hông) ──
    const sideTex = toTex(sideCanvas())
    const doorTex = toTex(doorCanvas())
    const roofTex = toTex(roofCanvas())
    const sideBump = toTex(sideCanvas(), false)
    const doorBump = toTex(doorCanvas(), false)
    const mk = (map: THREE.Texture | null, bump: THREE.Texture | null) => {
      const m = new THREE.MeshStandardMaterial({ color: 0xffffff, map, roughness: 0.58, metalness: 0.22, transparent: true })
      if (bump) {
        m.bumpMap = bump
        m.bumpScale = 1.6
      }
      // độ trong suốt riêng từng container (container mới hiện dần khi rơi)
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nattribute float aAlpha;\nvarying float vAlpha;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vAlpha = aAlpha;')
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying float vAlpha;')
          .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.a *= vAlpha;')
      }
      return m
    }
    const door = mk(doorTex, doorBump)
    const roof = mk(roofTex, null)
    roof.roughness = 0.85
    roof.metalness = 0.05
    const bottom = mk(null, null)
    bottom.color.set(0x3a3a3a)
    const side = mk(sideTex, sideBump)
    const geo = new THREE.BoxGeometry(CL, CH, CW)
    const n = this.boxes.length
    this.alpha = new THREE.InstancedBufferAttribute(new Float32Array(n), 1)
    this.alpha.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('aAlpha', this.alpha)
    // thứ tự nhóm mặt của BoxGeometry: +x −x +y −y +z −z
    this.mesh = new THREE.InstancedMesh(geo, [door, door, roof, bottom, side, side], n)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.frustumCulled = false
    this.rig.add(this.mesh)

    // ── Bến cảng ──
    const QW = 6.1
    const QD = 1.95
    this.floorMat = new THREE.MeshStandardMaterial({
      color: DARK.floor,
      map: toTex(floorCanvas()),
      roughness: 0.92,
      metalness: 0.05,
      transparent: true,
      depthWrite: false,
    })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(QW, QD), this.floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, QUAY_FRONT - QD / 2)
    floor.renderOrder = -2
    this.rig.add(floor)
    const fadeTex = toTex(fadeXCanvas(), false)
    // mặt đứng của bến (cho cảm giác dày)
    this.faceMat = new THREE.MeshBasicMaterial({ color: DARK.face, alphaMap: fadeTex, transparent: true, depthWrite: false })
    const face = new THREE.Mesh(new THREE.PlaneGeometry(QW, 0.16), this.faceMat)
    face.position.set(0, -0.08, QUAY_FRONT)
    face.renderOrder = -2
    this.rig.add(face)
    // vạch vàng an toàn ở mép bến
    this.edgeMat = new THREE.MeshBasicMaterial({ color: DARK.gold, alphaMap: fadeTex, transparent: true, depthWrite: false })
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(QW, 0.022), this.edgeMat)
    edge.rotation.x = -Math.PI / 2
    edge.position.set(0, 0.002, QUAY_FRONT - 0.03)
    edge.renderOrder = -1
    this.rig.add(edge)

    // vạch ô đỗ: dấu góc chữ L quanh chân mỗi chồng
    const pts: THREE.Vector3[] = []
    const tick = 0.11
    for (const s of this.stacks) {
      const x0 = s.x - CL / 2 - 0.035
      const x1 = s.x + CL / 2 + 0.035
      const z0 = s.z - CW / 2 - 0.03
      const z1 = s.z + CW / 2 + 0.03
      ;[
        [x0, z0, 1, 1],
        [x1, z0, -1, 1],
        [x0, z1, 1, -1],
        [x1, z1, -1, -1],
      ].forEach(([x, z, dx, dz]) => {
        pts.push(new THREE.Vector3(x, 0.003, z), new THREE.Vector3(x + dx * tick, 0.003, z))
        pts.push(new THREE.Vector3(x, 0.003, z), new THREE.Vector3(x, 0.003, z + dz * tick * 0.6))
      })
    }
    this.lineMat = new THREE.LineBasicMaterial({ color: DARK.line, transparent: true, opacity: 0, depthWrite: false })
    this.rig.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), this.lineMat))

    // thang đo phía sau: 50 · 100 · 150 tỷ USD (đường nét đứt rất mờ)
    const gpts: THREE.Vector3[] = []
    // đặt ngay mặt sau chồng NK để so chiều cao chính xác (không lệch phối cảnh)
    const zb = ZN - CW / 2 - 0.002
    const xl = GX[0] - CL / 2 - 0.3
    const xr = GX[2] + CL / 2 + 0.2
    ;[50, 100, 150].forEach((v) => {
      const y = (v / UNIT) * CH
      gpts.push(new THREE.Vector3(xl, y, zb), new THREE.Vector3(xr, y, zb))
    })
    gpts.push(new THREE.Vector3(xl, 0, zb), new THREE.Vector3(xl, (155 / UNIT) * CH, zb))
    const grid = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gpts), (this.gridMat = new THREE.LineDashedMaterial({ color: DARK.line, dashSize: 0.05, gapSize: 0.05, transparent: true, opacity: 0, depthWrite: false })))
    grid.computeLineDistances()
    this.rig.add(grid)
    ;['50', '100', '150 tỷ USD'].forEach((txt, i) => {
      const mat = new THREE.MeshBasicMaterial({ color: DARK.line, map: toTex(tickCanvas(txt)), transparent: true, opacity: 0, depthWrite: false })
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.234), mat)
      m.geometry.translate(0.625, 0, 0) // gốc ở mép trái chữ
      m.position.set(xl + 0.03, (([50, 100, 150][i] as number) / UNIT) * CH + 0.1, zb)
      this.rig.add(m)
      this.tickMats.push(mat)
      this.ticks.push(m)
    })

    // viền chồng: 4 cạnh đứng + 4 cạnh nóc mỗi chồng, cập nhật theo chiều cao hiện tại
    this.outlinePos = new THREE.BufferAttribute(new Float32Array(this.stacks.length * 16 * 3), 3)
    this.outlinePos.setUsage(THREE.DynamicDrawUsage)
    const og = new THREE.BufferGeometry()
    og.setAttribute('position', this.outlinePos)
    this.outlineMat = new THREE.LineBasicMaterial({ color: DARK.line, transparent: true, opacity: 0, depthWrite: false })
    const outline = new THREE.LineSegments(og, this.outlineMat)
    outline.frustumCulled = false
    this.rig.add(outline)

    // mặt nước: các vệt sáng ngắn lấp lánh
    const NW = 26
    const wp = new Float32Array(NW * 6)
    for (let i = 0; i < NW; i++) {
      const r1 = Math.abs(Math.sin(i * 91.7 + 3.1) * 4375.85) % 1
      const r2 = Math.abs(Math.sin(i * 47.3 + 1.7) * 2317.13) % 1
      const r3 = Math.abs(Math.sin(i * 13.1 + 7.9) * 9631.41) % 1
      const z = QUAY_FRONT + 0.14 + r2 * r2 * 0.75
      const x = (r1 - 0.5) * 5.4
      const len = 0.06 + r3 * 0.22
      wp.set([x - len / 2, -0.2, z, x + len / 2, -0.2, z], i * 6)
      this.waterSeed.push(r1 * 6.28, 0.6 + r3 * 1.1, 1 - r2 * 0.7)
    }
    const wg = new THREE.BufferGeometry()
    wg.setAttribute('position', new THREE.BufferAttribute(wp, 3))
    this.waterCol = new THREE.BufferAttribute(new Float32Array(NW * 8), 4)
    this.waterCol.setUsage(THREE.DynamicDrawUsage)
    wg.setAttribute('color', this.waterCol)
    this.rig.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false })))

    // quầng sáng phía sau cụm container (tách bóng khối khỏi nền tối)
    this.glow = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 5.4),
      new THREE.MeshBasicMaterial({ color: DARK.steel, map: toTex(glowCanvas(), false), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, dithering: true }),
    )
    this.glow.position.set(0.35, 2.0, -1.9)
    this.glow.renderOrder = -3
    this.rig.add(this.glow)

    // bóng tiếp xúc
    const shTex = toTex(shadowCanvas(), false)
    const shGeo = new THREE.PlaneGeometry(CL * 1.32, CW * 2.1)
    for (const s of this.stacks) {
      const m = new THREE.Mesh(shGeo, new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: shTex, transparent: true, opacity: 0, depthWrite: false }))
      m.rotation.x = -Math.PI / 2
      m.position.set(s.x + 0.04, 0.001, s.z + 0.02)
      m.renderOrder = -1
      this.rig.add(m)
      s.shadow = m
    }

    this.setTheme(light)
  }

  /** Dựng danh sách chồng & container + mốc thời gian rơi */
  private buildData() {
    let u = 0
    const starts: number[] = []
    YEARS.forEach((y, i) => {
      if (i > 0) u += 3 // nghỉ giữa các năm
      ;([0, 1] as const).forEach((kind) => {
        if (kind === 1) u += 1.5 // nghỉ giữa XK và NK
        const value = kind === 0 ? EXPORT[i] : IMPORT[i]
        const s: Stack = {
          id: (kind === 0 ? 'x' : 'n') + y,
          x: GX[i],
          z: kind === 0 ? ZX : ZN,
          kind,
          top: 0,
          acc: 0,
          shadow: null as unknown as Stack['shadow'],
        }
        const si = this.stacks.push(s) - 1
        const full = Math.floor(value / UNIT + 1e-6)
        const frac = value / UNIT - full
        const count = full + (frac > 1e-3 ? 1 : 0)
        for (let l = 0; l < count; l++) {
          const h = l < full ? CH : frac * CH
          // sắc độ hơi khác nhau giữa các container + tối nhẹ ở chân chồng (cảm giác che khuất)
          const r = Math.abs(Math.sin(si * 12.9898 + l * 78.233) * 43758.5453) % 1
          const shade = (0.9 + r * 0.14) * lerp(0.8, 1, smooth(clamp01(l / 3)))
          this.boxes.push({ s: si, y0: l * CH, h, start: 0, shade })
          starts.push(u)
          u += 1
        }
      })
    })
    const last = starts[starts.length - 1]
    this.boxes.forEach((b, i) => (b.start = P0 + ((P1 - P0) * starts[i]) / last))
  }

  setTheme(light: boolean) {
    const th = (this.theme = light ? LIGHT : DARK)
    this.floorMat.color.set(th.floor)
    this.faceMat.color.set(th.face)
    this.edgeMat.color.set(th.gold)
    this.lineMat.color.set(th.line)
    this.gridMat.color.set(th.line)
    this.tickMats.forEach((m) => m.color.set(th.line))
    this.outlineMat.color.set(th.line)
    this.glow.material.color.set(th.steel)
    this.col.set(th.line)
    for (let i = 0; i < this.waterCol.count; i++) this.waterCol.setXYZ(i, this.col.r, this.col.g, this.col.b)
    this.fog.color.set(th.bg)
    this.scene.environmentIntensity = th.env
    this.key.intensity = th.key
    this.rim.intensity = th.rim
    this.fill.intensity = th.fill
    const cx = new THREE.Color(th.xk)
    const cn = new THREE.Color(th.nk)
    this.boxes.forEach((b, i) => {
      this.col.copy(this.stacks[b.s].kind === 0 ? cx : cn).multiplyScalar(b.shade)
      this.mesh.setColorAt(i, this.col)
    })
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
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

  /**
   * mode 'stack' (mặc định):
   *  0.00–0.06  bến cảng hiện ra
   *  0.02–0.98  container rơi lần lượt: 2016 XK → NK, 2024 XK → NK, 2025 XK → NK
   *  camera chéo kiểu isometric, lắc rất chậm theo t
   */
  update(dt: number, t: number, _mode: string, p: number) {
    const k = this.first ? 1 : 1 - Math.exp(-dt * 6)
    const kTop = this.first ? 1 : 1 - Math.exp(-dt * 14)
    this.first = false
    const s = this.sm
    const e = easeOut(clamp01(p))
    s.yaw = lerp(s.yaw, lerp(0.7, 0.6, e) + Math.sin(t * 0.07) * 0.07, k)
    s.el = lerp(s.el, lerp(0.38, 0.33, e), k)
    s.dist = lerp(s.dist, lerp(17.2, 16.2, e), k)
    s.ground = lerp(s.ground, smooth(seg(p, 0, 0.06)), k)

    // ── container ──
    for (let i = 0; i < this.boxes.length; i++) {
      const b = this.boxes[i]
      const st = this.stacks[b.s]
      const u = (p - b.start) / DUR
      if (u <= 0) {
        this.m4.makeScale(0, 0, 0)
        this.mesh.setMatrixAt(i, this.m4)
        this.alpha.setX(i, 0)
        continue
      }
      const c = clamp01(u)
      let y = 0
      let sq = 0
      if (c < FALL) {
        const f = c / FALL
        y = DROP * (1 - f * f)
      } else {
        // chạm đất: nảy nhẹ + nén nhẹ rồi tắt dần
        const v = (c - FALL) / (1 - FALL)
        y = 0.035 * Math.exp(-4 * v) * Math.abs(Math.sin(v * Math.PI * 2)) * (1 - v)
        sq = 0.09 * Math.exp(-7 * v) * (1 - v)
      }
      const hv = b.h * (1 - sq) * 0.992
      this.pos.set(st.x, b.y0 + hv / 2 + y, st.z)
      this.scl.set(1 + sq * 0.25, hv / CH, 1 + sq * 0.25)
      this.m4.compose(this.pos, this.quat, this.scl)
      this.mesh.setMatrixAt(i, this.m4)
      this.alpha.setX(i, smooth(clamp01(c / 0.4)))
    }
    this.mesh.instanceMatrix.needsUpdate = true
    this.alpha.needsUpdate = true

    // ── chiều cao hiện tại của từng chồng (cho nhãn + bóng) ──
    for (const st of this.stacks) st.acc = 0
    for (const b of this.boxes) {
      const u = clamp01((p - b.start) / DUR)
      this.stacks[b.s].acc += b.h * smooth(seg(u, FALL * 0.8, FALL))
    }
    for (const st of this.stacks) {
      st.top = lerp(st.top, st.acc, kTop)
      st.shadow.material.opacity = this.theme.shadow * smooth(clamp01(st.top / CH)) * s.ground
    }

    // viền chồng
    const op = this.outlinePos
    const ex = 0.005
    for (let j = 0; j < this.stacks.length; j++) {
      const st = this.stacks[j]
      const x0 = st.x - CL / 2 - ex
      const x1 = st.x + CL / 2 + ex
      const z0 = st.z - CW / 2 - ex
      const z1 = st.z + CW / 2 + ex
      const y1 = st.top > 0.002 ? st.top + ex * 0.5 : 0
      const o = j * 16
      // 4 cạnh đứng
      this.edge(op, o, x0, 0, z0, x0, y1, z0)
      this.edge(op, o + 2, x1, 0, z0, x1, y1, z0)
      this.edge(op, o + 4, x0, 0, z1, x0, y1, z1)
      this.edge(op, o + 6, x1, 0, z1, x1, y1, z1)
      // 4 cạnh nóc
      this.edge(op, o + 8, x0, y1, z0, x1, y1, z0)
      this.edge(op, o + 10, x1, y1, z0, x1, y1, z1)
      this.edge(op, o + 12, x1, y1, z1, x0, y1, z1)
      this.edge(op, o + 14, x0, y1, z1, x0, y1, z0)
    }
    op.needsUpdate = true

    // ── bến cảng ──
    const g = s.ground
    this.floorMat.opacity = g
    this.faceMat.opacity = g
    this.edgeMat.opacity = g * 0.75
    this.lineMat.opacity = g * 0.32 * this.theme.lineA
    const gridA = smooth(seg(p, 0.08, 0.3))
    this.gridMat.opacity = gridA * 0.18 * this.theme.lineA
    for (let i = 0; i < this.ticks.length; i++) {
      this.tickMats[i].opacity = gridA * 0.55 * this.theme.lineA
      this.ticks[i].rotation.y = s.yaw * 0.85 // chữ thang đo gần như luôn quay về phía camera
    }
    this.outlineMat.opacity = 0.2 * this.theme.lineA * g
    this.glow.material.opacity = this.theme.glow * g * smooth(seg(p, 0.3, 1))
    this.glow.rotation.y = s.yaw
    // ánh nước
    const wc = this.waterCol
    for (let i = 0; i < wc.count / 2; i++) {
      const ph = this.waterSeed[i * 3]
      const sp = this.waterSeed[i * 3 + 1]
      const a = g * this.waterSeed[i * 3 + 2] * 0.22 * Math.pow(0.5 + 0.5 * Math.sin(t * sp + ph), 2) * this.theme.lineA
      wc.setW(i * 2, a)
      wc.setW(i * 2 + 1, a)
    }
    wc.needsUpdate = true

    // ── camera ──
    this.rig.position.set(-0.12, -1.72, 0)
    const d = s.dist / Math.max(0.35, this.k)
    this.camera.position.set(Math.sin(s.yaw) * Math.cos(s.el) * d, Math.sin(s.el) * d, Math.cos(s.yaw) * Math.cos(s.el) * d)
    this.camera.lookAt(0, 0, 0)
    anchorCamera(this.camera, this.w, this.h, this.ax < 0 ? this.w / 2 : this.ax, this.ay < 0 ? this.h / 2 : this.ay)
    this.camera.updateMatrixWorld()
    this.rig.updateMatrixWorld()
  }

  private edge(a: THREE.BufferAttribute, i: number, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
    a.setXYZ(i, x0, y0, z0)
    a.setXYZ(i + 1, x1, y1, z1)
  }

  /** Toạ độ px khung nhìn của điểm gắn nhãn HTML */
  project(id: string): { x: number; y: number; front?: boolean } {
    let front = true
    if (id[0] === 'y') {
      const i = YEARS.indexOf(id.slice(1))
      if (i < 0) return { x: 0, y: 0, front: false }
      this.v.set(GX[i], 0, QUAY_FRONT)
    } else {
      const st = this.stacks.find((s) => s.id === id)
      if (!st) return { x: 0, y: 0, front: false }
      // XK: lệch trái, mép trước · NK: lệch phải, mép sau → hai nhãn của một năm không chồng lên nhau
      this.v.set(st.x + (st.kind === 0 ? -0.2 : 0.2) * CL, st.top, st.z + (st.kind === 0 ? 0.5 : -0.5) * CW)
      front = st.top > CH * 0.15
    }
    this.v.applyMatrix4(this.rig.matrixWorld).project(this.camera)
    return { x: (this.v.x * 0.5 + 0.5) * this.w, y: (-this.v.y * 0.5 + 0.5) * this.h, front }
  }
}

export function create(renderer: THREE.WebGLRenderer, light: boolean): GLScene {
  return new Containers(renderer, light)
}

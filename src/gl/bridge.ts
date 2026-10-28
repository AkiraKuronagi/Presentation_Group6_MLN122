import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { type GLScene, anchorCamera, clamp01, easeInOut, easeOut, lerp, seg, smooth } from './stage'

/**
 * "FDI là cây cầu — chỉ thành BẬC THANG khi có nội lực".
 * Bờ trái: khối nền Việt Nam (điểm nhấn đỏ). Bờ phải cao hơn, lùi về xa: bệ vàng "hai đầu chuỗi giá trị".
 * mode 'morph':
 *   0.00–0.40  12 tấm ván kim loại bay vào, ghép thành cầu PHẲNG (chạm chân bệ nhưng không lên cao)
 *   0.45–1.00  dòng hạt vàng "nội lực" bốc lên từ bờ Việt Nam; ván lần lượt nâng thành CẦU THANG lên bệ vàng
 * mode 'flat': chỉ pha ghép cầu phẳng (p 0..1 ≙ 0..0.42 của 'morph').
 */

interface Pal {
  ink: string
  gold: string
  red: string
  bank: number
  bankMetal: number
  bankRough: number
  plank: number
  plankMetal: number
  plankRough: number
  edge: number
  grid: number
  env: number
  additive: boolean
  glow: number
}

const DARK: Pal = {
  ink: '#ede6d6',
  gold: '#e9b44c',
  red: '#e5383b',
  bank: 0x1f242b,
  bankMetal: 0.25,
  bankRough: 0.62,
  plank: 0x8fa3b8,
  plankMetal: 0.92,
  plankRough: 0.3,
  edge: 0.26,
  grid: 0.1,
  env: 0.55,
  additive: true,
  glow: 1,
}
const LIGHT: Pal = {
  ink: '#15130f',
  gold: '#9c6a12',
  red: '#c2202b',
  bank: 0xe4ddcf,
  bankMetal: 0.05,
  bankRough: 0.85,
  plank: 0x3d5368,
  plankMetal: 0.7,
  plankRough: 0.38,
  edge: 0.42,
  grid: 0.14,
  env: 0.9,
  additive: false,
  glow: 0,
}

// ── Kích thước (đơn vị cảnh). Trục x chạy dọc cầu: bờ Việt Nam (trái) → bệ vàng (phải) ──
const N = 12 // số tấm ván
const XA = -1.15 // mép bờ Việt Nam
const XB = 1.25 // chân bệ vàng
const TREAD = (XB - XA) / N // bề ngang mỗi bậc
const H = 2.0 // độ cao mặt bệ vàng
const RISE = H / N
const TH = 0.05 // độ dày ván
const BW = 0.62 // bề rộng cầu (trục z)
const G = -0.7 // mặt đất (đáy hai bờ)
const VN_X = (-2.0 + XA) / 2 // tâm khối Việt Nam
const VN_W = XA + 2.0
const VN_D = 1.0
const COL_W = 0.8
const COL_X = XB + 0.04 + COL_W / 2 // tâm trụ bờ phải
const COL_D = 0.95
const PLAT_T = 0.08
const PLAT_W = 0.92
const PLAT_X = XB + PLAT_W / 2 // tâm bệ vàng
const PLAT_D = 1.07
const CENTER_Y = 0.62 // hạ cả mô hình để tâm thị giác nằm ở gốc toạ độ
const NF = 260 // hạt chảy theo cầu thang
const NE = 110 // hạt bốc lên từ bờ Việt Nam

/** PRNG có hạt giống — hoạt ảnh giống nhau mỗi lần tải */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const fract = (v: number) => v - Math.floor(v)
/** vượt nhẹ rồi về đích — cảm giác ván "khớp" vào chỗ */
const backOut = (x: number) => {
  const c1 = 1.25
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function radialTexture(size: number, stops: Array<[number, number]>) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, a]) => grd.addColorStop(o, `rgba(255,255,255,${a})`))
  g.fillStyle = grd
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class Bridge implements GLScene {
  readonly name = 'bridge'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  private rig = new THREE.Group()
  private pal: Pal = DARK
  private w = 1
  private h = 1
  private ax = -1
  private ay = -1
  private k = 1
  private first = true
  private sm = { dist: 14, el: 0.3, glow: 0 }

  // vật liệu
  private bankMat: THREE.MeshStandardMaterial
  private plankMat: THREE.MeshStandardMaterial
  private goldMat: THREE.MeshStandardMaterial
  private redMat: THREE.MeshStandardMaterial
  private coreMat: THREE.MeshStandardMaterial
  private edgeMat: THREE.LineBasicMaterial
  private plankEdgeMat: THREE.LineBasicMaterial
  private gridMat: THREE.LineBasicMaterial
  private rulerMat: THREE.LineBasicMaterial
  private ghostMat: THREE.LineDashedMaterial
  private guideMat: THREE.LineDashedMaterial
  private nosingMat: THREE.MeshBasicMaterial
  private dotMat: THREE.PointsMaterial
  private glowMat: THREE.SpriteMaterial

  // ván cầu
  private planks: THREE.InstancedMesh
  private nosing: THREE.InstancedMesh
  private plankEdgeBase: Float32Array
  private plankEdgePos: Float32Array
  private plankEdges: THREE.LineSegments
  private start: Array<{ x: number; y: number; z: number; rx: number; ry: number; rz: number }> = []
  private tops = new Float32Array(N)

  // hạt "nội lực"
  private pPos = new Float32Array((NF + NE) * 3)
  private pCol = new Float32Array((NF + NE) * 4)
  private pGeo = new THREE.BufferGeometry()
  private pSeed = new Float32Array((NF + NE) * 5)

  private glow: THREE.Sprite
  private goldLight: THREE.PointLight
  private redLight: THREE.PointLight

  // dùng lại mỗi khung (không tạo object trong update)
  private dummy = new THREE.Object3D()
  private mA = new THREE.Matrix4()
  private mB = new THREE.Matrix4()
  private v = new THREE.Vector3()
  private gold = new THREE.Color()

  constructor(renderer: THREE.WebGLRenderer, light: boolean) {
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    this.scene.environment = pmrem.fromScene(room, 0.04).texture
    room.dispose()
    pmrem.dispose()
    this.scene.add(this.rig)
    this.rig.position.y = -CENTER_Y

    // ánh sáng: chính + viền ấm phía sau + đèn điểm vàng/đỏ ở hai bờ
    const key = new THREE.DirectionalLight(0xffffff, 1.25)
    key.position.set(3, 5, 4)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xffc27a, 1.6)
    rim.position.set(-2.5, 2.5, -4)
    this.scene.add(rim)
    this.goldLight = new THREE.PointLight(0xe9b44c, 1, 5, 2)
    this.goldLight.position.set(PLAT_X - 0.2, H + 0.6, 0.5)
    this.rig.add(this.goldLight)
    this.redLight = new THREE.PointLight(0xe5383b, 0.8, 3, 2)
    this.redLight.position.set(VN_X, 0.6, 0.4)
    this.rig.add(this.redLight)

    this.bankMat = new THREE.MeshStandardMaterial({ color: DARK.bank, metalness: 0.6, roughness: 0.48 })
    this.plankMat = new THREE.MeshStandardMaterial({ color: DARK.plank, metalness: 0.92, roughness: 0.3 })
    this.goldMat = new THREE.MeshStandardMaterial({ color: DARK.gold, metalness: 0.85, roughness: 0.28, emissive: DARK.gold, emissiveIntensity: 0.3 })
    this.redMat = new THREE.MeshStandardMaterial({ color: DARK.red, metalness: 0.2, roughness: 0.45, emissive: DARK.red, emissiveIntensity: 0.7 })
    this.coreMat = new THREE.MeshStandardMaterial({ color: DARK.red, metalness: 0.5, roughness: 0.3, emissive: DARK.red, emissiveIntensity: 0.1 })
    this.edgeMat = new THREE.LineBasicMaterial({ color: DARK.ink, transparent: true, opacity: DARK.edge, depthWrite: false })
    this.plankEdgeMat = new THREE.LineBasicMaterial({ color: DARK.ink, transparent: true, opacity: DARK.edge, depthWrite: false })
    this.gridMat = new THREE.LineBasicMaterial({ color: DARK.ink, transparent: true, opacity: DARK.grid, vertexColors: true, depthWrite: false })
    this.rulerMat = new THREE.LineBasicMaterial({ color: DARK.ink, transparent: true, opacity: 0.3, depthWrite: false })
    this.ghostMat = new THREE.LineDashedMaterial({ color: DARK.ink, transparent: true, opacity: 0, dashSize: 0.045, gapSize: 0.035, depthWrite: false })
    this.guideMat = new THREE.LineDashedMaterial({ color: DARK.gold, transparent: true, opacity: 0, dashSize: 0.06, gapSize: 0.05, depthWrite: false })
    this.nosingMat = new THREE.MeshBasicMaterial({ color: DARK.gold, toneMapped: false })

    // ── Lưới nền mờ dần theo bán kính (mặt đất bản vẽ) ──
    {
      const R = 3.0
      const step = 0.3
      const n = Math.round(R / step)
      const pts: number[] = []
      const cols: number[] = []
      const fade = (x: number, z: number) => Math.pow(clamp01(1 - Math.hypot(x, z) / R), 1.6)
      for (let i = -n; i <= n; i++) {
        for (let j = -n; j < n; j++) {
          const a = i * step
          const b0 = j * step
          const b1 = (j + 1) * step
          // đường song song trục z và trục x
          pts.push(a, G, b0, a, G, b1, b0, G, a, b1, G, a)
          cols.push(1, 1, 1, fade(a, b0), 1, 1, 1, fade(a, b1), 1, 1, 1, fade(b0, a), 1, 1, 1, fade(b1, a))
        }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
      geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 4))
      this.rig.add(new THREE.LineSegments(geo, this.gridMat))
    }

    // ── Hai bờ ──
    const block = (w: number, h: number, d: number, x: number, y: number, mat: THREE.Material, r = 0.02) => {
      const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat)
      m.position.set(x, y, 0)
      this.rig.add(m)
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), this.edgeMat)
      e.position.copy(m.position)
      this.rig.add(e)
      return m
    }
    // bờ Việt Nam: khối nền thấp, mặt trên có ô đỏ âm
    block(VN_W, -G, VN_D, VN_X, G / 2, this.bankMat)
    const IN = 0.09 // khoảng lùi của khung đỏ so với mép khối
    const inlay = new THREE.Mesh(new THREE.BoxGeometry(VN_W - IN * 2, 0.006, VN_D - IN * 2), this.coreMat)
    inlay.position.set(VN_X, 0.001, 0)
    this.rig.add(inlay)
    // khung đỏ mảnh viền quanh lõi
    const bar = 0.02
    const frame: Array<[number, number, number, number]> = [
      [VN_X, (VN_D - IN * 2) / 2, VN_W - IN * 2 + bar, bar],
      [VN_X, -(VN_D - IN * 2) / 2, VN_W - IN * 2 + bar, bar],
      [VN_X - (VN_W - IN * 2) / 2, 0, bar, VN_D - IN * 2],
      [VN_X + (VN_W - IN * 2) / 2, 0, bar, VN_D - IN * 2],
    ]
    frame.forEach(([x, z, w, d]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, d), this.redMat)
      m.position.set(x, 0.004, z)
      this.rig.add(m)
    })
    // vạch đỏ mảnh chạy quanh mặt trước khối
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(VN_W + 0.004, 0.018, VN_D + 0.004), this.redMat)
    stripe.position.set(VN_X, -0.09, 0)
    this.rig.add(stripe)
    // bờ phải: trụ cao + bệ vàng trên đỉnh
    block(COL_W, H - PLAT_T - G, COL_D, COL_X, (G + H - PLAT_T) / 2, this.bankMat)
    block(PLAT_W, PLAT_T, PLAT_D, PLAT_X, H - PLAT_T / 2, this.goldMat, 0.015)

    // thước đo độ cao trên mặt trụ (kiểu bản vẽ kỹ thuật): mỗi vạch = một bậc
    {
      const pts: number[] = []
      const x = XB + 0.04
      const z = COL_D / 2 + 0.002
      pts.push(x, 0, z, x, H - PLAT_T, z)
      for (let i = 0; i < N; i++) {
        const y = (i + 1) * RISE
        const len = (i + 1) % 3 === 0 ? 0.12 : 0.06
        pts.push(x, y, z, x + len, y, z)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
      this.rig.add(new THREE.LineSegments(geo, this.rulerMat))
    }

    // ── Bóng mờ cầu phẳng (nét đứt) + đường dẫn hướng chéo ──
    {
      const pts: number[] = []
      const z0 = -BW / 2
      const z1 = BW / 2
      pts.push(XA, 0, z0, XB, 0, z0, XA, 0, z1, XB, 0, z1)
      for (let i = 0; i <= N; i++) {
        const x = XA + i * TREAD
        pts.push(x, 0, z0, x, 0, z1)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
      const ghost = new THREE.LineSegments(geo, this.ghostMat)
      ghost.computeLineDistances()
      this.rig.add(ghost)

      const g2 = new THREE.BufferGeometry()
      g2.setAttribute('position', new THREE.Float32BufferAttribute([XA - 0.25, -RISE * 1.25, z1, XB + 0.3, H + RISE * 1.5, z1], 3))
      const guide = new THREE.LineSegments(g2, this.guideMat)
      guide.computeLineDistances()
      this.rig.add(guide)
    }

    // ── 12 tấm ván (InstancedMesh) + viền gộp 1 lần vẽ + gờ sáng vàng ──
    this.planks = new THREE.InstancedMesh(new RoundedBoxGeometry(TREAD * 0.9, TH, BW, 2, 0.008), this.plankMat, N)
    this.planks.frustumCulled = false
    this.rig.add(this.planks)
    this.nosing = new THREE.InstancedMesh(new THREE.BoxGeometry(0.014, 0.014, BW), this.nosingMat, N)
    this.nosing.frustumCulled = false
    this.rig.add(this.nosing)
    const eg = new THREE.EdgesGeometry(new THREE.BoxGeometry(TREAD * 0.9, TH, BW))
    this.plankEdgeBase = (eg.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
    this.plankEdgePos = new Float32Array(this.plankEdgeBase.length * N)
    const peg = new THREE.BufferGeometry()
    peg.setAttribute('position', new THREE.BufferAttribute(this.plankEdgePos, 3).setUsage(THREE.DynamicDrawUsage))
    this.plankEdges = new THREE.LineSegments(peg, this.plankEdgeMat)
    this.plankEdges.frustumCulled = false
    this.rig.add(this.plankEdges)

    const r = rng(6)
    for (let i = 0; i < N; i++) {
      this.start.push({
        x: (r() - 0.35) * 1.4,
        y: 1.0 + r() * 1.1,
        z: -0.3 + r() * 1.4,
        rx: (r() - 0.5) * 2.6,
        ry: (r() - 0.5) * 1.8,
        rz: (r() - 0.5) * 2.2,
      })
    }

    // ── Hạt "nội lực" ──
    for (let i = 0; i < NF + NE; i++) {
      const o = i * 5
      this.pSeed[o] = r() // pha
      this.pSeed[o + 1] = r() // tốc độ
      this.pSeed[o + 2] = r() * 2 - 1 // lệch z
      this.pSeed[o + 3] = r() // lệch cao / vị trí x
      this.pSeed[o + 4] = 0.45 + r() * 0.55 // độ sáng
    }
    this.pGeo.setAttribute('position', new THREE.BufferAttribute(this.pPos, 3).setUsage(THREE.DynamicDrawUsage))
    this.pGeo.setAttribute('color', new THREE.BufferAttribute(this.pCol, 4).setUsage(THREE.DynamicDrawUsage))
    this.dotMat = new THREE.PointsMaterial({
      size: 0.19,
      map: radialTexture(64, [
        [0, 1],
        [0.22, 0.85],
        [0.55, 0.16],
        [1, 0],
      ]),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const pts = new THREE.Points(this.pGeo, this.dotMat)
    pts.frustumCulled = false
    this.rig.add(pts)

    // quầng sáng trên bệ vàng
    this.glowMat = new THREE.SpriteMaterial({
      map: radialTexture(256, [
        [0, 0.55],
        [0.2, 0.28],
        [0.5, 0.07],
        [1, 0],
      ]),
      color: DARK.gold,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      opacity: 0,
    })
    this.glow = new THREE.Sprite(this.glowMat)
    this.glow.position.set(PLAT_X - 0.1, H + 0.1, 0)
    this.glow.scale.setScalar(2.8)
    this.rig.add(this.glow)

    this.setTheme(light)
  }

  setTheme(light: boolean) {
    const P = light ? LIGHT : DARK
    this.pal = P
    this.bankMat.color.set(P.bank)
    this.bankMat.metalness = P.bankMetal
    this.bankMat.roughness = P.bankRough
    this.plankMat.color.set(P.plank)
    this.plankMat.metalness = P.plankMetal
    this.plankMat.roughness = P.plankRough
    this.goldMat.color.set(P.gold)
    this.goldMat.emissive.set(P.gold)
    this.redMat.color.set(P.red)
    this.redMat.emissive.set(P.red)
    // lõi: đỏ thẫm như kính (tối) / ửng đỏ nhạt trên nền giấy (sáng)
    if (light) this.coreMat.color.set(P.bank).lerp(this.gold.set(P.red), 0.16)
    else this.coreMat.color.set(P.red).multiplyScalar(0.16)
    this.coreMat.emissive.set(P.red)
    for (const m of [this.edgeMat, this.plankEdgeMat, this.gridMat, this.rulerMat, this.ghostMat]) m.color.set(P.ink)
    this.edgeMat.opacity = P.edge
    this.plankEdgeMat.opacity = P.edge
    this.gridMat.opacity = P.grid
    this.rulerMat.opacity = P.edge * 1.1
    this.guideMat.color.set(P.gold)
    this.nosingMat.color.set(P.gold)
    this.goldLight.color.set(P.gold)
    this.redLight.color.set(P.red)
    this.scene.environmentIntensity = P.env
    const blend = P.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    this.dotMat.blending = blend
    this.glowMat.blending = blend
    this.glowMat.color.set(P.gold)
    this.dotMat.needsUpdate = true
    this.glowMat.needsUpdate = true
    // màu hạt: vàng, một số ánh trắng ấm (tối) / vàng đậm (sáng)
    this.gold.set(P.gold)
    for (let i = 0; i < NF + NE; i++) {
      const warm = light ? 0 : this.pSeed[i * 5 + 4] > 0.85 ? 0.45 : 0
      this.pCol[i * 4] = lerp(this.gold.r, 1, warm)
      this.pCol[i * 4 + 1] = lerp(this.gold.g, 0.95, warm)
      this.pCol[i * 4 + 2] = lerp(this.gold.b, 0.85, warm)
    }
    ;(this.pGeo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true
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

  /** Độ cao mặt cầu hiện tại tại toạ độ x (nội suy giữa tâm các ván) — đường đi của dòng hạt */
  private profile(x: number) {
    const s = (x - XA) / TREAD - 0.5
    if (s <= -1) return 0
    if (s >= N) return H
    const j = Math.floor(s)
    const f = s - j
    const y0 = j < 0 ? 0 : this.tops[j]
    const y1 = j + 1 >= N ? H : this.tops[j + 1]
    return lerp(y0, y1, f)
  }

  update(dt: number, t: number, mode: string, p: number) {
    const q = mode === 'flat' ? p * 0.42 : p
    const a = this.first ? 1 : 1 - Math.exp(-dt * 5)
    this.first = false
    const s = this.sm
    const build = easeInOut(seg(q, 0, 0.42))
    const climb = easeInOut(seg(q, 0.45, 1))
    const glowT = easeInOut(seg(q, 0.8, 1))
    s.dist = lerp(s.dist, lerp(12.9, 11.9, build) - 0.2 * climb, a)
    s.el = lerp(s.el, lerp(0.24, 0.3, climb), a)
    s.glow = lerp(s.glow, glowT, a)

    // ── camera ──
    const D = s.dist / Math.max(0.35, this.k)
    this.camera.position.set(0, Math.sin(s.el) * D, Math.cos(s.el) * D)
    this.camera.lookAt(0, 0, 0)
    anchorCamera(this.camera, this.w, this.h, this.ax < 0 ? this.w / 2 : this.ax, this.ay < 0 ? this.h / 2 : this.ay)
    this.rig.rotation.y = 0.5 + Math.sin(t * 0.22) * 0.035

    // ── ván: bay vào ghép phẳng rồi nâng thành bậc ──
    const d = this.dummy
    const base = this.plankEdgeBase
    const out = this.plankEdgePos
    for (let i = 0; i < N; i++) {
      const st = this.start[i]
      const fly = seg(q, 0.03 + i * 0.02, 0.18 + i * 0.02)
      const fe = easeOut(fly)
      const lift = seg(q, 0.48 + i * 0.03, 0.63 + i * 0.03)
      const x = XA + (i + 0.5) * TREAD
      const yFlat = -TH / 2
      const yStair = (i + 1) * RISE - TH / 2
      const y = lerp(yFlat, yStair, lift > 0 ? backOut(lift) : 0)
      d.position.set(x + st.x * (1 - fe), y + st.y * (1 - fe) * (1 - fe), st.z * (1 - fe))
      d.rotation.set(st.rx * (1 - fe), st.ry * (1 - fe), st.rz * (1 - fe) + Math.sin(Math.PI * lift) * 0.12)
      const sc = Math.max(0.0001, smooth(seg(fly, 0, 0.45)))
      d.scale.setScalar(sc)
      d.updateMatrix()
      this.planks.setMatrixAt(i, d.matrix)
      this.tops[i] = y + TH / 2

      // viền ván: biến đổi các đỉnh EdgesGeometry theo ma trận ván
      const m = d.matrix.elements
      const o = i * base.length
      for (let j = 0; j < base.length; j += 3) {
        const bx = base[j]
        const by = base[j + 1]
        const bz = base[j + 2]
        out[o + j] = m[0] * bx + m[4] * by + m[8] * bz + m[12]
        out[o + j + 1] = m[1] * bx + m[5] * by + m[9] * bz + m[13]
        out[o + j + 2] = m[2] * bx + m[6] * by + m[10] * bz + m[14]
      }

      // gờ vàng ở mép bậc: mọc dài ra khi ván đã khớp vào bậc
      const lit = easeOut(seg(lift, 0.75, 1))
      this.mB.makeScale(1, 1, Math.max(0.0001, lit))
      this.mB.setPosition(-TREAD * 0.45, TH / 2, 0)
      this.mA.multiplyMatrices(d.matrix, this.mB)
      this.nosing.setMatrixAt(i, this.mA)
    }
    this.planks.instanceMatrix.needsUpdate = true
    this.nosing.instanceMatrix.needsUpdate = true
    ;(this.plankEdges.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true

    // ── nét bản vẽ ──
    const P = this.pal
    this.ghostMat.opacity = P.edge * 1.3 * seg(q, 0.48, 0.62)
    this.guideMat.opacity = 0.55 * seg(q, 0.46, 0.58) * (1 - 0.5 * glowT)
    this.plankEdgeMat.opacity = P.edge * (0.6 + 0.4 * build)

    // ── bệ vàng phát sáng, bờ Việt Nam "thức tỉnh" ──
    const wake = seg(q, 0.42, 0.55)
    this.goldMat.emissiveIntensity = lerp(0.16, 0.48, s.glow) + 0.05 * Math.sin(t * 1.6) * s.glow
    this.goldLight.intensity = lerp(0.8, 4.5, s.glow)
    this.glowMat.opacity = lerp(0.12, 0.85, s.glow) * P.glow
    this.glow.visible = P.glow > 0
    this.glow.scale.setScalar(lerp(2.2, 3.2, s.glow))
    // quầng đặt SAU bệ (theo hướng nhìn) để không cắt qua trụ — thành ánh sáng ngược viền quanh bệ
    const ry = this.rig.rotation.y
    this.glow.position.set(PLAT_X + Math.sin(ry) * 1.3, H + 0.05, -Math.cos(ry) * 1.3)
    this.redMat.emissiveIntensity = lerp(0.35, 0.9, wake) + 0.08 * Math.sin(t * 2.2) * wake
    this.coreMat.emissiveIntensity = (this.pal.additive ? 1 : 0.3) * (lerp(0.03, 0.13, wake) + 0.02 * Math.sin(t * 2.2) * wake)
    this.redLight.intensity = lerp(0.5, 2.2, wake)

    // ── hạt: dòng chảy theo cầu thang + đốm bốc lên từ bờ Việt Nam ──
    const flowOn = seg(q, 0.45, 0.56) * (P.additive ? 1 : 0.8)
    const emberOn = seg(q, 0.42, 0.52) * (P.additive ? 1 : 0.7)
    const front = XA + TREAD * Math.min(N + 8, Math.max(0, (q - 0.46) / 0.03))
    const pos = this.pPos
    const col = this.pCol
    const seed = this.pSeed
    const x0 = VN_X - 0.1
    const x1 = PLAT_X + 0.05
    for (let i = 0; i < NF; i++) {
      const o = i * 5
      const u = fract(t * (0.07 + seed[o + 1] * 0.06) + seed[o])
      const x = lerp(x0, x1, u)
      const sink = 1 - smooth(seg(u, 0.84, 1)) // về cuối hạt chìm vào bệ vàng
      const y = this.profile(x) + (0.1 + seed[o + 3] * 0.2) * sink + Math.sin(t * 1.7 + i) * 0.012
      const z = seed[o + 2] * BW * 0.42 + Math.sin(t * 1.3 + i * 0.7) * 0.02
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      const fade = smooth(seg(u, 0, 0.07)) * (1 - smooth(seg(u, 0.9, 1)))
      const mask = 1 - smooth(seg(x, front - 0.3, front))
      col[i * 4 + 3] = flowOn * fade * mask * seed[o + 4]
    }
    for (let i = NF; i < NF + NE; i++) {
      const o = i * 5
      const u = fract(t * (0.14 + seed[o + 1] * 0.14) + seed[o])
      // bốc thẳng lên từ mặt khối rồi uốn dần về phía bậc đầu tiên
      const x = VN_X - VN_W * 0.36 + seed[o + 3] * VN_W * 0.72 + u * u * 0.55
      const y = 0.01 + u * (0.45 + seed[o + 4] * 0.55)
      const z = seed[o + 2] * VN_D * 0.34 * (1 - 0.5 * u) + Math.sin(t * 1.1 + i) * 0.025
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      col[i * 4 + 3] = emberOn * Math.pow(Math.sin(Math.PI * u), 1.5) * seed[o + 4] * 0.85
    }
    ;(this.pGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    ;(this.pGeo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true
  }

  /** Toạ độ px khung nhìn của điểm gắn nhãn: 'vn' bờ Việt Nam · 'top' bệ vàng · 'mid' giữa cầu */
  project(id: string): { x: number; y: number; front?: boolean } {
    const v = this.v
    if (id === 'vn') v.set(VN_X, 0, 0)
    else if (id === 'top') v.set(PLAT_X, H, 0)
    else if (id === 'mid') v.set(XA + N * 0.5 * TREAD, (this.tops[N / 2 - 1] + this.tops[N / 2]) / 2, 0)
    else return { x: 0, y: 0, front: false }
    this.rig.updateMatrixWorld()
    this.rig.localToWorld(v)
    v.project(this.camera)
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h, front: v.z < 1 }
  }
}

export function create(renderer: THREE.WebGLRenderer, light: boolean): GLScene {
  return new Bridge(renderer, light)
}

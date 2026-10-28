import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { type GLScene, anchorCamera, clamp01, easeInOut, easeOut, lerp, seg } from './stage'

/**
 * "Hai mặt của một hình thái" — vai trò lịch sử của chủ nghĩa tư bản.
 * Một đồng xu/huy chương kim loại dày, viền khía:
 *   mặt A (vàng ấm)      bánh răng · TÍCH CỰC  (phát triển lực lượng sản xuất, xã hội hoá sản xuất)
 *   mặt B (đỏ sẫm)       xiềng xích đứt + vết nứt · GIỚI HẠN (lợi nhuận của thiểu số, phân hoá giàu nghèo)
 * Mặt khắc vẽ bằng CanvasTexture (màu + bản đồ độ cao dùng chung cho bump & roughness).
 *
 * Mode:
 *   'spin'  p 0→0.5: bay vào, lật khoe mặt A rồi mặt B · p 0.5→1: nghiêng 3/4 rồi tự xoay chậm (theo thời gian)
 *   'a'/'b' bay vào và dừng ở góc 3/4 khoe một mặt, chỉ đung đưa nhẹ (cho slide nói riêng từng mặt)
 */

const TAU = Math.PI * 2
const R = 1 // bán kính đồng xu
const T = 0.19 // độ dày
const RF = 0.86 // bán kính mặt khắc (bên trong vành)
const FIELD = 0.02 // độ lõm của mặt khắc so với vành
const LIP = 0.04 // vát mép ngoài
const GROOVE = 0.007 // nửa bề rộng rãnh giữa hai nửa viền
const REEDS = 180 // số khía trên viền
const DIST = 7.6 // khoảng cách camera khi sân khấu cao bằng khung nhìn (k = 1)
const TILT = 0.3 // nghiêng trục quay về phía người xem (thấy mép trên)
const ROLL = -0.13 // nghiêng chéo cho động
const YAW = -0.72 // góc 3/4: mặt đồng xu hướng sang trái (về phía chữ)
const HALF_TURN = 4.6 // giây cho mỗi nửa vòng (đổi mặt)
const LINGER = 0.82 // 0..1: càng lớn càng "dừng" lâu ở mỗi mặt
const TEX = 1024
const FONT = '600 110px "Be Vietnam Pro", sans-serif'
const FONT_SMALL = '500 38px "Be Vietnam Pro", sans-serif'
const DUST = 260

type Side = 'A' | 'B'

interface Ink {
  field: string
  relief: string
  deep: string
  mid: string
  /** bản màu (có đổ bóng giả) hay bản độ cao */
  shade: boolean
}

interface Palette {
  A: Ink
  B: Ink
  gold: number
  red: number
  seam: number
  halo: string
  haloOpacity: number
  additive: boolean
  dustA: string
  dustB: string
  dustOpacity: number
  ring: string
  ringOpacity: number
  shadowOpacity: number
}

const DARK: Palette = {
  A: { field: '#946a26', relief: '#ebbb5c', deep: '#2e1b05', mid: '#b88a3e', shade: true },
  B: { field: '#540f14', relief: '#cf3f37', deep: '#120203', mid: '#7e2024', shade: true },
  gold: 0xd4a04a,
  red: 0x7c191d,
  seam: 0x141210,
  halo: '#e9b44c',
  haloOpacity: 0.3,
  additive: true,
  dustA: '#ede6d6',
  dustB: '#e9b44c',
  dustOpacity: 0.85,
  ring: '#8fa3b8',
  ringOpacity: 0.32,
  shadowOpacity: 0,
}

const LIGHT: Palette = {
  A: { field: '#8a6018', relief: '#e2ad4c', deep: '#2b1a04', mid: '#a87a2c', shade: true },
  B: { field: '#5a0b12', relief: '#d2363d', deep: '#1a0304', mid: '#8a1820', shade: true },
  gold: 0xbf8c32,
  red: 0x9e1a22,
  seam: 0x1c1813,
  halo: '#fffaf0',
  haloOpacity: 0.75,
  additive: false,
  dustA: '#9c6a12',
  dustB: '#3d5368',
  dustOpacity: 0.6,
  ring: '#3d5368',
  ringOpacity: 0.3,
  shadowOpacity: 0.2,
}

/** bản độ cao: trắng = nổi, xám = nền, đen = khắc lõm */
const HEIGHT_INK: Ink = { field: '#787878', relief: '#ffffff', deep: '#000000', mid: '#8a8a8a', shade: false }

const TEXT: Record<Side, { label: string; top: string; bottom: string }> = {
  A: { label: 'TÍCH CỰC', top: 'PHÁT TRIỂN LỰC LƯỢNG SẢN XUẤT', bottom: 'XÃ HỘI HOÁ SẢN XUẤT' },
  B: { label: 'GIỚI HẠN', top: 'VÌ LỢI NHUẬN CỦA THIỂU SỐ', bottom: 'PHÂN HOÁ GIÀU NGHÈO' },
}

/** số ngẫu nhiên có hạt giống — vẽ bản màu và bản độ cao phải trùng khít */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

let scratch: HTMLCanvasElement | null = null

/** Chữ chạy theo cung tròn (top: đọc trái→phải phía trên; bottom: phía dưới, chân chữ hướng ra ngoài) */
function arcText(g: CanvasRenderingContext2D, text: string, r: number, bottom: boolean) {
  const C = TEX / 2
  const chars = [...text.normalize('NFC')]
  const gap = 5
  const ws = chars.map((ch) => g.measureText(ch).width + gap)
  const total = ws.reduce((a, b) => a + b, 0) - gap
  let a = bottom ? Math.PI / 2 + total / r / 2 : -Math.PI / 2 - total / r / 2
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  chars.forEach((ch, i) => {
    const half = (ws[i] - gap) / 2 / r
    const am = bottom ? a - half : a + half
    g.save()
    g.translate(C + Math.cos(am) * r, C + Math.sin(am) * r)
    g.rotate(bottom ? am - Math.PI / 2 : am + Math.PI / 2)
    g.fillText(ch, 0, 0)
    g.restore()
    a += bottom ? -ws[i] / r : ws[i] / r
  })
  return total / r
}

function diamond(g: CanvasRenderingContext2D, x: number, y: number, s: number) {
  g.beginPath()
  g.moveTo(x, y - s)
  g.lineTo(x + s, y)
  g.lineTo(x, y + s)
  g.lineTo(x - s, y)
  g.closePath()
  g.fill()
}

/** Bánh răng: răng hình thang, chân răng là cung tròn */
function gearPath(g: CanvasRenderingContext2D, cx: number, cy: number, rOut: number, rIn: number, n: number) {
  const step = TAU / n
  g.beginPath()
  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2
    const pt = (r: number, f: number) => g.lineTo(cx + Math.cos(a + step * f) * r, cy + Math.sin(a + step * f) * r)
    pt(rIn, 0)
    pt(rOut, 0.13)
    pt(rOut, 0.41)
    pt(rIn, 0.54)
    g.arc(cx, cy, rIn, a + step * 0.54, a + step)
  }
  g.closePath()
}

/** Một mắt xích hở một đầu (đầu hở hướng về +x của hệ toạ độ cục bộ) */
function openLink(g: CanvasRenderingContext2D, w: number, h: number, open: number) {
  const r = h / 2
  const xr = w / 2 - r
  g.beginPath()
  g.arc(xr, 0, r, open, Math.PI / 2)
  g.lineTo(-xr, r)
  g.arc(-xr, 0, r, Math.PI / 2, Math.PI * 1.5)
  g.lineTo(xr, -r)
  g.arc(xr, 0, r, -Math.PI / 2, -open)
  g.stroke()
}

/** Vẽ một mặt đồng xu lên canvas 1024² (bản màu hoặc bản độ cao) */
function drawFace(c: HTMLCanvasElement, side: Side, ink: Ink, blur: number) {
  const g = c.getContext('2d')!
  const S = TEX
  const C = S / 2
  const rand = rng(side === 'A' ? 7 : 13)
  g.save()
  g.globalAlpha = 1
  g.fillStyle = ink.field
  g.fillRect(0, 0, S, S)

  // tia "sunburst" trên nền: các nan quạt xen kẽ → độ phủ đều ở mọi bán kính (không tạo vệt tròn ở tâm)
  g.fillStyle = ink.mid
  g.globalAlpha = ink.shade ? 0.12 : 0.4
  g.beginPath()
  for (let i = 0; i < 240; i += 2) {
    const a0 = (i / 240) * TAU
    const a1 = ((i + 1) / 240) * TAU
    g.moveTo(C, C)
    g.lineTo(C + Math.cos(a0) * 434, C + Math.sin(a0) * 434)
    g.lineTo(C + Math.cos(a1) * 434, C + Math.sin(a1) * 434)
    g.closePath()
  }
  g.fill()
  g.globalAlpha = 1

  // bậc vành + chuỗi hạt + chỉ tròn
  g.lineWidth = 18
  g.strokeStyle = ink.mid
  g.beginPath()
  g.arc(C, C, 503, 0, TAU)
  g.stroke()
  g.fillStyle = ink.relief
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * TAU
    g.beginPath()
    g.arc(C + Math.cos(a) * 468, C + Math.sin(a) * 468, 6.5, 0, TAU)
    g.fill()
  }
  g.strokeStyle = ink.relief
  g.lineWidth = 3
  g.beginPath()
  g.arc(C, C, 444, 0, TAU)
  g.stroke()

  // chữ chạy theo cung + hai điểm hình thoi ở đầu cung
  g.font = FONT_SMALL
  g.fillStyle = ink.relief
  const span = arcText(g, TEXT[side].top, 392, false)
  ;[-1, 1].forEach((s) => {
    const a = -Math.PI / 2 + s * (span / 2 + 0.07)
    diamond(g, C + Math.cos(a) * 405, C + Math.sin(a) * 405, 7)
  })
  const spanB = arcText(g, TEXT[side].bottom, 420, true)
  ;[-1, 1].forEach((s) => {
    const a = Math.PI / 2 + s * (spanB / 2 + 0.07)
    diamond(g, C + Math.cos(a) * 407, C + Math.sin(a) * 407, 7)
  })

  // biểu tượng
  const ey = 398
  if (side === 'A') {
    gearPath(g, C, ey, 162, 130, 14)
    g.fillStyle = ink.relief
    g.fill()
    // rãnh tròn + 6 lỗ khoét + trục giữa
    g.strokeStyle = ink.deep
    g.lineWidth = 8
    g.beginPath()
    g.arc(C, ey, 108, 0, TAU)
    g.stroke()
    g.fillStyle = ink.deep
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU - Math.PI / 2
      g.beginPath()
      g.arc(C + Math.cos(a) * 72, ey + Math.sin(a) * 72, 15, 0, TAU)
      g.fill()
    }
    g.beginPath()
    g.arc(C, ey, 30, 0, TAU)
    g.fill()
  } else {
    // xiềng xích đứt: hai mắt xích bị kéo rời theo một trục chéo
    const ang = -0.42
    const ux = Math.cos(ang)
    const uy = Math.sin(ang)
    const d = 152
    g.strokeStyle = ink.relief
    g.lineWidth = 32
    g.lineCap = 'butt'
    g.save()
    g.translate(C - ux * d, ey - uy * d)
    g.rotate(ang)
    openLink(g, 232, 116, 0.72)
    g.restore()
    g.save()
    g.translate(C + ux * d, ey + uy * d)
    g.rotate(ang + Math.PI)
    openLink(g, 232, 116, 0.72)
    g.restore()
    // tia gãy ở chỗ đứt
    g.lineWidth = 7
    g.lineCap = 'round'
    g.beginPath()
    for (const s of [-1, 1]) {
      for (const da of [-0.55, 0, 0.55]) {
        const a = ang + (s * Math.PI) / 2 + da
        g.moveTo(C + Math.cos(a) * 30, ey + Math.sin(a) * 30)
        g.lineTo(C + Math.cos(a) * (da === 0 ? 62 : 52), ey + Math.sin(a) * (da === 0 ? 62 : 52))
      }
    }
    g.stroke()
    // vết nứt chạy xuyên mặt, qua đúng chỗ đứt — khắc lõm
    const px = -uy
    const py = ux
    const pts: Array<[number, number]> = []
    for (let i = 0; i <= 14; i++) {
      const f = i / 14
      const along = lerp(-250, 205, f)
      const j = i === 0 || i === 14 ? 0 : (rand() - 0.5) * 46
      pts.push([C + px * along + ux * j, ey + py * along + uy * j])
    }
    g.strokeStyle = ink.deep
    g.lineCap = 'round'
    g.lineJoin = 'miter'
    for (let i = 0; i < pts.length - 1; i++) {
      const f = i / (pts.length - 1)
      g.lineWidth = 2 + 9 * Math.sin(Math.PI * f)
      g.beginPath()
      g.moveTo(pts[i][0], pts[i][1])
      g.lineTo(pts[i + 1][0], pts[i + 1][1])
      g.stroke()
    }
    // nhánh nứt nhỏ
    g.lineWidth = 3
    for (const [i, len, turn] of [
      [4, 70, 0.9],
      [9, 60, -1.0],
      [11, 45, 0.8],
    ] as const) {
      const [x0, y0] = pts[i]
      const a = Math.atan2(py, px) + turn
      g.beginPath()
      g.moveTo(x0, y0)
      g.lineTo(x0 + Math.cos(a) * len * 0.5 + (rand() - 0.5) * 12, y0 + Math.sin(a) * len * 0.5 + (rand() - 0.5) * 12)
      g.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len)
      g.stroke()
    }
  }

  // nhãn chính
  g.font = FONT
  g.fillStyle = ink.relief
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  g.fillText(TEXT[side].label.normalize('NFC'), C, 728, 660)

  // gạch phân cách
  g.fillRect(C - 130, 778, 100, 3)
  g.fillRect(C + 30, 778, 100, 3)
  diamond(g, C, 779.5, 9)

  if (ink.shade) {
    // đổ bóng giả: sáng nhẹ góc trên-trái, tối dần sát vành
    const rg = g.createRadialGradient(C * 0.78, C * 0.62, 30, C, C, C)
    rg.addColorStop(0, 'rgba(255,255,255,0.10)')
    rg.addColorStop(0.62, 'rgba(255,255,255,0)')
    rg.addColorStop(0.86, 'rgba(0,0,0,0.06)')
    rg.addColorStop(1, 'rgba(0,0,0,0.42)')
    g.fillStyle = rg
    g.fillRect(0, 0, S, S)
  }
  g.restore()

  if (blur > 0) {
    // làm mềm bản độ cao → gờ nổi bo tròn thay vì bậc thang
    scratch ??= document.createElement('canvas')
    scratch.width = S
    scratch.height = S
    const sg = scratch.getContext('2d')!
    sg.clearRect(0, 0, S, S)
    sg.drawImage(c, 0, 0)
    g.save()
    g.filter = `blur(${blur}px)`
    g.drawImage(scratch, 0, 0)
    g.restore()
  }
}

function makeCanvas() {
  const c = document.createElement('canvas')
  c.width = TEX
  c.height = TEX
  return c
}

/** Đốm sáng mềm dùng cho quầng sáng và bóng đổ */
function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  rg.addColorStop(0.7, 'rgba(255,255,255,0.1)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Dải viền khía: ống hở hai đầu, bán kính dao động theo góc (đỉnh khía = R, rãnh khía lùi vào trong) */
function reededBand(z0: number, z1: number) {
  const geo = new THREE.CylinderGeometry(R, R, Math.abs(z1 - z0), REEDS * 4, 1, true)
  geo.rotateX(Math.PI / 2)
  geo.translate(0, 0, (z0 + z1) / 2)
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const a = Math.atan2(y, x)
    const wave = Math.max(-1, Math.min(1, Math.cos(a * REEDS) * 1.6))
    const r = R - 0.0075 * (0.5 - 0.5 * wave)
    pos.setXY(i, Math.cos(a) * r, Math.sin(a) * r)
  }
  geo.computeVertexNormals()
  return geo
}

/** Vành nổi + vát mép của một mặt (s = +1 mặt A, -1 mặt B) */
function lipGeometry(s: number) {
  const top = T / 2
  const prof: Array<[number, number]> = [
    [RF - 0.002, top - FIELD],
    [RF + 0.01, top - FIELD * 0.35],
    [RF + 0.022, top],
    [R - LIP, top],
    [R - LIP * 0.35, top - LIP * 0.25],
    [R, top - LIP],
  ]
  const pts = prof.map(([r, z]) => new THREE.Vector2(r, z * s))
  if (s < 0) pts.reverse()
  const geo = new THREE.LatheGeometry(pts, 192)
  geo.rotateX(Math.PI / 2) // trục quay Y → Z (mặt đồng xu hướng ±Z)
  return geo
}

const DUST_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uViewH;
  attribute vec4 aSeed; // x: cỡ · y: pha · z: tốc độ · w: pha màu
  varying float vAlpha;
  varying float vTint;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + 1.35 + uTime * aSeed.z, 2.7) - 1.35;
    p.x += sin(uTime * 0.31 + aSeed.y * 6.2831) * 0.07;
    p.z += cos(uTime * 0.23 + aSeed.y * 4.1) * 0.05;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSeed.x * projectionMatrix[1][1] * uViewH * 0.5 / -mv.z;
    float edge = smoothstep(1.35, 0.95, abs(p.y)) * smoothstep(1.28, 0.9, abs(p.x));
    float tw = 0.45 + 0.55 * pow(0.5 + 0.5 * sin(uTime * (0.7 + aSeed.z * 9.0) + aSeed.y * 40.0), 2.0);
    vAlpha = edge * tw;
    vTint = aSeed.w;
  }
`

const DUST_FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(mix(uColorA, uColorB, vTint), a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`

export class Coin implements GLScene {
  readonly name = 'coin'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  /** bay vào + nghiêng trục quay */
  private rig = new THREE.Group()
  /** quay quanh trục (Y cục bộ) */
  private spin = new THREE.Group()
  /** thân đồng xu: mặt A hướng +Z, mặt B hướng −Z */
  private coin = new THREE.Group()
  private orbit = new THREE.Group()
  private halo: THREE.Mesh
  private renderer: THREE.WebGLRenderer
  private pmrem: THREE.PMREMGenerator
  private light = false
  private pal: Palette = DARK
  private colorCanvas: Record<Side, HTMLCanvasElement> = { A: makeCanvas(), B: makeCanvas() }
  private heightCanvas: Record<Side, HTMLCanvasElement> = { A: makeCanvas(), B: makeCanvas() }
  private colorTex: Record<Side, THREE.CanvasTexture>
  private heightTex: Record<Side, THREE.CanvasTexture>
  private goldMat: THREE.MeshStandardMaterial
  private redMat: THREE.MeshPhysicalMaterial
  private seamMat: THREE.MeshStandardMaterial
  private haloMat: THREE.MeshBasicMaterial
  private shadowMat: THREE.MeshBasicMaterial
  private ringMat: THREE.LineBasicMaterial
  private dustMat: THREE.ShaderMaterial
  private w = 1
  private h = 1
  private ax = -1
  private ay = -1
  private k = 1
  /** pha tự xoay (đơn vị: nửa vòng) — tích luỹ theo dt để nối mượt với hoạt ảnh theo p */
  private u = 0
  private first = true
  private tg = { x: 0, y: 0, z: 0, scale: 1, rotY: 0, tiltX: 0, rollZ: 0, spinOn: 0, sway: 0, fx: 0 }
  private sm = { x: 0, y: 0, z: 0, scale: 1, rotY: 0, tiltX: 0, rollZ: 0, spinOn: 0, sway: 0, fx: 0 }
  private v = new THREE.Vector3()
  private n = new THREE.Vector3()
  private dv = new THREE.Vector3()

  constructor(renderer: THREE.WebGLRenderer, light: boolean) {
    this.renderer = renderer
    this.pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    this.scene.environment = this.pmrem.fromScene(room, 0.04).texture
    room.dispose()
    this.scene.environmentIntensity = 0.95
    this.scene.environmentRotation.set(0.2, -0.6, 0)

    // ── Ánh sáng: chính ấm phía trước-phải, hai đèn viền phía sau (vàng ấm trái, thép lạnh phải) ──
    const key = new THREE.DirectionalLight(0xfff1dc, 1.6)
    key.position.set(3, 4, 6)
    const rimWarm = new THREE.DirectionalLight(0xffc27a, 3.2)
    rimWarm.position.set(-5, 3, -4)
    const rimCool = new THREE.DirectionalLight(0x9fb6d0, 2.2)
    rimCool.position.set(5, -2.5, -3)
    this.scene.add(key, rimWarm, rimCool)

    // ── Mặt khắc ──
    const tex = (c: HTMLCanvasElement, srgb: boolean) => {
      const t = new THREE.CanvasTexture(c)
      if (srgb) t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      return t
    }
    this.colorTex = { A: tex(this.colorCanvas.A, true), B: tex(this.colorCanvas.B, true) }
    this.heightTex = { A: tex(this.heightCanvas.A, false), B: tex(this.heightCanvas.B, false) }
    this.drawHeights()

    const faceA = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: this.colorTex.A,
      bumpMap: this.heightTex.A,
      bumpScale: 1.9,
      roughnessMap: this.heightTex.A,
      roughness: 0.7,
      metalness: 1,
    })
    const faceB = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: this.colorTex.B,
      bumpMap: this.heightTex.B,
      bumpScale: 1.9,
      roughnessMap: this.heightTex.B,
      roughness: 0.7,
      metalness: 0.84,
      clearcoat: 0.4,
      clearcoatRoughness: 0.18,
    })
    const disc = new THREE.CircleGeometry(RF + 0.001, 160)
    const mA = new THREE.Mesh(disc, faceA)
    mA.position.z = T / 2 - FIELD
    const mB = new THREE.Mesh(disc, faceB)
    mB.rotation.y = Math.PI
    mB.position.z = -(T / 2 - FIELD)

    // ── Vành, viền khía, rãnh giữa ──
    this.goldMat = new THREE.MeshStandardMaterial({ color: DARK.gold, metalness: 1, roughness: 0.3, side: THREE.DoubleSide })
    this.redMat = new THREE.MeshPhysicalMaterial({
      color: DARK.red,
      metalness: 0.92,
      roughness: 0.32,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    })
    this.seamMat = new THREE.MeshStandardMaterial({ color: DARK.seam, metalness: 0.9, roughness: 0.45, side: THREE.DoubleSide })
    const lipA = new THREE.Mesh(lipGeometry(1), this.goldMat)
    const lipB = new THREE.Mesh(lipGeometry(-1), this.redMat)
    const bandA = new THREE.Mesh(reededBand(T / 2 - LIP, GROOVE), this.goldMat)
    const bandB = new THREE.Mesh(reededBand(-GROOVE, -(T / 2 - LIP)), this.redMat)
    const seamGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(R - 0.004, GROOVE + 0.001),
        new THREE.Vector2(R - 0.017, GROOVE * 0.5),
        new THREE.Vector2(R - 0.017, -GROOVE * 0.5),
        new THREE.Vector2(R - 0.004, -GROOVE - 0.001),
      ],
      192,
    )
    seamGeo.rotateX(Math.PI / 2)
    const seam = new THREE.Mesh(seamGeo, this.seamMat)
    this.coin.add(mA, mB, lipA, lipB, bandA, bandB, seam)
    this.spin.add(this.coin)
    this.rig.add(this.spin)
    this.scene.add(this.rig)

    // ── Quầng sáng phía sau + bóng đổ mềm (chỉ hiện ở nền sáng) ──
    const glow = makeGlowTexture()
    this.haloMat = new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 })
    this.halo = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 3.3), this.haloMat)
    this.halo.renderOrder = -2
    this.shadowMat = new THREE.MeshBasicMaterial({ map: glow, color: 0x2a2116, transparent: true, depthWrite: false, opacity: 0 })
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.34), this.shadowMat)
    shadow.position.set(0, -1.36, -0.4)
    shadow.renderOrder = -1
    this.scene.add(this.halo, shadow)

    // ── Quỹ đạo mảnh: vòng tròn nghiêng, độ trong suốt nhạt dần thành "đuôi sao chổi" ──
    const N = 256
    const ringPos = new Float32Array((N + 1) * 3)
    const ringCol = new Float32Array((N + 1) * 4)
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * TAU
      ringPos.set([Math.cos(a) * 1.3, Math.sin(a) * 1.3, 0], i * 3)
      const f = i / N
      ringCol.set([1, 1, 1, Math.pow(f, 2.2)], i * 4)
    }
    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3))
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringCol, 4))
    this.ringMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, opacity: 0 })
    this.orbit.add(new THREE.Line(ringGeo, this.ringMat))
    this.orbit.rotation.set(1.22, 0.12, 0)
    this.scene.add(this.orbit)

    // ── Bụi sáng lơ lửng (chuyển động trong shader, không cập nhật buffer) ──
    const dPos = new Float32Array(DUST * 3)
    const dSeed = new Float32Array(DUST * 4)
    for (let i = 0; i < DUST; i++) {
      dPos.set([(Math.random() * 2 - 1) * 1.25, (Math.random() * 2 - 1) * 1.35, lerp(-1.5, 0.75, Math.random())], i * 3)
      const big = Math.random() < 0.12
      dSeed.set([big ? 0.035 + Math.random() * 0.02 : 0.01 + Math.random() * 0.016, Math.random(), 0.02 + Math.random() * 0.05, Math.random()], i * 4)
    }
    const dGeo = new THREE.BufferGeometry()
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 4))
    this.dustMat = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uViewH: { value: 900 },
        uColorA: { value: new THREE.Color() },
        uColorB: { value: new THREE.Color() },
        uOpacity: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
    })
    const dust = new THREE.Points(dGeo, this.dustMat)
    dust.frustumCulled = false
    this.scene.add(dust)

    this.setTheme(light)

    // font Be Vietnam Pro có thể nạp sau → vẽ lại mặt khắc khi sẵn sàng
    const fonts = document.fonts
    if (fonts) {
      const sample = 'TÍCH CỰC GIỚI HẠN ỰỢ'
      Promise.all([fonts.load(FONT, sample), fonts.load(FONT_SMALL, sample)])
        .then(() => {
          this.drawHeights()
          this.drawColors()
        })
        .catch(() => {})
    }
  }

  private drawHeights() {
    ;(['A', 'B'] as const).forEach((s) => {
      drawFace(this.heightCanvas[s], s, HEIGHT_INK, 2.5)
      this.heightTex[s].needsUpdate = true
    })
  }

  private drawColors() {
    ;(['A', 'B'] as const).forEach((s) => {
      drawFace(this.colorCanvas[s], s, this.pal[s], 0.8)
      this.colorTex[s].needsUpdate = true
    })
  }

  setTheme(light: boolean) {
    const changed = light !== this.light || this.first
    this.light = light
    this.pal = light ? LIGHT : DARK
    const P = this.pal
    if (changed) this.drawColors()
    this.goldMat.color.set(P.gold)
    this.redMat.color.set(P.red)
    this.seamMat.color.set(P.seam)
    this.haloMat.color.set(P.halo)
    this.haloMat.blending = P.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    this.ringMat.color.set(P.ring)
    this.ringMat.blending = P.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    this.dustMat.uniforms.uColorA.value.set(P.dustA)
    this.dustMat.uniforms.uColorB.value.set(P.dustB)
    this.dustMat.blending = P.additive ? THREE.AdditiveBlending : THREE.NormalBlending
  }

  resize(w: number, h: number) {
    this.w = w
    this.h = h
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.dustMat.uniforms.uViewH.value = h * this.renderer.getPixelRatio()
  }

  setAnchor(x: number, y: number, k: number) {
    this.ax = x
    this.ay = y
    this.k = k
  }

  update(dt: number, t: number, mode: string, p: number) {
    const tg = this.tg
    const single = mode === 'a' || mode === 'b'
    const fly = easeOut(seg(p, 0, single ? 0.4 : 0.26))
    let settle: number
    if (single) {
      // bay vào, xoay 1,5 vòng rồi dừng đúng mặt được chọn
      tg.rotY = (mode === 'b' ? Math.PI : 0) - 3 * Math.PI * (1 - fly)
      settle = easeInOut(seg(p, 0.35, 0.75))
      tg.spinOn = 0
      tg.sway = settle
    } else {
      // 0–0.26 bay vào, đáp xuống mặt A · 0.30–0.44 lật sang mặt B · 0.5–0.74 nghiêng 3/4 rồi tự xoay
      const flip = easeInOut(seg(p, 0.3, 0.44))
      tg.rotY = -3 * Math.PI * (1 - fly) + Math.PI * flip
      settle = easeInOut(seg(p, 0.5, 0.74))
      tg.spinOn = settle
      tg.sway = 0
    }
    tg.rotY += YAW * settle
    tg.x = lerp(1.7, 0, fly)
    tg.y = lerp(1.0, 0, fly)
    tg.z = lerp(-7.5, 0, fly)
    tg.scale = lerp(0.55, 1, fly)
    tg.tiltX = lerp(0.8, 0, fly) + TILT * settle
    tg.rollZ = lerp(-0.5, 0, fly) + ROLL * settle
    tg.fx = fly

    const k = this.first ? 1 : 1 - Math.exp(-dt * 7)
    this.first = false
    const s = this.sm
    s.x = lerp(s.x, tg.x, k)
    s.y = lerp(s.y, tg.y, k)
    s.z = lerp(s.z, tg.z, k)
    s.scale = lerp(s.scale, tg.scale, k)
    s.rotY = lerp(s.rotY, tg.rotY, k)
    s.tiltX = lerp(s.tiltX, tg.tiltX, k)
    s.rollZ = lerp(s.rollZ, tg.rollZ, k)
    s.spinOn = lerp(s.spinOn, tg.spinOn, k)
    s.sway = lerp(s.sway, tg.sway, k)
    s.fx = lerp(s.fx, tg.fx, k)

    // tự xoay: hàm "bậc thang mềm" → dừng lâu ở mỗi mặt, quay nhanh qua cạnh
    this.u += (dt / HALF_TURN) * tg.spinOn
    if (s.spinOn > 0.999 && this.u >= 2) this.u -= 2
    else if (tg.spinOn === 0 && s.spinOn < 0.001) this.u = 0 // chưa vào pha tự xoay → bắt đầu lại từ mặt B
    const stair = Math.PI * (this.u - (LINGER * Math.sin(TAU * this.u)) / TAU)
    const calm = clamp01(s.spinOn + s.sway)

    this.rig.position.set(s.x, s.y + Math.sin(t * 0.9) * 0.03 * calm, s.z)
    this.rig.scale.setScalar(s.scale)
    this.rig.rotation.set(s.tiltX + Math.sin(t * 0.55) * 0.025 * calm, 0, s.rollZ)
    this.spin.rotation.y = s.rotY + s.spinOn * stair + s.sway * Math.sin(t * 0.5) * 0.16

    // quầng sáng (đi theo đồng xu), quỹ đạo, bụi
    const P = this.pal
    this.halo.position.set(s.x, s.y, s.z - 1.7)
    this.haloMat.opacity = P.haloOpacity * s.fx * (0.88 + 0.12 * Math.sin(t * 0.8))
    this.shadowMat.opacity = P.shadowOpacity * s.fx * (1 - 0.15 * Math.sin(t * 0.9) * calm)
    this.ringMat.opacity = P.ringOpacity * clamp01(seg(p, 0.42, 0.85) + s.sway)
    this.orbit.rotation.z = -t * 0.28
    this.dustMat.uniforms.uTime.value = t
    this.dustMat.uniforms.uOpacity.value = P.dustOpacity * seg(p, 0.08, 0.55)

    this.camera.position.set(0, 0, DIST / Math.max(0.35, this.k))
    this.camera.lookAt(0, 0, 0)
    anchorCamera(this.camera, this.w, this.h, this.ax < 0 ? this.w / 2 : this.ax, this.ay < 0 ? this.h / 2 : this.ay)
    this.camera.updateMatrixWorld()
    this.scene.updateMatrixWorld()
  }

  /** Toạ độ px khung nhìn của điểm gắn nhãn: 'center' | 'faceA' | 'faceB' (front=false khi mặt đó quay ra sau) */
  project(id: string): { x: number; y: number; front?: boolean } {
    const v = this.v
    let front = true
    if (id === 'faceA' || id === 'faceB') {
      const s = id === 'faceA' ? 1 : -1
      v.set(0, 0, (s * T) / 2)
      this.coin.localToWorld(v)
      this.n.set(0, 0, s).transformDirection(this.coin.matrixWorld)
      this.dv.copy(this.camera.position).sub(v)
      front = this.n.dot(this.dv) > 0
    } else {
      v.set(0, 0, 0)
      this.coin.localToWorld(v)
    }
    v.project(this.camera)
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h, front }
  }
}

export function create(renderer: THREE.WebGLRenderer, light: boolean): GLScene {
  return new Coin(renderer, light)
}

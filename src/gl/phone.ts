import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { type GLScene, anchorCamera, clamp01, easeInOut, lerp, seg } from './stage'

/**
 * Điện thoại "lắp ráp tại Việt Nam" được tách lớp (exploded view) khi cuộn,
 * rồi biến thành bản vẽ khung dây — ẩn dụ: giá trị nằm ở tri thức (thiết kế, công nghệ lõi),
 * không nằm ở khâu lắp ráp.
 */

export interface PhoneLayerInfo {
  key: string
  /** độ dịch theo trục z khi tách (đơn vị cảnh) */
  spread: number
}

interface Layer {
  key: string
  group: THREE.Group
  solids: THREE.Mesh[]
  edges: THREE.LineSegments[]
  baseZ: number
  spread: number
}

export interface PhoneTheme {
  line: string
  accent: string
  red: string
  bg: string
}

const W = 0.74
const H = 1.52
const R = 0.11

function makeBackTexture(text: string[], color: string) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 1024
  const g = c.getContext('2d')!
  g.fillStyle = '#16181d'
  g.fillRect(0, 0, c.width, c.height)
  const grd = g.createLinearGradient(0, 0, c.width, c.height)
  grd.addColorStop(0, 'rgba(255,255,255,0.06)')
  grd.addColorStop(0.5, 'rgba(255,255,255,0)')
  grd.addColorStop(1, 'rgba(255,255,255,0.04)')
  g.fillStyle = grd
  g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = color
  g.textAlign = 'center'
  g.font = '500 26px "JetBrains Mono", monospace'
  text.forEach((t, i) => g.fillText(t, c.width / 2, 870 + i * 38))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makeScreenTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 1024
  const g = c.getContext('2d')!
  const grd = g.createLinearGradient(0, 0, 0, c.height)
  grd.addColorStop(0, '#2a0f12')
  grd.addColorStop(0.55, '#5a1418')
  grd.addColorStop(1, '#e9b44c')
  g.fillStyle = grd
  g.fillRect(0, 0, c.width, c.height)
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.05})`
    g.beginPath()
    g.arc(Math.random() * 512, Math.random() * 1024, 20 + Math.random() * 120, 0, Math.PI * 2)
    g.fill()
  }
  g.fillStyle = 'rgba(255,255,255,0.92)'
  g.textAlign = 'center'
  g.font = '300 120px "Be Vietnam Pro", sans-serif'
  g.fillText('09:41', 256, 250)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class Phone implements GLScene {
  readonly name = 'phone'
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50)
  private rig = new THREE.Group()
  private layers: Layer[] = []
  private edgeMat: THREE.LineBasicMaterial
  private edgeAccent: THREE.LineBasicMaterial
  private gridMat: THREE.LineBasicMaterial
  private w = 1
  private h = 1
  private ax = -1
  private ay = -1
  private k = 1
  private sm = { explode: 0, wire: 0, rotY: 0, rotX: 0, dist: 5.2, lift: 0, assembly: 0 }
  private first = true
  private pmrem: THREE.PMREMGenerator | null = null

  constructor(renderer: THREE.WebGLRenderer, theme: PhoneTheme, backText: string[]) {
    this.pmrem = new THREE.PMREMGenerator(renderer)
    this.scene.environment = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.add(this.rig)

    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(2, 3, 4)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xffc27a, 1.2)
    rim.position.set(-3, 1, -2)
    this.scene.add(rim)

    this.edgeMat = new THREE.LineBasicMaterial({ color: theme.line, transparent: true, opacity: 0 })
    this.edgeAccent = new THREE.LineBasicMaterial({ color: theme.accent, transparent: true, opacity: 0 })

    // Lưới bản vẽ phía sau
    const grid: THREE.Vector3[] = []
    for (let i = -12; i <= 12; i++) {
      grid.push(new THREE.Vector3(i * 0.25, -3, -1.6), new THREE.Vector3(i * 0.25, 3, -1.6))
      grid.push(new THREE.Vector3(-3, i * 0.25, -1.6), new THREE.Vector3(3, i * 0.25, -1.6))
    }
    this.gridMat = new THREE.LineBasicMaterial({ color: theme.line, transparent: true, opacity: 0 })
    this.scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grid), this.gridMat))

    const metal = (c: number, rough = 0.32, metalness = 0.85) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness, transparent: true })
    const glass = (c: number) =>
      new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.08, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 1 })

    const backTex = makeBackTexture(backText, '#b9b2a3')
    const screenTex = makeScreenTexture()

    // ── Các lớp (từ trước ra sau). baseZ: vị trí khi đã lắp; spread: vị trí khi tách ──
    this.addLayer('glass', 0.05, 1.05, (g) => {
      const m = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.012, 4, R), glass(0x0b0d10))
      ;(m.material as THREE.MeshPhysicalMaterial).opacity = 0.55
      g.add(m)
    })
    this.addLayer('display', 0.035, 0.7, (g) => {
      const panel = new THREE.Mesh(
        new RoundedBoxGeometry(W - 0.03, H - 0.03, 0.01, 4, R * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.2, transparent: true }),
      )
      g.add(panel)
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.06, H - 0.06),
        new THREE.MeshBasicMaterial({ map: screenTex, transparent: true, toneMapped: false }),
      )
      face.position.z = 0.0062
      g.add(face)
    })
    this.addLayer('frame', 0.0, 0.32, (g) => {
      // khung viền: hộp rỗng mô phỏng bằng 4 thanh
      const mat = metal(0x9aa3ad, 0.25, 0.95)
      const t = 0.035
      const bars: Array<[number, number, number, number]> = [
        [0, H / 2 - t / 2, W, t],
        [0, -H / 2 + t / 2, W, t],
        [W / 2 - t / 2, 0, t, H],
        [-W / 2 + t / 2, 0, t, H],
      ]
      bars.forEach(([x, y, w, h]) => {
        const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.07, 2, 0.012), mat)
        b.position.set(x, y, 0)
        g.add(b)
      })
      const plate = new THREE.Mesh(new THREE.BoxGeometry(W - 0.06, H - 0.06, 0.006), metal(0x5b636c, 0.5, 0.8))
      g.add(plate)
    })
    this.addLayer('board', -0.03, -0.05, (g) => {
      const pcb = new THREE.Mesh(
        new RoundedBoxGeometry(W * 0.86, H * 0.36, 0.016, 2, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x0f3b2c, roughness: 0.55, metalness: 0.3, transparent: true }),
      )
      pcb.position.y = H * 0.27
      g.add(pcb)
      const chip = (w: number, h: number, x: number, y: number, c: number, name?: string) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), metal(c, 0.35, 0.7))
        m.position.set(x, H * 0.27 + y, 0.017)
        if (name) m.name = name
        g.add(m)
        return m
      }
      chip(0.2, 0.2, -0.12, 0.02, 0xb8bcc2, 'soc')
      chip(0.13, 0.09, 0.14, 0.07, 0x2a2d33)
      chip(0.13, 0.09, 0.14, -0.06, 0x2a2d33)
      chip(0.08, 0.08, -0.12, -0.17, 0x3a3d44)
      chip(0.06, 0.05, 0.22, -0.16, 0x3a3d44)
    })
    this.addLayer('battery', -0.035, -0.42, (g) => {
      const b = new THREE.Mesh(
        new RoundedBoxGeometry(W * 0.8, H * 0.5, 0.05, 3, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.6, metalness: 0.4, transparent: true }),
      )
      b.position.y = -H * 0.13
      g.add(b)
    })
    this.addLayer('camera', -0.045, -0.78, (g) => {
      const base = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.3, 0.04, 3, 0.06), metal(0x2b2e34, 0.3, 0.9))
      base.position.set(-W / 2 + 0.22, H / 2 - 0.22, 0)
      g.add(base)
      const lensMat = glass(0x050608)
      ;[
        [-0.06, 0.06],
        [0.06, -0.06],
      ].forEach(([x, y]) => {
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 32), lensMat)
        l.rotation.x = Math.PI / 2
        l.position.set(-W / 2 + 0.22 + x, H / 2 - 0.22 + y, 0.02)
        g.add(l)
      })
    })
    this.addLayer('back', -0.06, -1.12, (g) => {
      const m = new THREE.Mesh(
        new RoundedBoxGeometry(W, H, 0.012, 4, R),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: backTex, roughness: 0.18, metalness: 0.3, clearcoat: 1, transparent: true }),
      )
      m.rotation.y = Math.PI // mặt in chữ hướng ra sau
      g.add(m)
    })

    this.scene.add(this.rig)
    this.setPalette(theme)
  }

  private addLayer(key: string, baseZ: number, spread: number, build: (g: THREE.Group) => void) {
    const group = new THREE.Group()
    build(group)
    const solids: THREE.Mesh[] = []
    const edges: THREE.LineSegments[] = []
    group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) solids.push(o as THREE.Mesh)
    })
    solids.forEach((m) => {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 25), m.name === 'soc' ? this.edgeAccent : this.edgeMat)
      e.position.copy(m.position)
      e.rotation.copy(m.rotation)
      e.scale.copy(m.scale)
      m.parent!.add(e)
      edges.push(e)
    })
    group.position.z = baseZ
    this.rig.add(group)
    this.layers.push({ key, group, solids, edges, baseZ, spread })
  }

  setPalette(theme: PhoneTheme) {
    this.edgeMat.color.set(theme.line)
    this.edgeAccent.color.set(theme.accent)
    this.gridMat.color.set(theme.line)
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
   * Kịch bản theo p (0..1) của vùng cuộn 'phone':
   *  0.00–0.18  điện thoại xoay khoe mặt lưng "Lắp ráp tại Việt Nam"
   *  0.18–0.55  tách lớp, nhãn từng lớp hiện dần (HTML)
   *  0.55–0.78  vật liệu tan dần → bản vẽ khung dây (tri thức = giá trị)
   *  0.78–1.00  chỉ còn khâu lắp ráp sáng màu, phần còn lại mờ đi
   */
  update(dt: number, t: number, _mode: string, p: number) {
    const narrow = this.w < 760
    const turn = easeInOut(seg(p, 0, 0.18))
    const ex = easeInOut(seg(p, 0.16, 0.52))
    const wire = easeInOut(seg(p, 0.55, 0.76))
    const asm = easeInOut(seg(p, 0.8, 0.97))

    const tgt = {
      explode: ex,
      wire,
      rotY: lerp(Math.PI * 0.92, 0, turn) + lerp(0, -0.72, ex) + Math.sin(t * 0.4) * 0.03,
      rotX: lerp(0.08, 0.32, ex),
      dist: lerp(narrow ? 5.6 : 4.6, narrow ? 6.6 : 5.0, ex),
      lift: lerp(0, narrow ? 0.35 : 0, ex),
      assembly: asm,
    }
    const k = this.first ? 1 : 1 - Math.exp(-dt * 8)
    this.first = false
    const s = this.sm
    ;(Object.keys(tgt) as Array<keyof typeof tgt>).forEach((key) => (s[key] = lerp(s[key], tgt[key], k)))

    this.rig.rotation.set(s.rotX, s.rotY, 0)
    this.rig.position.set(0, s.lift, 0)
    this.camera.position.set(0, 0.1, s.dist / Math.max(0.35, this.k))
    this.camera.lookAt(0, 0, 0)
    anchorCamera(this.camera, this.w, this.h, this.ax < 0 ? this.w / 2 : this.ax, this.ay < 0 ? this.h / 2 : this.ay)

    const solidA = 1 - s.wire
    const edgeA = clamp01(s.wire * 1.2)
    this.edgeMat.opacity = edgeA * 0.85
    this.edgeAccent.opacity = edgeA
    this.gridMat.opacity = s.wire * 0.12

    for (const L of this.layers) {
      L.group.position.z = lerp(L.baseZ, L.spread, s.explode)
      const isAsm = L.key === 'frame' || L.key === 'back'
      // ở pha cuối: lớp "lắp ráp" (khung + vỏ) sáng lại, các lớp công nghệ lõi chỉ còn nét mảnh
      const sa = isAsm ? lerp(solidA, 1, s.assembly) : solidA
      for (const m of L.solids) {
        const mat = m.material as THREE.Material & { opacity: number }
        const base = L.key === 'glass' ? 0.55 : 1
        mat.opacity = base * sa
        m.visible = mat.opacity > 0.01
        mat.depthWrite = mat.opacity > 0.95
      }
      for (const e of L.edges) e.visible = edgeA > 0.01
    }
  }

  /** Vị trí màn hình (px) của mép phải một lớp, ở độ cao fy (tỉ lệ theo chiều cao máy) — để đặt nhãn HTML */
  project(key: string, fy = 0.38) {
    const L = this.layers.find((l) => l.key === key)
    if (!L) return { x: 0, y: 0 }
    const v = new THREE.Vector3(W * 0.5, H * fy, 0)
    L.group.localToWorld(v)
    v.project(this.camera)
    return { x: (v.x * 0.5 + 0.5) * this.w, y: (-v.y * 0.5 + 0.5) * this.h }
  }
}

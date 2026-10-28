import * as THREE from 'three'

/**
 * Một cảnh WebGL dùng chung renderer (quả địa cầu, điện thoại, tháp dữ liệu…).
 * Mỗi slide khai báo cảnh + "mode" + tiến độ đích p (0..1); Stage tự đưa p hiện tại tiến dần tới p đích,
 * nên khi chuyển slide mô hình chuyển động mượt sang trạng thái mới (giống cuộn video nhưng theo phím bấm).
 */
export interface GLScene {
  readonly name: string
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  /** dt: giây từ khung trước · t: giây từ lúc khởi tạo · mode: trạng thái · p: tiến độ 0..1 (đã được Stage làm mượt) */
  update(dt: number, t: number, mode: string, p: number): void
  resize(w: number, h: number): void
  /**
   * Điểm neo: tâm mô hình phải hiện ở (x, y) — toạ độ px của khung nhìn.
   * k = chiều cao sân khấu 1920×1080 đã co / chiều cao khung nhìn (≤ 1). Cảnh dùng k để giữ kích thước tương đối.
   */
  setAnchor?(x: number, y: number, k: number): void
  setTheme?(light: boolean): void
}

/** "Cú máy" của một slide */
export interface GLShot {
  scene: string
  mode: string
  /** tiến độ đích (mặc định 1) */
  p?: number
  /** khi vào cảnh/mode mới thì p bắt đầu từ đây (mặc định 0) */
  from?: number
  /** điểm neo trên sân khấu thiết kế 1920×1080 (mặc định giữa: 960, 540) */
  x?: number
  y?: number
  /** tốc độ p (đơn vị/giây), mặc định 0.55 */
  speed?: number
}

/** Ánh xạ toạ độ sân khấu 1920×1080 → px khung nhìn (do Deck cung cấp vì Deck biết cách co sân khấu) */
export type StageMapper = (x: number, y: number) => { x: number; y: number; k: number }

export const DESIGN_W = 1920
export const DESIGN_H = 1080

/** Đặt camera sao cho gốc toạ độ cảnh hiện tại điểm neo (x, y) trên khung nhìn w×h */
export function anchorCamera(camera: THREE.PerspectiveCamera, w: number, h: number, x: number, y: number) {
  const ox = x - w / 2
  const oy = y - h / 2
  if (Math.abs(ox) > 0.5 || Math.abs(oy) > 0.5) camera.setViewOffset(w, h, -ox, -oy, w, h)
  else camera.clearViewOffset()
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

export class Stage {
  readonly renderer: THREE.WebGLRenderer
  private scenes = new Map<string, GLScene>()
  private last = performance.now()
  private t0 = performance.now()
  private shot: GLShot | null = null
  private cur: { scene: GLScene; mode: string; p: number } | null = null
  private map: StageMapper = (x, y) => ({ x: (x / DESIGN_W) * window.innerWidth, y: (y / DESIGN_H) * window.innerHeight, k: 1 })
  private fadeTimer = 0

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.onResize()
    window.addEventListener('resize', () => this.onResize())
  }

  add(s: GLScene) {
    this.scenes.set(s.name, s)
    s.resize(window.innerWidth, window.innerHeight)
  }

  get(name: string) {
    return this.scenes.get(name) ?? null
  }

  setMapper(m: StageMapper) {
    this.map = m
  }

  setTheme(light: boolean) {
    this.scenes.forEach((s) => s.setTheme?.(light))
  }

  /** Trạng thái hiện tại (để lớp nhãn HTML biết cảnh nào đang hiện) */
  get state() {
    return this.cur ? { scene: this.cur.scene.name, mode: this.cur.mode, p: this.cur.p } : null
  }

  /** Chuyển sang cú máy mới; null = tắt WebGL (slide không có mô hình) */
  show(shot: GLShot | null, instant = false): void {
    this.shot = shot
    window.clearTimeout(this.fadeTimer)
    if (!shot) {
      this.canvas.classList.remove('is-on')
      // dừng vẽ sau khi mờ hẳn cho nhẹ máy
      this.fadeTimer = window.setTimeout(() => {
        if (!this.shot) this.cur = null
      }, 700)
      return
    }
    const scene = this.scenes.get(shot.scene)
    if (!scene) return this.show(null)
    const same = this.cur && this.cur.scene === scene && this.cur.mode === shot.mode
    if (!same) {
      const from = instant ? shot.p ?? 1 : shot.from ?? 0
      if (this.cur && this.cur.scene !== scene && !instant) {
        // đổi cảnh: mờ nhanh rồi hiện lại để không "giật"
        this.canvas.classList.remove('is-on')
        this.fadeTimer = window.setTimeout(() => {
          this.cur = { scene, mode: shot.mode, p: from }
          this.canvas.classList.add('is-on')
        }, 260)
        return
      }
      this.cur = { scene, mode: shot.mode, p: from }
    } else if (instant && this.cur) {
      this.cur.p = shot.p ?? 1
    }
    this.canvas.classList.add('is-on')
  }

  private onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.setSize(w, h, false)
    this.scenes.forEach((s) => s.resize(w, h))
  }

  /** Gọi mỗi khung hình (gsap.ticker) */
  tick() {
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 0.1)
    this.last = now
    const t = (now - this.t0) / 1000
    const c = this.cur
    if (!c) return
    const shot = this.shot
    if (shot && shot.scene === c.scene.name && shot.mode === c.mode) {
      const target = shot.p ?? 1
      const step = (shot.speed ?? 0.55) * dt
      c.p = c.p < target ? Math.min(target, c.p + step) : Math.max(target, c.p - step)
      const a = this.map(shot.x ?? DESIGN_W / 2, shot.y ?? DESIGN_H / 2)
      c.scene.setAnchor?.(a.x, a.y, a.k)
    }
    c.scene.update(dt, t, c.mode, c.p)
    this.renderer.render(c.scene.scene, c.scene.camera)
  }
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** đoạn [a,b] của p ánh xạ về 0..1 */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

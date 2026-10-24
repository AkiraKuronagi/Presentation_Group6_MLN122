import * as THREE from 'three'

/** Một cảnh WebGL dùng chung renderer (quả địa cầu, điện thoại...). */
export interface GLScene {
  readonly name: string
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  /** mode + p (0..1) do vùng cuộn đang hoạt động quyết định; t = giây kể từ lúc khởi tạo */
  update(dt: number, t: number, mode: string, p: number): void
  resize(w: number, h: number): void
}

/** Vùng cuộn gắn với một cảnh: khi trang cuộn trong [start,end] thì cảnh đó được vẽ. */
export interface GLZone {
  scene: string
  mode: string
  /** trả về [start, end] theo pixel cuộn — đọc lại mỗi khung hình nên luôn đúng sau khi resize */
  range(): [number, number]
}

/**
 * Renderer WebGL duy nhất cho cả trang, cố định phía sau nội dung.
 * Cảnh được chọn hoàn toàn từ vị trí cuộn (không phụ thuộc thứ tự sự kiện),
 * nên nhảy cóc bằng bàn phím hay kéo thanh cuộn đều ra trạng thái đúng.
 */
export class Stage {
  readonly renderer: THREE.WebGLRenderer
  private scenes = new Map<string, GLScene>()
  private zones: GLZone[] = []
  private last = performance.now()
  private t0 = performance.now()
  private visible = false
  private current: { scene: GLScene; mode: string; p: number } | null = null
  private listeners: Array<(s: { scene: string; mode: string; p: number } | null) => void> = []

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

  zone(z: GLZone) {
    this.zones.push(z)
  }

  onChange(fn: (s: { scene: string; mode: string; p: number } | null) => void) {
    this.listeners.push(fn)
  }

  get state() {
    return this.current ? { scene: this.current.scene.name, mode: this.current.mode, p: this.current.p } : null
  }

  private onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    this.renderer.setSize(w, h, false)
    this.scenes.forEach((s) => s.resize(w, h))
  }

  /** Gọi mỗi khung hình (gắn vào gsap.ticker). */
  tick(scrollY: number) {
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 0.1)
    this.last = now
    const t = (now - this.t0) / 1000

    // vùng đang hoạt động = vùng chứa tâm màn hình; ưu tiên vùng bắt đầu muộn nhất
    const probe = scrollY + window.innerHeight * 0.5
    let best: GLZone | null = null
    let bestStart = -Infinity
    let bestP = 0
    for (const z of this.zones) {
      const [s, e] = z.range()
      const lo = s - window.innerHeight * 0.5
      const hi = e + window.innerHeight * 0.5
      if (probe >= lo && probe <= hi && s > bestStart) {
        best = z
        bestStart = s
        bestP = e > s ? (scrollY - s) / (e - s) : 0
      }
    }

    const scene = best ? this.scenes.get(best.scene) ?? null : null
    const on = !!scene
    if (on !== this.visible) {
      this.visible = on
      this.canvas.classList.toggle('is-on', on)
    }
    const prev = this.current
    if (scene && best) {
      const p = Math.min(1, Math.max(0, bestP))
      this.current = { scene, mode: best.mode, p }
      scene.update(dt, t, best.mode, p)
      this.renderer.render(scene.scene, scene.camera)
    } else {
      this.current = null
    }
    if (prev?.scene !== this.current?.scene || prev?.mode !== this.current?.mode) {
      const st = this.state
      this.listeners.forEach((fn) => fn(st))
    }
  }
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** đoạn [a,b] của p ánh xạ về 0..1 */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
export const smooth = (t: number) => t * t * (3 - 2 * t)
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

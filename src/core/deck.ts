import gsap from 'gsap'
import { DESIGN_H, DESIGN_W, type GLShot, type Stage } from '../gl/stage'

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Nhãn HTML bám theo một điểm của mô hình 3D (toạ độ khung nhìn do cảnh tự chiếu) */
export interface GLLabel {
  /** id điểm trong scene.project(id) · "lat,lon" cho quả địa cầu · "id@0.3" truyền thêm tham số thứ hai */
  at: string
  html: string
  /** lệch thêm theo px sân khấu */
  dx?: number
  dy?: number
  /** canh nhãn: 'left' (mặc định, nhãn nằm bên phải điểm), 'right', 'center', 'above' */
  align?: 'left' | 'right' | 'center' | 'above'
  cls?: string
  /** chỉ hiện khi tiến độ cảnh vượt ngưỡng này (mặc định 0.25) */
  minP?: number
}

export interface Slide {
  id: string
  /** tên ngắn hiện ở rail / HUD / cửa sổ người thuyết trình */
  title: string
  seconds: number
  notes: string
  gl?: GLShot
  labels?: GLLabel[]
  /** ảnh nền tràn màn hình: đường dẫn đã import, dòng ghi nguồn, vị trí cắt, độ tối lớp phủ (0..1) */
  bg?: { src: string; credit: string; pos?: string; dim?: number }
  /** nội dung trong sân khấu 1920×1080 */
  html(): string
  mount?(el: HTMLElement, deck: Deck): void
  enter?(el: HTMLElement, deck: Deck): void
  leave?(el: HTMLElement, deck: Deck): void
}

type ProjectFn = (a: string | number, b?: number) => { x: number; y: number; front?: boolean }
/** "lat,lon" → chiếu điểm trên quả địa cầu; còn lại là id điểm của cảnh */
const LATLON = /^(-?[\d.]+),\s*(-?[\d.]+)$/

/**
 * Bộ trình chiếu toàn màn hình: mỗi slide là đúng một khung hình 16:9.
 * ↓ → Space PgDn: slide sau · ↑ ← PgUp: slide trước · cuộn chuột/vuốt: một slide mỗi cử chỉ.
 * Không có cuộn trang tự do, nên không bao giờ có hai nội dung chen nhau trên một màn hình.
 */
export class Deck {
  readonly root: HTMLElement
  readonly els: HTMLElement[] = []
  readonly labelLayer: HTMLElement
  /** ảnh nền nằm DƯỚI canvas WebGL (mô hình 3D vẽ đè lên ảnh), chữ nằm trên cùng */
  readonly bgLayer: HTMLElement
  private bgEls: Array<HTMLElement | null> = []
  private idx = -1
  private busy = false
  private listeners: Array<(i: number) => void> = []
  private frames: Array<(t: number) => void> = []
  private labelEls: HTMLElement[][] = []
  /** khớp với UI cũ: mỗi slide là một "điểm dừng" */
  stations: Array<{ id: string; chapter: number; label: string; notes?: string; seconds?: number }> = []
  chapters: Array<{ n: number; title: string; short: string; el: HTMLElement }> = []
  scale = 1
  offsetX = 0
  offsetY = 0

  constructor(
    host: HTMLElement,
    readonly slides: Slide[],
    readonly stage: Stage | null,
  ) {
    this.root = host
    host.classList.add('deck')
    host.innerHTML = slides
      .map(
        (s, i) => `
      <section class="slide" id="${s.id}" data-i="${i}" aria-roledescription="slide" aria-label="${i + 1}/${slides.length}: ${s.title.replace(/<[^>]+>/g, '')}">
        <div class="slide__stage">${s.html()}${s.bg ? `<p class="slide__credit">${s.bg.credit}</p>` : ''}</div>
      </section>`,
      )
      .join('')
    host.querySelectorAll<HTMLElement>('.slide').forEach((el) => this.els.push(el))
    this.bgLayer = document.createElement('div')
    this.bgLayer.className = 'deck-bg'
    this.bgLayer.setAttribute('aria-hidden', 'true')
    document.body.prepend(this.bgLayer)
    this.bgEls = slides.map((s) => {
      if (!s.bg) return null
      const d = document.createElement('div')
      d.className = 'slide__bg'
      d.style.setProperty('--dim', String(s.bg.dim ?? 0.62))
      d.innerHTML = `<img src="${s.bg.src}" alt="" style="object-position:${s.bg.pos ?? 'center'}" decoding="async" />`
      this.bgLayer.appendChild(d)
      return d
    })
    this.labelLayer = document.createElement('div')
    this.labelLayer.className = 'gl-labels'
    this.labelLayer.setAttribute('aria-hidden', 'true')
    document.body.appendChild(this.labelLayer)
    this.labelEls = slides.map((s) =>
      (s.labels ?? []).map((l) => {
        const d = document.createElement('div')
        d.className = `gl-label gl-label--${l.align ?? 'left'} ${l.cls ?? ''}`
        d.innerHTML = `<div>${l.html}</div>`
        this.labelLayer.appendChild(d)
        return d
      }),
    )
    this.stations = slides.map((s, i) => ({ id: s.id, chapter: i + 1, label: s.title.replace(/<[^>]+>/g, ''), notes: s.notes, seconds: s.seconds }))
    this.chapters = slides.map((s, i) => ({ n: i + 1, title: s.title.replace(/<[^>]+>/g, ''), short: s.title.replace(/<[^>]+>/g, ''), el: this.els[i] }))

    this.layout()
    window.addEventListener('resize', () => this.layout())
    stage?.setMapper((x, y) => ({ x: this.offsetX + x * this.scale, y: this.offsetY + y * this.scale, k: (DESIGN_H * this.scale) / window.innerHeight }))
    this.bindInput()
    gsap.ticker.add((t) => this.tick(t))
  }

  get current() {
    return this.idx
  }

  get count() {
    return this.slides.length
  }

  progress() {
    return this.count > 1 ? Math.max(0, this.idx) / (this.count - 1) : 0
  }

  onStation(fn: (s: { id: string; chapter: number; label: string; notes?: string; seconds?: number }, i: number) => void) {
    this.listeners.push((i) => fn(this.stations[i], i))
  }

  onFrame(fn: (t: number) => void) {
    this.frames.push(fn)
  }

  /** co sân khấu 1920×1080 vừa khung nhìn (giữ tỉ lệ, viền thừa cùng màu nền) */
  private layout() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.scale = Math.min(w / DESIGN_W, h / DESIGN_H)
    this.offsetX = (w - DESIGN_W * this.scale) / 2
    this.offsetY = (h - DESIGN_H * this.scale) / 2
    const st = document.documentElement.style
    st.setProperty('--s', String(this.scale))
    st.setProperty('--ox', `${this.offsetX}px`)
    st.setProperty('--oy', `${this.offsetY}px`)
    document.documentElement.classList.toggle('is-portrait', h > w && w < 900)
  }

  mountAll() {
    this.slides.forEach((s, i) => s.mount?.(this.els[i], this))
  }

  goTo(i: number, instant = false) {
    const n = this.slides.length
    const k = Math.max(0, Math.min(n - 1, i))
    if (k === this.idx || (this.busy && !instant)) return
    const prev = this.idx
    const dir = prev < 0 || k > prev ? 1 : -1
    const from = prev >= 0 ? this.els[prev] : null
    const to = this.els[k]
    const slide = this.slides[k]
    this.idx = k
    this.busy = true
    if (prev >= 0) this.slides[prev].leave?.(this.els[prev], this)
    this.stage?.show(slide.gl ?? null, instant)

    const dur = instant || reduceMotion ? 0 : 0.75
    to.classList.add('is-active')
    gsap.killTweensOf([from, to, from?.querySelector('.slide__stage'), to.querySelector('.slide__stage')])
    if (from) {
      gsap.to(from, { autoAlpha: 0, duration: dur * 0.6, ease: 'power2.in', onComplete: () => from.classList.remove('is-active') })
      gsap.to(from.querySelector('.slide__stage'), { y: -60 * dir, duration: dur * 0.6, ease: 'power2.in' })
    }
    gsap.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, delay: dur * 0.3, ease: 'power2.out' })
    gsap.fromTo(to.querySelector('.slide__stage'), { y: 60 * dir }, { y: 0, duration: dur * 1.2, delay: dur * 0.3, ease: 'expo.out' })
    // ảnh nền: mờ chéo, rồi zoom chậm kiểu điện ảnh (Ken Burns)
    const bgFrom = prev >= 0 ? this.bgEls[prev] : null
    const bgTo = this.bgEls[k]
    if (bgFrom && bgFrom !== bgTo) gsap.to(bgFrom, { autoAlpha: 0, duration: dur * 0.9, ease: 'power1.inOut' })
    if (bgTo) {
      gsap.fromTo(bgTo, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur * 1.2, ease: 'power1.inOut' })
      if (!reduceMotion) gsap.fromTo(bgTo.querySelector('img'), { scale: 1.12 }, { scale: 1.02, duration: 14, ease: 'none' })
    }
    // các phần tử [data-in] hiện lần lượt
    const items = to.querySelectorAll('[data-in]')
    if (items.length && !reduceMotion) {
      gsap.fromTo(items, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: dur * 0.55 })
    }
    slide.enter?.(to, this)
    window.setTimeout(() => (this.busy = false), dur * 1000 * 0.55)
    this.listeners.forEach((fn) => fn(k))
    if (location.hash !== `#${k + 1}`) history.replaceState(null, '', `#${k + 1}`)
  }

  next() {
    this.goTo(this.idx + 1)
  }

  prev() {
    this.goTo(this.idx - 1)
  }

  goChapter(n: number) {
    this.goTo(n - 1)
  }

  /** chiếu nhãn 3D của slide hiện tại lên khung nhìn */
  private tick(t: number) {
    this.frames.forEach((f) => f(t))
    const i = this.idx
    this.labelEls.forEach((els, k) => {
      if (k !== i) {
        els.forEach((e) => e.classList.remove('is-on'))
        return
      }
      const s = this.slides[k]
      const scene = s.gl && this.stage?.state?.scene === s.gl.scene ? (this.stage.get(s.gl.scene) as unknown as { project?: ProjectFn }) : null
      els.forEach((e, j) => {
        const l = s.labels![j]
        if (!scene?.project) return void e.classList.remove('is-on')
        const ll = LATLON.exec(l.at)
        const [id, fy] = l.at.split('@')
        const pt = ll ? scene.project(+ll[1], +ll[2]) : fy !== undefined ? scene.project(id, +fy) : scene.project(id)
        e.style.transform = `translate(${pt.x + (l.dx ?? 0) * this.scale}px, ${pt.y + (l.dy ?? 0) * this.scale}px)`
        e.classList.toggle('is-on', pt.front !== false && (this.stage?.state?.p ?? 0) > (l.minP ?? 0.25))
      })
    })
  }

  private bindInput() {
    const typing = (el: EventTarget | null) => {
      const t = el as HTMLElement | null
      return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
    }
    window.addEventListener('keydown', (e) => {
      if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key
      // nút đang được focus (minigame, bình chọn): Enter/Space bấm nút, không chuyển slide
      if ((k === 'Enter' || k === ' ') && (e.target as HTMLElement).closest?.('button')) return
      if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey) || k === 'Enter') {
        e.preventDefault()
        this.next()
      } else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey) || k === 'Backspace') {
        e.preventDefault()
        this.prev()
      } else if (k === 'Home') {
        e.preventDefault()
        this.goTo(0)
      } else if (k === 'End') {
        e.preventDefault()
        this.goTo(this.slides.length - 1)
      }
    })
    // cuộn chuột / touchpad: gom cử chỉ, mỗi cử chỉ đúng một slide
    let acc = 0
    let lockUntil = 0
    window.addEventListener(
      'wheel',
      (e) => {
        const t = (e.target as HTMLElement).closest('[data-scroll]')
        if (t && t.scrollHeight > t.clientHeight) return // vùng có thanh cuộn riêng (danh mục tài liệu)
        e.preventDefault()
        const now = performance.now()
        if (now < lockUntil) return
        acc += e.deltaY
        if (Math.abs(acc) > 60) {
          if (acc > 0) this.next()
          else this.prev()
          acc = 0
          lockUntil = now + 900
        }
      },
      { passive: false },
    )
    let y0 = 0
    let x0 = 0
    window.addEventListener('touchstart', (e) => {
      y0 = e.touches[0].clientY
      x0 = e.touches[0].clientX
    })
    window.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - y0
      const dx = e.changedTouches[0].clientX - x0
      const d = Math.abs(dy) > Math.abs(dx) ? dy : dx
      if (Math.abs(d) > 50) {
        if (d < 0) this.next()
        else this.prev()
      }
    })
  }
}

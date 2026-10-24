import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Một "điểm dừng" thuyết trình: phím → / ← nhảy giữa các điểm này. */
export interface Station {
  id: string
  chapter: number
  label: string
  /** vị trí cuộn (px) — hàm để luôn đúng sau khi resize/refresh */
  y: () => number
  notes?: string
  /** thời lượng gợi ý (giây) cho phần trình bày tại điểm dừng này */
  seconds?: number
}

export interface Chapter {
  n: number
  title: string
  short: string
  el: HTMLElement
}

type Listener = (s: Station, i: number) => void

export class Engine {
  readonly lenis: Lenis
  stations: Station[] = []
  chapters: Chapter[] = []
  private idx = -1
  private listeners: Listener[] = []
  private tickers: Array<(y: number) => void> = []

  constructor() {
    this.lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })
    this.lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000)
      const y = this.lenis.scroll
      for (const fn of this.tickers) fn(y)
      this.syncStation(y)
    })
    gsap.ticker.lagSmoothing(0)
  }

  get scrollY() {
    return this.lenis.scroll
  }

  onFrame(fn: (y: number) => void) {
    this.tickers.push(fn)
  }

  addStation(s: Station) {
    this.stations.push(s)
  }

  sortStations() {
    this.stations.sort((a, b) => a.y() - b.y())
  }

  onStation(fn: Listener) {
    this.listeners.push(fn)
  }

  get current() {
    return this.idx
  }

  private syncStation(y: number) {
    if (!this.stations.length) return
    // điểm dừng hiện tại = điểm cuối cùng có y <= vị trí cuộn (+ dung sai nửa màn hình nhỏ)
    const probe = y + window.innerHeight * 0.18
    let i = 0
    for (let k = 0; k < this.stations.length; k++) {
      if (this.stations[k].y() <= probe) i = k
      else break
    }
    if (i !== this.idx) {
      this.idx = i
      const s = this.stations[i]
      this.listeners.forEach((fn) => fn(s, i))
    }
  }

  goTo(i: number, immediate = false) {
    const n = this.stations.length
    if (!n) return
    const k = Math.max(0, Math.min(n - 1, i))
    const target = this.stations[k].y()
    const dist = Math.abs(target - this.scrollY)
    const dur = immediate || reduceMotion ? 0 : Math.min(2.2, 0.9 + dist / window.innerHeight / 6)
    this.lenis.scrollTo(target, { duration: dur, immediate: immediate || reduceMotion, force: true, lock: dur > 0 })
  }

  next() {
    const y = this.scrollY
    const k = this.stations.findIndex((s) => s.y() > y + 6)
    if (k >= 0) this.goTo(k)
  }

  prev() {
    const y = this.scrollY
    let k = -1
    for (let i = 0; i < this.stations.length; i++) if (this.stations[i].y() < y - 6) k = i
    if (k >= 0) this.goTo(k)
  }

  goChapter(n: number) {
    const k = this.stations.findIndex((s) => s.chapter === n)
    if (k >= 0) this.goTo(k)
  }

  refresh() {
    ScrollTrigger.refresh()
    this.sortStations()
  }
}

/** Vị trí tuyệt đối của phần tử trong trang (không tính transform của pin) */
export function docTop(el: HTMLElement) {
  let y = 0
  let n: HTMLElement | null = el
  while (n) {
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return y
}

export { gsap, ScrollTrigger }

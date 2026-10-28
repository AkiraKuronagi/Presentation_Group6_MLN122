import gsap from 'gsap'
import { reduceMotion } from './deck'

const nfCache = new Map<number, Intl.NumberFormat>()
const nf = (d: number) => {
  if (!nfCache.has(d)) nfCache.set(d, new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }))
  return nfCache.get(d)!
}

/** Đếm số từ 0 tới data-count (định dạng Việt Nam) cho mọi [data-count] trong el */
export function countUp(el: ParentNode, delay = 0.35) {
  el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => {
    const to = parseFloat(n.dataset.count!)
    const d = +(n.dataset.digits ?? (String(n.dataset.count).split('.')[1]?.length ?? 0))
    const o = { v: 0 }
    gsap.killTweensOf(o)
    if (reduceMotion) return void (n.textContent = nf(d).format(to))
    n.textContent = nf(d).format(0)
    gsap.to(o, { v: to, duration: 1.8, delay, ease: 'expo.out', onUpdate: () => (n.textContent = nf(d).format(o.v)) })
  })
}

/** Nhiễu chữ kiểu "giải mã" — dùng cho chuyển 1916 → nay. Mỗi phần tử chỉ có một hiệu ứng chạy tại một thời điểm. */
const scrambling = new WeakMap<HTMLElement, gsap.core.Tween>()
export function scramble(el: HTMLElement, to: string, dur = 0.9) {
  const chars = 'ABCDEFGHIKLMNOPQRSTUVXYĐƯƠÂÊÔ0123456789#%$&'
  scrambling.get(el)?.kill()
  const from = el.textContent ?? ''
  const len = Math.max(from.length, to.length)
  const o = { p: 0 }
  const tw = gsap.to(o, {
    p: 1,
    duration: reduceMotion ? 0 : dur,
    ease: 'none',
    onUpdate: () => {
      let s = ''
      for (let i = 0; i < len; i++) {
        const k = i / len
        if (o.p > k + 0.25) s += to[i] ?? ''
        else if (o.p > k) s += to[i] === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0]
        else s += from[i] ?? ''
      }
      el.textContent = s
    },
    onComplete: () => (el.textContent = to),
  })
  scrambling.set(el, tw)
}

/** Vẽ dần các đường SVG [data-draw] (stroke-dashoffset) */
export function drawLines(el: ParentNode, delay = 0.3, dur = 1.4) {
  el.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((p, i) => {
    const len = p.getTotalLength()
    gsap.killTweensOf(p)
    if (reduceMotion) return void gsap.set(p, { strokeDasharray: 'none', strokeDashoffset: 0 })
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: dur, delay: delay + i * 0.12, ease: 'power2.inOut' })
  })
}

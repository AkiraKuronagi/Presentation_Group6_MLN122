import { gsap, ScrollTrigger, reduceMotion } from './engine'

/** Tách tiêu đề [data-split] thành từ để làm hiệu ứng "mặt nạ" khi xuất hiện. */
export function splitWords(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.dataset.splitDone) return
    el.dataset.splitDone = '1'
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === Node.TEXT_NODE) {
          const parts = (c.textContent ?? '').split(/(\s+)/)
          const frag = document.createDocumentFragment()
          parts.forEach((p) => {
            if (!p) return
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p))
            else {
              const w = document.createElement('span')
              w.className = 'w'
              const i = document.createElement('span')
              i.className = 'wi'
              i.textContent = p
              w.appendChild(i)
              frag.appendChild(w)
            }
          })
          c.replaceWith(frag)
        } else if (c.nodeType === Node.ELEMENT_NODE && !(c as HTMLElement).classList.contains('w')) {
          walk(c)
        }
      })
    }
    walk(el)
  })
}

/** Hiệu ứng xuất hiện khi cuộn tới: [data-reveal], [data-split], [data-count], [data-stagger] */
export function initReveals(root: ParentNode = document) {
  if (reduceMotion) return
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const words = el.querySelectorAll('.wi')
    gsap.set(words, { yPercent: 110 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 }),
    })
  })
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 28 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', delay: +(el.dataset.delay ?? 0) }),
    })
  })
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    const kids = Array.from(el.children)
    gsap.set(kids, { autoAlpha: 0, y: 24 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(kids, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 }),
    })
  })
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count!)
    const d = +(el.dataset.digits ?? (String(el.dataset.count).split('.')[1]?.length ?? 0))
    const f = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d })
    const o = { v: 0 }
    el.textContent = f.format(0)
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = f.format(o.v)),
        }),
    })
  })
}

/** Số định dạng kiểu Việt Nam cho phần tử có data-count khi không có chuyển động */
export function staticCounts(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count!)
    const d = +(el.dataset.digits ?? (String(el.dataset.count).split('.')[1]?.length ?? 0))
    el.textContent = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }).format(to)
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

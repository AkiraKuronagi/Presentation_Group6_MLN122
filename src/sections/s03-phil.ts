import { docTop, gsap, ScrollTrigger, reduceMotion } from '../core/engine'
import { PHIL } from '../content/theory'
import type { Section } from './types'

/** Lăng kính triết học: lượng – chất và LLSX – QHSX */
export const phil: Section = {
  id: 'triet-hoc',
  html: () => `
  <section class="sec sec--pad phil" id="triet-hoc" aria-label="Nhìn từ triết học">
    <div class="wrap">
      <div class="lede">
        <div>
          <p class="eyebrow">Nhìn từ triết học Mác – Lênin</p>
          <h2 class="display t-h2" data-split>Vì sao là <em class="c-gold">“đổi áo”</em> mà không phải <em>“đổi chất”?</em></h2>
        </div>
        <p class="t-lead" data-reveal>Hai quy luật giúp phân biệt <b>hình thức mới</b> với <b>bản chất không đổi</b> của độc quyền.</p>
      </div>
      <div class="phil__grid">
        <article class="card" data-reveal>
          <p class="pill pill--red">Quy luật lượng – chất</p>
          <div class="phil__viz" aria-hidden="true">
            <svg viewBox="0 0 520 170" class="qty-svg" preserveAspectRatio="none">
              <g data-qty>
                ${Array.from({ length: 11 }, (_, i) => {
                  const h = 18 + i * 9
                  return `<rect x="${12 + i * 30}" y="${150 - h}" width="20" height="${h}" rx="3" class="qty-bar"/>`
                }).join('')}
                <rect x="372" y="20" width="56" height="130" rx="4" class="qty-leap" />
                <rect x="440" y="24" width="56" height="126" rx="4" class="qty-leap qty-leap--2" />
              </g>
              <line x1="358" y1="6" x2="358" y2="158" class="qty-node" />
              <text x="12" y="166" class="qty-t">Cạnh tranh tự do · tích tụ dần về lượng (trong “độ”)</text>
              <text x="364" y="14" class="qty-t qty-t--red">Điểm nút → bước nhảy</text>
              <text x="378" y="166" class="qty-t">Độc quyền → “áo mới”</text>
            </svg>
          </div>
          <h3 class="display t-h3">${PHIL.qty.title}</h3>
          <p class="c-dim">${PHIL.qty.body}</p>
          <p class="cite">${PHIL.qty.cite}</p>
        </article>
        <article class="card" data-reveal data-delay="0.12">
          <p class="pill pill--gold">Quy luật QHSX phù hợp với trình độ LLSX</p>
          <div class="phil__viz" aria-hidden="true">
            <svg viewBox="0 0 520 170" class="net-svg">
              ${[
                [60, 40, 'Thiết kế'],
                [40, 120, 'Linh kiện'],
                [170, 150, 'Lắp ráp'],
                [300, 140, 'Logistics'],
                [200, 30, 'Phần mềm'],
                [330, 50, 'Marketing'],
              ]
                .map(
                  ([x, y, t]) =>
                    `<line x1="${x}" y1="${y}" x2="450" y2="88" class="net-l"/><circle cx="${x}" cy="${y}" r="7" class="net-n"/><text x="${x}" y="${(y as number) + 22}" class="qty-t" text-anchor="middle">${t}</text>`,
                )
                .join('')}
              <circle cx="450" cy="88" r="22" class="net-hub"/>
              <text x="450" y="128" class="qty-t qty-t--gold" text-anchor="middle">Sở hữu công nghệ,</text>
              <text x="450" y="142" class="qty-t qty-t--gold" text-anchor="middle">thương hiệu, lợi nhuận</text>
            </svg>
          </div>
          <h3 class="display t-h3">${PHIL.prod.title}</h3>
          <p class="c-dim">${PHIL.prod.body}</p>
          <p class="cite">${PHIL.prod.cite}</p>
        </article>
      </div>
    </div>
  </section>`,
  mount(el, { engine }) {
    engine.addStation({
      id: 'phil',
      chapter: 2,
      label: 'Nhìn từ triết học: lượng – chất, LLSX – QHSX',
      y: () => docTop(el) + 40,
      seconds: 40,
      notes: PHIL.notes,
    })
    if (reduceMotion) return
    const bars = el.querySelectorAll('.qty-bar')
    const leaps = el.querySelectorAll('.qty-leap')
    const lines = el.querySelectorAll('.net-l')
    gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%', transformBox: 'fill-box' })
    gsap.set(leaps, { scaleY: 0, transformOrigin: '50% 100%', transformBox: 'fill-box' })
    gsap.set(lines, { opacity: 0 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        gsap.to(bars, { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' })
        gsap.to(leaps, { scaleY: 1, duration: 0.7, delay: 1.1, stagger: 0.15, ease: 'back.out(2)' })
        gsap.to(lines, { opacity: 1, duration: 0.6, stagger: 0.12, delay: 0.3 })
      },
    })
  },
}

import { docTop, gsap, reduceMotion } from '../core/engine'
import { scramble } from '../core/fx'
import { THEORY } from '../content/theory'
import { type Section, notes } from './types'

/** Chương 2: 5 đặc điểm kinh tế của CNTB độc quyền (Lênin, 1916) lật thành 5 biểu hiện mới hôm nay. */
export const lenin: Section = {
  id: 'ly-luan',
  chapter: { n: 2, title: 'Từ Lênin 1916 đến hôm nay', short: 'Lý luận' },
  html: () => `
  <section class="sec lenin" id="ly-luan" aria-label="Năm đặc điểm của độc quyền và biểu hiện mới">
    <div class="lenin__pin">
      <div class="wrap">
        <div class="lenin__head">
          <div>
            <div class="chapter-tag"><span class="chapter-tag__n">02</span><span class="eyebrow">Nền tảng lý luận · Giáo trình Ch.4 mục II → III</span></div>
            <h2 class="display t-h1" data-lenin="title">${THEORY.leninTitleThen}</h2>
          </div>
          <div class="lenin__year" data-lenin="year" aria-live="polite">1916</div>
        </div>
        <div class="lenin__cards">
          ${THEORY.features
            .map(
              (f, i) => `
            <article class="flip" data-flip="${i}">
              <div class="flip__face flip__face--old">
                <span class="flip__n">${i + 1}</span>
                <h3 class="flip__t">${f.then}</h3>
                <p class="flip__d">${f.thenNote}</p>
              </div>
              <div class="flip__face flip__face--new">
                <span class="flip__n">${i + 1}</span>
                <h3 class="flip__t">${f.now}</h3>
                <p class="flip__d">${f.nowNote}</p>
                <p class="flip__ex">${f.example}</p>
              </div>
            </article>`,
            )
            .join('')}
        </div>
        <div class="lenin__foot">
          <p class="cite" data-lenin="cite">${THEORY.citeThen}</p>
          <p class="cite" style="text-align:right">${THEORY.citeNow}</p>
        </div>
      </div>
    </div>
  </section>`,

  mount(el, { engine }) {
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    const at = (f: number) => () => {
      const [s, e] = range()
      return s + (e - s) * f
    }
    engine.addStation({
      id: 'lenin-1916',
      chapter: 2,
      label: '5 đặc điểm kinh tế của CNTB độc quyền (Lênin)',
      y: at(0.02),
      seconds: 55,
      notes: THEORY.notesThen,
    })
    engine.addStation({
      id: 'lenin-now',
      chapter: 2,
      label: '5 biểu hiện mới của độc quyền ngày nay',
      y: at(0.985),
      seconds: 60,
      notes: THEORY.notesNow,
    })

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-flip]'))
    const year = el.querySelector('[data-lenin="year"]') as HTMLElement
    const title = el.querySelector('[data-lenin="title"]') as HTMLElement

    if (reduceMotion || window.innerWidth < 900) {
      // màn hình hẹp / giảm chuyển động: hiện cả hai mặt nối tiếp nhau
      cards.forEach((c) => {
        c.style.transformStyle = 'flat'
        c.querySelectorAll<HTMLElement>('.flip__face').forEach((f) => {
          f.style.position = 'relative'
          f.style.transform = 'none'
          f.style.backfaceVisibility = 'visible'
          f.style.marginBottom = '8px'
        })
      })
      return
    }

    let now = false
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const flipped = self.progress > 0.16
          if (flipped !== now) {
            now = flipped
            scramble(year, flipped ? 'Nay' : '1916', 0.6)
            gsap.to(title, {
              autoAlpha: 0,
              duration: 0.18,
              onComplete: () => {
                title.textContent = flipped ? THEORY.leninTitleNow : THEORY.leninTitleThen
                gsap.to(title, { autoAlpha: 1, duration: 0.3 })
              },
            })
          }
        },
      },
    })
    cards.forEach((c, i) => {
      tl.to(c, { rotateY: 180, duration: 0.12, ease: 'power2.inOut' }, 0.18 + i * 0.13)
    })
    tl.to({}, { duration: 0.05 })
  },
}

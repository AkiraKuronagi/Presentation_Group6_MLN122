import { meta } from '../content/meta'
import { docTop, gsap, ScrollTrigger, reduceMotion } from '../core/engine'
import { type Section, notes } from './types'

/** Nhãn địa danh hiện khi quả địa cầu "lặn" vào Việt Nam */
const PLACES = [
  { lat: 21.03, lon: 105.85, text: 'Hà Nội', vn: true },
  { lat: 10.82, lon: 106.63, text: 'TP. Hồ Chí Minh', vn: true },
  { lat: 16.5, lon: 112.0, text: 'Q.đ. Hoàng Sa (Việt Nam)', vn: true },
  { lat: 10.0, lon: 114.2, text: 'Q.đ. Trường Sa (Việt Nam)', vn: true },
]

export const cover: Section = {
  id: 'bia',
  chapter: { n: 1, title: 'Mở đầu', short: 'Mở đầu' },
  html: () => `
  <section class="sec sec--clear cover" id="bia" aria-label="Trang bìa">
    <div class="cover__pin">
      <div class="wrap cover__top">
        <div class="cover__inst">
          ${meta.school}<br />${meta.courseCode} · ${meta.courseName}<br />${meta.topicNo} · ${meta.group}
        </div>
        <div class="cover__inst" style="text-align:right">
          Lớp ${meta.className}<br />GV: ${meta.lecturer}<br />${meta.semester}
        </div>
      </div>

      <div class="wrap cover__main">
        <p class="eyebrow" data-cover="kicker">Biểu hiện mới của độc quyền &amp; độc quyền nhà nước</p>
        <h1 class="display t-mega cover__title" data-cover="title">Ai nắm giữ<br /><em>chuỗi giá trị?</em></h1>
        <p class="t-lead cover__sub" data-cover="sub">
          Các tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của chủ nghĩa tư bản —
          nhìn từ những chiếc điện thoại và chiếc áo “Made in Vietnam”.
        </p>
      </div>

      <div class="wrap" data-cover="meta">
        <dl class="cover__meta">
          <div><dt>Nhóm thực hiện</dt><dd>${meta.group}</dd></div>
          <div><dt>Nhóm phản biện</dt><dd>${meta.critics.join(', ')}</dd></div>
          <div><dt>Giáo trình</dt><dd>KTCT Mác – Lênin (2021), Ch.4 mục III · Ch.6 mục II</dd></div>
          <div>
            <dt>Thành viên</dt>
            <dd><ul class="cover__members">${meta.members
              .map((m) => `<li>${m.name} <small>${m.id}</small></li>`)
              .join('')}</ul></dd>
          </div>
        </dl>
        <div class="cover__cue" style="margin-top:22px"><i></i>Cuộn hoặc nhấn → để bắt đầu · ? để xem phím tắt</div>
      </div>

      <div class="cover__dive" data-cover="dive">
        <p class="display t-h2">Dòng vốn chảy vào. <em class="c-red">Hàng hóa chảy ra.</em></p>
        <p class="t-lead" style="margin-top:14px">Việt Nam đang đứng ở đâu trong dòng chảy ấy?</p>
      </div>
      <div class="cover__geo" data-cover="geo">
        ${PLACES.map((p, i) => `<span class="geo-label ${p.vn ? 'geo-label--vn' : ''}" data-geo="${i}">● ${p.text}</span>`).join('')}
      </div>
    </div>
  </section>`,

  mount(el, { engine, stage, globe }) {
    const q = (k: string) => el.querySelector(`[data-cover="${k}"]`) as HTMLElement
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    stage?.zone({ scene: 'globe', mode: 'hero', range })

    engine.addStation({
      id: 'cover',
      chapter: 1,
      label: 'Bìa — giới thiệu nhóm & chủ đề',
      y: () => range()[0],
      seconds: 20,
      notes: notes(
        'Chào thầy/cô và các bạn. Nhóm 6 trình bày Chủ đề 6: biểu hiện mới của độc quyền, độc quyền nhà nước; tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của CNTB.',
        'Câu hỏi dẫn đường của cả bài: <b>Ai nắm giữ chuỗi giá trị — và Việt Nam đang đứng ở đâu?</b>',
      ),
    })
    engine.addStation({
      id: 'cover-dive',
      chapter: 1,
      label: 'Dòng vốn vào – hàng hóa ra',
      y: () => {
        const [s, e] = range()
        return s + (e - s) * 0.86
      },
      seconds: 20,
      notes: notes(
        'Các đường màu vàng: dòng vốn đầu tư trực tiếp nước ngoài (FDI) từ các nền kinh tế, đối tác đầu tư lớn vào Việt Nam.',
        'Các đường màu đỏ: hàng hóa Việt Nam xuất khẩu ngược lại chính các thị trường đó.',
        'Lưu ý trên bản đồ: quần đảo Hoàng Sa, Trường Sa là của Việt Nam.',
      ),
    })

    if (reduceMotion) return
    // chữ bìa mờ dần khi quả địa cầu tiến lại; câu "dòng vốn" hiện ở pha cuối
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    })
    tl.to([q('kicker'), q('title'), q('sub')], { autoAlpha: 0, y: -60, stagger: 0.03, duration: 0.18, ease: 'power2.in' }, 0.1)
      .to(q('meta'), { autoAlpha: 0, y: 30, duration: 0.12 }, 0.08)
      .to(el.querySelectorAll('.cover__top'), { autoAlpha: 0, duration: 0.12 }, 0.08)
      .fromTo(q('dive'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.5)
      .to(q('dive'), { autoAlpha: 0, y: -30, duration: 0.1 }, 0.9)

    // nhãn địa danh bám theo quả địa cầu
    const labels = Array.from(el.querySelectorAll<HTMLElement>('[data-geo]'))
    engine.onFrame(() => {
      if (!globe || stage?.state?.mode !== 'hero') {
        labels.forEach((l) => (l.style.opacity = '0'))
        return
      }
      const show = globe.p > 0.7 && globe.p < 0.995
      labels.forEach((l, i) => {
        const p = PLACES[i]
        const s = globe.project(p.lat, p.lon)
        l.style.transform = `translate(${s.x}px, ${s.y}px) translate(8px, -50%)`
        l.style.opacity = show && s.front ? '1' : '0'
      })
    })
    ScrollTrigger.addEventListener('refresh', () => engine.sortStations())
  },
}

import gsap from 'gsap'
import qrcode from 'qrcode-generator'
import { SKILLS } from '../content/data'
import { photo, PHOTOS } from '../content/images'
import { MAJORS } from '../content/majors'
import { meta } from '../content/meta'
import { QUIZ } from '../content/quiz'
import { SOURCES } from '../content/sources'
import { reduceMotion, type Slide } from '../core/deck'
import { count, notes, refs, source } from './util'

// ─── 17. Bài học cho sinh viên ──────────────────────────────────────
const MW = 640
const MH = 300
const sp = (t: number) => [30 + ((t + 1) / 2) * (MW - 60), 250 - 200 * Math.pow(Math.abs(t), 1.65)] as const
const miniPath = () =>
  Array.from({ length: 41 }, (_, i) => sp(-1 + (2 * i) / 40))
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')

export const lesson: Slide = {
  id: 'bai-hoc',
  title: 'Bài học cho sinh viên',
  seconds: 55,
  bg: photo('students', { dim: 0.86 }),
  html: () => {
    const [vx, vy] = sp(0)
    return `
    <p class="k"><b>17</b>Bài học cho sinh viên</p>
    <h2 class="h h--m" data-in>Bạn sẽ đứng ở <em>đâu</em> trên đường cong?</h2>
    <div class="majors" role="group" aria-label="Chọn ngành học" data-in>
      ${MAJORS.map((m, i) => `<button type="button" data-major="${m.id}" aria-pressed="${i === 0}">${m.name}</button>`).join('')}
    </div>
    <div class="lesson" data-in>
      <div>
        <svg class="mini" viewBox="0 0 ${MW} ${MH}" aria-hidden="true">
          <path d="${miniPath()}" class="mini__curve" />
          <circle cx="${vx}" cy="${vy}" r="6" class="mini__vn" />
          <text x="${vx}" y="${vy + 34}" text-anchor="middle" class="mini__t">lắp ráp, gia công</text>
          <circle data-dot cx="${vx}" cy="${vy}" r="13" class="mini__dot" />
        </svg>
        <p class="lesson__stage" data-stage></p>
      </div>
      <div>
        <ul class="skills" data-skills></ul>
        <p class="lesson__fact" data-fact></p>
      </div>
    </div>
    <div class="row row--3 lesson__stats" data-in>
      <div class="stat stat--red"><div class="stat__v">${count(SKILLS.trainedLabour2025, 1)}<small>%</small></div><div class="stat__l">lao động có bằng, chứng chỉ (2025)</div></div>
      <div class="stat stat--blue"><div class="stat__v">${SKILLS.giiRank2026}<small>/139</small></div><div class="stat__l">Đổi mới sáng tạo 2026 · vốn con người hạng ${SKILLS.giiHumanCapitalRank2026}</div></div>
      <div class="stat"><div class="stat__v">${count(SKILLS.chipTotalTarget)}</div><div class="stat__l">nhân lực bán dẫn cần đến 2030</div></div>
    </div>
    ${source(refs('nso-2025', 'wipo-gii', 'qd1017', 'gt-triet'))}`
  },
  mount(el) {
    const dot = el.querySelector('[data-dot]') as SVGCircleElement
    const stage = el.querySelector('[data-stage]') as HTMLElement
    const skills = el.querySelector('[data-skills]') as HTMLElement
    const fact = el.querySelector('[data-fact]') as HTMLElement
    const pick = (id: string) => {
      const m = MAJORS.find((x) => x.id === id) ?? MAJORS[0]
      el.querySelectorAll<HTMLElement>('[data-major]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.major === m.id)))
      const [x, y] = sp(m.t)
      gsap.to(dot, { attr: { cx: x, cy: y }, duration: reduceMotion ? 0 : 0.8, ease: 'expo.out' })
      stage.textContent = m.stage
      skills.innerHTML = m.skills.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join('')
      fact.innerHTML = m.fact
      if (!reduceMotion) gsap.fromTo(skills.children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 })
    }
    el.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-major]')
      if (b) pick(b.dataset.major!)
    })
    pick(MAJORS[0].id)
  },
  notes: notes(
    'Ba con số: 29,2% lao động có bằng, chứng chỉ (2025); GII hạng 43/139 nhưng vốn con người & nghiên cứu chỉ hạng 79; cần 50.000 nhân lực bán dẫn đến 2030. (Kinh tế số mới 14,02% GDP so với mục tiêu 30% — hiện trong ngành Phần mềm.)',
    'Liên hệ lý luận: lao động phức tạp tạo nhiều giá trị hơn lao động giản đơn trong cùng thời gian.',
    'Mời 1–2 bạn nói ngành học; bấm ngành tương ứng để thấy vị trí trên đường cong và 4 năng lực cần có. Thông điệp: ngành nào cũng có đường lên hai đầu — vấn đề là có chủ động tích lũy hay không.',
    'Lượng – chất cho chính mình (Giáo trình Triết học): tích lũy đủ về lượng — kỹ năng, kinh nghiệm — mới có bước nhảy về chất; không nôn nóng, cũng không bảo thủ.',
  ),
}

// ─── 18. Minigame ────────────────────────────────────────────────────
export const quiz: Slide = {
  id: 'minigame',
  title: 'Minigame',
  seconds: 150,
  html: () => `
    <div class="quiz">
      <div class="quiz__main">
        <p class="k"><b>18</b>Minigame · ${QUIZ.length} câu · tối đa 5 phút</p>
        <p class="quiz__n" data-qn></p>
        <h2 class="quiz__q" data-q></h2>
        <div class="quiz__opts" data-opts></div>
        <p class="quiz__why" data-why hidden></p>
        <div class="quiz__nav">
          <div class="quiz__dots" data-dots>${QUIZ.map(() => '<i></i>').join('')}</div>
          <button type="button" class="btn" data-prevq>← Câu trước</button>
          <button type="button" class="btn" data-reveal>Hiện đáp án</button>
          <button type="button" class="btn btn--solid" data-nextq>Câu tiếp →</button>
        </div>
      </div>
      <aside class="score" aria-label="Bảng điểm">
        <p class="score__h">Bảng điểm</p>
        ${['Đội A', 'Đội B', 'Đội C']
          .map(
            (t, i) => `<div class="score__team"><span>${t}</span><b data-score="${i}">0</b><span class="score__btns"><button type="button" data-pt="${i}" data-d="1" aria-label="Cộng điểm ${t}">+</button><button type="button" data-pt="${i}" data-d="-1" aria-label="Trừ điểm ${t}">−</button></span></div>`,
          )
          .join('')}
        <p class="score__tip">Chia lớp 3 đội theo dãy bàn · giơ tay nhanh và đúng: +1</p>
      </aside>
    </div>`,
  mount(el) {
    let i = 0
    const scores = [0, 0, 0]
    const $ = (k: string) => el.querySelector(`[${k}]`) as HTMLElement
    const render = () => {
      const q = QUIZ[i]
      $('data-qn').textContent = `Câu ${i + 1}/${QUIZ.length}`
      $('data-q').textContent = q.q
      $('data-opts').innerHTML = q.opts.map((o, k) => `<button type="button" class="quiz__opt" data-o="${k}"><b>${'ABCD'[k]}</b><span>${o}</span></button>`).join('')
      $('data-why').hidden = true
      $('data-why').textContent = q.why
      el.querySelectorAll('[data-dots] i').forEach((d, k) => d.classList.toggle('is-on', k <= i))
      if (!reduceMotion) gsap.fromTo($('data-opts').children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4 })
    }
    const reveal = () => {
      el.querySelectorAll<HTMLElement>('[data-o]').forEach((b) => b.classList.toggle('is-right', +b.dataset.o! === QUIZ[i].a))
      el.querySelectorAll<HTMLElement>('[data-o].is-picked:not(.is-right)').forEach((b) => b.classList.add('is-wrong'))
      $('data-why').hidden = false
    }
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      const o = t.closest<HTMLElement>('[data-o]')
      if (o) {
        el.querySelectorAll('[data-o]').forEach((b) => b.classList.remove('is-picked'))
        o.classList.add('is-picked')
      }
      if (t.closest('[data-reveal]')) reveal()
      if (t.closest('[data-nextq]') && i < QUIZ.length - 1) (i++, render())
      if (t.closest('[data-prevq]') && i > 0) (i--, render())
      const p = t.closest<HTMLElement>('[data-pt]')
      if (p) {
        const k = +p.dataset.pt!
        scores[k] = Math.max(0, scores[k] + +p.dataset.d!)
        $(`data-score="${k}"`).textContent = String(scores[k])
      }
    })
    render()
  },
  notes: notes(
    'Chia lớp 3 đội. Đọc câu hỏi → đội giơ tay → bấm vào phương án đội chọn → “Hiện đáp án” → cộng điểm ở bảng bên phải.',
    'Mỗi câu ~30–40 giây; tổng không quá 5 phút (theo FAQ của môn). Nút “Câu tiếp” đổi câu; phím ↓ sang slide kết luận.',
  ),
}

// ─── 19. Kết luận ────────────────────────────────────────────────────
const POLL = ['Học việc trong tập đoàn FDI', 'Doanh nghiệp Việt / khởi nghiệp', 'Lộ trình: FDI trước, rồi về DN Việt']
const PLEDGES = [
  ['Học sâu một năng lực lõi', 'thiết kế, phần mềm, dữ liệu, thương hiệu'],
  ['Học “luật chơi” toàn cầu', 'ngoại ngữ, xuất xứ, sở hữu trí tuệ'],
  ['Làm việc có trách nhiệm', 'tuân thủ pháp luật, dùng AI có kiểm chứng'],
]

export const outro: Slide = {
  id: 'ket',
  title: 'Kết luận',
  seconds: 50,
  gl: { scene: 'globe', mode: 'footer', x: 1500, y: 520, p: 1, speed: 0.4 },
  html: () => `
    <div class="col col--wide">
      <p class="k"><b>19</b>Thông điệp của nhóm</p>
      <h2 class="h h--l outro__h" data-in>Hội nhập để lớn lên —<br /><em>tự chủ để không<br />bị cuốn đi.</em></h2>
      <div class="pledges" data-in>
        ${PLEDGES.map(([b, s]) => `<button type="button" class="pledge" data-pledge><b>${b}</b><span>${s}</span></button>`).join('')}
      </div>
      <p class="outro__thanks" data-in>Cảm ơn thầy cô và các bạn đã lắng nghe!</p>
    </div>
    <div class="open" data-in>
      <p class="open__k">Câu hỏi mở</p>
      <p class="open__q">Tốt nghiệp xong, bạn chọn <em>học việc trong tập đoàn FDI</em> hay <em class="r">xây năng lực cho doanh nghiệp Việt?</em></p>
      <div class="poll">
        ${POLL.map((t, i) => `<div class="poll__row"><span>${t}</span><i><i data-pbar="${i}"></i></i><b data-pn="${i}">0</b><button type="button" data-pv="${i}" aria-label="Thêm phiếu: ${t}">+</button></div>`).join('')}
      </div>
      ${meta.pollUrl ? '<div class="open__qr" data-qr></div>' : ''}
    </div>`,
  mount(el) {
    const pv = [0, 0, 0]
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      t.closest('[data-pledge]')?.classList.toggle('is-on')
      const b = t.closest<HTMLElement>('[data-pv]')
      if (!b) return
      pv[+b.dataset.pv!]++
      const total = pv.reduce((a, c) => a + c, 0)
      pv.forEach((v, i) => {
        ;(el.querySelector(`[data-pn="${i}"]`) as HTMLElement).textContent = String(v)
        ;(el.querySelector(`[data-pbar="${i}"]`) as HTMLElement).style.transform = `scaleX(${v / total})`
      })
    })
    const qr = el.querySelector('[data-qr]')
    if (qr && meta.pollUrl) {
      const q = qrcode(0, 'M')
      q.addData(meta.pollUrl)
      q.make()
      qr.innerHTML = q.createSvgTag({ cellSize: 5, margin: 2, scalable: true })
    }
  },
  notes: notes(
    'Kết luận một câu: độc quyền ngày nay không biến mất mà đổi hình thức — tập đoàn xuyên quốc gia điều phối chuỗi giá trị toàn cầu và giữ hai đầu giá trị cao.',
    'Việt Nam lựa chọn hội nhập sâu rộng nhưng giữ vững độc lập, tự chủ; với sinh viên, đó là nâng năng lực để leo lên hai đầu “đường cong nụ cười”. Mời cả lớp chọn một cam kết (bấm để đánh dấu).',
    'Câu hỏi mở: mời 2–3 bạn trả lời, yêu cầu dùng một khái niệm của bài (chuỗi giá trị, nội địa hóa, độc lập – tự chủ, lượng – chất). Không có lựa chọn sai — quan trọng là “lộ trình tích lũy”, đúng quy luật lượng – chất.',
    'Mời các nhóm phản biện (Nhóm 7, 8, 9) đặt câu hỏi.',
  ),
}

// ─── 20. Tài liệu tham khảo ─────────────────────────────────────────
export const references: Slide = {
  id: 'tai-lieu',
  title: 'Tài liệu tham khảo',
  seconds: 10,
  html: () => `
    <div class="refs__head">
      <div>
        <p class="k"><b>20</b>APA 7 · ${SOURCES.length} nguồn</p>
        <h2 class="h h--m">Tài liệu tham khảo</h2>
      </div>
      <div>
        <p class="refs__note">Nguồn chính thống: giáo trình, văn kiện, văn bản pháp luật, cơ quan nhà nước, báo Đảng – Chính phủ, tổ chức quốc tế, báo cáo bắt buộc của doanh nghiệp. Các phép so sánh “lần GDP” do nhóm tự tính. Công cụ AI chỉ hỗ trợ tìm nguồn, dựng giao diện, phản biện — chi tiết ở <b>Phụ lục AI</b>; không dùng ảnh do AI tạo.</p>
        ${
          Object.keys(PHOTOS).length
            ? `<p class="refs__note">Ảnh nền (Wikimedia Commons, giấy phép mở): ${Object.values(PHOTOS)
                .map((p) => `<a href="${p.url}" target="_blank" rel="noopener">${p.caption}</a> — ${p.author}, <a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a>`)
                .join('; ')}.</p>`
            : ''
        }
      </div>
    </div>
    <ol class="refs">
      ${SOURCES.map((s) => `<li>${s.apa}${s.url ? ` <a href="${s.url}" target="_blank" rel="noopener">${s.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</a>` : ''}</li>`).join('')}
    </ol>`,
  notes: notes('Lướt qua: nguồn chính thống, trích dẫn APA 7, ảnh nền từ Wikimedia Commons có giấy phép mở; nhắc tới Phụ lục AI đã nộp kèm.'),
}


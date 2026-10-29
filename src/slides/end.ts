import gsap from 'gsap'
import { NSO_YEAR_URLS, SKILLS } from '../content/data'
import { photo, PHOTOS } from '../content/images'
import { MAJORS } from '../content/majors'
import { SOURCES } from '../content/sources'
import { reduceMotion, type Slide } from '../core/deck'
import { VN_PLACES } from './intro'
import { count, notes, refs, source } from './util'

// ─── 16. Bài học cho sinh viên ──────────────────────────────────────
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
  seconds: 50,
  bg: photo('students', { dim: 0.86 }),
  html: () => {
    const [vx, vy] = sp(0)
    return `
    <p class="k"><b>16</b>Bài học cho sinh viên</p>
    <h2 class="h h--m" data-in>Nâng năng lực để bước lên <em>khâu giá trị cao hơn</em></h2>
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
        <ul class="more" data-in>
          <li><b>Lao động phức tạp</b> tạo ra nhiều giá trị hơn lao động giản đơn trong cùng một thời gian</li>
          <li><b>Lượng – chất:</b> tích lũy đủ kỹ năng, kinh nghiệm mới có bước nhảy — không vội vàng, cũng đừng đứng yên</li>
        </ul>
      </div>
    </div>
    <div class="row row--3 lesson__stats" data-in>
      <div class="stat stat--red"><div class="stat__v">${count(SKILLS.trainedLabour2025, 1)}<small>%</small></div><div class="stat__l">lao động qua đào tạo có bằng, chứng chỉ (ước tính 2025)</div></div>
      <div class="stat stat--blue"><div class="stat__v">${SKILLS.giiRank2026}<small>/139</small></div><div class="stat__l">Chỉ số Đổi mới sáng tạo toàn cầu 2026 · riêng trụ cột vốn con người &amp; nghiên cứu hạng ${SKILLS.giiHumanCapitalRank2026}</div></div>
      <div class="stat"><div class="stat__v">${count(SKILLS.chipTotalTarget)}</div><div class="stat__l">mục tiêu đào tạo ít nhất 50.000 nhân lực bán dẫn trình độ ĐH trở lên đến 2030 (QĐ 1017/QĐ-TTg)</div></div>
    </div>
    ${source(refs('nso-2025', 'wipo-gii', 'most-gii', 'qd1017', 'gt-triet'))}`
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
      skills.innerHTML = m.skills.map(([b]) => `<li><b>${b}</b></li>`).join('')
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
    'Với sinh viên, có mấy con số đáng nghĩ. Năm 2025, tỷ lệ lao động qua đào tạo có bằng, chứng chỉ ước đạt 29,2%. Năm 2026, Việt Nam xếp hạng 43 trên 139 về Chỉ số Đổi mới sáng tạo toàn cầu, nhưng riêng trụ cột vốn con người và nghiên cứu chỉ hạng 79. Theo Quyết định 1017, đến năm 2030 cần đào tạo ít nhất 50.000 nhân lực bán dẫn trình độ đại học trở lên.',
    '(Bấm 2–3 ngành trên màn hình.) Ngành nào thì sinh viên cũng cần nâng chuyên môn, công nghệ, ngoại ngữ và kỹ năng để tham gia được những khâu có giá trị cao hơn. Lao động phức tạp tạo ra nhiều giá trị hơn lao động giản đơn trong cùng một thời gian. Và theo quy luật lượng – chất, phải tích lũy đủ thì mới có bước nhảy: không vội vàng, nhưng cũng không đứng yên.',
    'Cách bấm: bấm 2–3 ngành (ví dụ ngành của các bạn trong nhóm) để thấy vị trí trên đường cong và các kỹ năng cần có.',
  ),
}

// ─── 17. Kết luận ────────────────────────────────────────────────────
const PLEDGES = [
  ['Học sâu một năng lực lõi', 'thiết kế, phần mềm, dữ liệu, thương hiệu'],
  ['Học “luật chơi” toàn cầu', 'ngoại ngữ, xuất xứ, sở hữu trí tuệ'],
  ['Làm việc có trách nhiệm', 'tuân thủ pháp luật, dùng AI có kiểm chứng'],
]

export const outro: Slide = {
  id: 'ket',
  title: 'Kết luận',
  seconds: 40,
  gl: { scene: 'globe', mode: 'footer', x: 1500, y: 520, p: 1, speed: 0.4 },
  labels: VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  html: () => `
    <div class="col col--wide">
      <p class="k"><b>17</b>Thông điệp của nhóm</p>
      <h2 class="h h--l outro__h" data-in>Hội nhập để lớn lên —<br /><em>tự chủ để không<br />bị cuốn đi.</em></h2>
      <ul class="more" data-in style="max-width:960px">
        <li>Độc quyền không mất đi mà đổi hình thức: tập đoàn xuyên quốc gia chi phối nhiều chuỗi giá trị toàn cầu, thường nắm các khâu giá trị gia tăng cao — nghiên cứu, thiết kế, công nghệ, thương hiệu</li>
        <li>Việt Nam hội nhập sâu nhưng giữ độc lập, tự chủ; sinh viên nâng năng lực để tham gia những khâu có giá trị cao hơn</li>
      </ul>
      <div class="pledges" data-in>
        ${PLEDGES.map(([b, s]) => `<div class="pledge"><b>${b}</b><span>${s}</span></div>`).join('')}
      </div>
      <p class="outro__thanks" data-in>Cảm ơn thầy và các bạn đã lắng nghe!</p>
    </div>`,
  notes: notes(
    'Tóm lại, độc quyền ngày nay không mất đi mà đổi hình thức. Tập đoàn xuyên quốc gia chi phối nhiều chuỗi giá trị toàn cầu và thường nắm các khâu có giá trị gia tăng cao như nghiên cứu, thiết kế, công nghệ, thương hiệu. Việt Nam hội nhập sâu nhưng giữ độc lập, tự chủ. Còn sinh viên thì cần nâng năng lực để tham gia những khâu có giá trị cao hơn, bằng ba việc: học sâu một năng lực chính, hiểu luật chơi toàn cầu, và làm việc có trách nhiệm.',
    'Thông điệp của nhóm 6: hội nhập để lớn lên, tự chủ để không bị cuốn đi. Phần trình bày của nhóm đến đây là hết. Cảm ơn thầy và các bạn đã lắng nghe. Mời Nhóm 7, 8, 9 đặt câu hỏi.',
  ),
}

// ─── 18. Tài liệu tham khảo ─────────────────────────────────────────
export const references: Slide = {
  id: 'tai-lieu',
  title: 'Tài liệu tham khảo',
  seconds: 10,
  html: () => `
    <div class="refs__head">
      <div>
        <p class="k"><b>18</b>APA 7 · ${SOURCES.length} nguồn</p>
        <h2 class="h h--m">Tài liệu tham khảo</h2>
      </div>
      <div>
        <p class="refs__note">Nguồn chính thống: giáo trình, văn kiện, văn bản pháp luật, cơ quan nhà nước, báo Đảng – Chính phủ, tổ chức quốc tế, báo cáo bắt buộc của doanh nghiệp. Các phép so sánh “lần GDP” do nhóm tự tính.</p>
        ${
          Object.keys(PHOTOS).length
            ? `<p class="refs__note">Ảnh nền (Wikimedia Commons, giấy phép mở): ${Object.values(PHOTOS)
                .map((p) => `<a href="${p.url}" target="_blank" rel="noopener">${p.caption}</a> — ${p.author}, <a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a>`)
                .join('; ')}.</p>`
            : ''
        }
        <p class="refs__note">Chuỗi FDI – xuất khẩu (Tổng cục/Cục Thống kê) theo năm: ${Object.entries(NSO_YEAR_URLS)
          .map(([y, u]) => `<a href="${u}" target="_blank" rel="noopener">${y}</a>`)
          .join(' · ')}.</p>
      </div>
    </div>
    <ol class="refs">
      ${SOURCES.map((s) => `<li>${s.apa}${s.url ? ` <a href="${s.url}" target="_blank" rel="noopener">${s.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</a>` : ''}</li>`).join('')}
    </ol>`,
  // chữ danh mục to nhất có thể mà vẫn vừa một khung (phông khác nhau giữa các máy nên đo khi vào slide)
  enter(el) {
    const ol = el.querySelector<HTMLElement>('.refs')!
    const stage = el.querySelector<HTMLElement>('.slide__stage')!
    const room = stage.clientHeight - parseFloat(getComputedStyle(stage).paddingBottom) - ol.offsetTop
    let fs = 20
    do {
      ol.style.fontSize = `${fs}px`
      fs -= 0.25
    } while (ol.offsetHeight > room && fs > 10)
  },
  notes: notes(
    'Số liệu trong bài đều có nguồn, ghi theo chuẩn APA 7 ở slide này. Việc nhóm dùng AI được ghi trong Phụ lục AI nộp kèm.',
  ),
}


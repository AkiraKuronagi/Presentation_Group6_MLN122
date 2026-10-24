import { SKILLS } from '../content/data'
import { cite } from '../content/sources'
import { docTop, gsap, reduceMotion } from '../core/engine'
import { type Section, notes } from './types'

const nf = (v: number, d = 0) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d }).format(v)

interface Major {
  id: string
  name: string
  /** vị trí trên đường cong, -1 (R&D) … 0 (lắp ráp) … 1 (thương hiệu) */
  t: number
  stage: string
  skills: Array<[string, string]>
  fact: string
}

const MAJORS: Major[] = [
  {
    id: 'ic',
    name: 'Thiết kế vi mạch',
    t: -0.92,
    stage: 'R&D · thiết kế chip — đỉnh trái',
    skills: [
      ['Thiết kế số & tương tự', 'nền tảng điện tử, vật lý bán dẫn'],
      ['Công cụ EDA, kiểm chứng', 'học qua dự án, phòng thí nghiệm trường'],
      ['Tiếng Anh kỹ thuật', 'đọc tài liệu chuẩn quốc tế'],
      ['Sở hữu trí tuệ', 'bằng sáng chế, bí mật kinh doanh'],
    ],
    fact: `Cả nước mới có khoảng ${nf(SKILLS.chipDesignEngineers)} kỹ sư thiết kế chip, mục tiêu ${nf(SKILLS.chipDesignTarget)} người đến 2030 ${cite('most-chip', 'qd1017')}`,
  },
  {
    id: 'ai',
    name: 'Trí tuệ nhân tạo · Dữ liệu',
    t: -0.8,
    stage: 'R&D · công nghệ lõi — đỉnh trái',
    skills: [
      ['Toán, thống kê, học máy', 'nền tảng không thể “đi tắt”'],
      ['Dữ liệu & điện toán', 'xử lý dữ liệu lớn, MLOps'],
      ['Đạo đức & pháp lý AI', 'dùng AI có trách nhiệm'],
      ['Giải bài toán Việt Nam', 'ngôn ngữ, y tế, nông nghiệp…'],
    ],
    fact: `ILO: khoảng ${nf(SKILLS.aiExposedWorkersM, 1)} triệu lao động Việt Nam làm nghề có nhiệm vụ chịu tác động của AI tạo sinh ${cite('ilo-2026')}`,
  },
  {
    id: 'se',
    name: 'Kỹ thuật phần mềm',
    t: -0.6,
    stage: 'Phần mềm · sản phẩm số — sườn trái',
    skills: [
      ['Xây sản phẩm, không chỉ “gia công code”', 'từ outsourcing sang sản phẩm riêng'],
      ['Kiến trúc hệ thống, bảo mật', 'chất lượng chuẩn quốc tế'],
      ['Tư duy sản phẩm & người dùng', 'hiểu thị trường'],
      ['Bản quyền phần mềm', 'giữ giá trị ở lại'],
    ],
    fact: `Kinh tế số mới đạt ${nf(SKILLS.digitalEconomy2025, 2)}% GDP (2025); mục tiêu ${SKILLS.digitalEconomyTarget2030}% vào 2030 ${cite('nso-digital', 'nq57')}`,
  },
  {
    id: 'design',
    name: 'Thiết kế · Mỹ thuật số',
    t: -0.72,
    stage: 'Thiết kế sản phẩm (ODM) — sườn trái',
    skills: [
      ['Thiết kế sản phẩm, UX', 'tự đề xuất mẫu thay vì nhận mẫu'],
      ['Nghiên cứu xu hướng', 'dữ liệu người tiêu dùng'],
      ['Vật liệu & sản xuất', 'thiết kế làm ra được'],
      ['Bản sắc Việt', 'khác biệt khó sao chép'],
    ],
    fact: `Dệt may mới ~10% đơn hàng theo phương thức ODM ${cite('moit-cmt')}; Chiến lược đến 2030 yêu cầu chuyển sang thiết kế, thương hiệu ${cite('qd1643')}`,
  },
  {
    id: 'logi',
    name: 'Kinh doanh quốc tế · Logistics',
    t: 0.42,
    stage: 'Phân phối · chuỗi cung ứng — sườn phải',
    skills: [
      ['Quy tắc xuất xứ, FTA', 'EVFTA, CPTPP: “từ vải”, “từ sợi”'],
      ['Quản trị chuỗi cung ứng', 'tìm nguồn, tối ưu chi phí'],
      ['Luật thương mại quốc tế', 'phòng vệ thương mại, thuế quan'],
      ['Đàm phán với nhãn hàng', 'từ CMT lên FOB'],
    ],
    fact: `Tỷ lệ tận dụng ưu đãi C/O của dệt may chỉ ~15% (CPTPP), 30–35% (EVFTA) ${cite('moit-roo')}`,
  },
  {
    id: 'mkt',
    name: 'Marketing · Quản trị kinh doanh',
    t: 0.8,
    stage: 'Thương hiệu · bán hàng — đỉnh phải',
    skills: [
      ['Xây dựng thương hiệu (OBM)', 'từ “làm thuê” sang “làm chủ”'],
      ['Marketing số, thương mại điện tử', 'tiếp cận khách hàng toàn cầu'],
      ['Tài chính & quản trị rủi ro', 'đọc hiểu báo cáo, dòng vốn'],
      ['Kinh doanh có trách nhiệm', 'tuân thủ pháp luật, ESG'],
    ],
    fact: `Dệt may: chỉ ~1% doanh nghiệp làm thương hiệu riêng (OBM), theo chuyên gia trên ${cite('nd-dm-smile')}`,
  },
  {
    id: 'lang',
    name: 'Ngôn ngữ (Anh · Nhật · Hàn · Trung)',
    t: 0.6,
    stage: 'Cầu nối thị trường, dịch vụ — sườn phải',
    skills: [
      ['Ngoại ngữ + một chuyên môn', 'ngôn ngữ là công cụ, không là đích'],
      ['Hiểu văn hóa đối tác', 'Hàn Quốc, Singapore, Nhật Bản dẫn đầu vốn FDI'],
      ['Biên – phiên dịch chuyên ngành', 'kỹ thuật, pháp lý, thương mại'],
      ['Bản lĩnh văn hóa', 'hội nhập mà không “hòa tan”'],
    ],
    fact: `Lũy kế FDI: Hàn Quốc 94,6 tỷ USD, Singapore 89,8 tỷ USD (31/12/2025) ${cite('fia-2025')}`,
  },
]

const SW = 300
const SH = 150
const sp = (t: number) => {
  const x = 20 + ((t + 1) / 2) * (SW - 40)
  const y = 120 - 95 * Math.pow(Math.abs(t), 1.65)
  return [x, y]
}
const miniPath = () => {
  let d = ''
  for (let i = 0; i <= 40; i++) {
    const t = -1 + (2 * i) / 40
    const [x, y] = sp(t)
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }
  return d
}

export const lesson: Section = {
  id: 'bai-hoc',
  chapter: { n: 9, title: 'Bài học cho sinh viên', short: 'Bài học' },
  html: () => {
    const [vx, vy] = sp(0)
    return `
  <section class="sec sec--pad" id="bai-hoc" aria-label="Bài học cho sinh viên">
    <div class="wrap">
      <div class="lede">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">09</span><span class="eyebrow">Bài học cá nhân</span></div>
          <h2 class="display t-h1" data-split>Bạn sẽ đứng ở <em class="c-gold">đâu</em> trên đường cong?</h2>
        </div>
        <p class="t-lead" data-reveal>Lao động phức tạp, hàm lượng tri thức cao tạo ra nhiều giá trị hơn. Muốn giữ lại phần giá trị lớn hơn, phải nâng chất lượng sức lao động — bắt đầu từ chính mình.</p>
      </div>

      <div class="datastrip" data-stagger>
        <div class="evidence"><div class="evidence__v"><span data-count="${SKILLS.trainedLabour2025}" data-digits="1">29,2</span><span class="evidence__u">%</span></div><p class="evidence__l">lao động qua đào tạo có bằng, chứng chỉ (2025)</p>${cite('nso-2025')}</div>
        <div class="evidence"><div class="evidence__v"><span data-count="${SKILLS.giiRank2026}">43</span><span class="evidence__u">/139</span></div><p class="evidence__l">hạng Đổi mới sáng tạo toàn cầu 2026; riêng trụ cột vốn con người &amp; nghiên cứu chỉ hạng ${SKILLS.giiHumanCapitalRank2026}</p>${cite('wipo-gii')}</div>
        <div class="evidence"><div class="evidence__v"><span data-count="${SKILLS.digitalEconomy2025}" data-digits="2">14,02</span><span class="evidence__u">% GDP</span></div><p class="evidence__l">kinh tế số năm 2025 — mục tiêu ${SKILLS.digitalEconomyTarget2030}% vào 2030</p>${cite('nso-digital', 'nq57')}</div>
        <div class="evidence"><div class="evidence__v"><span data-count="${SKILLS.chipTotalTarget}">50.000</span></div><p class="evidence__l">nhân lực bán dẫn trình độ đại học trở lên cần đào tạo đến 2030</p>${cite('qd1017')}</div>
      </div>

      <p class="eyebrow">Chọn ngành của bạn</p>
      <div class="lesson__picker" role="group" aria-label="Chọn ngành học">
        ${MAJORS.map((m, i) => `<button type="button" data-major="${m.id}" aria-pressed="${i === 0}">${m.name}</button>`).join('')}
      </div>
      <div class="lesson__out">
        <div>
          <svg class="mini-smile" viewBox="0 0 ${SW} ${SH}" aria-hidden="true">
            <path d="${miniPath()}"/>
            <circle cx="${vx}" cy="${vy}" r="5" style="fill:var(--fg-3)"/>
            <text x="${vx}" y="${vy + 22}" text-anchor="middle" class="qty-t">lắp ráp, gia công</text>
            <circle data-dot cx="${vx}" cy="${vy}" r="9"/>
          </svg>
          <p class="mono t-small c-gold" data-stage style="margin:6px 0 0"></p>
        </div>
        <div>
          <ul class="lesson__skills" data-skills></ul>
          <p class="t-small c-dim" data-fact style="margin:14px 0 0"></p>
        </div>
      </div>

      <div class="phil-note card card--ghost" data-reveal style="margin-top:clamp(30px,5vh,56px)">
        <p class="t-small" style="margin:0"><b>Lượng – chất cho chính mình:</b> phải biết tích lũy về lượng để có biến đổi về chất; không nôn nóng, cũng không bảo thủ. Kỹ năng tích lũy đủ “điểm nút” thì mới “nhảy” được lên khâu giá trị cao. ${cite('gt-triet')}</p>
      </div>

      <p class="eyebrow" style="margin-top:clamp(40px,7vh,80px)">Kêu gọi hành động — mỗi người chọn ít nhất một cam kết</p>
      <div class="commit">
        <label><input type="checkbox" /><span><b>Học sâu một năng lực lõi</b><br/><span class="t-small c-dim">thiết kế, phần mềm, dữ liệu, thương hiệu — thứ khó bị thay thế</span></span></label>
        <label><input type="checkbox" /><span><b>Học “luật chơi” toàn cầu</b><br/><span class="t-small c-dim">ngoại ngữ, quy tắc xuất xứ, sở hữu trí tuệ, luật thương mại quốc tế</span></span></label>
        <label><input type="checkbox" /><span><b>Làm việc có trách nhiệm</b><br/><span class="t-small c-dim">tuân thủ pháp luật, kinh doanh liêm chính, dùng AI có kiểm chứng</span></span></label>
      </div>
    </div>
  </section>`
  },
  mount(el, { engine }) {
    const picker = el.querySelector('.lesson__picker') as HTMLElement
    engine.addStation({
      id: 'lesson-1',
      chapter: 9,
      label: 'Khoảng cách năng lực — số liệu',
      y: () => docTop(el),
      seconds: 40,
      notes: notes(
        'Bốn con số: 29,2% lao động có bằng, chứng chỉ (2025); GII hạng 43/139 nhưng vốn con người & nghiên cứu chỉ hạng 79; kinh tế số 14,02% GDP so với mục tiêu 30%; cần 50.000 nhân lực bán dẫn đến 2030.',
        'Liên hệ lý luận: lao động phức tạp tạo nhiều giá trị hơn lao động giản đơn trong cùng thời gian.',
      ),
    })
    engine.addStation({
      id: 'lesson-2',
      chapter: 9,
      label: 'Chọn ngành → vị trí trên đường cong',
      y: () => docTop(picker) - window.innerHeight * 0.3,
      seconds: 50,
      notes: notes(
        'Mời 1–2 bạn trong lớp nói ngành học; bấm chọn ngành tương ứng để thấy vị trí trên đường cong và 4 năng lực cần có.',
        'Thông điệp: ngành nào cũng có đường lên hai đầu — vấn đề là có chủ động tích lũy hay không.',
      ),
    })
    engine.addStation({
      id: 'lesson-3',
      chapter: 9,
      label: 'Kêu gọi hành động — 3 cam kết',
      y: () => docTop(el.querySelector('.commit') as HTMLElement) - window.innerHeight * 0.45,
      seconds: 30,
      notes: notes('Mời cả lớp chọn một cam kết. Bấm vào ô để đánh dấu cam kết được nhiều bạn chọn nhất.'),
    })

    const dot = el.querySelector('[data-dot]') as SVGCircleElement
    const stage = el.querySelector('[data-stage]') as HTMLElement
    const skills = el.querySelector('[data-skills]') as HTMLElement
    const fact = el.querySelector('[data-fact]') as HTMLElement
    const pick = (id: string) => {
      const m = MAJORS.find((x) => x.id === id) ?? MAJORS[0]
      picker.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.major === m.id)))
      const [x, y] = sp(m.t)
      if (reduceMotion) {
        dot.setAttribute('cx', String(x))
        dot.setAttribute('cy', String(y))
      } else gsap.to(dot, { attr: { cx: x, cy: y }, duration: 0.7, ease: 'power3.out' })
      stage.textContent = m.stage
      skills.innerHTML = m.skills.map(([b, s]) => `<li><b>${b}</b>${s}</li>`).join('')
      fact.innerHTML = m.fact
      if (!reduceMotion) gsap.fromTo(skills.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 })
    }
    picker.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('[data-major]') as HTMLElement | null
      if (b) pick(b.dataset.major!)
    })
    pick(MAJORS[0].id)
  },
}

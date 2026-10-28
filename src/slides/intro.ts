import gsap from 'gsap'
import { meta } from '../content/meta'
import { photo } from '../content/images'
import { PHIL } from '../content/theory'
import { reduceMotion, type Slide } from '../core/deck'
import { scramble } from '../core/fx'
import { notes, refs, source } from './util'

/** Đảo, thành phố luôn ghi khi quả địa cầu quay tới Việt Nam */
export const VN_PLACES = [
  { at: '16.5,112', html: 'Q.đ. Hoàng Sa <i>(Việt Nam)</i>' },
  { at: '10,114.2', html: 'Q.đ. Trường Sa <i>(Việt Nam)</i>' },
]

// ─── 1. Bìa ──────────────────────────────────────────────────────────
export const cover: Slide = {
  id: 'bia',
  title: 'Bìa',
  seconds: 30,
  gl: { scene: 'globe', mode: 'cover', x: 1530, y: 560, p: 1, speed: 0.35 },
  labels: VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  html: () => `
    <div class="cover">
      <p class="k">${meta.courseCode} · ${meta.courseName} · ${meta.topicNo}</p>
      <h1 class="h h--xl cover__title" data-in>Ai nắm giữ<br /><em>chuỗi giá trị?</em></h1>
      <p class="lead cover__sub" data-in>Biểu hiện mới của độc quyền và độc quyền nhà nước — tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của CNTB.</p>
      <div class="cover__meta" data-in>
        <div><span>Nhóm thực hiện</span><b>${meta.group}</b></div>
        <div><span>Lớp · Giảng viên</span><b>${meta.className} · ${meta.lecturer}</b></div>
        <div><span>Nhóm phản biện</span><b>${meta.critics.join(', ')}</b></div>
      </div>
      <ul class="cover__team" data-in>${meta.members.map((m) => `<li>${m.name}<small>${m.id}</small></li>`).join('')}</ul>
      <p class="cover__hint"><kbd>↓</kbd> slide tiếp · <kbd>F</kbd> toàn màn hình · <kbd>?</kbd> phím tắt</p>
    </div>`,
  notes: notes(
    'Chào thầy/cô và các bạn. Nhóm 6 trình bày Chủ đề 6: biểu hiện mới của độc quyền, độc quyền nhà nước; tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của CNTB.',
    'Câu hỏi dẫn đường của cả bài: <b>Ai nắm giữ chuỗi giá trị — và Việt Nam đang đứng ở đâu?</b>',
    'Trên quả địa cầu: cung vàng là dòng vốn FDI vào Việt Nam, cung đỏ là hàng hóa Việt Nam xuất đi. Quần đảo Hoàng Sa, Trường Sa là của Việt Nam.',
  ),
}

// ─── 2. Câu hỏi mở đầu ──────────────────────────────────────────────
export const HOOK_OPTIONS = [
  { k: 'A', t: 'Trên 60 USD' },
  { k: 'B', t: '40 – 60 USD' },
  { k: 'C', t: '20 – 40 USD' },
  { k: 'D', t: 'Dưới 20 USD' },
]
/** Đáp án — công bố ở slide "Đáp án" sau khi tách lớp chiếc điện thoại */
export const HOOK_ANSWER = 3
const votes = [0, 0, 0, 0]
export const hookVotes = () => votes.slice()

export const hook: Slide = {
  id: 'cau-hoi',
  title: 'Câu hỏi mở đầu',
  seconds: 45,
  bg: photo('port', { dim: 0.7 }),
  html: () => `
    <p class="k"><b>02</b>Câu hỏi mở đầu · cả lớp bình chọn</p>
    <h2 class="h h--l hook__q" data-in>Trong <em>100 USD</em> hàng điện tử<br />“Made in Vietnam”, bao nhiêu<br /><em class="r">ở lại Việt Nam?</em></h2>
    <div class="vote" data-in>
      ${HOOK_OPTIONS.map(
        (o, i) => `
        <div class="vote__opt">
          <span class="vote__k">${o.k}</span>
          <span class="vote__t">${o.t}</span>
          <span class="vote__n" data-n="${i}">0</span>
          <i class="vote__bar"><i data-bar="${i}"></i></i>
          <span class="vote__btns"><button type="button" data-tally="${i}" data-d="1" aria-label="Thêm phiếu ${o.k}">+</button><button type="button" data-tally="${i}" data-d="-1" aria-label="Bớt phiếu ${o.k}">−</button></span>
        </div>`,
      ).join('')}
    </div>
    <p class="hook__foot">Giơ tay chọn A – D · đáp án sau khi “tách lớp” một chiếc điện thoại</p>`,
  mount(el) {
    const render = () => {
      const total = votes.reduce((a, b) => a + b, 0)
      votes.forEach((v, i) => {
        ;(el.querySelector(`[data-n="${i}"]`) as HTMLElement).textContent = `${v}`
        ;(el.querySelector(`[data-bar="${i}"]`) as HTMLElement).style.transform = `scaleX(${total ? v / total : 0})`
      })
      document.dispatchEvent(new CustomEvent('hook:votes'))
    }
    el.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tally]')
      if (!t) return
      const i = +t.dataset.tally!
      votes[i] = Math.max(0, votes[i] + +t.dataset.d!)
      render()
    })
  },
  notes: notes(
    'Đọc câu hỏi, mời cả lớp giơ tay cho A, B, C, D; bấm “+” dưới mỗi phương án để ghi phiếu.',
    'Không tiết lộ đáp án — hẹn công bố sau khi tách lớp chiếc điện thoại.',
    'Ba câu hỏi dẫn dắt: (1) Độc quyền “đổi áo” thế nào? (2) Việt Nam đứng ở đâu trong chuỗi giá trị? (3) CNTB đóng vai trò gì trong lịch sử — và sinh viên cần làm gì?',
  ),
}

// ─── 3. Lênin 1916 → hôm nay ────────────────────────────────────────
const FEATURES = [
  { then: 'Tích tụ, tập trung tư bản → tổ chức độc quyền', now: 'Tập đoàn xuyên quốc gia + “hệ thống gia công”' },
  { then: 'Tư bản tài chính, “chế độ tham dự”', now: '“Chế độ ủy nhiệm”, quỹ đầu tư khổng lồ' },
  { then: 'Xuất khẩu tư bản', now: 'FDI đa chiều, nhiều chủ thể, nhiều hình thức' },
  { then: 'Phân chia thị trường thế giới', now: 'Chuỗi giá trị toàn cầu' },
  { then: 'Phân chia lãnh thổ ảnh hưởng', now: '“Biên giới mềm”, biên giới kinh tế' },
]

export const lenin: Slide = {
  id: 'lenin',
  title: 'Từ Lênin đến hôm nay',
  seconds: 75,
  bg: photo('factory-1910', { dim: 0.82 }),
  html: () => `
    <div class="lenin__head">
      <div>
        <p class="k"><b>03</b>5 đặc điểm của CNTB độc quyền</p>
        <h2 class="h h--m" data-in>Độc quyền không biến mất —<br /><em>chỉ “đổi áo”</em></h2>
      </div>
      <p class="lenin__year" aria-live="off"><span data-year>1916</span></p>
    </div>
    <div class="flips">
      ${FEATURES.map(
        (f, i) => `
        <button type="button" class="flip" data-flip>
          <span class="flip__in">
            <span class="flip__face flip__face--then"><i>${i + 1}</i><span>${f.then}</span><small>Lênin, 1916</small></span>
            <span class="flip__face flip__face--now"><i>${i + 1}</i><span>${f.now}</span><small>Ngày nay</small></span>
          </span>
        </button>`,
      ).join('')}
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục II–III.1; ${refs('lenin-t27')}`)}`,
  enter(el) {
    const year = el.querySelector('[data-year]') as HTMLElement
    const cards = el.querySelectorAll<HTMLElement>('[data-flip]')
    year.textContent = '1916'
    cards.forEach((c) => c.classList.remove('is-now'))
    gsap.killTweensOf(cards)
    const t = gsap.delayedCall(reduceMotion ? 0 : 1.6, () => {
      scramble(year, '2026', 1.1)
      cards.forEach((c, i) => gsap.delayedCall(i * 0.18, () => c.classList.add('is-now')))
    })
    ;(el as HTMLElement & { _t?: gsap.core.Tween })._t = t
  },
  leave(el) {
    ;(el as HTMLElement & { _t?: gsap.core.Tween })._t?.kill()
  },
  mount(el) {
    el.addEventListener('click', (e) => (e.target as HTMLElement).closest('[data-flip]')?.classList.toggle('is-now'))
  },
  notes: notes(
    'Giáo trình (Ch.4 mục II) tóm tắt 5 đặc điểm kinh tế của CNTB độc quyền theo Lênin: tích tụ, tập trung tư bản tạo ra tổ chức độc quyền; tư bản tài chính và tài phiệt chi phối; xuất khẩu tư bản; phân chia thị trường thế giới; phân định khu vực lãnh thổ ảnh hưởng.',
    'Thẻ lật sang “ngày nay” (Ch.4 mục III.1): cả 5 đặc điểm vẫn còn, nhưng mang hình thức mới. Luận điểm của nhóm: <b>độc quyền không biến mất mà “đổi áo”</b>.',
    '• Thẻ 1 — điểm then chốt cho cả bài: giáo trình gọi <b>“hệ thống gia công”</b> là biểu hiện của độc quyền dưới dạng mới.',
    '• Thẻ 2 — “chế độ tham dự” được bổ sung bằng “chế độ ủy nhiệm” (cổ đông nhỏ ủy nhiệm cho đại cổ đông).',
    '• Thẻ 3 — xuất khẩu tư bản đổi chiều, đổi chủ thể. • Thẻ 4 — chuỗi giá trị toàn cầu (nhóm vận dụng). • Thẻ 5 — “biên giới mềm”.',
    'Bấm vào một thẻ để lật lại. Chuyển ý: “Vì sao nói là ‘đổi áo’ chứ không phải ‘đổi người’? Triết học giúp ta trả lời.”',
  ),
}

// ─── 4. Lăng kính triết học ─────────────────────────────────────────
const FORMS = ['Cartel', 'Trust', 'Concern', 'TNC', 'Chuỗi giá trị']
const NODES: Array<[number, number, string]> = [
  [70, 70, 'Thiết kế'],
  [230, 40, 'Chip'],
  [110, 200, 'Màn hình'],
  [300, 150, 'Pin'],
  [80, 320, 'Lắp ráp · VN'],
  [260, 290, 'Logistics'],
  [400, 330, 'Bán lẻ'],
]

export const phil: Slide = {
  id: 'triet-hoc',
  title: 'Lăng kính triết học',
  seconds: 40,
  html: () => `
    <p class="k"><b>04</b>Nhìn từ triết học Mác – Lênin</p>
    <h2 class="h h--m" data-in>Đổi hình thức — <em class="r">chưa đổi chất</em></h2>
    <div class="phil">
      <figure class="phil__panel" data-in>
        <figcaption><b>Lượng – chất</b>Bước nhảy đã xảy ra; hôm nay là thay đổi trong cùng một “độ”.</figcaption>
        <svg viewBox="0 0 800 380" aria-hidden="true">
          ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${50 + i * 42}" cy="${282 - i * 3}" r="${4 + i * 1.8}" class="phil__dot" />`).join('')}
          <path data-draw class="phil__line" d="M20 300 H300 V130 H790" />
          <circle cx="300" cy="300" r="9" class="phil__node" />
          <text x="20" y="340" class="phil__t phil__t--dim">cạnh tranh tự do · tích lũy về lượng</text>
          <text x="318" y="306" class="phil__t">điểm nút</text>
          <text x="318" y="214" class="phil__t phil__t--red">bước nhảy → độc quyền</text>
          <text x="318" y="240" class="phil__t phil__t--dim">cuối TK XIX – đầu TK XX</text>
          ${FORMS.map((f, i) => `<g class="phil__form"><circle cx="${360 + i * 98}" cy="130" r="7" /><text x="${360 + i * 98}" y="${i % 2 ? 100 : 72}" text-anchor="middle">${f}</text></g>`).join('')}
          <text x="560" y="178" text-anchor="middle" class="phil__t phil__t--gold">cùng một chất: CNTB độc quyền</text>
        </svg>
      </figure>
      <figure class="phil__panel" data-in>
        <figcaption><b>LLSX – QHSX</b>Sản xuất xã hội hóa toàn cầu ↔ sở hữu, phân phối tập trung.</figcaption>
        <svg viewBox="0 0 800 380" aria-hidden="true">
          ${NODES.map(([x, y], i) => NODES.slice(i + 1, i + 3).map(([x2, y2]) => `<path class="phil__mesh" d="M${x} ${y} L${x2} ${y2}" />`).join('')).join('')}
          ${NODES.map(([x, y]) => `<path data-draw class="phil__flow" d="M${x} ${y} Q ${(x + 660) / 2} ${y < 180 ? y - 40 : y + 40} 660 180" />`).join('')}
          ${NODES.map(([x, y, t]) => `<g class="phil__pnode"><circle cx="${x}" cy="${y}" r="8" /><text x="${x}" y="${y - 16}" text-anchor="middle">${t}</text></g>`).join('')}
          <circle cx="660" cy="180" r="62" class="phil__own" />
          <text x="660" y="188" text-anchor="middle" class="phil__t phil__t--own">Sở hữu</text>
          <text x="660" y="272" text-anchor="middle" class="phil__t phil__t--own2">công nghệ · thương hiệu</text>
        </svg>
      </figure>
    </div>
    ${source(`${PHIL.qty.cite}; ${PHIL.prod.cite}`)}`,
  notes: PHIL.notes,
}

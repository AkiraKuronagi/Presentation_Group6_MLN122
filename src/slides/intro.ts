import gsap from 'gsap'
import { meta } from '../content/meta'
import { photo } from '../content/images'
import { PHIL } from '../content/theory'
import { reduceMotion, type GLLabel, type Slide } from '../core/deck'
import { scramble } from '../core/fx'
import { notes, refs, source } from './util'

/** nhãn nằm bên trái đảo để không đè lên đồng bằng sông Cửu Long */
export const PHU_QUOC: GLLabel = { at: '10.22,103.97', html: 'Đ. Phú Quốc <i>(Việt Nam)</i>', align: 'right' }

/** Đảo, thành phố luôn ghi khi quả địa cầu quay tới Việt Nam */
export const VN_PLACES: GLLabel[] = [
  { at: '16.5,112', html: 'Q.đ. Hoàng Sa <i>(Việt Nam)</i>' },
  { at: '10,114.2', html: 'Q.đ. Trường Sa <i>(Việt Nam)</i>' },
  PHU_QUOC,
]

// ─── 1. Bìa ──────────────────────────────────────────────────────────
export const cover: Slide = {
  id: 'bia',
  title: 'Bìa',
  seconds: 35,
  gl: { scene: 'globe', mode: 'cover', x: 1530, y: 560, p: 1, speed: 0.35 },
  labels: VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  html: () => `
    <div class="cover">
      <p class="k">${meta.school} · ${meta.courseCode} – ${meta.courseName}</p>
      <h1 class="h h--xl cover__title" data-in>Ai nắm giữ<br /><em>chuỗi giá trị?</em></h1>
      <p class="lead cover__sub" data-in>${meta.topicNo}: Biểu hiện mới của độc quyền, độc quyền nhà nước trong điều kiện ngày nay — các tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của chủ nghĩa tư bản.</p>
      <div class="cover__meta" data-in>
        <div><span>Nhóm thực hiện</span><b>${meta.group}</b></div>
        <div><span>Lớp · Giảng viên</span><b>${meta.className} · ${meta.lecturer}</b></div>
        <div><span>Nhóm phản biện</span><b>${meta.critics.join(', ')}</b></div>
      </div>
      <ul class="cover__team" data-in>${meta.members.map((m) => `<li>${m.name}</li>`).join('')}</ul>
    </div>`,
  notes: notes(
    'Chào thầy và các bạn. Nhóm 6 xin trình bày Chủ đề 6: biểu hiện mới của độc quyền và độc quyền nhà nước ngày nay, qua các tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của chủ nghĩa tư bản.',
    'Cả bài xoay quanh một câu hỏi: ai đang nắm chuỗi giá trị toàn cầu, và Việt Nam đang ở đâu trong chuỗi đó. Trên quả địa cầu, đường màu vàng là tiền đầu tư nước ngoài vào Việt Nam, đường màu đỏ là hàng Việt Nam bán ra nước ngoài.',
  ),
}

// ─── 2. Lênin 1916 → hôm nay ────────────────────────────────────────
const FEATURES = [
  { then: 'Tích tụ, tập trung tư bản → tổ chức độc quyền', thenD: 'tư bản gom lại ngày càng lớn', now: 'Concern, conglomerate, TNC + “hệ thống gia công”', nowD: 'tổ chức độc quyền kiểu mới; quanh tập đoàn là nhiều công ty nhận gia công' },
  { then: 'Tư bản tài chính, “chế độ tham dự”', thenD: 'một nhóm nhỏ tài phiệt chi phối nền kinh tế', now: '“Chế độ ủy nhiệm”, quỹ đầu tư khổng lồ', nowD: 'cổ đông nhỏ giao quyền cho cổ đông lớn, quỹ quyết định thay' },
  { then: 'Xuất khẩu tư bản', thenD: 'nước giàu đem vốn ra nước ngoài đầu tư', now: 'Xuất khẩu tư bản đổi chiều, đổi chủ thể, đổi hình thức', nowD: 'chủ yếu do tập đoàn xuyên quốc gia thực hiện' },
  { then: 'Phân chia thị trường thế giới', thenD: 'các tập đoàn lớn chia nhau thị trường', now: 'Toàn cầu hóa song hành khu vực hóa (EU, FTA)', nowD: 'thị trường được “chia” qua chuỗi giá trị' },
  { then: 'Phân chia lãnh thổ ảnh hưởng', thenD: 'cường quốc chia nhau vùng ảnh hưởng', now: '“Biên giới mềm”, biên giới kinh tế', nowD: 'thuế quan, công nghệ, quy tắc xuất xứ thay cho chiếm đất' },
]

export const lenin: Slide = {
  id: 'lenin',
  title: 'Từ Lênin đến hôm nay',
  seconds: 80,
  bg: photo('factory-1910', { dim: 0.82 }),
  html: () => `
    <div class="lenin__head">
      <div>
        <p class="k"><b>02</b>5 đặc điểm của CNTB độc quyền</p>
        <h2 class="h h--m" data-in>Độc quyền không biến mất —<br /><em>chỉ “đổi áo”</em></h2>
      </div>
      <p class="lenin__year" aria-live="off"><span data-year>1916</span></p>
    </div>
    <div class="flips">
      ${FEATURES.map(
        (f, i) => `
        <button type="button" class="flip" data-flip>
          <span class="flip__in">
            <span class="flip__face flip__face--then"><i>${i + 1}</i><span>${f.then}</span><em>${f.thenD}</em><small>Lênin, 1916</small></span>
            <span class="flip__face flip__face--now"><i>${i + 1}</i><span>${f.now}</span><em>${f.nowD}</em><small>Ngày nay</small></span>
          </span>
        </button>`,
      ).join('')}
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục II; mục III.1 (tr.134–136); ${refs('lenin-t27')}`)}`,
  enter(el) {
    // luôn mở ở 1916; người trình bày nhấn ↓ (hoặc bấm vào slide) mới lật sang “ngày nay”
    const year = el.querySelector('[data-year]') as HTMLElement
    year.textContent = '1916'
    el.querySelectorAll<HTMLElement>('[data-flip]').forEach((c) => c.classList.remove('is-now'))
    el.dataset.flipped = ''
  },
  leave(el) {
    ;(el as HTMLElement & { _t?: gsap.core.Tween[] })._t?.forEach((t) => t.kill())
  },
  step(el) {
    if (el.dataset.flipped) return false
    el.dataset.flipped = '1'
    const year = el.querySelector('[data-year]') as HTMLElement
    scramble(year, '2026', reduceMotion ? 0 : 1.1)
    ;(el as HTMLElement & { _t?: gsap.core.Tween[] })._t = [...el.querySelectorAll<HTMLElement>('[data-flip]')].map((c, i) =>
      gsap.delayedCall(reduceMotion ? 0 : i * 0.18, () => c.classList.add('is-now')),
    )
    return true
  },
  mount(el, deck) {
    el.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('[data-flip]')
      if (!el.dataset.flipped) lenin.step!(el, deck)
      else card?.classList.toggle('is-now')
    })
  },
  notes: notes(
    'Giáo trình Kinh tế chính trị, chương 4, có nêu năm đặc điểm của chủ nghĩa tư bản độc quyền theo Lênin. Một, tư bản gom lại ngày càng lớn, sinh ra các tổ chức độc quyền. Hai, tiền ngân hàng và tiền công nghiệp nhập lại, gọi là tư bản tài chính, và một nhóm nhỏ tài phiệt chi phối nền kinh tế. Ba, nước giàu đem vốn ra nước ngoài đầu tư, gọi là xuất khẩu tư bản. Bốn, các tập đoàn lớn chia nhau thị trường thế giới. Năm, các cường quốc chia nhau vùng ảnh hưởng.',
    '(Nhấn ↓ để lật thẻ.) Hơn một trăm năm sau, năm đặc điểm này vẫn còn, nhưng cách làm đã khác. Thẻ một: ngoài các kiểu độc quyền cũ, giờ có concern, conglomerate và tập đoàn xuyên quốc gia; quanh mỗi tập đoàn có nhiều công ty nhỏ nhận gia công cho nó. Giáo trình gọi đây là “hệ thống gia công”, và nói đó vẫn là độc quyền, chỉ ở dạng mới. Bốn thẻ còn lại là chế độ ủy nhiệm, xuất khẩu tư bản đổi chiều, toàn cầu hóa đi cùng khu vực hóa, và “biên giới mềm”. Các slide sau nhóm sẽ nói từng cái.',
    'Tóm lại: độc quyền không mất đi, nó chỉ “đổi áo”.',
    'Cách bấm: slide mở ở năm 1916. Nói xong 5 đặc điểm thì nhấn ↓ để lật cả 5 thẻ sang “ngày nay”; nhấn ↓ lần nữa mới sang slide sau. Bấm vào một thẻ để lật riêng thẻ đó.',
  ),
}

// ─── 3. Lăng kính triết học ─────────────────────────────────────────
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
  seconds: 90,
  html: () => `
    <p class="k"><b>03</b>Nhìn từ triết học Mác – Lênin · quan điểm nhóm</p>
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
        <p class="phil__more">Như đun nước: nóng dần, tới 100°C mới sôi. Tư bản gom dần về lượng, tới điểm nút thì có bước nhảy — độc quyền ra đời. TNC, quỹ đầu tư, chuỗi giá trị chỉ to hơn, khác hình thức, vẫn trong cùng một “độ”. <b>Giáo trình KTCT (tr.137):</b> CNTB độc quyền nhà nước là “biểu hiện mới của độc quyền”, “hình thức vận động mới” của QHSX TBCN — đổi hình thức, chưa đổi chất.</p>
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
        <p class="phil__more">Thiết kế ở nước này, linh kiện ở nước kia, lắp ráp ở Việt Nam — nhưng công nghệ, thương hiệu chỉ thuộc về vài công ty. Ai làm chủ thì người đó chia phần: mâu thuẫn cơ bản của CNTB, nay trên quy mô toàn cầu.</p>
      </figure>
    </div>
    ${source(`${PHIL.qty.cite}; ${PHIL.prod.cite}`)}`,
  notes: PHIL.notes,
}

import { photo } from '../content/images'
import type { Slide } from '../core/deck'
import { VN_PLACES } from './intro'
import { notes, refs, source } from './util'

// ─── 13. "Biên giới mềm" ────────────────────────────────────────────
const TIMELINE = [
  { d: '10/2022', t: 'Mỹ siết xuất khẩu chip tiên tiến', src: 'bis-2022' },
  { d: '4/2025', t: 'Thuế “đối ứng” <b>46%</b> với hàng Việt Nam', src: 'vgp-tariff46' },
  { d: '7/2025', t: 'Giảm còn <b>20%</b>', src: 'wh-2025' },
  { d: '2/2026', t: 'Mức chung <b>10%</b> theo Mục 122', src: 'vgp-ieepa' },
  { d: '7/2026', t: '<b>12,5%</b> theo Mục 301 · điện tử được miễn', src: 'nd-301' },
]

export const softBorder: Slide = {
  id: 'bien-gioi-mem',
  title: 'Biên giới mềm',
  seconds: 40,
  gl: { scene: 'globe', mode: 'tariff', x: 1380, y: 560, p: 1, speed: 0.45 },
  labels: [
    { at: '37.77,-122.42', html: '<b>Hoa Kỳ</b>', cls: 'hub' },
    ...VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  ],
  html: () => `
    <div class="col">
      <p class="k"><b>13</b>Biểu hiện mới 5</p>
      <h2 class="h h--m" data-in>“Biên giới mềm”</h2>
      <p class="lead" data-in>Thuộc địa kiểu cũ sụp đổ — thay bằng <b>luật chơi</b>: thuế quan, kiểm soát công nghệ, quy tắc xuất xứ.</p>
      <ol class="tl" data-in>
        ${TIMELINE.map((e) => `<li><span>${e.d}</span><p>${e.t}</p></li>`).join('')}
      </ol>
      <div class="chip chip--red" data-in><b>Việt Nam</b> vừa hợp tác, vừa đấu tranh · 7 phiên đàm phán</div>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.1; ${refs(...TIMELINE.map((e) => e.src), 'vgp-dam-phan', 'nq59')}`)}`,
  notes: notes(
    'Giáo trình: thực dân cũ sụp đổ, nhưng cường quốc tư bản dùng “chiến lược biên giới mềm”, bành trướng “biên giới kinh tế”.',
    'Dòng thời gian từ nguồn chính thức: friend-shoring (4/2022), kiểm soát chip (10/2022), thuế đối ứng 46% (4/2025) → 20% (Sắc lệnh 31/7/2025) → Tuyên bố chung khuôn khổ Hiệp định (26/10/2025) → ngừng thu, áp 10% theo Mục 122 (24/02/2026) → 12,5% theo Mục 301 (24/7/2026, điện tử được miễn) → 7 phiên đàm phán (10/2026).',
    'Việt Nam ứng xử theo NQ 59: vừa hợp tác vừa đấu tranh; Đại hội XIII: tránh lệ thuộc vào một thị trường, một đối tác.',
    'Giữ giọng trung lập, trình bày sự kiện và nguồn; không bình luận cảm tính về quốc gia nào.',
  ),
}

// ─── 14. Độc quyền nhà nước kiểu mới ────────────────────────────────
export const stateMono: Slide = {
  id: 'doc-quyen-nha-nuoc',
  title: 'Độc quyền nhà nước',
  seconds: 50,
  bg: photo('wafer', { dim: 0.84 }),
  html: () => `
    <div class="sm">
      <div>
        <p class="k"><b>14</b>Độc quyền nhà nước trong CNTB ngày nay</p>
        <h2 class="h h--m" data-in>Nhà nước <em>+</em> tập đoàn</h2>
        <svg class="venn" viewBox="0 0 640 360" data-in aria-hidden="true">
          <circle class="venn__a" cx="240" cy="180" r="150" />
          <circle class="venn__b" cx="400" cy="180" r="150" />
          <text x="170" y="186" text-anchor="middle">Tổ chức</text><text x="170" y="214" text-anchor="middle">độc quyền</text>
          <text x="470" y="186" text-anchor="middle">Nhà nước</text><text x="470" y="214" text-anchor="middle">tư sản</text>
          <text x="320" y="196" text-anchor="middle" class="venn__mid">ĐQNN</text>
        </svg>
        <p class="sm__3" data-in>nhân sự · sở hữu nhà nước · công cụ điều tiết</p>
      </div>
      <div class="sm__cards">
        <div class="stat" data-in><div class="stat__v">52,7<small>tỷ USD</small></div><div class="stat__l">Đạo luật CHIPS (Mỹ) hỗ trợ ngành bán dẫn</div></div>
        <div class="stat" data-in><div class="stat__v">10<small>%</small></div><div class="stat__l">cổ phần Chính phủ Mỹ nắm tại Intel</div></div>
        <div class="stat" data-in><div class="stat__v">&gt; 43<small>tỷ EUR</small></div><div class="stat__l">Đạo luật Chip châu Âu — vốn công và tư</div></div>
        <div class="stat stat--red" data-in><div class="stat__v">15<small>%</small></div><div class="stat__l">thuế tối thiểu toàn cầu — Việt Nam áp dụng từ 2024 (NQ 107/2023/QH15)</div></div>
      </div>
    </div>
    <p class="distinct" data-in><b>Phân biệt:</b> kinh tế nhà nước Việt Nam giữ vai trò chủ đạo trong kinh tế thị trường định hướng XHCN (Hiến pháp 2013, Điều 51) — khác bản chất với độc quyền nhà nước tư bản.</p>
    ${source(`${refs('gt-ktct')}, Ch.4 mục II.2, III.2; ${refs('chips-act', 'wir2026', 'eu-chips', 'oecd-pillar2', 'nq107', 'nd236', 'hp-2013')}`)}`,
  notes: notes(
    'Bản chất (Ch.4 mục II.2): kết hợp sức mạnh của tổ chức độc quyền tư nhân với sức mạnh nhà nước tư sản, phục vụ tư bản độc quyền. Ba biểu hiện mới: quan hệ nhân sự (cơ chế thỏa hiệp), sở hữu nhà nước, công cụ điều tiết.',
    'Bằng chứng ở các nền kinh tế TBCN phát triển: Mỹ nắm 10% Intel (UNCTAD 2026); gói cứu AIG, Citigroup (giáo trình); CHIPS Act 52,7 tỷ USD; EU Chips Act >43 tỷ EUR công và tư; 229 biện pháp chính sách đầu tư năm 2025.',
    'Việt Nam chủ động: Nghị quyết 107/2023/QH15 áp thuế TNDN bổ sung theo quy định chống xói mòn cơ sở thuế toàn cầu, hiệu lực 1/1/2024; Nghị định 236/2025/NĐ-CP hướng dẫn — cạnh tranh bằng hạ tầng, nhân lực, thể chế thay vì “chạy đua xuống đáy” bằng ưu đãi thuế.',
    'Phân biệt rõ: kinh tế nhà nước ở Việt Nam giữ vai trò chủ đạo (Hiến pháp Điều 51) — khác bản chất với độc quyền nhà nước TBCN. Không đồng nhất DNNN Việt Nam với ĐQNN.',
  ),
}

import { photo } from '../content/images'
import type { Slide } from '../core/deck'
import { VN_PLACES } from './intro'
import { notes, refs, source } from './util'

// ─── 12. "Biên giới mềm" ────────────────────────────────────────────
const TIMELINE = [
  { d: '10/2022', t: 'Mỹ siết xuất khẩu chip tiên tiến', src: 'bis-2022' },
  { d: '4/2025', t: 'Mỹ công bố thuế “đối ứng” <b>46%</b> với hàng Việt Nam', src: 'vgp-tariff46' },
  { d: '7/2025', t: 'Giảm còn <b>20%</b>', src: 'wh-2025' },
  { d: '2/2026', t: 'Ngừng thu thuế đối ứng · mức chung <b>10%</b> (Mục 122, 150 ngày)', src: 'moit-2026' },
  { d: '24/7/2026', t: 'Thuế bổ sung <b>12,5%</b> theo Mục 301 · miễn: thiết bị điện tử, công nghệ cao, AI, bán dẫn (dệt may không được miễn)', src: 'nd-301' },
]

export const softBorder: Slide = {
  id: 'bien-gioi-mem',
  title: 'Biên giới mềm',
  seconds: 65,
  gl: { scene: 'globe', mode: 'tariff', x: 1380, y: 560, p: 1, speed: 0.45 },
  labels: [
    { at: '37.77,-122.42', html: '<b>Hoa Kỳ</b>', cls: 'hub' },
    ...VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  ],
  html: () => `
    <div class="col">
      <p class="k"><b>12</b>Biểu hiện mới 5 · Lãnh thổ ảnh hưởng</p>
      <h2 class="h h--m" data-in>“Biên giới mềm”</h2>
      <p class="lead" data-in>Thuộc địa kiểu cũ sụp đổ — không cần đem quân chiếm đất, thay bằng <b>luật chơi</b>: thuế quan, kiểm soát công nghệ, quy tắc xuất xứ.</p>
      <ol class="tl" data-in>
        ${TIMELINE.map((e) => `<li><span>${e.d}</span><p>${e.t}</p></li>`).join('')}
      </ol>
      <div class="chip chip--red" data-in><b>Việt Nam</b> vừa hợp tác, vừa đấu tranh · 7 phiên đàm phán chính thức</div>
      <p class="more" data-in>7 phiên tính từ 4/2025 đến 10/2026 (Bộ Công Thương, họp báo 7/10/2026). Đồng thời tìm thêm thị trường, đối tác khác để không phụ thuộc vào một nơi.</p>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.1; ${refs(...TIMELINE.map((e) => e.src), 'treasury-2022', 'vgp-tariff20', 'vgp-ieepa', 'vgp-dam-phan', 'nq59')}`)}`,
  notes: notes(
    'Thời thuộc địa kiểu cũ đã qua. Nhưng giáo trình nói các nước tư bản lớn chuyển sang “biên giới mềm”, tức là mở rộng ảnh hưởng bằng thuế, bằng việc giữ chặt công nghệ và bằng quy định về nguồn gốc hàng hóa, chứ không cần đem quân đi chiếm đất.',
    'Các mốc trên màn hình cho thấy rất rõ: Mỹ siết bán chip đời mới từ tháng 10 năm 2022; tháng 4 năm 2025 công bố thuế đối ứng 46% với hàng Việt Nam, tháng 7 giảm còn 20%; tháng 2 năm 2026 chuyển sang mức chung 10% trong 150 ngày, theo Mục 122 của luật thương mại Mỹ. Từ ngày 24 tháng 7 năm 2026, Mỹ đánh thêm 12,5% theo Mục 301; thiết bị điện tử, sản phẩm công nghệ cao, AI và chip được miễn, còn dệt may, cao su, gỗ thì không.',
    'Trước những thay đổi đó, Việt Nam vừa hợp tác vừa đấu tranh. Theo Bộ Công Thương, từ tháng 4 năm 2025 đến tháng 10 năm 2026, hai nước đã qua bảy phiên đàm phán chính thức. Việt Nam cũng tìm thêm thị trường và đối tác khác để không phụ thuộc vào một nơi.',
    'Nếu bị hỏi về mức 15%: Báo Chính phủ ngày 23/2/2026 có đưa tin ông Trump tuyên bố 15%, nhưng theo Bộ Công Thương mức áp dụng là 10% theo Mục 122. Giữ giọng trung lập, chỉ nói sự kiện và nguồn.',
  ),
}

// ─── 13. Độc quyền nhà nước kiểu mới ────────────────────────────────
export const stateMono: Slide = {
  id: 'doc-quyen-nha-nuoc',
  title: 'Độc quyền nhà nước',
  seconds: 75,
  bg: photo('wafer', { dim: 0.84 }),
  html: () => `
    <div class="sm">
      <div>
        <p class="k"><b>13</b>Độc quyền nhà nước trong CNTB ngày nay</p>
        <h2 class="h h--m" data-in>Nhà nước <em>+</em> tập đoàn</h2>
        <p class="more" data-in style="max-width:640px">Tổ chức độc quyền tư nhân bắt tay với nhà nước tư sản, phục vụ tư bản độc quyền.</p>
        <svg class="venn" viewBox="0 0 640 360" data-in aria-hidden="true">
          <circle class="venn__a" cx="240" cy="180" r="150" />
          <circle class="venn__b" cx="400" cy="180" r="150" />
          <text x="170" y="186" text-anchor="middle">Tổ chức</text><text x="170" y="214" text-anchor="middle">độc quyền</text>
          <text x="470" y="186" text-anchor="middle">Nhà nước</text><text x="470" y="214" text-anchor="middle">tư sản</text>
          <text x="320" y="196" text-anchor="middle" class="venn__mid">ĐQNN</text>
        </svg>
        <p class="sm__3" data-in>Ba đường bắt tay: nhân sự qua lại · nhà nước nắm cổ phần · chính sách điều tiết</p>
      </div>
      <div class="sm__cards">
        <div class="stat" data-in><div class="stat__v">52,7<small>tỷ USD</small></div><div class="stat__l">Đạo luật CHIPS (Mỹ) hỗ trợ ngành bán dẫn</div></div>
        <div class="stat" data-in><div class="stat__v">10<small>%</small></div><div class="stat__l">cổ phần Chính phủ Mỹ nắm tại Intel</div></div>
        <div class="stat" data-in><div class="stat__v">&gt; 43<small>tỷ EUR</small></div><div class="stat__l">Đạo luật Chip châu Âu — vốn công và tư</div></div>
        <div class="stat" data-in><div class="stat__v">AIG · Citi</div><div class="stat__l">nhà nước cứu tập đoàn 2008–2009 (giáo trình)</div></div>
      </div>
    </div>
    <p class="distinct" data-in style="bottom:104px"><b>Phân biệt:</b> kinh tế nhà nước VN giữ vai trò chủ đạo (Hiến pháp 2013, Điều 51) — khác bản chất với ĐQNN tư bản. <b>VN chủ động:</b> thuế tối thiểu toàn cầu 15% từ 2024 (NQ 107/2023/QH15); thu hút đầu tư bằng hạ tầng, con người, thủ tục — không đua nhau giảm thuế.</p>
    ${source(`${refs('gt-ktct')}, Ch.4 mục II.2, III.2; ${refs('chips-act', 'wir2026', 'eu-chips', 'oecd-pillar2', 'nq107', 'nd236', 'hp-2013')}`)}`,
  notes: notes(
    'Độc quyền nhà nước trong chủ nghĩa tư bản là khi các tập đoàn độc quyền tư nhân bắt tay với nhà nước tư sản. Bây giờ cái bắt tay đó thể hiện qua ba đường: người qua lại giữa chính phủ và tập đoàn, nhà nước nắm cổ phần, và nhà nước dùng chính sách để can thiệp.',
    'Ngành chip là ví dụ rõ nhất. Đạo luật CHIPS của Mỹ dành 52,7 tỷ USD hỗ trợ ngành bán dẫn. Chính phủ Mỹ nắm 10% cổ phần Intel. Đạo luật Chip của châu Âu huy động hơn 43 tỷ euro, cả vốn nhà nước lẫn vốn tư nhân. Trước đó, trong khủng hoảng 2008–2009, nhà nước Mỹ đã bỏ tiền cứu các tập đoàn như AIG và Citigroup.',
    'Cần nói rõ: kinh tế nhà nước ở Việt Nam giữ vai trò chủ đạo trong nền kinh tế thị trường định hướng xã hội chủ nghĩa, theo Điều 51 Hiến pháp 2013. Cái này khác hẳn về bản chất với độc quyền nhà nước tư bản. Việt Nam cũng chủ động thích nghi: từ năm 2024 áp dụng thuế tối thiểu toàn cầu 15%, tức là tập đoàn lớn đặt ở đâu cũng phải chịu thuế ít nhất 15%, theo Nghị quyết 107 của Quốc hội; và thu hút đầu tư bằng hạ tầng, con người, thủ tục, chứ không đua nhau giảm thuế.',
    'Nếu bị hỏi: không đánh đồng doanh nghiệp nhà nước Việt Nam với độc quyền nhà nước tư bản.',
  ),
}

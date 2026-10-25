import { cite } from '../content/sources'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

const TIMELINE = [
  { d: '13/4/2022', t: 'Mỹ đề xuất “friend-shoring”: dời chuỗi cung ứng sang các nước “tin cậy”', src: ['treasury-2022'] },
  { d: '07/10/2022', t: 'Mỹ siết kiểm soát xuất khẩu chip tiên tiến và thiết bị sản xuất bán dẫn sang Trung Quốc', src: ['bis-2022'] },
  { d: '02/4/2025', t: 'Mỹ công bố thuế “đối ứng” 46% với hàng Việt Nam; Bộ Công Thương đề nghị hoãn để đàm phán', src: ['vgp-tariff46'] },
  { d: '31/7/2025', t: 'Sắc lệnh điều chỉnh: mức thuế đối ứng áp cho hàng Việt Nam giảm từ 46% xuống 20%', src: ['wh-2025'] },
  { d: '26/10/2025', t: 'Việt Nam – Hoa Kỳ công bố Tuyên bố chung về khuôn khổ Hiệp định thương mại đối ứng', src: ['vgp-tariff20'] },
  { d: '24/02/2026', t: 'Ngừng thu thuế đối ứng sau phán quyết của Tòa án Tối cao Mỹ; áp mức chung 10% theo Mục 122 Đạo luật Thương mại 1974 trong 150 ngày', src: ['vgp-ieepa', 'moit-2026'] },
  { d: '24/7/2026', t: 'Thuế bổ sung theo Mục 301: Việt Nam chịu 12,5%; điện tử, bán dẫn, AI được miễn', src: ['nd-301'] },
  { d: '07/10/2026', t: 'Việt Nam chủ động đối thoại: đã qua 7 phiên đàm phán, cơ bản hoàn tất nội dung Hiệp định — “vừa hợp tác, vừa đấu tranh”', src: ['vgp-dam-phan'] },
]

export const power: Section = {
  id: 'quyen-luc',
  chapter: { n: 6, title: 'Biên giới mềm & độc quyền nhà nước', short: 'Nhà nước' },
  html: () => `
  <section class="sec sec--pad" id="quyen-luc" aria-label="Biểu hiện mới 5 và độc quyền nhà nước">
    <div class="wrap">
      <article class="exp" style="border-top:0;padding-top:0">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">06</span><span class="eyebrow">Biểu hiện mới · 5</span></div>
          <div class="exp__num">05</div>
          <h3 class="display t-h2 exp__title">Phân chia lãnh thổ ảnh hưởng — bằng <em class="c-gold">“biên giới mềm”</em></h3>
          <p class="exp__then"><b>Lênin:</b> thuộc địa, khu vực ảnh hưởng, chiến tranh chia lại thế giới.<br/><b>Nay:</b> “chiến lược biên giới mềm”, bành trướng “biên giới kinh tế”, ràng buộc từ vốn, công nghệ đến chính trị. ${cite('gt-ktct')}</p>
        </div>
        <div class="exp__body">
          <ol class="timeline" data-stagger>
            ${TIMELINE.map((e) => `<li><span class="mono timeline__d">${e.d}</span><p>${e.t} ${cite(...e.src)}</p></li>`).join('')}
          </ol>
          <p class="t-small c-dim" style="margin:0">UNCTAD (2026): các công ty đang <b>thiết kế lại chuỗi cung ứng theo tuyến địa chính trị</b>; với Việt Nam, mức tăng thuế tuy vừa phải nhưng rơi vào ngành điện tử — ngành chiếm tỷ trọng lớn trong vốn FDI — vì sản xuất phụ thuộc thị trường bên ngoài ${cite('wir2026')}. Bài học (Đại hội XIII): đa dạng hóa, tránh lệ thuộc vào một thị trường ${cite('dh13')}.</p>
        </div>
      </article>

      <div class="lede" style="margin-top:clamp(50px,9vh,110px)">
        <div>
          <p class="eyebrow">Biểu hiện mới của độc quyền nhà nước · Ch.4 mục III.2</p>
          <h2 class="display t-h2" data-split>Khi nhà nước tư sản <em class="c-red">vào cuộc</em> cùng tập đoàn</h2>
        </div>
        <p class="t-lead" data-reveal>Độc quyền nhà nước trong CNTB là sự kết hợp sức mạnh của các tổ chức độc quyền tư nhân với sức mạnh của nhà nước tư sản, phục vụ lợi ích của tư bản độc quyền (diễn đạt lại theo Ch.4 mục II.2). Ba biểu hiện mới:</p>
      </div>
      <div class="state__grid" data-stagger>
        <div class="card state__col">
          <span class="pill">Quan hệ nhân sự</span>
          <h3 class="display t-h3">Cơ chế thỏa hiệp giữa các thế lực độc quyền</h3>
          <p>Quyền lực được phân chia, thỏa hiệp giữa các nhóm tư bản lớn, không nhóm nào độc tôn; bộ máy điều tiết có đại diện của tập đoàn lớn. ${cite('gt-ktct')}</p>
        </div>
        <div class="card state__col">
          <span class="pill pill--gold">Sở hữu nhà nước</span>
          <h3 class="display t-h3">Nhà nước nắm cổ phần, cứu tập đoàn</h3>
          <p>Cổ phần nhà nước trong ngân hàng, công ty lớn trở nên phổ biến ${cite('gt-ktct')}; ví dụ gần đây: Chính phủ Mỹ mua <b>10%</b> cổ phần Intel ${cite('wir2026')}.</p>
          <p>Giáo trình dẫn các gói cứu AIG (2008), Citigroup (2009) — nhà nước gánh rủi ro cho tập đoàn. ${cite('gt-ktct')}</p>
        </div>
        <div class="card state__col">
          <span class="pill pill--red">Công cụ điều tiết</span>
          <h3 class="display t-h3">Trợ cấp, luật chơi, thuế xuyên biên giới</h3>
          <p>Đạo luật CHIPS (Mỹ, 2022): <b>52,7 tỷ USD</b> cho bán dẫn ${cite('chips-act')}; Đạo luật Chip châu Âu: huy động hơn <b>43 tỷ EUR</b> đầu tư công và tư ${cite('eu-chips')}. Năm 2025 có kỷ lục <b>229</b> biện pháp chính sách đầu tư mới ${cite('wir2026')}.</p>
        </div>
      </div>

      <div class="distinct" data-reveal>
        <p class="eyebrow">Phân biệt — tránh đồng nhất</p>
        <p style="margin:8px 0 0">Kinh tế nhà nước ở Việt Nam giữ <b>vai trò chủ đạo</b> trong nền kinh tế thị trường định hướng XHCN ${cite('hp-2013')} là công cụ để Nhà nước định hướng, điều tiết vì mục tiêu <b>dân giàu, nước mạnh, dân chủ, công bằng, văn minh</b> — khác về bản chất với độc quyền nhà nước phục vụ tư bản độc quyền trong CNTB.</p>
      </div>

      <div class="callout" data-reveal>
        <div>
          <p class="eyebrow">Nhà nước Việt Nam điều tiết trong hội nhập</p>
          <h3 class="display t-h3" style="margin:8px 0 0">Thuế tối thiểu toàn cầu 15% — chủ động tham gia luật chơi chung</h3>
        </div>
        <p>OECD/G20 thống nhất thuế suất tối thiểu 15% với tập đoàn đa quốc gia doanh thu từ 750 triệu EUR ${cite('oecd-pillar2')}. Quốc hội thông qua <b>Nghị quyết 107/2023/QH15</b> (hiệu lực 1/1/2024) ${cite('nq107')}; Chính phủ ban hành <b>Nghị định 236/2025/NĐ-CP</b> hướng dẫn ${cite('nd236')} — ví dụ về hội nhập chủ động: tham gia luật chơi chung để bảo vệ nguồn thu và lợi ích quốc gia.</p>
      </div>
    </div>
  </section>`,
  mount(el, { engine }) {
    const lede = el.querySelectorAll<HTMLElement>('.lede')[0]
    const callout = el.querySelector('.callout') as HTMLElement
    engine.addStation({
      id: 'soft-border',
      chapter: 6,
      label: 'Biểu hiện mới 5 — “biên giới mềm”',
      y: () => docTop(el),
      seconds: 35,
      notes: notes(
        'Giáo trình: thực dân cũ sụp đổ, nhưng cường quốc tư bản dùng “chiến lược biên giới mềm”, bành trướng “biên giới kinh tế”.',
        'Dòng thời gian từ nguồn chính thức: friend-shoring (4/2022), kiểm soát chip (10/2022), thuế đối ứng 46% (4/2025) → 20% (Sắc lệnh 31/7/2025) → Tuyên bố chung khuôn khổ Hiệp định (26/10/2025) → ngừng thu, áp 10% theo Mục 122 (24/02/2026) → 12,5% theo Mục 301 (24/7/2026, điện tử được miễn) → 7 phiên đàm phán (10/2026).', 'Việt Nam ứng xử theo NQ 59: vừa hợp tác vừa đấu tranh; Đại hội XIII: tránh lệ thuộc vào một thị trường, một đối tác.',
        'Giữ giọng trung lập, trình bày sự kiện và nguồn; không bình luận cảm tính về quốc gia nào.',
      ),
    })
    engine.addStation({
      id: 'state-mono',
      chapter: 6,
      label: 'Độc quyền nhà nước — 3 biểu hiện mới',
      y: () => docTop(lede) - 60,
      seconds: 35,
      notes: notes(
        'Bản chất (Ch.4 mục II.2): kết hợp sức mạnh của tổ chức độc quyền tư nhân với sức mạnh nhà nước tư sản, phục vụ tư bản độc quyền. Ba biểu hiện mới: quan hệ nhân sự (cơ chế thỏa hiệp), sở hữu nhà nước, công cụ điều tiết.', 'Phân biệt rõ: kinh tế nhà nước ở Việt Nam giữ vai trò chủ đạo trong KTTT định hướng XHCN (Hiến pháp Điều 51) — khác bản chất với độc quyền nhà nước TBCN. Không đồng nhất DNNN Việt Nam với ĐQNN.',
        'Bằng chứng ở các nền kinh tế TBCN phát triển: Mỹ nắm 10% Intel (UNCTAD 2026); gói cứu AIG, Citigroup (giáo trình); CHIPS Act 52,7 tỷ USD; EU Chips Act >43 tỷ EUR công và tư; 229 biện pháp chính sách đầu tư năm 2025.',
      ),
    })
    engine.addStation({
      id: 'min-tax',
      chapter: 6,
      label: 'Việt Nam & thuế tối thiểu toàn cầu',
      y: () => docTop(callout) - window.innerHeight * 0.3,
      seconds: 20,
      notes: notes(
        'Ví dụ Việt Nam chủ động: Nghị quyết 107/2023/QH15 áp thuế TNDN bổ sung theo quy định chống xói mòn cơ sở thuế toàn cầu, hiệu lực 1/1/2024; Nghị định 236/2025/NĐ-CP hướng dẫn.',
        'Ý nghĩa: không “chạy đua xuống đáy” bằng ưu đãi thuế, mà cạnh tranh bằng hạ tầng, nhân lực, thể chế.',
      ),
    })
  },
}

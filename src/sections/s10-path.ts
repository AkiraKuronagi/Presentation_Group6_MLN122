import { cite } from '../content/sources'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

export const path: Section = {
  id: 'con-duong-viet-nam',
  chapter: { n: 8, title: 'Lựa chọn của Việt Nam', short: 'Việt Nam' },
  html: () => `
  <section class="sec sec--pad" id="con-duong-viet-nam" aria-label="Lựa chọn con đường phát triển của Việt Nam">
    <div class="wrap">
      <div class="lede">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">08</span><span class="eyebrow">Giáo trình Ch.6 mục II · văn kiện Đảng</span></div>
          <h2 class="display t-h1" data-split>Kế thừa thành tựu — <em class="c-red">không lặp lại giới hạn</em></h2>
        </div>
        <div data-reveal>
          <p class="t-lead">“Bỏ qua chế độ TBCN” là bỏ qua áp bức, bất công, bóc lột — <b>không bỏ qua</b> thành tựu văn minh nhân loại đạt được dưới CNTB. ${cite('npt-2021')}</p>
          <p class="t-small c-dim" style="margin-top:12px">Triết học: “bỏ qua” là rút ngắn tiến trình, cốt lõi là sự tăng trưởng nhảy vọt của LLSX — nhờ giao lưu, hợp tác quốc tế. ${cite('gt-triet')}</p>
        </div>
      </div>

      <div class="path__grid">
        <div class="path__pillars" data-stagger>
          <div class="path__pillar"><i>2013</i><div><b>Hiến pháp — Điều 50, 51</b><span>Kinh tế thị trường định hướng XHCN, kinh tế nhà nước giữ vai trò chủ đạo; xây dựng nền kinh tế độc lập, tự chủ, phát huy nội lực, hội nhập quốc tế. ${cite('hp-2013')}</span></div></div>
          <div class="path__pillar"><i>2021</i><div><b>Đại hội XIII</b><span>Xử lý tốt quan hệ giữa độc lập, tự chủ và hội nhập; đa phương hóa, đa dạng hóa, <b>tránh lệ thuộc vào một thị trường, một đối tác</b>. ${cite('dh13')}</span></div></div>
          <div class="path__pillar"><i>2025</i><div><b>Nghị quyết 59-NQ/TW</b><span>Nội lực giữ vai trò quyết định; hội nhập vừa hợp tác vừa đấu tranh; chuyển từ tâm thế “xin nhận, gia nhập” sang chủ động đóng góp, xây dựng. ${cite('nq59')}</span></div></div>
          <div class="path__pillar"><i>2026</i><div><b>Đại hội XIV</b><span>Giải quyết tốt quan hệ giữa <b>tự chủ sản xuất trong nước</b> với tham gia mạng sản xuất, chuỗi giá trị toàn cầu; thu hút FDI có chọn lọc, tăng liên kết FDI với doanh nghiệp trong nước. ${cite('dh14')}</span></div></div>
        </div>
        <div class="card" data-reveal data-delay="0.1">
          <p class="eyebrow">6 phương hướng nâng cao hiệu quả hội nhập</p>
          <ol class="mini-list" style="margin-top:14px">
            <li>Nhận thức đúng thời cơ và thách thức</li>
            <li>Chiến lược, lộ trình hội nhập phù hợp</li>
            <li>Chủ động tham gia liên kết, thực hiện đầy đủ cam kết</li>
            <li>Hoàn thiện thể chế để vươn lên <b>tầng nấc cao hơn của chuỗi giá trị</b></li>
            <li>Nâng cao năng lực cạnh tranh, nhân lực chất lượng cao</li>
            <li><b>Xây dựng nền kinh tế độc lập, tự chủ</b> — nền tảng để hội nhập không “hòa tan”</li>
          </ol>
          <p class="cite" style="margin-top:12px">Diễn đạt lại theo ${cite('gt-ktct')}, Ch.6 mục II.3</p>
        </div>
      </div>

      <div class="thesis" data-reveal>
        <p class="eyebrow">Quan điểm của nhóm</p>
        <p class="display t-h2" style="margin:10px 0 0">FDI là <em class="c-gold">cây cầu</em>, không phải <em class="c-red">chiếc thang</em>.</p>
        <p class="t-lead" style="margin-top:14px">Cây cầu đưa Việt Nam vào chuỗi giá trị toàn cầu. Nhưng muốn leo lên hai đầu “đường cong nụ cười”, ta phải tự đóng từng bậc thang bằng nội lực: <b>con người, công nghệ, thể chế</b>.</p>
      </div>
    </div>
  </section>`,
  mount(el, { engine }) {
    const thesis = el.querySelector('.thesis') as HTMLElement
    engine.addStation({
      id: 'path-1',
      chapter: 8,
      label: 'Con đường Việt Nam — kế thừa, không lặp lại',
      y: () => docTop(el),
      seconds: 55,
      notes: notes(
        'Từ vai trò và giới hạn của CNTB → lý giải lựa chọn của Việt Nam: kinh tế thị trường định hướng XHCN, kế thừa thành tựu (vốn, công nghệ, quản trị) nhưng không chấp nhận áp bức, bất công.',
        'Mạch văn kiện: Hiến pháp 2013 (Điều 50, 51) → Đại hội XIII → Nghị quyết 59 (2025) → Đại hội XIV (2026) — Đại hội XIV nêu thẳng quan hệ giữa tự chủ sản xuất với tham gia chuỗi giá trị toàn cầu.',
        'Giáo trình Ch.6 mục II: 6 phương hướng; độc lập, tự chủ là nền tảng — hội nhập không phải hòa tan.',
      ),
    })
    engine.addStation({
      id: 'path-2',
      chapter: 8,
      label: 'Quan điểm nhóm: FDI là cây cầu, không phải chiếc thang',
      y: () => docTop(thesis) - window.innerHeight * 0.3,
      seconds: 30,
      notes: notes(
        'Câu chốt quan điểm riêng: FDI giúp ta vào chuỗi (cây cầu), nhưng không tự đưa ta lên khâu giá trị cao (chiếc thang). Bậc thang phải tự đóng bằng nội lực: con người, công nghệ, thể chế.',
        'Chuyển ý: “Con người — tức là chính chúng ta.”',
      ),
    })
  },
}

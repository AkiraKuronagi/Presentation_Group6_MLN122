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
          <p class="t-lead">Theo cố Tổng Bí thư Nguyễn Phú Trọng, bỏ qua chế độ TBCN là bỏ qua áp bức, bất công, bóc lột — <b>không bỏ qua</b> thành tựu, giá trị văn minh nhân loại đạt được dưới CNTB ${cite('npt-2021')}.</p>
          <p class="t-small c-dim" style="margin-top:12px">Triết học: “bỏ qua” là rút ngắn tiến trình, cốt lõi là sự tăng trưởng nhảy vọt của LLSX — nhờ giao lưu, hợp tác quốc tế. ${cite('gt-triet')}</p>
        </div>
      </div>

      <div class="path__grid">
        <div class="path__pillars" data-stagger>
          <div class="path__pillar"><i>2013</i><div><b>Hiến pháp — Điều 50, 51</b><span>Kinh tế thị trường định hướng XHCN, kinh tế nhà nước giữ vai trò chủ đạo; xây dựng nền kinh tế độc lập, tự chủ, phát huy nội lực, hội nhập quốc tế. ${cite('hp-2013')}</span></div></div>
          <div class="path__pillar"><i>2019</i><div><b>Nghị quyết 50-NQ/TW</b><span>Chủ động thu hút, hợp tác đầu tư nước ngoài <b>có chọn lọc</b>, lấy chất lượng, hiệu quả, công nghệ và bảo vệ môi trường là tiêu chí đánh giá chủ yếu ${cite('nq50')}.</span></div></div>
          <div class="path__pillar"><i>2021</i><div><b>Đại hội XIII</b><span>Xử lý tốt quan hệ giữa độc lập, tự chủ và hội nhập; đa phương hóa, đa dạng hóa, <b>tránh lệ thuộc vào một thị trường, một đối tác</b>. ${cite('dh13')}</span></div></div>
          <div class="path__pillar"><i>2025</i><div><b>Nghị quyết 59-NQ/TW</b><span>Nội lực giữ vai trò quyết định; hội nhập vừa hợp tác vừa đấu tranh; chuyển từ tâm thế “xin nhận, gia nhập” sang chủ động đóng góp, xây dựng. ${cite('nq59')}</span></div></div>
          <div class="path__pillar"><i>2026</i><div><b>Đại hội XIV</b><span>Giải quyết tốt quan hệ giữa <b>tự chủ sản xuất trong nước</b> với tham gia mạng sản xuất, chuỗi giá trị toàn cầu; thu hút FDI có chọn lọc, tăng liên kết FDI với doanh nghiệp trong nước. ${cite('dh14')}</span></div></div>
        </div>
        <div class="card" data-reveal data-delay="0.1">
          <p class="eyebrow">Giáo trình Ch.6 mục II.3 — 3 trong 6 phương hướng, gắn bằng chứng của bài</p>
          <ol class="mini-list" style="margin-top:14px">
            <li><b>Hoàn thiện thể chế</b> để tham gia “tầng nấc cao hơn của chuỗi cung ứng và giá trị” → thuế tối thiểu toàn cầu (Phần 6)</li>
            <li><b>Nâng cao năng lực cạnh tranh, nhân lực</b> → 50.000 nhân lực bán dẫn đến 2030 (Phần 9)</li>
            <li><b>Xây dựng nền kinh tế độc lập, tự chủ</b> — nền tảng để hội nhập không “hòa tan” → nội địa hóa, đa dạng hóa thị trường (Phần 5, 6)</li>
          </ol>
          <p class="cite" style="margin-top:12px">Ba phương hướng còn lại: nhận thức đúng thời cơ – thách thức; chiến lược, lộ trình phù hợp; chủ động tham gia liên kết, thực hiện cam kết. Diễn đạt lại theo ${cite('gt-ktct')}.</p>
        </div>
      </div>

      <table class="match" data-reveal>
        <thead><tr><th>Giới hạn của CNTB (giáo trình)</th><th></th><th>Định hướng của Việt Nam</th></tr></thead>
        <tbody>
          <tr><td>Sản xuất chủ yếu vì lợi ích thiểu số</td><td>→</td><td>Mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh ${cite('hp-2013')}</td></tr>
          <tr><td>Chiến tranh, xung đột</td><td>→</td><td>Đường lối đối ngoại độc lập, tự chủ, hòa bình, hợp tác và phát triển ${cite('npt-2021')}</td></tr>
          <tr><td>Phân hóa giàu nghèo</td><td>→</td><td>Tăng trưởng kinh tế đi đôi với tiến bộ, công bằng xã hội ngay trong từng bước ${cite('npt-2021')}</td></tr>
        </tbody>
      </table>

      <div class="thesis" data-reveal>
        <p class="eyebrow">Quan điểm của nhóm</p>
        <p class="display t-h2" style="margin:10px 0 0">FDI là <em class="c-gold">cây cầu</em> — chỉ thành <em class="c-red">bậc thang</em> khi có nội lực.</p>
        <p class="t-lead" style="margin-top:14px">Cây cầu đưa Việt Nam vào chuỗi giá trị toàn cầu. Nó chỉ trở thành bậc thang lên hai đầu “đường cong nụ cười” khi ta có nội lực hấp thụ — <b>con người, công nghệ, thể chế</b> — cùng chính sách liên kết, chuyển giao công nghệ.</p>
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
      seconds: 35,
      notes: notes(
        'Từ vai trò và giới hạn của CNTB → lý giải lựa chọn của Việt Nam: kinh tế thị trường định hướng XHCN, kế thừa thành tựu (vốn, công nghệ, quản trị) nhưng không chấp nhận áp bức, bất công.',
        'Mạch văn kiện: Hiến pháp 2013 (Điều 50, 51) → NQ 50-NQ/TW (2019, FDI có chọn lọc, lấy công nghệ làm tiêu chí) → Đại hội XIII → NQ 59 (2025) → Đại hội XIV (2026) — Đại hội XIV nêu thẳng quan hệ giữa tự chủ sản xuất với tham gia chuỗi giá trị toàn cầu.', 'Bảng đối ứng: 3 giới hạn của CNTB ↔ 3 định hướng của Việt Nam — đây là câu trả lời trực tiếp cho câu hỏi cốt lõi “từ đó lý giải lựa chọn con đường phát triển của Việt Nam”.',
        'Giáo trình Ch.6 mục II: 6 phương hướng; độc lập, tự chủ là nền tảng — hội nhập không phải hòa tan.',
      ),
    })
    engine.addStation({
      id: 'path-2',
      chapter: 8,
      label: 'Quan điểm nhóm: FDI là cây cầu — thành bậc thang khi có nội lực',
      y: () => docTop(thesis) - window.innerHeight * 0.3,
      seconds: 20,
      notes: notes(
        'Câu chốt quan điểm riêng: FDI giúp ta vào chuỗi (cây cầu); nó chỉ thành bậc thang lên khâu giá trị cao khi có nội lực hấp thụ cùng chính sách liên kết, chuyển giao công nghệ — đúng tinh thần NQ 50-NQ/TW và Đại hội XIV.',
        'Chuyển ý: “Con người — tức là chính chúng ta.”',
      ),
    })
  },
}

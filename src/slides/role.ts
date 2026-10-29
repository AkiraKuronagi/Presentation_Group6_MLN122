import { LIMITS } from '../content/data'
import type { Slide } from '../core/deck'
import { notes, refs, source } from './util'

// ─── 14. Hai mặt của một hình thái ──────────────────────────────────
export const coin: Slide = {
  id: 'vai-tro',
  title: 'Vai trò lịch sử của CNTB',
  seconds: 100,
  gl: { scene: 'coin', mode: 'spin', x: 1420, y: 520, p: 1, speed: 0.22 },
  html: () => `
    <div class="col">
      <p class="k"><b>14</b>Vai trò lịch sử của chủ nghĩa tư bản</p>
      <h2 class="h h--m" data-in>Hai mặt của<br /><em>một hình thái</em></h2>
      <div class="sides" data-in>
        <ul class="sides__a"><li>Phát triển lực lượng sản xuất</li><li>Sản xuất nhỏ → sản xuất lớn</li><li>Xã hội hóa sản xuất</li></ul>
        <ul class="sides__b"><li>Vì lợi ích thiểu số</li><li>Chiến tranh, xung đột</li><li>Phân hóa giàu nghèo</li></ul>
      </div>
      <div class="row" data-in>
        <div class="stat stat--red"><div class="stat__v">${LIMITS.incomeTop10}<small>%</small></div><div class="stat__l">thu nhập thế giới vào tay 10% giàu nhất</div></div>
        <div class="stat stat--red"><div class="stat__v">${String(LIMITS.warmingCurrentPolicies).replace('.', ',')}<small>°C</small></div><div class="stat__l">mức ấm lên nếu giữ chính sách hiện hành</div></div>
      </div>
      <blockquote class="q" data-in>“Chủ nghĩa tư bản chưa bao giờ mang tính toàn cầu như ngày nay … [nhưng] vẫn không thể khắc phục được những mâu thuẫn cơ bản vốn có của nó.”<cite>— Cố Tổng Bí thư Nguyễn Phú Trọng (2021)</cite></blockquote>
    </div>
    <p class="distinct" data-in><b>Gốc rễ (giáo trình, tr.149):</b> mâu thuẫn cơ bản — sản xuất ngày càng xã hội hóa ↔ chiếm hữu tư nhân TBCN về tư liệu sản xuất. <b>Nhóm cụ thể hóa:</b> sản xuất vì lợi nhuận → chi phí môi trường bị đẩy ra ngoài · sở hữu quyết định phân phối → bất bình đẳng tự lặp lại · cạnh tranh giữa các khối → khó hợp tác toàn cầu</p>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.3 (tr.148–150); ${refs('npt-2021', 'wir-ineq', 'wir-exec', 'unep-2025')}`)}`,
  notes: notes(
    'Chủ nghĩa tư bản có hai mặt. Mặt tích cực, giáo trình nêu ba điểm: làm máy móc, kỹ thuật và tay nghề phát triển mạnh, giáo trình gọi là phát triển lực lượng sản xuất; biến làm ăn nhỏ thành sản xuất lớn; và biến sản xuất thành việc chung của nhiều người, nhiều nơi. Chuỗi giá trị toàn cầu chính là cả thế giới cùng làm ra một sản phẩm.',
    'Mặt giới hạn: chủ nghĩa tư bản sản xuất vì lợi ích của số ít, gây ra chiến tranh, xung đột, và khoảng cách giàu nghèo ngày càng xa. Theo Báo cáo Bất bình đẳng Thế giới 2026, 10% người giàu nhất nhận 53% thu nhập của cả thế giới. Theo UNEP, nếu cứ giữ chính sách như hiện nay, trái đất sẽ nóng lên khoảng 2,8 độ C.',
    'Cố Tổng Bí thư Nguyễn Phú Trọng từng nhận định: chủ nghĩa tư bản chưa bao giờ mang tính toàn cầu như ngày nay, nhưng vẫn không thể khắc phục được những mâu thuẫn cơ bản vốn có của nó. Gốc rễ, theo giáo trình trang 149, là mâu thuẫn cơ bản: việc làm ra sản phẩm ngày càng là việc chung của cả thế giới, nhưng nhà máy, máy móc, công nghệ, giáo trình gọi là tư liệu sản xuất, lại thuộc về một số ít chủ tư bản. Nhóm chia mâu thuẫn đó thành ba điều dễ thấy. Một, làm ra là để kiếm lời, nên cái giá về môi trường bị đẩy cho người khác gánh. Hai, ai làm chủ thì người đó quyết định chia phần, nên chuyện giàu nghèo cứ lặp đi lặp lại. Ba, các khối nước cạnh tranh nhau nên khó ngồi lại hợp tác. Chủ nghĩa tư bản vẫn tự sửa mình được nên vẫn còn phát triển, nhưng mâu thuẫn gốc thì không tự hết được.',
  ),
}

// ─── 15. Lựa chọn của Việt Nam: cây cầu → bậc thang ─────────────────
const DOCS = ['Hiến pháp 2013 · Điều 50–51', 'NQ 50-NQ/TW (2019)', 'Đại hội XIII (2021)', 'NQ 59-NQ/TW (2025)', 'Đại hội XIV (2026)']

export const bridge: Slide = {
  id: 'con-duong',
  title: 'Lựa chọn của Việt Nam',
  seconds: 90,
  gl: { scene: 'bridge', mode: 'morph', x: 1300, y: 600, p: 1, speed: 0.2 },
  labels: [
    { at: 'vn', html: '<b class="lo">Hôm nay</b><i>lắp ráp, gia công</i>', align: 'right', dx: -130, dy: 20, minP: 0.05 },
    { at: 'mid', html: '<b>Nội lực</b><i>nhân lực · công nghệ · liên kết</i>', minP: 0.6 },
    { at: 'top', html: '<b class="hi">Khâu giá trị cao</b><i>thiết kế · thương hiệu</i>', dy: -50, minP: 0.85 },
  ],
  html: () => `
    <div class="col">
      <p class="k"><b>15</b>Lựa chọn của Việt Nam · quan điểm nhóm</p>
      <h2 class="h h--m" data-in>FDI là <em>cây cầu</em> —<br />chỉ thành <em class="r">bậc thang</em><br />khi có nội lực</h2>
      <p class="why" data-in><b>Giáo trình (tr.150):</b> mâu thuẫn cơ bản không tự giải quyết được → CNTB “không tồn tại vĩnh viễn”, sẽ được thay bằng hình thái kinh tế – xã hội tiến bộ hơn. Cùng với điều kiện lịch sử và thực tiễn cách mạng, đây là cơ sở để <b>Việt Nam đi lên CNXH, bỏ qua chế độ TBCN</b>: bỏ qua áp bức, bất công, bóc lột — <b>không bỏ qua</b> thành tựu, giá trị văn minh nhân loại.</p>
      <ol class="docs" data-in style="margin-top:22px">${DOCS.map((d) => `<li>${d}</li>`).join('')}</ol>
      <ul class="more more--narrow" data-in>
        <li>Vì lợi ích thiểu số → <b>dân giàu, nước mạnh, dân chủ, công bằng, văn minh</b></li>
        <li>Chiến tranh, xung đột → <b>độc lập, tự chủ, tự cường, hòa bình, hữu nghị, hợp tác và phát triển</b></li>
        <li>Phân hóa giàu nghèo → <b>tăng trưởng đi cùng tiến bộ, công bằng xã hội</b></li>
      </ul>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.3 (tr.150), Ch.6 mục II; ${refs('hp-2013', 'nq50', 'dh13', 'nq59', 'dh14', 'npt-2021')}`)}`,
  notes: notes(
    'Giáo trình trang 150 kết luận: vì mâu thuẫn gốc không tự giải quyết được, chủ nghĩa tư bản không tồn tại vĩnh viễn, mà sẽ được thay bằng một kiểu xã hội mới, tiến bộ hơn, giáo trình gọi là hình thái kinh tế – xã hội mới. Kết luận lý luận đó, cùng với điều kiện lịch sử, thực tiễn cách mạng và mục tiêu phát triển của Việt Nam, là cơ sở để Việt Nam lựa chọn quá độ lên chủ nghĩa xã hội, bỏ qua chế độ tư bản chủ nghĩa, bằng nền kinh tế thị trường định hướng xã hội chủ nghĩa. Theo cố Tổng Bí thư Nguyễn Phú Trọng, “bỏ qua chế độ tư bản chủ nghĩa là bỏ qua chế độ áp bức, bất công, bóc lột tư bản chủ nghĩa… chứ không phải bỏ qua cả những thành tựu, giá trị văn minh mà nhân loại đã đạt được trong thời kỳ phát triển chủ nghĩa tư bản”. Hội nhập nhưng không hòa tan.',
    'Hướng đi này có trong các văn bản trên màn hình, từ Hiến pháp 2013, Nghị quyết 50 năm 2019 về thu hút FDI có chọn lọc, đến Nghị quyết 59 năm 2025 về hội nhập quốc tế và Đại hội XIV. Ứng với ba giới hạn của chủ nghĩa tư bản, Việt Nam có ba hướng đi: dân giàu, nước mạnh, dân chủ, công bằng, văn minh; đối ngoại độc lập, tự chủ, tự cường, hòa bình, hữu nghị, hợp tác và phát triển, như Đại hội XIV ghi; và kinh tế lớn lên phải đi cùng tiến bộ, công bằng xã hội ngay từ từng bước.',
    'Nhóm nghĩ thế này: FDI là cây cầu giúp Việt Nam bước vào chuỗi giá trị toàn cầu. Nhưng muốn cây cầu đó thành bậc thang đưa mình lên khâu có giá trị cao hơn, thì mình phải đủ sức học được công nghệ, và phải có chính sách để doanh nghiệp Việt được làm cùng, học được từ doanh nghiệp FDI. Mà sức mạnh đó bắt đầu từ con người.',
  ),
}

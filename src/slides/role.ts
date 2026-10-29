import { LIMITS } from '../content/data'
import type { Slide } from '../core/deck'
import { notes, refs, source } from './util'

// ─── 14. Hai mặt của một hình thái ──────────────────────────────────
export const coin: Slide = {
  id: 'vai-tro',
  title: 'Vai trò lịch sử của CNTB',
  seconds: 75,
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
    <p class="distinct" data-in><b>Vì sao khó giải quyết triệt để? (quan điểm nhóm)</b> Sản xuất vì lợi nhuận → chi phí môi trường bị đẩy ra ngoài · Sở hữu quyết định phân phối → bất bình đẳng tự lặp lại · Cạnh tranh giữa các khối → khó hợp tác toàn cầu</p>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.3; ${refs('npt-2021', 'wir-ineq', 'wir-exec', 'unep-2025', 'ipcc-2023')}`)}`,
  notes: notes(
    'Chủ nghĩa tư bản có hai mặt. Mặt tích cực, giáo trình nêu ba điểm: phát triển lực lượng sản xuất, biến sản xuất nhỏ thành sản xuất lớn, và làm cho sản xuất mang tính xã hội. Chuỗi giá trị toàn cầu chính là cả thế giới cùng làm ra một sản phẩm.',
    'Mặt giới hạn: chủ nghĩa tư bản sản xuất vì lợi ích của số ít, gây ra chiến tranh, xung đột, và khoảng cách giàu nghèo ngày càng xa. Theo Báo cáo Bất bình đẳng Thế giới 2026, 10% người giàu nhất nhận 53% thu nhập của cả thế giới. Theo UNEP, nếu cứ giữ chính sách như hiện nay, trái đất sẽ nóng lên khoảng 2,8 độ C.',
    'Cố Tổng Bí thư Nguyễn Phú Trọng từng nhận định: chủ nghĩa tư bản chưa bao giờ mang tính toàn cầu như ngày nay, nhưng vẫn không thể khắc phục được những mâu thuẫn cơ bản vốn có của nó. Nhóm nghĩ có ba lý do. Một, làm ra là để kiếm lời, nên cái giá về môi trường bị đẩy cho người khác gánh. Hai, ai làm chủ thì người đó quyết định chia phần, nên chuyện giàu nghèo cứ lặp đi lặp lại. Ba, các khối nước cạnh tranh nhau nên khó ngồi lại hợp tác. Chủ nghĩa tư bản vẫn tự điều chỉnh được nên vẫn còn phát triển, nhưng mâu thuẫn gốc thì không tự hết được, vì vậy nó không tồn tại mãi mãi.',
  ),
}

// ─── 15. Lựa chọn của Việt Nam: cây cầu → bậc thang ─────────────────
const DOCS = ['Hiến pháp 2013 · Điều 50–51', 'NQ 50-NQ/TW (2019)', 'Đại hội XIII (2021)', 'NQ 59-NQ/TW (2025)', 'Đại hội XIV (2026)']

export const bridge: Slide = {
  id: 'con-duong',
  title: 'Lựa chọn của Việt Nam',
  seconds: 70,
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
      <p class="lead" data-in>Kế thừa thành tựu nhân loại đạt được dưới CNTB — <b>không lặp lại</b> áp bức, bất công, bóc lột. Hội nhập, không hòa tan.</p>
      <ol class="docs" data-in>${DOCS.map((d) => `<li>${d}</li>`).join('')}</ol>
    </div>
    ${source(`${refs('hp-2013', 'nq50', 'dh13', 'nq59', 'dh14', 'npt-2021')}; ${refs('gt-ktct')}, Ch.6 mục II`)}`,
  notes: notes(
    'Hiểu hai mặt đó rồi thì sẽ hiểu vì sao Việt Nam chọn kinh tế thị trường định hướng xã hội chủ nghĩa: học lấy những gì nhân loại đã làm được dưới chủ nghĩa tư bản, nhưng không lặp lại áp bức, bất công, bóc lột. Hội nhập nhưng không hòa tan.',
    'Hướng đi này có trong Hiến pháp 2013, Nghị quyết 50 của Bộ Chính trị năm 2019 về thu hút FDI có chọn lọc, Đại hội XIII, Nghị quyết 59 năm 2025 về hội nhập quốc tế, và Đại hội XIV năm 2026. Ứng với ba giới hạn của chủ nghĩa tư bản, Việt Nam có ba hướng đi: mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh; đối ngoại độc lập, tự chủ, hòa bình, hợp tác và phát triển; và tăng trưởng kinh tế phải đi cùng với tiến bộ, công bằng xã hội ngay trong từng bước.',
    'Nhóm nghĩ thế này: FDI là cây cầu giúp Việt Nam bước vào chuỗi giá trị toàn cầu. Nhưng muốn cây cầu đó thành bậc thang đưa mình lên khâu có giá trị cao hơn, thì mình phải đủ sức học được công nghệ, và phải có chính sách để doanh nghiệp Việt được làm cùng, học được từ doanh nghiệp FDI. Mà sức mạnh đó bắt đầu từ con người.',
  ),
}

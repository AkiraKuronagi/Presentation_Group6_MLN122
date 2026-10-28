import { LIMITS } from '../content/data'
import type { Slide } from '../core/deck'
import { notes, refs, source } from './util'

// ─── 15. Hai mặt của một hình thái ──────────────────────────────────
export const coin: Slide = {
  id: 'vai-tro',
  title: 'Vai trò lịch sử của CNTB',
  seconds: 60,
  gl: { scene: 'coin', mode: 'spin', x: 1420, y: 520, p: 1, speed: 0.22 },
  html: () => `
    <div class="col">
      <p class="k"><b>15</b>Vai trò lịch sử của chủ nghĩa tư bản</p>
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
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.3; ${refs('npt-2021', 'wir-ineq', 'unep-2025', 'ipcc-2023')}`)}`,
  notes: notes(
    'Giáo trình Ch.4 mục III.3: ba vai trò tích cực (phát triển LLSX; chuyển sản xuất nhỏ thành lớn; xã hội hóa sản xuất) và ba giới hạn (vì lợi ích thiểu số; gây chiến tranh, xung đột; phân hóa giàu nghèo).',
    'Nối với bài: chuỗi giá trị toàn cầu chính là xã hội hóa sản xuất ở quy mô hành tinh — vai trò tích cực; nhưng phần giá trị lại dồn về chủ sở hữu công nghệ, thương hiệu — giới hạn.',
    'Số liệu quốc tế: World Inequality Report 2026 — 10% giàu nhất nhận 53% thu nhập, nắm ~75% của cải; 50% dưới cùng: 8% thu nhập, 2% của cải. UNEP 2025: theo chính sách hiện hành, trái đất ấm lên 2,8°C; phát thải 2024 kỷ lục 57,7 GtCO₂e. IPCC: 10% hộ phát thải cao nhất chiếm 34–45% phát thải hộ gia đình. Số liệu toàn cầu không quy cho từng quốc gia.',
    'Trích đủ hai vế của cố Tổng Bí thư Nguyễn Phú Trọng (2021) — không cắt riêng vế đầu.',
    'Quan điểm nhóm — vì sao khó giải quyết triệt để: (1) sản xuất vì lợi nhuận → chi phí môi trường bị đẩy ra ngoài; (2) quan hệ sở hữu quyết định phân phối → bất bình đẳng tự tái sản xuất; (3) cạnh tranh giữa các khối làm khó hợp tác toàn cầu.',
    'Kết luận giáo trình: QHSX TBCN còn tự điều chỉnh được nên CNTB còn phát triển, nhưng mâu thuẫn cơ bản không tự giải quyết được → CNTB không tồn tại vĩnh viễn.',
  ),
}

// ─── 16. Lựa chọn của Việt Nam: cây cầu → bậc thang ─────────────────
const DOCS = ['Hiến pháp 2013 · Điều 50–51', 'NQ 50-NQ/TW (2019)', 'Đại hội XIII (2021)', 'NQ 59-NQ/TW (2025)', 'Đại hội XIV (2026)']

export const bridge: Slide = {
  id: 'con-duong',
  title: 'Lựa chọn của Việt Nam',
  seconds: 50,
  gl: { scene: 'bridge', mode: 'morph', x: 1300, y: 600, p: 1, speed: 0.2 },
  labels: [
    { at: 'vn', html: '<b class="lo">Hôm nay</b><i>lắp ráp, gia công</i>', align: 'right', dx: -130, dy: 20, minP: 0.05 },
    { at: 'mid', html: '<b>Nội lực</b><i>nhân lực · công nghệ · liên kết</i>', minP: 0.6 },
    { at: 'top', html: '<b class="hi">Khâu giá trị cao</b><i>thiết kế · thương hiệu</i>', dy: -50, minP: 0.85 },
  ],
  html: () => `
    <div class="col">
      <p class="k"><b>16</b>Lựa chọn của Việt Nam · quan điểm nhóm</p>
      <h2 class="h h--m" data-in>FDI là <em>cây cầu</em> —<br />thành <em class="r">bậc thang</em><br />khi có nội lực</h2>
      <p class="lead" data-in>Kế thừa vốn, công nghệ, quản trị của CNTB — <b>không lặp lại</b> áp bức, bất công. Hội nhập, không hòa tan.</p>
      <ol class="docs" data-in>${DOCS.map((d) => `<li>${d}</li>`).join('')}</ol>
    </div>
    ${source(`${refs('hp-2013', 'nq50', 'dh13', 'nq59', 'dh14', 'gt-ktct')}, Ch.6 mục II`)}`,
  notes: notes(
    'Từ vai trò và giới hạn của CNTB → lý giải lựa chọn của Việt Nam: kinh tế thị trường định hướng XHCN, kế thừa thành tựu (vốn, công nghệ, quản trị) nhưng không chấp nhận áp bức, bất công.',
    'Mạch văn kiện: Hiến pháp 2013 (Điều 50, 51) → NQ 50-NQ/TW (2019, FDI có chọn lọc, lấy công nghệ làm tiêu chí) → Đại hội XIII → NQ 59 (2025) → Đại hội XIV (2026) — nêu thẳng quan hệ giữa tự chủ sản xuất với tham gia chuỗi giá trị toàn cầu.',
    'Đối ứng 3 giới hạn ↔ 3 định hướng: sản xuất vì lợi ích thiểu số → mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh (Hiến pháp 2013); chiến tranh, xung đột → đối ngoại độc lập, tự chủ, hòa bình, hợp tác và phát triển; phân hóa giàu nghèo → tăng trưởng đi đôi với tiến bộ, công bằng xã hội ngay trong từng bước (Nguyễn Phú Trọng, 2021).',
    'Theo cố Tổng Bí thư Nguyễn Phú Trọng: bỏ qua chế độ TBCN là bỏ qua áp bức, bất công, bóc lột — không bỏ qua thành tựu, giá trị văn minh nhân loại đạt được dưới CNTB. Giáo trình Ch.6 mục II: độc lập, tự chủ là nền tảng — hội nhập không phải hòa tan.',
    'Câu chốt quan điểm riêng: FDI giúp ta vào chuỗi (cây cầu); nó chỉ thành bậc thang lên khâu giá trị cao khi có nội lực hấp thụ cùng chính sách liên kết, chuyển giao công nghệ. Chuyển ý: “Nội lực — tức là chính chúng ta.”',
  ),
}

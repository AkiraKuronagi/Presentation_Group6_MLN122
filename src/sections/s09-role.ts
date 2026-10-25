import { LIMITS } from '../content/data'
import { cite } from '../content/sources'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

export const role: Section = {
  id: 'vai-tro-lich-su',
  chapter: { n: 7, title: 'Vai trò lịch sử của CNTB', short: 'Vai trò CNTB' },
  html: () => `
  <section class="sec sec--pad" id="vai-tro-lich-su" aria-label="Vai trò lịch sử của chủ nghĩa tư bản">
    <div class="wrap">
      <div class="lede">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">07</span><span class="eyebrow">Giáo trình Ch.4 mục III.3</span></div>
          <h2 class="display t-h1" data-split>Hai mặt của <em class="c-gold">một</em> hình thái</h2>
        </div>
        <p class="t-lead" data-reveal>Đánh giá CNTB bằng quan điểm lịch sử – cụ thể: thừa nhận đóng góp to lớn, đồng thời chỉ ra giới hạn không tự vượt qua được.</p>
      </div>

      <div class="balance">
        <div class="balance__side" data-reveal>
          <h3 class="display t-h2 c-gold">Vai trò tích cực</h3>
          <ol>
            <li><div><b>Thúc đẩy lực lượng sản xuất phát triển nhanh</b><span>Từ thủ công lên cơ khí, tự động hóa, tin học hóa; các cuộc cách mạng công nghiệp đến CMCN lần thứ tư.</span></div></li>
            <li><div><b>Chuyển sản xuất nhỏ thành sản xuất lớn hiện đại</b><span>Năng suất lao động cao, khối lượng hàng hóa khổng lồ.</span></div></li>
            <li><div><b>Thực hiện xã hội hóa sản xuất</b><span>Phân công, chuyên môn hóa, hợp tác — nối các ngành, các quốc gia thành một quá trình sản xuất thống nhất (chính là chuỗi giá trị toàn cầu).</span></div></li>
          </ol>
        </div>
        <div class="balance__axis" aria-hidden="true"></div>
        <div class="balance__side" data-reveal data-delay="0.15">
          <h3 class="display t-h2 c-red">Giới hạn phát triển</h3>
          <ol>
            <li><div><b>Mục đích sản xuất vì lợi ích thiểu số</b><span>Dựa trên chiếm hữu tư nhân TBCN; độc quyền áp giá, chỉ đổi mới khi vị thế an toàn — vừa phát triển vừa có xu hướng trì trệ.</span></div></li>
            <li><div><b>Gây chiến tranh, xung đột</b><span>Phân chia và đòi chia lại thị trường, lãnh thổ là nguyên nhân chính của hai cuộc chiến tranh thế giới; nay vẫn còn chạy đua vũ trang, chiến tranh thương mại gắn với cạnh tranh lợi ích giữa các cường quốc tư bản.</span></div></li>
            <li><div><b>Phân hóa giàu nghèo</b><span>Trong lòng mỗi nước tư bản và giữa các quốc gia.</span></div></li>
          </ol>
          <p class="t-small" style="margin:22px 0 0">Gốc rễ: <b>mâu thuẫn cơ bản</b> giữa trình độ xã hội hóa ngày càng cao của LLSX với chế độ chiếm hữu tư nhân TBCN. QHSX TBCN tự điều chỉnh được trong giới hạn nhất định nên CNTB còn tiềm năng phát triển, nhưng không khắc phục triệt để được mâu thuẫn này — CNTB không tồn tại vĩnh viễn ${cite('gt-ktct', 'gt-triet')}.</p>
        </div>
      </div>
      <blockquote class="role-quote" data-reveal>
        <p class="quote">Chủ nghĩa tư bản chưa bao giờ mang tính toàn cầu như ngày nay … [nhưng] vẫn không thể khắc phục được những mâu thuẫn cơ bản vốn có của nó</p>
        <p class="cite">Cố Tổng Bí thư Nguyễn Phú Trọng ${cite('npt-2021')}</p>
      </blockquote>
      <p class="cite" style="margin-top:14px">Hai cột: diễn đạt lại theo ${cite('gt-ktct')}, Ch.4 mục III.3.</p>

      <p class="t-small c-dim" style="margin:clamp(40px,7vh,80px) 0 0">Số liệu quốc tế (UNEP, IPCC thuộc LHQ; World Inequality Lab) phản ánh trật tự kinh tế thế giới do tư bản độc quyền quốc tế chi phối — nhóm không quy cho từng quốc gia.</p>
      <div class="balance__stats" data-stagger style="margin-top:16px">
        <div class="evidence">
          <div class="evidence__v"><span data-count="${LIMITS.incomeTop10}">${LIMITS.incomeTop10}</span><span class="evidence__u">% thu nhập</span></div>
          <p class="evidence__l">thế giới thuộc về 10% người thu nhập cao nhất (2025); 50% dưới cùng chỉ nhận ${LIMITS.incomeBottom50}%</p>
          ${cite('wir-ineq')}
        </div>
        <div class="evidence">
          <div class="evidence__v">~<span data-count="${LIMITS.wealthTop10}">${LIMITS.wealthTop10}</span><span class="evidence__u">% của cải</span></div>
          <p class="evidence__l">nằm trong tay 10% giàu nhất; 1% giàu nhất nắm ${LIMITS.wealthTop1}%, còn một nửa nhân loại chỉ có ${LIMITS.wealthBottom50}%</p>
          ${cite('wir-ineq')}
        </div>
        <div class="evidence">
          <div class="evidence__v"><span data-count="${LIMITS.warmingCurrentPolicies}" data-digits="1">2,8</span><span class="evidence__u">°C</span></div>
          <p class="evidence__l">mức ấm lên thế kỷ này nếu giữ chính sách hiện hành; phát thải năm 2024 lập kỷ lục ${String(LIMITS.emissions2024).replace('.', ',')} GtCO₂e</p>
          ${cite('unep-2025', 'un-climate')}
        </div>
        <div class="evidence">
          <div class="evidence__v">${LIMITS.householdTop10Emissions}<span class="evidence__u">%</span></div>
          <p class="evidence__l">phát thải khí nhà kính hộ gia đình do 10% hộ phát thải cao nhất gây ra; 50% dưới cùng chỉ chiếm ${LIMITS.householdBottom50Emissions}%</p>
          ${cite('ipcc-2023')}
        </div>
      </div>

      <div class="why" data-reveal>
        <p class="eyebrow">Phân tích của nhóm — vì sao khó giải quyết triệt để?</p>
        <div class="why__grid">
          <div><b>Lợi nhuận đặt trước chi phí xã hội</b><span>Khi sản xuất vì lợi nhuận của chủ sở hữu, chi phí môi trường dễ bị đẩy ra ngoài — CNTB gắn với cạn kiệt tài nguyên, suy thoái sinh thái. ${cite('npt-2021')}</span></div>
          <div><b>Phân phối theo sở hữu tư bản</b><span>Quan hệ sở hữu quyết định phân phối, nên bất bình đẳng tự tái sản xuất: 10% giàu nhất chiếm 77% phát thải gắn với sở hữu tư bản tư nhân ${cite('wir-exec')}.</span></div>
          <div><b>Cạnh tranh giữa các “pháo đài”</b><span>Vấn đề toàn cầu cần hợp tác, nhưng trợ cấp, thuế quan, kiểm soát công nghệ lại chia thế giới thành các khối cạnh tranh. ${cite('wir2026')}</span></div>
        </div>
        <p class="t-small" style="margin:6px 0 10px">Việt Nam lựa chọn khác: cam kết <b>phát thải ròng bằng “0” vào năm 2050</b>, được Thủ tướng xác định là sứ mệnh chính trị của quốc gia ${cite('net-zero')}.</p>
        <p class="cite">Lưu ý: Ch.4 mục III của giáo trình không bàn trực tiếp về biến đổi khí hậu; luận điểm khí hậu dựa trên UNEP, IPCC, World Inequality Lab và bài viết của cố Tổng Bí thư Nguyễn Phú Trọng.</p>
      </div>
    </div>
  </section>`,
  mount(el, { engine }) {
    const why = el.querySelector('.why') as HTMLElement
    const stats = el.querySelector('.balance__stats') as HTMLElement
    engine.addStation({
      id: 'role-1',
      chapter: 7,
      label: 'Vai trò tích cực & giới hạn của CNTB',
      y: () => docTop(el),
      seconds: 40,
      notes: notes(
        'Giáo trình Ch.4 mục III.3: ba vai trò tích cực (phát triển LLSX; chuyển sản xuất nhỏ thành lớn; xã hội hóa sản xuất) và ba giới hạn (vì lợi ích thiểu số; gây chiến tranh, xung đột; phân hóa giàu nghèo).',
        'Nối với bài: chuỗi giá trị toàn cầu chính là xã hội hóa sản xuất ở quy mô hành tinh — vai trò tích cực; nhưng phần giá trị lại dồn về chủ sở hữu công nghệ, thương hiệu — giới hạn.',
        'Trích đủ hai vế của cố Tổng Bí thư Nguyễn Phú Trọng (2021): CNTB chưa bao giờ mang tính toàn cầu như ngày nay… nhưng vẫn không thể khắc phục được những mâu thuẫn cơ bản vốn có. Không cắt riêng vế đầu.', 'Kết luận giáo trình: QHSX TBCN còn tự điều chỉnh được nên CNTB còn phát triển, nhưng mâu thuẫn cơ bản không tự giải quyết được → CNTB không tồn tại vĩnh viễn.',
      ),
    })
    engine.addStation({
      id: 'role-2',
      chapter: 7,
      label: 'Bất bình đẳng & khí hậu — số liệu quốc tế',
      y: () => docTop(stats) - window.innerHeight * 0.25,
      seconds: 30,
      notes: notes(
        'World Inequality Report 2026: 10% giàu nhất nhận 53% thu nhập, nắm ~75% của cải; 50% dưới cùng: 8% thu nhập, 2% của cải.',
        'UNEP 2025: theo chính sách hiện hành, trái đất ấm lên 2,8°C; phát thải 2024 kỷ lục 57,7 GtCO₂e. IPCC: 10% hộ phát thải cao nhất chiếm 34–45% phát thải hộ gia đình.',
      ),
    })
    engine.addStation({
      id: 'role-3',
      chapter: 7,
      label: 'Vì sao CNTB khó giải quyết triệt để?',
      y: () => docTop(why) - window.innerHeight * 0.25,
      seconds: 30,
      notes: notes(
        'Đây là phần “quan điểm riêng” của nhóm, dựa trên lý luận: (1) sản xuất vì lợi nhuận → chi phí môi trường bị đẩy ra ngoài; (2) quan hệ sở hữu quyết định phân phối → bất bình đẳng tự tái sản xuất; (3) cạnh tranh giữa các khối làm khó hợp tác toàn cầu.',
        'Nếu bị hỏi: giáo trình Ch.4 mục III không nói về khí hậu — nhóm dùng UNEP, IPCC, World Inequality Lab và bài của cố Tổng Bí thư Nguyễn Phú Trọng (có nêu cạn kiệt tài nguyên, suy thoái môi trường). Số liệu toàn cầu không quy cho từng quốc gia; Việt Nam cam kết phát thải ròng bằng 0 vào 2050.',
      ),
    })
  },
}

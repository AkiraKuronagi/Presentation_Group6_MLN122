import { SCALE } from '../content/data'
import { cite } from '../content/sources'
import { docTop, gsap, ScrollTrigger, reduceMotion } from '../core/engine'
import { type Section, notes } from './types'

const nf = (v: number, d = 0) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d }).format(v)

/** So sánh quy mô (tỷ USD) — thanh ngang tuyến tính để thấy rõ chênh lệch */
const BARS = [
  { label: 'GDP Việt Nam 2025', v: SCALE.vnGdp2025, cls: 'vn' },
  { label: 'Doanh thu Apple (năm tài chính 2025)', v: SCALE.appleRevenueFY2025, cls: '' },
  { label: 'Doanh thu 100 TNC phi tài chính lớn nhất (2025, sơ bộ)', v: SCALE.top100Revenue2025, cls: '' },
  { label: 'Tài sản BlackRock quản lý (31/12/2025) *', v: SCALE.blackrockAum2025, cls: 'fin' },
]

export const concentration: Section = {
  id: 'tich-tu',
  chapter: { n: 3, title: 'Tích tụ & tư bản tài chính', short: 'Tập đoàn' },
  html: () => `
  <section class="sec sec--pad" id="tich-tu" aria-label="Biểu hiện mới 1 và 2">
    <div class="wrap">
      <div class="lede">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">03</span><span class="eyebrow">Biểu hiện mới · 1 &amp; 2</span></div>
          <h2 class="display t-h1" data-split>Những “đế chế” lớn hơn <em class="c-gold">cả một quốc gia</em></h2>
        </div>
        <p class="t-lead" data-reveal>Tích tụ và tập trung tư bản đạt quy mô chưa từng có; tư bản tài chính len vào mọi ngành.</p>
      </div>

      <div class="scale" data-scale>
        <p class="figure__title">So sánh quy mô (tỷ USD)</p>
        ${BARS.map(
          (b) => `
          <div class="scale__row scale__row--${b.cls || 'tnc'}">
            <span class="scale__l">${b.label}</span>
            <div class="scale__track"><i class="scale__bar" style="--w:${(b.v / SCALE.blackrockAum2025) * 100}%"></i></div>
            <span class="scale__v">${nf(b.v, b.v < 1000 ? 1 : 0)}</span>
          </div>`,
        ).join('')}
        <p class="cite">Nguồn: ${cite('wb-gdp', 'apple-10k', 'wir2026', 'blackrock')}. * Tài sản quản lý là đại lượng tồn (stock), GDP là đại lượng dòng (flow) — đặt cạnh nhau chỉ để hình dung quy mô. Tỷ lệ “lần GDP” do nhóm tự tính.</p>
      </div>

      <article class="exp">
        <div>
          <div class="exp__num">01</div>
          <h3 class="display t-h2 exp__title">Tích tụ, tập trung tư bản</h3>
          <p class="exp__then"><b>Lênin:</b> Cartel, Trust, Consortium chi phối từng ngành.<br/><b>Nay:</b> công ty xuyên quốc gia (TNC) bên cạnh mạng lưới doanh nghiệp vừa và nhỏ.</p>
        </div>
        <div class="exp__body">
          <p>Giáo trình chỉ ra: các độc quyền liên kết <b>cả dọc lẫn ngang, trong và ngoài nước</b> (Concern, Conglomerate); doanh nghiệp vừa và nhỏ tăng lên nhưng nhiều nơi trở thành mắt xích của <mark class="hl">“hệ thống gia công” — một dạng độc quyền mới</mark>, phụ thuộc tập đoàn lớn về vốn, công nghệ, thị trường. ${cite('gt-ktct')}</p>
          <div class="ev-row" data-stagger>
            <div class="evidence">
              <div class="evidence__v"><span data-count="12677">12.677</span><span class="evidence__u">tỷ USD</span></div>
              <p class="evidence__l">doanh thu của 100 tập đoàn đa quốc gia phi tài chính lớn nhất năm 2025 — khoảng <b>24,6 lần</b> GDP Việt Nam</p>
              ${cite('wir2026', 'wb-gdp')}
            </div>
            <div class="evidence">
              <div class="evidence__v">~<span data-count="81">81</span><span class="evidence__u">% GDP VN</span></div>
              <p class="evidence__l">doanh thu một năm của Apple (416,2 tỷ USD, năm tài chính 2025) so với GDP Việt Nam 2025 (514,7 tỷ USD)</p>
              ${cite('apple-10k', 'wb-gdp')}
            </div>
          </div>
          <blockquote class="card card--ghost">
            <p class="t-small c-dim" style="margin:0">UNCTAD nhận định: giá trị và lợi nhuận của sản xuất quốc tế ngày càng dồn vào <b>một nhóm nhỏ công ty thống trị</b> trong các ngành chiến lược (bán dẫn, AI, năng lượng sạch). ${cite('wir2026')}</p>
          </blockquote>
        </div>
      </article>

      <article class="exp">
        <div>
          <div class="exp__num">02</div>
          <h3 class="display t-h2 exp__title">Tư bản tài chính</h3>
          <p class="exp__then"><b>Lênin:</b> “chế độ tham dự” — công ty mẹ, con, cháu.<br/><b>Nay:</b> bổ sung “chế độ ủy nhiệm”, tập đoàn tài chính đa ngành, xuyên quốc gia.</p>
        </div>
        <div class="exp__body">
          <p>Cổ phiếu mệnh giá nhỏ phổ biến nên chủ sở hữu lớn khống chế doanh nghiệp cả trực tiếp lẫn gián tiếp qua thị trường tài chính; hình thành ngân hàng xuyên quốc gia và các trung tâm tài chính thế giới. ${cite('gt-ktct')}</p>
          <div class="ev-row" data-stagger>
            <div class="evidence">
              <div class="evidence__v"><span data-count="14.0" data-digits="1">14,0</span><span class="evidence__u">nghìn tỷ USD</span></div>
              <p class="evidence__l">tài sản do riêng BlackRock quản lý (31/12/2025) — gấp khoảng <b>27 lần</b> GDP Việt Nam</p>
              ${cite('blackrock', 'wb-gdp')}
            </div>
            <div class="evidence">
              <div class="evidence__v">~<span data-count="20">20</span><span class="evidence__u">%</span></div>
              <p class="evidence__l">tỷ trọng các thương vụ thôn tính quốc tế do quỹ đầu tư tư nhân thực hiện trong tổng M&amp;A toàn cầu (2024–2025)</p>
              ${cite('wir2026')}
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>`,
  mount(el, { engine }) {
    const exps = el.querySelectorAll<HTMLElement>('.exp')
    engine.addStation({
      id: 'scale',
      chapter: 3,
      label: 'Quy mô tập đoàn so với một quốc gia',
      y: () => docTop(el),
      seconds: 45,
      notes: notes(
        'Bốn thanh cùng một thước đo: GDP cả Việt Nam năm 2025 chỉ là một vạch ngắn bên cạnh doanh thu của 100 tập đoàn lớn nhất hay tài sản một quỹ đầu tư quản lý.',
        'Nói rõ: tài sản quản lý là “tồn”, GDP là “dòng” — so sánh để hình dung quy mô, không phải phép so sánh kinh tế chính xác.',
      ),
    })
    engine.addStation({
      id: 'exp-1',
      chapter: 3,
      label: 'Biểu hiện mới 1 — TNC & “hệ thống gia công”',
      y: () => docTop(exps[0]) - 40,
      seconds: 45,
      notes: notes(
        'Nhấn mạnh câu chữ của giáo trình: “hệ thống gia công” là độc quyền dưới dạng mới — đây là sợi chỉ nối sang phần Việt Nam.',
        'Số liệu UNCTAD 2026: 100 TNC lớn nhất có doanh thu 12.677 tỷ USD; Apple một năm thu bằng khoảng 81% GDP Việt Nam (nhóm tự tính từ báo cáo 10-K và World Bank).',
        'Không quy chụp doanh nghiệp cụ thể; Apple chỉ minh họa mô hình thuê ngoài, theo chính báo cáo bắt buộc của công ty.',
      ),
    })
    engine.addStation({
      id: 'exp-2',
      chapter: 3,
      label: 'Biểu hiện mới 2 — tư bản tài chính',
      y: () => docTop(exps[1]) - 40,
      seconds: 40,
      notes: notes(
        '“Chế độ tham dự” của Lênin nay được bổ sung bằng “chế độ ủy nhiệm”: nắm cổ phần nhỏ phân tán, khống chế qua thị trường tài chính.',
        'BlackRock quản lý 14,0 nghìn tỷ USD — gấp ~27 lần GDP Việt Nam (tự tính). Quỹ đầu tư tư nhân chiếm ~20% M&A toàn cầu (UNCTAD).',
      ),
    })
    if (reduceMotion) return
    const bars = el.querySelectorAll<HTMLElement>('.scale__bar')
    gsap.set(bars, { scaleX: 0, transformOrigin: '0 50%' })
    ScrollTrigger.create({
      trigger: el.querySelector('[data-scale]'),
      start: 'top 75%',
      once: true,
      onEnter: () => gsap.to(bars, { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.25 }),
    })
  },
}

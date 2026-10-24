import { renderChart } from '../charts/charts'
import { FDI, NSO_YEAR_URLS } from '../content/data'
import { HUBS_IN } from '../content/geo'
import { cite } from '../content/sources'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

const nf = (v: number, d = 2) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d }).format(v)
const STOCK = Object.fromEntries(FDI.topStock.map((t) => [t.name, t]))

const yearLinks = Object.entries(NSO_YEAR_URLS)
  .map(([y, u]) => `<a href="${u}" target="_blank" rel="noopener">${y}</a>`)
  .join(' · ')

export const fdi: Section = {
  id: 'xuat-khau-tu-ban',
  chapter: { n: 4, title: 'Xuất khẩu tư bản vào Việt Nam', short: 'FDI' },
  html: () => `
  <section class="sec sec--clear fdi" id="xuat-khau-tu-ban" aria-label="Biểu hiện mới 3: xuất khẩu tư bản">
    <div class="fdi__geo" data-fdi-geo aria-hidden="true">
      ${HUBS_IN.map((h, i) => {
        const s = STOCK[h.name]
        return `<span class="geo-label" data-hub="${i}">● ${h.name}${s ? ` <b>${nf(s.value, 1)} tỷ USD</b>` : ''}</span>`
      }).join('')}
      <span class="geo-label geo-label--vn" data-hub-vn>● Việt Nam</span>
    </div>
    <div class="wrap fdi__inner">
      <div class="fdi__col">
        <div class="fdi__panel" data-fdi-step="0">
          <div class="chapter-tag"><span class="chapter-tag__n">04</span><span class="eyebrow">Biểu hiện mới · 3</span></div>
          <h2 class="display t-h2" style="margin:0 0 16px">Xuất khẩu tư bản: <em class="c-gold">đổi chiều, đổi chủ thể, đổi hình thức</em></h2>
          <ol class="mini-list">
            <li>Dòng vốn chủ yếu chảy <b>giữa các nước phát triển</b> với nhau.</li>
            <li><b>TNC</b> là chủ thể chính, chủ yếu qua <b>FDI</b>; xuất hiện cả nhà đầu tư từ nước đang phát triển.</li>
            <li>Hình thức đa dạng (BOT, BT…), đan xen xuất khẩu hàng hóa, dịch vụ, chất xám.</li>
            <li>Áp đặt kiểu thực dân giảm; <b>nguyên tắc cùng có lợi</b> được đề cao.</li>
          </ol>
          <p class="cite">Diễn đạt lại theo ${cite('gt-ktct')}, Ch.4 mục III.1.c</p>
        </div>

        <div class="fdi__panel" data-fdi-step="1">
          <div class="figure">
            <p class="figure__title">Vốn FDI thực hiện tại Việt Nam, 2015–2025</p>
            <p class="figure__sub">tỷ USD · số ước tính công bố cuối năm</p>
            <div data-chart="fdi"></div>
            <p class="cite">Nguồn: ${cite('nso-series', 'nso-2025')}. Báo cáo từng năm: ${yearLinks}</p>
          </div>
          <div class="ev-row" style="margin-top:22px">
            <div class="evidence">
              <div class="evidence__v"><span data-count="${FDI.stock2025.registered}" data-digits="1">${nf(FDI.stock2025.registered, 1)}</span><span class="evidence__u">tỷ USD</span></div>
              <p class="evidence__l">vốn đăng ký lũy kế của ${nf(FDI.stock2025.projects, 0)} dự án FDI còn hiệu lực (31/12/2025); Hàn Quốc 18%, Singapore 17%</p>
              ${cite('fia-2025')}
            </div>
            <div class="evidence">
              <div class="evidence__v"><span data-count="${FDI.registered9m2026}" data-digits="2">${nf(FDI.registered9m2026)}</span><span class="evidence__u">tỷ USD</span></div>
              <p class="evidence__l">vốn FDI đăng ký 9 tháng 2026, tăng 76,4% — ${nf(FDI.manufacturingShare2025, 1)}% vốn thực hiện năm 2025 vào chế biến, chế tạo</p>
              ${cite('nso-9m2026', 'nso-2025')}
            </div>
          </div>
        </div>

        <div class="fdi__panel" data-fdi-step="2">
          <div class="figure">
            <p class="figure__title">Tỷ trọng xuất khẩu của khu vực có vốn FDI</p>
            <p class="figure__sub">% tổng kim ngạch xuất khẩu hàng hóa (kể cả dầu thô) · 2016, 2017 nhóm tự tính</p>
            <div data-chart="share"></div>
            <p class="cite">Nguồn: ${cite('nso-series', 'nso-2025')}</p>
          </div>
          <div class="evidence" style="margin-top:22px">
            <div class="evidence__v"><span data-count="${FDI.exportShare9m2026}" data-digits="1">${nf(FDI.exportShare9m2026, 1)}</span><span class="evidence__u">%</span></div>
            <p class="evidence__l">9 tháng 2026 — tỷ trọng cao nhất trong chuỗi số liệu; khu vực trong nước chỉ còn 19,3%</p>
            ${cite('nso-9m2026')}
          </div>
        </div>

        <div class="fdi__panel" data-fdi-step="3">
          <p class="figure__title" style="margin-bottom:14px">Hai khu vực — hai cán cân thương mại (tỷ USD)</p>
          <div class="bal">
            ${[
              ['Năm 2025', FDI.balance2025],
              ['9 tháng 2026', FDI.balance9m2026],
            ]
              .map(([label, b]) => {
                const bb = b as { fdi: number; domestic: number }
                const max = 50
                return `<div class="bal__row"><span class="bal__y mono">${label}</span>
                  <div class="bal__axis">
                    <i class="bal__neg" style="--w:${(Math.abs(bb.domestic) / max) * 50}%"></i>
                    <i class="bal__pos" style="--w:${(bb.fdi / max) * 50}%"></i>
                  </div>
                  <span class="bal__v"><b class="c-red">${nf(bb.domestic)}</b> · <b class="c-gold">+${nf(bb.fdi)}</b></span></div>`
              })
              .join('')}
            <div class="bal__legend t-small"><span><i class="sw" style="--sw:var(--c3)"></i>Khu vực trong nước (nhập siêu)</span><span><i class="sw" style="--sw:var(--c1)"></i>Khu vực FDI (xuất siêu)</span></div>
          </div>
          <p style="margin:18px 0 6px">Khoảng <b>90%</b> kim ngạch nhập khẩu là nguyên liệu, linh kiện, bán thành phẩm phục vụ sản xuất; xuất khẩu vẫn chủ yếu là <b>gia công cho nhãn hàng nước ngoài</b>. ${cite('vgp-930')}</p>
          <p class="cite">Nguồn cán cân: ${cite('nso-2025', 'nso-9m2026')}</p>
        </div>

        <div class="fdi__panel" data-fdi-step="4">
          <p class="eyebrow">Đánh giá hai mặt — quan điểm lịch sử, cụ thể</p>
          <div class="two">
            <div>
              <h3 class="t-h3 c-gold" style="margin:10px 0">Đóng góp</h3>
              <ul class="mini-list">
                <li>Khoảng <b>20% GDP</b>, khoảng <b>50%</b> giá trị sản xuất công nghiệp</li>
                <li>Việc làm trực tiếp cho khoảng <b>5 triệu lao động</b></li>
                <li>Vốn, công nghệ, kỹ năng quản trị, mở thị trường</li>
              </ul>
            </div>
            <div>
              <h3 class="t-h3 c-red" style="margin:10px 0">Giới hạn</h3>
              <ul class="mini-list">
                <li>Nhiều dự án tập trung ở khâu <b>gia công, lắp ráp</b>, sản xuất theo đơn đặt hàng</li>
                <li><b>Tỷ lệ nội địa hóa</b> trong nhiều ngành xuất khẩu chủ lực còn thấp</li>
                <li>Liên kết với doanh nghiệp trong nước còn yếu</li>
              </ul>
            </div>
          </div>
          <p class="cite">Theo lãnh đạo Cục Đầu tư nước ngoài — ${cite('fia-2026')}</p>
        </div>
      </div>
      <div aria-hidden="true"></div>
    </div>
  </section>`,

  mount(el, { engine, stage, globe }) {
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    stage?.zone({ scene: 'globe', mode: 'fdi', range })

    renderChart(el.querySelector('[data-chart="fdi"]') as HTMLElement, {
      kind: 'columns',
      categories: FDI.years,
      series: [{ key: 'disb', label: 'Vốn FDI thực hiện', color: 'c1', values: FDI.disbursed }],
      unit: 'tỷ USD',
      digits: 2,
      labelAt: [0, FDI.years.length - 1],
    })
    renderChart(el.querySelector('[data-chart="share"]') as HTMLElement, {
      kind: 'lines',
      categories: FDI.years,
      series: [{ key: 'share', label: 'Tỷ trọng XK khu vực FDI', color: 'c1', values: FDI.exportShare }],
      unit: '%',
      digits: 1,
      yMax: 100,
      labelAt: [0, 4, FDI.years.length - 1],
      height: 260,
    })

    const panels = Array.from(el.querySelectorAll<HTMLElement>('[data-fdi-step]'))
    const stationNotes = [
      notes(
        'Biểu hiện mới thứ 3 theo giáo trình có 4 ý: đổi chiều (chủ yếu giữa các nước phát triển), đổi chủ thể (TNC, FDI), đổi hình thức (BOT, BT, đan xen xuất khẩu hàng hóa), và đề cao nguyên tắc cùng có lợi.',
        'Trên quả địa cầu: các cung vàng là dòng vốn từ Hàn Quốc, Singapore, Nhật Bản, Đài Loan, Hồng Kông, Trung Quốc… vào Việt Nam.',
      ),
      notes(
        'Vốn FDI thực hiện tăng gần gấp đôi: 14,5 tỷ USD (2015) → 27,62 tỷ USD (2025), cao nhất 5 năm. 9 tháng 2026 vốn đăng ký đạt 50,36 tỷ USD, tăng 76,4%.',
        'Lũy kế đến hết 2025: 45.416 dự án, 529,6 tỷ USD vốn đăng ký; Hàn Quốc dẫn đầu (94,6 tỷ USD), Singapore thứ hai (89,8 tỷ USD). 82,8% vốn thực hiện năm 2025 đổ vào chế biến, chế tạo — tức khâu sản xuất của chuỗi giá trị.',
      ),
      notes(
        'Khu vực FDI luôn chiếm khoảng 70–74% xuất khẩu; năm 2025 vọt lên 77,3% và 9 tháng 2026 là 80,7%.',
        'Ý nghĩa: “Made in Vietnam” phần lớn là hàng của doanh nghiệp vốn nước ngoài.',
      ),
      notes(
        'Hai khu vực, hai cán cân: năm 2025 khu vực FDI xuất siêu 49,46 tỷ USD, khu vực trong nước nhập siêu 29,43 tỷ USD. 9 tháng 2026 khoảng cách còn rộng hơn.',
        'Khoảng 90% nhập khẩu là đầu vào sản xuất — dấu hiệu của mô hình gia công, lắp ráp.',
      ),
      notes(
        'Đánh giá theo quan điểm lịch sử – cụ thể: FDI đóng góp ~20% GDP, ~50% giá trị sản xuất công nghiệp, ~5 triệu việc làm — đó là vai trò tích cực thật.',
        'Nhưng chính Cục Đầu tư nước ngoài thừa nhận nhiều dự án vẫn chủ yếu gia công, lắp ráp, tỷ lệ nội địa hóa thấp. Không quy chụp FDI là “bóc lột”; vấn đề là vị trí của ta trong chuỗi.',
        'Chuyển ý: “Vậy cụ thể, trong một sản phẩm, Việt Nam giữ lại bao nhiêu?”',
      ),
    ]
    const labels = ['Biểu hiện mới 3 — xuất khẩu tư bản', 'Vốn FDI thực hiện 2015–2025', 'FDI chiếm ~77–81% xuất khẩu', 'Hai khu vực, hai cán cân', 'FDI: đóng góp và giới hạn']
    const secs = [50, 50, 35, 40, 50]
    panels.forEach((p, i) =>
      engine.addStation({
        id: `fdi-${i}`,
        chapter: 4,
        label: labels[i],
        y: () => docTop(p) - window.innerHeight * 0.18,
        seconds: secs[i],
        notes: stationNotes[i],
      }),
    )

    // nhãn quốc gia bám theo quả địa cầu
    const hubLabels = Array.from(el.querySelectorAll<HTMLElement>('[data-hub]'))
    const vnLabel = el.querySelector('[data-hub-vn]') as HTMLElement
    engine.onFrame(() => {
      const on = !!globe && stage?.state?.mode === 'fdi'
      hubLabels.forEach((l, i) => {
        if (!on || !globe) return void (l.style.opacity = '0')
        const h = HUBS_IN[i]
        const s = globe.project(h.lat, h.lon)
        l.style.transform = `translate(${s.x}px, ${s.y}px) translate(10px, -50%)`
        l.style.opacity = s.front ? '1' : '0'
      })
      if (on && globe) {
        const s = globe.project(16.2, 106.5)
        vnLabel.style.transform = `translate(${s.x}px, ${s.y}px) translate(10px, -50%)`
        vnLabel.style.opacity = '1'
      } else vnLabel.style.opacity = '0'
    })
  },
}

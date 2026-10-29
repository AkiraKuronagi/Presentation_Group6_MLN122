import gsap from 'gsap'
import { FDI, SCALE } from '../content/data'
import { HUBS_IN } from '../content/geo'
import { photo } from '../content/images'
import { reduceMotion, type Slide } from '../core/deck'
import { VN_PLACES } from './intro'
import { count, nf, notes, refs, source } from './util'

// ─── 4. Tháp quy mô: tích tụ & tư bản tài chính ──────────────────────
const TOWER_LABELS = [
  { id: 'vn', v: SCALE.vnGdp2025, d: 1, t: 'GDP Việt Nam 2025', cls: 'lo' },
  { id: 'apple', v: SCALE.appleRevenueFY2025, d: 1, t: 'Doanh thu Apple, năm TC 2025', cls: '' },
  { id: 'top100', v: SCALE.top100Revenue2025, d: 0, t: 'Doanh thu 100 TNC phi tài chính lớn nhất', cls: '' },
  { id: 'blackrock', v: SCALE.blackrockAum2025, d: 0, t: 'Tài sản BlackRock quản lý hộ', cls: 'hi' },
]

export const towers: Slide = {
  id: 'quy-mo',
  title: 'Đế chế lớn hơn quốc gia',
  seconds: 50,
  gl: { scene: 'towers', mode: 'rise', x: 1330, y: 600, p: 1, speed: 0.32 },
  bg: photo('finance', { dim: 0.86, pos: '50% 60%' }),
  labels: TOWER_LABELS.map((l, i) => ({
    at: l.id,
    align: (['right', 'left', 'right', 'left'] as const)[i],
    dy: -14,
    minP: [0.12, 0.2, 0.7, 0.8][i],
    html: `<b class="${l.cls}">${nf(l.v, l.d)}</b><i>${l.t}</i>`,
  })),
  html: () => `
    <div class="col">
      <p class="k"><b>04</b>Biểu hiện mới 1 · 2</p>
      <h2 class="h h--m" data-in>Đế chế <em>lớn hơn</em><br />cả một quốc gia</h2>
      <p class="lead" data-in>tỷ USD · mỗi lát tháp = một GDP Việt Nam năm 2025</p>
      <div class="cards" data-in>
        <div class="card"><b>TNC + “hệ thống gia công”</b><span>độc quyền dưới dạng mới</span></div>
        <div class="card"><b>“Chế độ ủy nhiệm”</b><span>số ít định chế chi phối vốn của số đông</span></div>
      </div>
      <p class="note" data-in>Tài sản quản lý là số tồn, GDP là số dòng — đặt cạnh nhau chỉ để hình dung quy mô.</p>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục III.1; ${refs('wir2026', 'apple-10k', 'blackrock', 'wb-gdp')}`)}`,
  notes: notes(
    'Bốn cái tháp trên màn hình dùng chung một thước đo: mỗi tầng tháp bằng cả GDP của Việt Nam năm 2025, khoảng 514,7 tỷ USD. Doanh thu một năm của Apple đã khoảng 416,2 tỷ USD, gần bằng những gì cả nước mình làm ra trong một năm. 100 tập đoàn phi tài chính lớn nhất thế giới thu về khoảng 12.677 tỷ USD. Riêng quỹ BlackRock đang giữ hộ khoảng 14.042 tỷ USD tiền của nhà đầu tư, gấp khoảng 27 lần GDP Việt Nam.',
    'Lưu ý một chút: tiền quỹ giữ hộ là số tích góp lại, còn GDP là số làm ra trong một năm, nên đặt cạnh nhau chỉ để dễ hình dung độ lớn. Hai con số này ứng với hai biểu hiện mới đầu tiên: tập đoàn lớn cùng mạng lưới gia công của nó, và chế độ ủy nhiệm, khi vài quỹ lớn cầm tiền của rất nhiều nhà đầu tư.',
    'Nếu bị hỏi về Apple: nhóm chỉ lấy Apple làm ví dụ cho cách thuê ngoài, theo chính báo cáo của công ty, không đánh giá riêng doanh nghiệp nào. Con số gấp 27 lần GDP là nhóm tự tính.',
  ),
}

// ─── 5. FDI: xuất khẩu tư bản vào Việt Nam ──────────────────────────
const SW = 720
const SH = 170
const spark = () => {
  const v = FDI.disbursed
  const max = 30
  const pts = v.map((y, i) => [(i / (v.length - 1)) * SW, SH - (y / max) * SH] as const)
  return { d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '), pts }
}

export const fdi: Slide = {
  id: 'fdi',
  title: 'Dòng vốn FDI',
  seconds: 50,
  gl: { scene: 'globe', mode: 'fdi', x: 1390, y: 560, p: 1, speed: 0.4 },
  labels: [
    ...HUBS_IN.slice(0, 6).map((h) => ({ at: `${h.lat},${h.lon}`, html: h.name, cls: 'hub', dy: h.labelDy ?? 0, align: h.labelAlign })),
    ...VN_PLACES.map((p) => ({ ...p, cls: 'vn small' })),
  ],
  html: () => {
    const s = spark()
    const [lx, ly] = s.pts[s.pts.length - 1]
    return `
    <div class="col">
      <p class="k"><b>05</b>Biểu hiện mới 3 · Xuất khẩu tư bản</p>
      <h2 class="h h--m" data-in>Vốn <em>chảy vào</em><br />Việt Nam</h2>
      <div class="hero-num" data-in>
        <div class="big big--gold">${count(FDI.disbursed[10], 2)}<small>tỷ USD</small></div>
        <p>vốn FDI thực hiện năm 2025 — cao nhất 5 năm</p>
      </div>
      <svg class="spark" viewBox="-10 -30 ${SW + 120} ${SH + 64}" data-in aria-label="Vốn FDI thực hiện 2015–2025">
        <path class="spark__grid" d="M0 ${SH} H${SW}" />
        <path data-draw class="spark__line" d="${s.d}" />
        <circle cx="${lx}" cy="${ly}" r="7" class="spark__dot" />
        <text x="0" y="${s.pts[0][1] - 14}" class="spark__t">${nf(FDI.disbursed[0], 1)}</text>
        <text x="${lx + 14}" y="${ly + 6}" class="spark__t spark__t--hi">${nf(FDI.disbursed[10], 2)}</text>
        <text x="0" y="${SH + 30}" class="spark__t spark__t--dim">2015</text>
        <text x="${SW}" y="${SH + 30}" text-anchor="end" class="spark__t spark__t--dim">2025</text>
      </svg>
      <div class="row" data-in>
        <div class="stat"><div class="stat__v">${nf(FDI.stock2025.registered, 1)}<small>tỷ USD</small></div><div class="stat__l">vốn đăng ký lũy kế · ${nf(FDI.stock2025.projects)} dự án</div></div>
        <div class="stat stat--red"><div class="stat__v">${nf(FDI.manufacturingShare2025, 1)}<small>%</small></div><div class="stat__l">vốn thực hiện 2025 vào chế biến, chế tạo</div></div>
      </div>
    </div>
    ${source(refs('nso-series', 'nso-fdi-2025', 'fia-2025', 'gt-ktct') + ', Ch.4 mục III.1')}`
  },
  notes: notes(
    'Biểu hiện mới thứ ba là xuất khẩu tư bản, tức là đem vốn ra nước ngoài đầu tư. Giáo trình nói nó thay đổi ở ba chỗ. Đổi chiều: giờ chủ yếu là các nước giàu đầu tư qua lại với nhau. Đổi người làm: chủ yếu là các tập đoàn xuyên quốc gia. Đổi cách làm: đầu tư đi cùng với bán hàng hóa và dịch vụ. Và chuyện hai bên cùng có lợi được coi trọng hơn.',
    'Ở Việt Nam, vốn chủ yếu đến từ Hàn Quốc, Singapore, Nhật Bản, Đài Loan, Hồng Kông và Trung Quốc. Vốn FDI giải ngân tăng gần gấp đôi, từ 14,5 tỷ USD năm 2015 lên 27,62 tỷ USD năm 2025, cao nhất trong năm năm. Tính đến hết năm 2025, Việt Nam có 45.416 dự án, tổng vốn đăng ký 529,6 tỷ USD. Và 82,8% số vốn giải ngân năm 2025 đổ vào nhà máy chế biến, chế tạo, tức là khâu sản xuất trong chuỗi.',
  ),
}

// ─── 6. FDI trong xuất khẩu: đóng góp & giới hạn ─────────────────────
const R = 190
const C = 2 * Math.PI * R
const bal = (label: string, v: number, max: number) =>
  `<div class="bal__row"><span>${label}</span><div class="bal__track"><i class="${v >= 0 ? 'pos' : 'neg'}" style="--w:${(Math.abs(v) / max) * 50}%"></i></div><b class="${v >= 0 ? 'hi' : 'lo'}">${v >= 0 ? '+' : '−'}${nf(Math.abs(v), 2)}</b></div>`

export const fdiShare: Slide = {
  id: 'fdi-xuat-khau',
  title: 'FDI trong xuất khẩu',
  seconds: 55,
  bg: photo('industrial-park', { dim: 0.8 }),
  html: () => `
    <p class="k"><b>06</b>Khu vực FDI trong nền kinh tế</p>
    <h2 class="h h--m" data-in>FDI nắm <em>hơn 3/4</em> xuất khẩu</h2>
    <div class="share">
      <figure class="gauge" data-in>
        <svg viewBox="0 0 440 440" aria-hidden="true">
          <circle cx="220" cy="220" r="${R}" class="gauge__bg" />
          <circle cx="220" cy="220" r="${R}" class="gauge__fg" data-gauge="${FDI.exportShare[10]}" style="stroke-dasharray:${C};stroke-dashoffset:${C}" />
        </svg>
        <div class="gauge__c"><b>${count(FDI.exportShare[10], 1)}<small>%</small></b><span>kim ngạch xuất khẩu 2025</span><span class="gauge__sub">9 tháng 2026: <b>${nf(FDI.exportShare9m2026, 1)}%</b></span></div>
      </figure>
      <div class="bal" data-in>
        <p class="bal__h">Cán cân thương mại · tỷ USD</p>
        <p class="bal__y">2025</p>
        ${bal('Khu vực FDI', FDI.balance2025.fdi, 50)}
        ${bal('Khu vực trong nước', FDI.balance2025.domestic, 50)}
        <p class="bal__y">9 tháng 2026</p>
        ${bal('Khu vực FDI', FDI.balance9m2026.fdi, 50)}
        ${bal('Khu vực trong nước', FDI.balance9m2026.domestic, 50)}
      </div>
    </div>
    <div class="twin" data-in>
      <div class="twin__a"><b>Đóng góp</b>~${FDI.role.gdp}% GDP · ~${FDI.role.industry}% giá trị SX công nghiệp · ~${FDI.role.workersM} triệu việc làm</div>
      <div class="twin__b"><b>Giới hạn</b>giá trị gia tăng nội địa thấp · liên kết với DN trong nước lỏng lẻo</div>
    </div>
    ${source(refs('nso-series', 'nso-2025', 'nso-9m2026', 'fia-2026', 'nso-fdi-2025'))}`,
  enter(el) {
    const g = el.querySelector<SVGCircleElement>('[data-gauge]')!
    const target = C * (1 - +g.dataset.gauge! / 100)
    gsap.fromTo(g, { strokeDashoffset: C }, { strokeDashoffset: target, duration: reduceMotion ? 0 : 1.8, delay: 0.5, ease: 'expo.out' })
    gsap.fromTo(el.querySelectorAll('.bal__track i'), { scaleX: 0 }, { scaleX: 1, duration: reduceMotion ? 0 : 1.1, delay: 0.7, stagger: 0.12, ease: 'expo.out' })
  },
  notes: notes(
    'Doanh nghiệp vốn nước ngoài đang nắm hơn ba phần tư hàng xuất khẩu của Việt Nam: 77,3% năm 2025, và 80,7% trong chín tháng đầu năm 2026. Nghĩa là phần lớn hàng ghi “Made in Vietnam” là do công ty nước ngoài làm ra.',
    'Hai bên còn ngược nhau về chuyện mua bán với nước ngoài. Năm 2025, khối FDI bán ra nhiều hơn mua vào 49,46 tỷ USD, còn doanh nghiệp trong nước thì mua vào nhiều hơn bán ra 29,43 tỷ USD. Chín tháng năm 2026, doanh nghiệp trong nước nhập siêu 34,28 tỷ USD, còn phần dư của khối FDI giảm xuống 14,86 tỷ USD.',
    'Công bằng mà nói, FDI có đóng góp thật: khoảng 20% GDP, khoảng một nửa giá trị sản xuất công nghiệp, và khoảng 5 triệu việc làm. Nhưng theo Cục Thống kê, phần giá trị ở lại trong nước của nhiều dự án FDI còn thấp, và họ còn ít làm ăn với doanh nghiệp Việt. Vấn đề không phải FDI tốt hay xấu, mà là Việt Nam đang đứng ở khâu nào trong chuỗi.',
    'Nếu bị hỏi: nhóm không nói FDI là “bóc lột”; vấn đề là vị trí của mình trong chuỗi.',
  ),
}

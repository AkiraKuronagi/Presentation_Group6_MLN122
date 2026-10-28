import gsap from 'gsap'
import { ELECTRONICS, SCALE, TEXTILE } from '../content/data'
import { photo } from '../content/images'
import { reduceMotion, type Slide } from '../core/deck'
import { HOOK_ANSWER, HOOK_OPTIONS, hookVotes } from './intro'
import { count, nf, notes, refs, source } from './util'

// ─── 8. Container: xuất lớn — nhập còn lớn hơn ──────────────────────
const yrs = ELECTRONICS.years
export const containers: Slide = {
  id: 'container',
  title: 'Xuất – nhập điện tử',
  seconds: 40,
  gl: { scene: 'containers', mode: 'stack', x: 1300, y: 610, p: 1, speed: 0.3 },
  labels: [
    ...yrs.map((y) => ({ at: `y${y}`, html: `<b>${y}</b>`, align: 'center' as const, dy: 34, minP: 0.05 })),
    ...yrs.flatMap((y, i) => [
      { at: `x${y}`, html: `<b class="hi">${nf(ELECTRONICS.exports[i], 1)}</b>`, align: 'above' as const, dx: -10, minP: [0.15, 0.45, 0.75][i] },
      { at: `n${y}`, html: `<b class="blue">${nf(ELECTRONICS.imports[i], 1)}</b>`, align: 'above' as const, dx: 10, minP: [0.3, 0.6, 0.92][i] },
    ]),
  ],
  html: () => `
    <div class="col">
      <p class="k"><b>08</b>Biểu hiện mới 4 · Chuỗi giá trị toàn cầu</p>
      <h2 class="h h--m" data-in>Xuất <em>107,7</em> —<br />nhập <em class="b">150,7</em></h2>
      <p class="lead" data-in>tỷ USD năm 2025 · máy vi tính, sản phẩm điện tử &amp; linh kiện</p>
      <div class="chips" data-in>
        <span class="chip"><i class="sw sw--gold"></i>Xuất khẩu</span>
        <span class="chip"><i class="sw sw--blue"></i>Nhập khẩu</span>
        <span class="chip"><b>1 container</b> = 10 tỷ USD</span>
      </div>
      <div class="stat stat--blue" data-in style="margin-top:46px"><div class="stat__v">${count(ELECTRONICS.capitalGoodsImportShare2025, 1)}<small>%</small></div><div class="stat__l">kim ngạch nhập khẩu 2025 là tư liệu sản xuất<br />— nhập linh kiện về lắp ráp rồi xuất đi</div></div>
    </div>
    ${source(`${refs('nso-dientu', 'tttctt-2026', 'nso-2025')} · số liệu chưa gồm nhóm điện thoại`)}`,
  notes: notes(
    'Biểu hiện mới thứ 4: phân chia thị trường thế giới — hôm nay diễn ra qua <b>chuỗi giá trị toàn cầu</b> (nhóm vận dụng).',
    'Số liệu Cục Thống kê, nhóm máy vi tính – điện tử – linh kiện (chưa gồm điện thoại): xuất khẩu 107,7 tỷ USD năm 2025, nhưng nhập khẩu cùng nhóm 150,7 tỷ USD. 2016: xuất 18,5 – nhập 27,8; 2024: xuất 72,6 – nhập 107,1.',
    'Tư liệu sản xuất chiếm 93,6% kim ngạch nhập khẩu năm 2025 — phù hợp với mô hình nhập linh kiện, nguyên liệu để lắp ráp, xuất khẩu (tỷ trọng này cũng là đặc điểm chung của nền kinh tế đang công nghiệp hóa).',
    'Ý nghĩa: kim ngạch lớn chưa chắc phần giữ lại lớn.',
  ),
}

// ─── 9. Điện thoại tách lớp ──────────────────────────────────────────
const LAYERS: Array<{ key: string; name: string; tag: string; v: 'hi' | 'lo' | 'mid' }> = [
  { key: 'glass', name: 'Kính cường lực', tag: 'vật liệu', v: 'mid' },
  { key: 'display', name: 'Màn hình OLED', tag: 'công nghệ lõi', v: 'hi' },
  { key: 'frame', name: 'Khung · lắp ráp · kiểm thử', tag: 'gia công', v: 'lo' },
  { key: 'board', name: 'Chip xử lý · bộ nhớ', tag: 'thiết kế · bằng sáng chế', v: 'hi' },
  { key: 'battery', name: 'Pin', tag: 'linh kiện', v: 'mid' },
  { key: 'camera', name: 'Cụm camera', tag: 'cảm biến', v: 'hi' },
  { key: 'back', name: 'Vỏ · đóng gói', tag: 'gia công', v: 'lo' },
]

export const phoneExplode: Slide = {
  id: 'tach-lop',
  title: 'Tách lớp điện thoại',
  seconds: 30,
  gl: { scene: 'phone', mode: 'chain', x: 1180, y: 560, p: 0.52, speed: 0.3 },
  labels: LAYERS.map((l, i) => ({ at: `${l.key}@${(-0.42 + i * 0.14).toFixed(2)}`, minP: 0.3, html: `${l.name}<span class="tag ${l.v}">${l.tag}</span>` })),
  html: () => `
    <div class="col col--narrow">
      <p class="k"><b>09</b>Tách lớp một chiếc điện thoại</p>
      <h2 class="h h--m" data-in>Mỗi linh kiện —<br /><em>một quốc gia</em></h2>
      <div class="hero-num" data-in>
        <div class="big big--gold">~80<small>%</small></div>
        <p>thương mại thế giới gắn với chuỗi giá trị do tập đoàn xuyên quốc gia điều phối</p>
      </div>
      <div class="legend" data-in>
        <span><i class="sw sw--gold"></i>công nghệ lõi</span>
        <span><i class="sw sw--red"></i>gia công · lắp ráp</span>
      </div>
    </div>
    ${source(`${refs('wir2013')} (ước tính); ${refs('apple-10k')} — minh họa mô hình thuê ngoài`)}`,
  notes: notes(
    'UNCTAD ước tính (2013): khoảng 80% thương mại thế giới gắn với chuỗi giá trị do TNC điều phối.',
    'Ví dụ trích từ báo cáo 10-K của Apple (nộp cho SEC): đối tác gia công ở nhiều nước, có Việt Nam; phần cứng gần như được lắp ráp hoàn toàn ở châu Á — minh họa mô hình thuê ngoài, KHÔNG đánh giá doanh nghiệp cụ thể. Giáo trình gọi “hệ thống gia công” là biểu hiện của độc quyền dưới dạng mới.',
    'Nhãn vàng: khâu công nghệ lõi; nhãn đỏ: gia công, lắp ráp.',
  ),
}

// ─── 10. Bản vẽ kỹ thuật: giá trị thu về ở đâu ──────────────────────
export const phoneBlueprint: Slide = {
  id: 'ban-ve',
  title: 'Giá trị nằm ở tri thức',
  seconds: 25,
  gl: { scene: 'phone', mode: 'chain', x: 1180, y: 560, p: 0.76, speed: 0.22 },
  labels: [
    { at: 'board@0.3', minP: 0.6, html: '<b class="hi">Thiết kế chip · bằng sáng chế</b><i>lao động phức tạp · độc quyền công nghệ</i>' },
    { at: 'display@-0.05', minP: 0.6, html: '<b class="hi">Công nghệ màn hình</b><i>tri thức · sở hữu trí tuệ</i>' },
    { at: 'frame@-0.4', minP: 0.6, html: '<b class="lo">Lắp ráp · kiểm thử</b><i>giá trị được tạo ra — nhưng thu về ít</i>' },
  ],
  html: () => `
    <div class="col col--narrow">
      <p class="k"><b>10</b>Bản vẽ kỹ thuật</p>
      <h2 class="h h--m" data-in>Giá trị thu về nằm ở<br /><em>tri thức &amp; độc quyền</em></h2>
      <div class="cards" data-in>
        <div class="card"><b>Tạo ra</b><span>lao động trên toàn chuỗi — kể cả lắp ráp</span></div>
        <div class="card card--gold"><b>Thu về</b><span>dồn cho bên nắm công nghệ, thương hiệu</span></div>
      </div>
      <div class="stat" data-in style="margin-top:44px"><div class="stat__v">${count(SCALE.appleGrossMargin, 1)}<small>%</small></div><div class="stat__l">biên lợi nhuận gộp của Apple, năm tài chính 2025</div></div>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.4 mục I–II; ${refs('apple-10k')}`)}`,
  notes: notes(
    'Nhấn mạnh khác biệt: giá trị do lao động trên toàn chuỗi TẠO RA (kể cả lắp ráp); nhưng phần giá trị gia tăng mỗi khâu THU VỀ thì dồn về bên nắm công nghệ, thương hiệu.',
    'Hai lý do theo lý luận: (1) R&D, thiết kế là lao động phức tạp, tạo nhiều giá trị hơn trong cùng thời gian; (2) độc quyền cho phép “bán cao, mua thấp” → lợi nhuận độc quyền, phân phối lại giá trị thặng dư về hai đầu.',
    'Biên lợi nhuận gộp 46,9% lấy từ báo cáo 10-K của Apple — minh họa mức thu về của khâu thiết kế, thương hiệu.',
  ),
}

// ─── 11. Đáp án + đường cong nụ cười ────────────────────────────────
const SX = (t: number) => 70 + ((t + 1) / 2) * 760
const SY = (t: number) => 430 - 320 * Math.pow(Math.abs(t), 1.65)
const smilePath = () =>
  Array.from({ length: 61 }, (_, i) => -1 + (2 * i) / 60)
    .map((t, i) => `${i ? 'L' : 'M'}${SX(t).toFixed(1)} ${SY(t).toFixed(1)}`)
    .join(' ')

export const answer: Slide = {
  id: 'dap-an',
  title: 'Đáp án · đường cong nụ cười',
  seconds: 55,
  bg: photo('electronics', { dim: 0.86 }),
  html: () => `
    <div class="answer">
      <div>
        <p class="k"><b>11</b>Đáp án câu hỏi mở đầu</p>
        <h2 class="h h--l" data-in>Ước tính:<br /><em class="r">dưới 20 USD</em></h2>
        <div class="recap" data-in>
          ${HOOK_OPTIONS.map((o, i) => `<div class="recap__row ${i === HOOK_ANSWER ? 'is-ans' : ''}"><b>${o.k}</b><span>${o.t}</span><i><i data-rbar="${i}"></i></i><em data-rn="${i}">0</em></div>`).join('')}
        </div>
        <div class="chip chip--gold" data-in style="margin-top:34px"><b>QĐ 1018/QĐ-TTg</b> mục tiêu GTGT nội địa điện tử – bán dẫn: ${ELECTRONICS.vaTarget2030}% vào 2030</div>
      </div>
      <figure class="smile" data-in>
        <svg viewBox="0 0 900 520" aria-label="Đường cong nụ cười">
          <defs><linearGradient id="smileFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity=".22" /><stop offset="1" stop-color="var(--gold)" stop-opacity="0" /></linearGradient></defs>
          <path d="M70 470 H850" class="smile__axis" />
          <path d="M70 470 V70" class="smile__axis" />
          <text x="82" y="62" class="smile__t smile__t--dim">giá trị gia tăng thu về ↑</text>
          <text x="850" y="500" text-anchor="end" class="smile__t smile__t--dim">các khâu của chuỗi →</text>
          <path d="${smilePath()} L830 470 L70 470 Z" fill="url(#smileFill)" />
          <path data-draw d="${smilePath()}" class="smile__curve" />
          <text x="${SX(-0.86)}" y="${SY(-0.86) - 24}" class="smile__t smile__t--hi">R&amp;D · thiết kế · chip</text>
          <text x="${SX(0.86)}" y="${SY(0.86) - 24}" text-anchor="end" class="smile__t smile__t--hi">Thương hiệu · phân phối</text>
          <circle cx="${SX(0)}" cy="${SY(0)}" r="22" class="smile__pulse" />
          <circle cx="${SX(0)}" cy="${SY(0)}" r="10" class="smile__vn" />
          <text x="${SX(0)}" y="${SY(0) + 48}" text-anchor="middle" class="smile__t smile__t--lo">Lắp ráp · gia công — Việt Nam</text>
        </svg>
      </figure>
    </div>
    ${source(`ước tính của nhóm từ ${refs('nso-dientu', 'qd1018')}; khái niệm “đường cong nụ cười”: Stan Shih (~1992), ${refs('gvc2017')}`)}`,
  mount(el) {
    const render = () => {
      const v = hookVotes()
      const total = v.reduce((a, b) => a + b, 0)
      v.forEach((n, i) => {
        ;(el.querySelector(`[data-rn="${i}"]`) as HTMLElement).textContent = `${n}`
        ;(el.querySelector(`[data-rbar="${i}"]`) as HTMLElement).style.transform = `scaleX(${total ? n / total : 0})`
      })
    }
    document.addEventListener('hook:votes', render)
    render()
  },
  notes: notes(
    'Công bố: ước tính của nhóm là D — dưới 20 USD. So với kết quả bình chọn của lớp (cột bên trái).',
    'Căn cứ: Cục Thống kê (Việt Nam chủ yếu lắp ráp, linh kiện phần lớn nhập khẩu) và QĐ 1018/QĐ-TTg (mục tiêu GTGT tại Việt Nam của điện tử – bán dẫn đạt 10–15% vào 2030, tức hiện nay còn thấp hơn). Đây là ước tính có căn cứ, không phải số đo trực tiếp. Phân biệt nội địa hóa (đầu vào mua trong nước) với GTGT nội địa.',
    'Đường cong nụ cười (Stan Shih, ~1992; WTO – World Bank – OECD, 2017): biểu diễn phần giá trị gia tăng mỗi khâu THU VỀ (đo bằng giá cả), không phải nơi giá trị được TẠO RA. Hai đầu thu về nhiều nhờ lao động phức tạp và vị thế độc quyền công nghệ, thương hiệu.',
    'Giáo trình Ch.6 mục II.2 cảnh báo nguy cơ “có vị trí bất lợi và thua thiệt trong chuỗi giá trị toàn cầu” — đáy đường cong chính là vị trí đó.',
  ),
}

// ─── 12. Dệt may ─────────────────────────────────────────────────────
const MODES: Array<[string, number, string, string]> = [
  ['CMT', TEXTILE.modes.cmt, 'gia công thuần', 'red'],
  ['FOB', TEXTILE.modes.fob, 'mua nguyên liệu, sản xuất', 'gold'],
  ['ODM', TEXTILE.modes.odm, 'tự thiết kế', 'blue'],
  ['OBM', TEXTILE.modes.obm, 'thương hiệu riêng', 'fg'],
]

export const textile: Slide = {
  id: 'det-may',
  title: 'Dệt may',
  seconds: 35,
  bg: photo('garment', { dim: 0.8 }),
  html: () => `
    <p class="k"><b>12</b>Dệt may — cùng một đường cong</p>
    <h2 class="h h--m" data-in><em>${TEXTILE.sewingLabourShare}%</em> lao động —<br />chỉ <em class="r">${TEXTILE.sewingValueShare}%</em> giá trị</h2>
    <p class="lead" data-in>Khâu may dùng phần lớn lao động nhưng thu về phần nhỏ giá trị gia tăng.</p>
    <div class="stack" data-in>
      <p class="stack__h">Phương thức sản xuất của doanh nghiệp dệt may hiện nay (%)</p>
      <div class="stack__bar">${MODES.map(([k, v, , c]) => `<i class="stack__seg stack__seg--${c}" style="--v:${v}"><b>${k} ${v}%</b></i>`).join('')}</div>
      <div class="stack__keys">${MODES.map(([k, , t, c]) => `<span><i class="sw sw--${c}"></i><b>${k}</b> ${t}</span>`).join('')}</div>
    </div>
    <div class="row row--3" data-in>
      <div class="stat"><div class="stat__v">~${TEXTILE.export2025}<small>tỷ USD</small></div><div class="stat__l">xuất khẩu dệt may 2025</div></div>
      <div class="stat stat--red"><div class="stat__v">~${TEXTILE.fabricImport2025}<small>tỷ USD</small></div><div class="stat__l">vải nhập khẩu 2025</div></div>
      <div class="stat stat--blue"><div class="stat__v">${TEXTILE.coUtilisation.cptpp}% · ${TEXTILE.coUtilisation.evfta}%</div><div class="stat__l">tận dụng ưu đãi xuất xứ CPTPP · EVFTA</div></div>
    </div>
    ${source(refs('nd-dm-smile', 'nd-dm-2025', 'nd-dm-vai', 'moit-roo', 'qd1643'))}`,
  enter(el) {
    gsap.fromTo(el.querySelectorAll('.stack__seg'), { scaleX: 0 }, { scaleX: 1, duration: reduceMotion ? 0 : 0.9, delay: 0.6, stagger: 0.18, ease: 'expo.out' })
  },
  notes: notes(
    'Dệt may: khâu may dùng ~80% lao động nhưng chỉ thu về 18–20% giá trị gia tăng (chuyên gia trên Báo Nhân Dân, 2024). Phương thức hiện nay: CMT ~35%, FOB ~55%, ODM ~9%, OBM ~1% (TS Hoàng Xuân Hiệp); 10 năm trước CMT 70–80% → đang dịch chuyển lên. (Bộ Công Thương 2023 từng nêu CMT ~65% — khác phương pháp, nếu bị hỏi thì giải thích.)',
    'Nút thắt: nhập ~17 tỷ USD vải năm 2025; quy tắc xuất xứ “từ vải” (EVFTA), “từ sợi” (CPTPP) → tỷ lệ tận dụng ưu đãi chỉ ~15% (CPTPP), 30–35% (EVFTA). Đây là “luật chơi” mà người chơi lớn đặt ra — nối sang biểu hiện mới 5.',
    'Giá trị nội địa tăng thêm của dệt may ~52% (VITAS, 2025). QĐ 1643/QĐ-TTg: chuyển từ gia công sang quản lý chuỗi cung ứng, thiết kế, thương hiệu.',
  ),
}

import gsap from 'gsap'
import { CAPTURE, ELECTRONICS, TEXTILE } from '../content/data'
import { photo } from '../content/images'
import { reduceMotion, type Slide } from '../core/deck'
import { count, nf, notes, refs, source } from './util'

// ─── 7. Container: xuất lớn — nhập còn lớn hơn ──────────────────────
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
      <p class="k"><b>07</b>Biểu hiện mới 4 · Chuỗi giá trị (vận dụng)</p>
      <h2 class="h h--m" data-in>Xuất <em>107,7</em> —<br />nhập <em class="b">150,7</em></h2>
      <p class="lead" data-in>tỷ USD năm 2025 · máy vi tính, sản phẩm điện tử &amp; linh kiện</p>
      <div class="chips" data-in>
        <span class="chip"><i class="sw sw--gold"></i>Xuất khẩu</span>
        <span class="chip"><i class="sw sw--blue"></i>Nhập khẩu</span>
        <span class="chip"><b>1 container</b> = 10 tỷ USD</span>
      </div>
      <div class="stat stat--blue" data-in style="margin-top:46px"><div class="stat__v">${count(ELECTRONICS.capitalGoodsImportShare2025, 1)}<small>%</small></div><div class="stat__l">kim ngạch nhập khẩu <b>cả nước</b> 2025 là tư liệu sản xuất<br />(máy móc, nguyên liệu, linh kiện)</div></div>
      <ul class="more" data-in>
        <li>Nhập nhiều hơn xuất đã có từ 2016 (xuất ${nf(ELECTRONICS.exports[0], 1)} – nhập ${nf(ELECTRONICS.imports[0], 1)}) đến 2024 (${nf(ELECTRONICS.exports[1], 1)} – ${nf(ELECTRONICS.imports[1], 1)})</li>
        <li>Nhập linh kiện về, lắp ráp rồi xuất đi — <b>xuất được nhiều chưa chắc tạo ra nhiều giá trị trong nước</b></li>
      </ul>
    </div>
    ${source(`${refs('nso-dientu', 'tttctt-2026', 'nso-2025')} · số liệu chưa gồm nhóm điện thoại`)}`,
  notes: notes(
    'Biểu hiện mới thứ tư là phân chia thị trường thế giới; nhóm áp vào chuỗi giá trị, và ngành điện tử là ví dụ rõ nhất. Năm 2025, nhóm hàng máy tính, điện tử và linh kiện xuất khẩu 107,7 tỷ USD, nhưng nhập khẩu tới 150,7 tỷ USD. Nhập nhiều hơn xuất đã có từ năm 2016, khi xuất 18,5 và nhập 27,8 tỷ USD; năm 2024 là xuất 72,6 và nhập 107,1 tỷ USD.',
    'Năm 2025, 93,6% kim ngạch nhập khẩu của cả nước là tư liệu sản xuất, tức máy móc, nguyên liệu, linh kiện. Mình nhập linh kiện về, lắp ráp rồi xuất đi. Xuất được nhiều chưa chắc đã tạo ra nhiều giá trị trong nước.',
  ),
}

// ─── 8. Điện thoại tách lớp ──────────────────────────────────────────
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
  seconds: 40,
  gl: { scene: 'phone', mode: 'chain', x: 1180, y: 560, p: 0.52, speed: 0.3 },
  labels: LAYERS.map((l, i) => ({ at: `${l.key}@${(-0.42 + i * 0.14).toFixed(2)}`, minP: 0.3, html: `${l.name}<span class="tag ${l.v}">${l.tag}</span>` })),
  html: () => `
    <div class="col col--narrow">
      <p class="k"><b>08</b>Tách lớp một chiếc điện thoại</p>
      <h2 class="h h--m" data-in>Mỗi linh kiện —<br /><em>một quốc gia</em></h2>
      <div class="hero-num" data-in>
        <div class="big big--gold">~80<small>%</small></div>
        <p>thương mại thế giới gắn với chuỗi giá trị do tập đoàn xuyên quốc gia điều phối — ước tính của UNCTAD năm 2013</p>
      </div>
      <div class="legend" data-in>
        <span><i class="sw sw--gold"></i>công nghệ lõi</span>
        <span><i class="sw sw--red"></i>gia công · lắp ráp</span>
      </div>
      <ul class="more more--narrow" data-in>
        <li>Báo cáo 10-K của Apple: thuê đối tác gia công ở nhiều nước, trong đó có Việt Nam — giáo trình gọi là <b>“hệ thống gia công”</b></li>
        <li>Phần khó (chip, màn hình, cảm biến) ở một bên; gia công, lắp ráp, đóng gói ở bên kia</li>
      </ul>
    </div>
    ${source(`${refs('wir2013')} (ước tính); ${refs('apple-10k')} — minh họa mô hình thuê ngoài`)}`,
  notes: notes(
    'Tháo một chiếc điện thoại ra từng lớp thì mỗi linh kiện đến từ một nơi khác nhau. Năm 2013, UNCTAD, cơ quan về thương mại và phát triển của Liên Hợp Quốc, ước tính khoảng 80% thương mại thế giới gắn với chuỗi giá trị do tập đoàn xuyên quốc gia điều phối.',
    'Báo cáo năm Apple nộp cho cơ quan chứng khoán Mỹ cũng ghi họ thuê đối tác gia công ở nhiều nước, trong đó có Việt Nam. Đó chính là “hệ thống gia công” mà giáo trình nói. Phần khó như chip, màn hình, cảm biến ở một bên; gia công, lắp ráp, đóng gói ở bên kia.',
  ),
}

// ─── 9. Bản vẽ kỹ thuật: giá trị thu về ở đâu ──────────────────────
export const phoneBlueprint: Slide = {
  id: 'ban-ve',
  title: 'Giá trị nằm ở tri thức',
  seconds: 60,
  gl: { scene: 'phone', mode: 'chain', x: 1180, y: 560, p: 0.76, speed: 0.22 },
  labels: [
    { at: 'board@0.3', minP: 0.6, html: '<b class="hi">Thiết kế chip · bằng sáng chế</b><i>lao động phức tạp · độc quyền công nghệ</i>' },
    { at: 'display@-0.05', minP: 0.6, html: '<b class="hi">Công nghệ màn hình</b><i>tri thức · sở hữu trí tuệ</i>' },
    { at: 'frame@-0.4', minP: 0.6, html: '<b class="lo">Lắp ráp · kiểm thử</b><i>giá trị được tạo ra — nhưng thu về ít</i>' },
  ],
  html: () => `
    <div class="col col--narrow">
      <p class="k"><b>09</b>Bản vẽ kỹ thuật</p>
      <h2 class="h h--m" data-in>Giá trị thu về nằm ở<br /><em>tri thức &amp; độc quyền</em></h2>
      <div class="cards" data-in>
        <div class="card"><b>Tạo ra</b><span>lao động trên toàn chuỗi — kể cả lắp ráp</span></div>
        <div class="card card--gold"><b>Thu về</b><span>dồn cho bên nắm công nghệ, thương hiệu</span></div>
      </div>
      <ul class="more more--narrow" data-in>
        <li><b>Lao động phức tạp:</b> nghiên cứu, thiết kế — cùng một giờ làm tạo ra nhiều giá trị hơn</li>
        <li><b>Vị thế độc quyền:</b> bán giá cao, mua giá thấp → lợi nhuận độc quyền</li>
      </ul>
      <div class="split" data-in>
        <p class="split__h">Một iPhone 7 bán ~${CAPTURE.iphonePrice} USD, tiền chia về đâu?</p>
        <div class="split__bar"><i class="split__a" style="--v:${CAPTURE.appleShare}"><b>Apple ~${Math.round((CAPTURE.iphonePrice * CAPTURE.appleShare) / 100)} USD</b><span>~${CAPTURE.appleShare}%</span></i><i class="split__b" style="--v:${100 - CAPTURE.appleShare}"><b>Linh kiện · lắp ráp · phân phối</b><span>phần còn lại</span></i></div>
        <p class="split__n">Không tự lắp ráp, vẫn giữ phần lớn nhất nhờ công nghệ, thương hiệu — WIPO (LHQ), 2017</p>
      </div>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.2 mục I (lao động phức tạp), Ch.4 mục II.1 (giá cả, lợi nhuận độc quyền); ${refs('wipr2017', 'apple-10k')}`)}`,
  notes: notes(
    'Ở đây phải tách hai chuyện. Giá trị là do người lao động trên cả chuỗi làm ra, kể cả công nhân lắp ráp. Nhưng tiền thu về lại dồn cho bên nắm công nghệ và thương hiệu.',
    'Có hai lý do. Một, nghiên cứu, thiết kế là lao động phức tạp: cùng một giờ làm nhưng tạo ra nhiều giá trị hơn. Hai, bên nắm độc quyền thì bán được giá cao, mua được giá thấp, nên có lợi nhuận độc quyền.',
    'Ví dụ trên màn hình lấy từ báo cáo năm 2017 của WIPO, cơ quan về sở hữu trí tuệ của Liên Hợp Quốc: một chiếc iPhone 7 bán khoảng 810 USD thì Apple giữ khoảng 42%, tức khoảng 340 USD. Phần còn lại chia cho hãng làm linh kiện, nhà máy lắp ráp, vận chuyển, bán lẻ. Apple không tự lắp ráp, nhưng giữ phần lớn nhất nhờ công nghệ, thiết kế và thương hiệu.',
    'Nếu bị hỏi “42% có phải lợi nhuận độc quyền không?” — Không hẳn. Đó là phần giá bán Apple giữ lại theo cách đo của WIPO, chưa trừ hết chi phí nghiên cứu, bán hàng. Nhóm dùng nó để thấy khâu thiết kế, thương hiệu thu về rất nhiều. Số mới hơn trong báo cáo 10-K năm tài chính 2025 của Apple: biên lãi gộp mảng sản phẩm phần cứng 36,8%; cả công ty 46,9% vì mảng dịch vụ (App Store, iCloud…) lãi tới 75,4% — nhóm không dùng 46,9% vì dịch vụ không đi qua chuỗi lắp ráp.',
  ),
}

// ─── 10. Đường cong nụ cười ────────────────────────────────
const SX = (t: number) => 70 + ((t + 1) / 2) * 760
const SY = (t: number) => 430 - 320 * Math.pow(Math.abs(t), 1.65)
const smilePath = () =>
  Array.from({ length: 61 }, (_, i) => -1 + (2 * i) / 60)
    .map((t, i) => `${i ? 'L' : 'M'}${SX(t).toFixed(1)} ${SY(t).toFixed(1)}`)
    .join(' ')

export const answer: Slide = {
  id: 'duong-cong',
  title: 'Đường cong nụ cười',
  seconds: 80,
  bg: photo('electronics', { dim: 0.86 }),
  html: () => `
    <div class="answer">
      <div>
        <p class="k"><b>10</b>Việt Nam đứng ở đâu?</p>
        <h2 class="h h--m" data-in>Mục tiêu 2030:<br />GTGT tại Việt Nam<br />chỉ <em class="r">${ELECTRONICS.vaTarget2030}%</em></h2>
        <ul class="more" data-in>
          <li><b>QĐ 1018/QĐ-TTg (2024):</b> giai đoạn 2024–2030, doanh thu công nghiệp điện tử tại Việt Nam trên 225 tỷ USD/năm, giá trị gia tăng tại Việt Nam ${ELECTRONICS.vaTarget2030}%</li>
          <li><b>Cục Thống kê (2025):</b> Việt Nam “chủ yếu lắp ráp, chưa làm chủ khâu thiết kế, nghiên cứu (R&amp;D)”; phụ thuộc linh kiện nhập khẩu</li>
          <li>GTGT tính theo <b>lãnh thổ</b> (gồm cả lợi nhuận DN FDI) — khác tỷ lệ nội địa hóa</li>
          <li>Giáo trình Ch.6: <b>nguy cơ</b> “vị trí bất lợi và thua thiệt” trong chuỗi giá trị toàn cầu</li>
        </ul>
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
          <text x="${SX(0)}" y="${SY(0) + 32}" text-anchor="middle" class="smile__t smile__t--lo">Lắp ráp · gia công — điện tử Việt Nam</text>
          <text x="850" y="62" text-anchor="end" class="smile__t smile__t--dim">mô hình minh họa, không phải số đo</text>
        </svg>
      </figure>
    </div>
    ${source(`${refs('qd1018', 'nso-dientu')}; “đường cong nụ cười”: Stan Shih, nhà sáng lập Acer (đầu thập niên 1990), theo ${refs('gvc2017', 'wipr2017')}; ${refs('gt-ktct')}, Ch.6 mục II`)}`,
  notes: notes(
    'Vậy Việt Nam đứng ở đâu? Nhóm không tự đưa ra con số, mà dùng mốc của Nhà nước. Quyết định 1018 năm 2024 của Thủ tướng đặt mục tiêu giai đoạn 2024 đến 2030: doanh thu công nghiệp điện tử tại Việt Nam trên 225 tỷ USD mỗi năm, và giá trị gia tăng tại Việt Nam đạt 10 đến 15%. Tức là cứ 100 USD doanh thu của ngành, mục tiêu là 10 đến 15 USD giá trị làm ra trong nước.',
    'Còn hiện nay, Cục Thống kê viết: Việt Nam chủ yếu lắp ráp, chưa làm chủ khâu thiết kế, nghiên cứu, và phụ thuộc linh kiện nhập khẩu. Lưu ý là giá trị gia tăng “tại Việt Nam” tính theo lãnh thổ, nên có cả lợi nhuận của doanh nghiệp FDI ở Việt Nam. Nó cũng khác tỷ lệ nội địa hóa, là phần linh kiện mua được trong nước.',
    'Đường trên màn hình gọi là đường cong nụ cười, do ông Stan Shih, người sáng lập Acer, đưa ra đầu những năm 1990. Đây là hình minh họa, không phải số đo. Hai đầu cao là nghiên cứu, thiết kế và thương hiệu, phân phối; chỗ thấp ở giữa là lắp ráp, gia công, nơi ngành điện tử Việt Nam đang làm nhiều nhất. Giáo trình chương 6 cũng cảnh báo nguy cơ các nước đang phát triển có “vị trí bất lợi và thua thiệt” trong chuỗi giá trị toàn cầu.',
  ),
}

// ─── 11. Dệt may ─────────────────────────────────────────────────────
const MODES: Array<[string, number, string, string]> = [
  ['CMT', TEXTILE.modes.cmt, 'nhận vải về may', 'red'],
  ['FOB', TEXTILE.modes.fob, 'tự mua nguyên liệu, sản xuất', 'gold'],
  ['ODM', TEXTILE.modes.odm, 'tự thiết kế', 'blue'],
  ['OBM', TEXTILE.modes.obm, 'thương hiệu riêng', 'fg'],
]

export const textile: Slide = {
  id: 'det-may',
  title: 'Dệt may',
  seconds: 90,
  bg: photo('garment', { dim: 0.8 }),
  html: () => `
    <p class="k"><b>11</b>Dệt may — cùng một đường cong</p>
    <h2 class="h h--m" data-in><em>${TEXTILE.sewingLabourShare}%</em> lao động —<br />chỉ thu về <em class="r">${TEXTILE.sewingValueShare}%</em> giá trị</h2>
    <p class="lead" data-in style="max-width:none">Giá trị nội địa tăng thêm toàn ngành: <b>~${TEXTILE.domesticValueAdded2025}%</b> (2025) · chỗ vướng nhất: nguyên liệu, phải nhập vải</p>
    <div class="stack" data-in>
      <p class="stack__h">Phương thức sản xuất của ngành dệt may (%, TS Hoàng Xuân Hiệp, 2024) — 10 năm trước CMT chiếm 70–80%</p>
      <div class="stack__bar">${MODES.map(([k, v, , c]) => `<i class="stack__seg stack__seg--${c}" style="--v:${v}"><b>${k} ${v}%</b></i>`).join('')}</div>
      <div class="stack__keys">${MODES.map(([k, , t, c]) => `<span><i class="sw sw--${c}"></i><b>${k}</b> ${t}</span>`).join('')}</div>
    </div>
    <div class="row row--3" data-in>
      <div class="stat"><div class="stat__v">~${TEXTILE.export2025}<small>tỷ USD</small></div><div class="stat__l">xuất khẩu dệt may 2025</div></div>
      <div class="stat stat--red"><div class="stat__v">~${TEXTILE.fabricImport2025}<small>tỷ USD</small></div><div class="stat__l">vải nhập khẩu 2025 (số liệu Cục Hải quan)</div></div>
      <div class="stat stat--blue"><div class="stat__v">${TEXTILE.coUtilisation.cptpp}% · ${TEXTILE.coUtilisation.evfta}%</div><div class="stat__l">tỷ lệ tận dụng ưu đãi thuế quan (C/O) · CPTPP · EVFTA — vì quy tắc xuất xứ “từ sợi”, “từ vải”</div></div>
    </div>
    <p class="why" data-in style="max-width:none"><b>80% lao động – 18–20% giá trị là ước tính của chuyên gia</b> (Chủ tịch HĐQT Tổng công ty May Hưng Yên, Báo Nhân Dân 2024), không phải số thống kê: phần của khâu may trong <b>cả chuỗi</b> (trồng bông → may → phân phối). ~${TEXTILE.domesticValueAdded2025}% là số của ngành: giá trị tạo thêm trong nước trên <b>kim ngạch xuất khẩu</b> — khác mẫu số nên không mâu thuẫn.</p>
    ${source(refs('nd-dm-smile', 'nd-dm-2025', 'tcct-npl', 'moit-roo', 'qd1643'))}`,
  enter(el) {
    gsap.fromTo(el.querySelectorAll('.stack__seg'), { scaleX: 0 }, { scaleX: 1, duration: reduceMotion ? 0 : 0.9, delay: 0.6, stagger: 0.18, ease: 'expo.out' })
  },
  notes: notes(
    'Dệt may cũng tương tự. Theo ông Nguyễn Xuân Dương, Chủ tịch Tổng công ty May Hưng Yên, trên Báo Nhân Dân năm 2024, khâu may dùng khoảng 80% lao động nhưng chỉ chiếm 18 đến 20% giá trị của cả chuỗi. Đây là ước tính của chuyên gia, không phải số thống kê.',
    'Cũng trong bài báo đó, theo TS Hoàng Xuân Hiệp: cắt may thuê, gọi là CMT, còn khoảng 35%; tự mua nguyên liệu rồi sản xuất, gọi là FOB, khoảng 55%; tự thiết kế, ODM, khoảng 9%; có thương hiệu riêng, OBM, chỉ khoảng 1%. Mười năm trước CMT chiếm tới 70 đến 80%, nên ngành đang đi lên dần.',
    'Năm 2025, giá trị nội địa tăng thêm của cả ngành khoảng 52%. Con số này không mâu thuẫn với 18 đến 20%: 52% tính trên tiền xuất khẩu, còn 18 đến 20% là phần của khâu may trong cả chuỗi, từ trồng bông tới bán lẻ.',
    'Chỗ vướng nhất là nguyên liệu. Năm 2025, dệt may xuất khẩu khoảng 46 tỷ USD, nhưng riêng vải đã nhập gần 15 tỷ USD, theo Cục Hải quan. EVFTA yêu cầu hàng làm từ vải trở đi, CPTPP yêu cầu từ sợi trở đi, mới được ưu đãi thuế. Nên theo Bộ Công Thương, tỷ lệ tận dụng ưu đãi mới khoảng 15% với CPTPP và 30 đến 35% với EVFTA. Ai nắm được khâu nguyên liệu thì hưởng lợi nhiều hơn.',
    'Nguồn: 18–20% là lời ông Nguyễn Xuân Dương, Chủ tịch HĐQT Tổng công ty May Hưng Yên, trong bài “Nâng tầm giá trị dệt may” (Báo Nhân Dân, 02/01/2024; cùng bài: khâu trồng bông đến dệt nhuộm 15% lao động – 60% giá trị, khâu phân phối 5% lao động – hơn 20% giá trị); 46 tỷ USD và 52% do Hiệp hội Dệt may công bố (Báo Nhân Dân, 25/11/2025); vải gần 15 tỷ USD là số sơ bộ của Cục Hải quan (Tạp chí Công Thương, 8/2026) — Báo Nhân Dân 3/2026 có nêu “khoảng 17 tỷ USD”, nhóm dùng số Hải quan vì là số thống kê; C/O 15% và 30–35%: Bộ Công Thương, 19/11/2025.',
    'Nếu bị hỏi về số CMT: bài báo ghi “còn tới 35% các doanh nghiệp” làm cắt may thuê, tức là tính theo số doanh nghiệp, không phải theo kim ngạch; các tỷ lệ FOB, ODM, OBM nối tiếp trong cùng câu của TS Hoàng Xuân Hiệp. Các nguồn cũ hơn có bộ số khác (ví dụ gia công 65%, FOB 25%) vì khác năm và cách tính; nhóm dùng trọn một bộ số của TS Hoàng Xuân Hiệp cho thống nhất.',
  ),
}

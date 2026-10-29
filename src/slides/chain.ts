import gsap from 'gsap'
import { ELECTRONICS, SCALE, TEXTILE } from '../content/data'
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
        <li>Nhập linh kiện về, lắp ráp rồi xuất đi — <b>bán được nhiều chưa chắc giữ lại được nhiều</b></li>
      </ul>
    </div>
    ${source(`${refs('nso-dientu', 'tttctt-2026', 'nso-2025')} · số liệu chưa gồm nhóm điện thoại`)}`,
  notes: notes(
    'Biểu hiện mới thứ tư, nhóm đem áp vào chuỗi giá trị toàn cầu, và ngành điện tử là ví dụ dễ thấy nhất. Năm 2025, máy tính, đồ điện tử và linh kiện Việt Nam xuất đi 107,7 tỷ USD, nhưng phải nhập về tới 150,7 tỷ USD. Chuyện nhập nhiều hơn xuất đã có từ năm 2016, khi xuất 18,5 và nhập 27,8 tỷ USD; đến năm 2024 là xuất 72,6 và nhập 107,1 tỷ USD.',
    'Trong toàn bộ hàng nhập khẩu của cả nước năm 2025, có 93,6% là máy móc, nguyên liệu và linh kiện để sản xuất. Tức là mình nhập đồ về, lắp lại rồi xuất đi. Bán được nhiều tiền chưa chắc đã giữ lại được nhiều.',
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
    'Nếu tháo một chiếc điện thoại ra từng lớp, ta sẽ thấy mỗi linh kiện đến từ một nước khác nhau. Năm 2013, UNCTAD, cơ quan về thương mại và phát triển của Liên Hợp Quốc, ước tính khoảng 80% hàng hóa buôn bán trên thế giới đi qua các chuỗi do tập đoàn xuyên quốc gia điều khiển.',
    'Chính báo cáo hằng năm Apple gửi cơ quan chứng khoán Mỹ cũng ghi là họ thuê các đối tác ở nhiều nước làm gia công, trong đó có Việt Nam. Đây đúng là cái giáo trình gọi là “hệ thống gia công”. Phần khó như chip, màn hình, cảm biến nằm ở một bên; phần gia công, lắp ráp, đóng gói nằm ở bên kia.',
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
        <li><b>Vị thế độc quyền:</b> bán giá cao, mua giá thấp → lợi nhuận độc quyền, kéo giá trị thặng dư về phía mình</li>
      </ul>
      <div class="stat" data-in style="margin-top:32px"><div class="stat__v">${count(SCALE.appleGrossMargin, 1)}<small>%</small></div><div class="stat__l">biên lợi nhuận gộp của <b>cả công ty</b> Apple, năm TC 2025 (100 đồng doanh thu lãi gộp ${nf(SCALE.appleGrossMargin, 1)} đồng) — chỉ gợi ý mức thu về, <b>không phải</b> số đo lợi nhuận độc quyền theo giáo trình</div></div>
    </div>
    ${source(`${refs('gt-ktct')}, Ch.2 mục I (lao động phức tạp), Ch.4 mục II.1 (giá cả, lợi nhuận độc quyền); ${refs('apple-10k')}`)}`,
  notes: notes(
    'Ở đây phải tách hai chuyện cho rõ. Giá trị là do người lao động trên cả chuỗi làm ra, kể cả công nhân lắp ráp. Nhưng tiền thu về thì lại dồn về phía công ty nắm công nghệ và thương hiệu.',
    'Theo kinh tế chính trị thì có hai lý do. Một, nghiên cứu, thiết kế là lao động phức tạp: cùng một giờ làm nhưng tạo ra nhiều giá trị hơn. Hai, ai nắm độc quyền thì bán được giá cao, mua được giá thấp, nên thu được lợi nhuận độc quyền và kéo phần giá trị dôi ra, giáo trình gọi là giá trị thặng dư, về phía mình. Năm tài chính 2025, cứ 100 đồng doanh thu thì Apple còn lãi gộp 46,9 đồng. Nhưng phải nói rõ: đây là con số của cả công ty, mới trừ tiền làm ra sản phẩm, chưa trừ tiền nghiên cứu, bán hàng, quản lý, và không phải là lợi nhuận độc quyền theo giáo trình. Nhóm chỉ dùng nó để thấy khâu thiết kế và thương hiệu thu về rất nhiều.',
    'Nếu bị hỏi “46,9% có phải lợi nhuận độc quyền không?” — Không. Đó là biên lợi nhuận gộp của cả công ty, lấy từ báo cáo 10-K. Lợi nhuận độc quyền theo giáo trình là phần lợi nhuận cao hơn lợi nhuận bình quân nhờ vị thế độc quyền; muốn đo phải so với lợi nhuận bình quân, nhóm không có số đó nên chỉ dùng 46,9% để gợi ý.',
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
        <h2 class="h h--m" data-in>100 USD điện tử —<br />mục tiêu 2030<br />giữ lại <em class="r">${ELECTRONICS.vaTarget2030} USD</em></h2>
        <ul class="more" data-in>
          <li><b>QĐ 1018/QĐ-TTg (2024):</b> mục tiêu giá trị gia tăng tại Việt Nam của điện tử – bán dẫn đạt ${ELECTRONICS.vaTarget2030}% vào 2030 → <b>hiện nay còn thấp hơn</b></li>
          <li>Cục Thống kê: chủ yếu lắp ráp, linh kiện phần lớn nhập khẩu</li>
          <li><b>Cách tính:</b> giá trị xuất khẩu − phần linh kiện, nguyên liệu nhập khẩu nằm trong sản phẩm (khác tỷ lệ nội địa hóa)</li>
          <li>Đáy đường cong: vị trí bất lợi, chịu thiệt (giáo trình Ch.6)</li>
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
          <text x="${SX(0)}" y="${SY(0) + 48}" text-anchor="middle" class="smile__t smile__t--lo">Lắp ráp · gia công — Việt Nam</text>
        </svg>
      </figure>
    </div>
    ${source(`${refs('qd1018', 'nso-dientu')}; khái niệm “đường cong nụ cười”: Stan Shih (~1992), ${refs('gvc2017')}; ${refs('gt-ktct')}, Ch.6 mục II`)}`,
  notes: notes(
    'Giờ quay lại câu hỏi lúc đầu: Việt Nam đứng ở đâu? Ở đây nhóm không tự đặt ra con số, mà dùng mốc của Nhà nước. Quyết định 1018 năm 2024 của Thủ tướng đặt mục tiêu đến năm 2030, phần giá trị làm ra ở Việt Nam trong ngành điện tử – bán dẫn đạt 10 đến 15%. Nói dễ hiểu: cứ 100 USD hàng điện tử xuất đi, mục tiêu là đến năm 2030 giữ lại được 10 đến 15 USD. Đã là mục tiêu còn phải cố gắng, thì hiện nay con số còn thấp hơn. Số liệu của Cục Thống kê cũng cho thấy mình chủ yếu lắp ráp, linh kiện phần lớn phải nhập.',
    'Cách tính dễ hiểu: lấy giá bán ra nước ngoài, trừ đi tiền linh kiện, nguyên liệu mua từ nước ngoài nằm trong sản phẩm, phần còn lại là phần ở lại Việt Nam. Cái này khác với tỷ lệ nội địa hóa, tức là bao nhiêu phần linh kiện mua được ở trong nước.',
    'Đường cong trên màn hình gọi là đường cong nụ cười. Hai đầu cao là nghiên cứu, thiết kế, chip, và thương hiệu, bán hàng; chỗ thấp nhất ở giữa là lắp ráp, gia công. Việt Nam đang ở chỗ thấp nhất đó. Giáo trình chương 6 đã cảnh báo nguy cơ bị đặt vào chỗ bất lợi, chịu thiệt trong chuỗi giá trị toàn cầu, và đáy đường cong chính là chỗ đó.',
    'Nếu bị hỏi vì sao không đưa con số hiện tại: nhóm chưa tìm được số chính thức đo riêng cho ngành điện tử hiện nay, nên dùng mốc mục tiêu của Quyết định 1018; con số hiện nay thấp hơn mốc mục tiêu.',
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
      <p class="stack__h">Phương thức sản xuất của doanh nghiệp dệt may hiện nay (%) — 10 năm trước CMT chiếm 70–80%, nay ngành đang leo lên dần</p>
      <div class="stack__bar">${MODES.map(([k, v, , c]) => `<i class="stack__seg stack__seg--${c}" style="--v:${v}"><b>${k} ${v}%</b></i>`).join('')}</div>
      <div class="stack__keys">${MODES.map(([k, , t, c]) => `<span><i class="sw sw--${c}"></i><b>${k}</b> ${t}</span>`).join('')}</div>
    </div>
    <div class="row row--3" data-in>
      <div class="stat"><div class="stat__v">~${TEXTILE.export2025}<small>tỷ USD</small></div><div class="stat__l">xuất khẩu dệt may 2025</div></div>
      <div class="stat stat--red"><div class="stat__v">~${TEXTILE.fabricImport2025}<small>tỷ USD</small></div><div class="stat__l">vải nhập khẩu 2025</div></div>
      <div class="stat stat--blue"><div class="stat__v">${TEXTILE.coUtilisation.cptpp}% · ${TEXTILE.coUtilisation.evfta}%</div><div class="stat__l">tỷ lệ tận dụng ưu đãi thuế quan (C/O) · CPTPP · EVFTA — vì quy tắc xuất xứ “từ sợi”, “từ vải”</div></div>
    </div>
    <p class="why" data-in style="max-width:none"><b>Hai con số không mâu thuẫn — khác mẫu số:</b> 18–20% là phần của khâu may trong <b>cả chuỗi</b> (trồng bông → dệt nhuộm → may → phân phối); ~${TEXTILE.domesticValueAdded2025}% là giá trị tạo thêm trong nước tính trên <b>kim ngạch xuất khẩu</b> của Việt Nam.</p>
    ${source(refs('nd-dm-smile', 'nd-dm-2025', 'nd-dm-vai', 'moit-roo', 'vcci-loc', 'qd1643'))}`,
  enter(el) {
    gsap.fromTo(el.querySelectorAll('.stack__seg'), { scaleX: 0 }, { scaleX: 1, duration: reduceMotion ? 0 : 0.9, delay: 0.6, stagger: 0.18, ease: 'expo.out' })
  },
  notes: notes(
    'Ngành dệt may cũng y như vậy. Khâu may dùng khoảng 80% lao động nhưng chỉ thu về 18 đến 20% giá trị. Về cách làm: nhận vải về may rồi giao hàng, gọi là CMT, còn khoảng 35%; tự mua nguyên liệu rồi sản xuất, gọi là FOB, khoảng 55%; tự thiết kế, gọi là ODM, khoảng 9%; còn có thương hiệu riêng, gọi là OBM, chỉ khoảng 1%. Mười năm trước CMT chiếm tới 70 đến 80%, nên ngành đang leo lên dần. Năm 2025, phần giá trị tạo ra trong nước của cả ngành đạt khoảng 52%.',
    'Có hai con số dễ gây hiểu nhầm là 18 đến 20% và 52%. 18 đến 20% là phần của riêng khâu may, tính trên cả chuỗi dệt may, từ trồng bông, dệt nhuộm, may cho tới bán lẻ. Còn 52% là phần giá trị làm ra ở trong nước, tính trên tiền xuất khẩu của Việt Nam. Hai con số tính trên hai cái khác nhau nên không mâu thuẫn: mỗi đồng xuất khẩu mình giữ lại được khoảng một nửa, nhưng việc mình làm nhiều nhất là khâu may, mà khâu may chỉ chiếm khoảng một phần năm giá trị của cả chuỗi.',
    'Chỗ vướng nhất là nguyên liệu. Năm 2025, ngành xuất khẩu khoảng 46 tỷ USD nhưng phải nhập khoảng 17 tỷ USD vải. Hiệp định EVFTA đòi hàng phải làm từ khâu vải trở đi, CPTPP còn đòi từ khâu sợi, thì mới được giảm thuế. Vì vậy, với CPTPP mình chỉ được hưởng giảm thuế khoảng 15%, với EVFTA khoảng 30 đến 35%. Luật chơi này do các bên lớn đặt ra, và nó dẫn sang biểu hiện mới thứ năm.',
    'Nguồn hai con số: 18–20% là lời ông Nguyễn Xuân Dương, Chủ tịch HĐQT Tổng công ty May Hưng Yên, trên Báo Nhân Dân năm 2024 (khâu đầu 15% lao động – 60% giá trị; khâu cuối 5% lao động – hơn 20% giá trị); 52% là tỷ lệ giá trị nội địa tăng thêm của ngành năm 2025, Báo Nhân Dân năm 2025.',
    'Nếu bị hỏi về số CMT: Bộ Công Thương năm 2023 từng nêu CMT khoảng 65% vì cách tính khác; nhóm dùng một bộ số của TS Hoàng Xuân Hiệp cho thống nhất.',
  ),
}

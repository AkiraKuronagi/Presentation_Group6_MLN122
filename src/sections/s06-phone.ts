import { renderChart } from '../charts/charts'
import { ELECTRONICS, SCALE, TEXTILE } from '../content/data'
import { cite } from '../content/sources'
import { docTop, gsap, reduceMotion } from '../core/engine'
import { HOOK_ANSWER, HOOK_OPTIONS, hookVotes } from './s01-hook'
import { type Section, notes } from './types'

const LAYERS: Array<{ key: string; name: string; tag: string; v: 'hi' | 'lo' | 'mid' }> = [
  { key: 'glass', name: 'Kính cường lực', tag: 'vật liệu', v: 'mid' },
  { key: 'display', name: 'Màn hình OLED', tag: 'công nghệ lõi', v: 'hi' },
  { key: 'frame', name: 'Khung · lắp ráp · kiểm thử', tag: 'gia công', v: 'lo' },
  { key: 'board', name: 'Chip xử lý · bộ nhớ', tag: 'thiết kế · bằng sáng chế', v: 'hi' },
  { key: 'battery', name: 'Pin', tag: 'linh kiện', v: 'mid' },
  { key: 'camera', name: 'Cụm camera', tag: 'cảm biến', v: 'hi' },
  { key: 'back', name: 'Vỏ · đóng gói', tag: 'gia công', v: 'lo' },
]

/** pha → [bắt đầu, kết thúc] theo tiến độ cuộn của section */
const STEPS: Array<[number, number]> = [
  [0, 0.17],
  [0.17, 0.53],
  [0.53, 0.79],
  [0.79, 1.01],
]

export const phone: Section = {
  id: 'chuoi-gia-tri',
  chapter: { n: 5, title: 'Chuỗi giá trị toàn cầu', short: 'Chuỗi giá trị' },
  html: () => `
  <section class="sec sec--clear phone" id="chuoi-gia-tri" aria-label="Biểu hiện mới 4: chuỗi giá trị toàn cầu">
    <div class="phone__pin">
      <div class="phone__labels" data-labels aria-hidden="true">
        ${LAYERS.map((l) => `<div class="layer-label" data-layer="${l.key}"><b>${l.name}</b><span class="v-${l.v}">${l.tag}</span></div>`).join('')}
      </div>
      <div class="phone__steps">
        <div class="phone__step" data-step="0">
          <div class="chapter-tag"><span class="chapter-tag__n">05</span><span class="eyebrow">Biểu hiện mới · 4 — phân chia thị trường thế giới</span></div>
          <h3 class="display t-h2">Một thiết bị điện tử <em class="c-gold">“Made in Vietnam”</em></h3>
          <p>Năm 2025, điện tử – máy tính – linh kiện là nhóm đầu tiên xuất khẩu vượt <b>100 tỷ USD</b> (${ELECTRONICS.exportShare2025.toString().replace('.', ',')}% kim ngạch). Nhưng ta cũng <b>nhập khẩu</b> chính nhóm hàng này nhiều hơn thế:</p>
          <div class="figure" style="margin-top:6px">
            <p class="figure__title" style="font-size:var(--t-small)">Điện tử, máy tính và linh kiện (tỷ USD)</p>
            <div data-chart="elec"></div>
            <p class="cite">Nhóm “máy vi tính, sản phẩm điện tử và linh kiện” (chưa gồm nhóm điện thoại; linh kiện nhập trong nhóm này cũng phục vụ lắp ráp điện thoại). Nguồn: ${cite('nso-dientu', 'tttctt-2026')}</p>
          </div>
        </div>
        <div class="phone__step" data-step="1">
          <p class="eyebrow">Tách lớp</p>
          <h3 class="display t-h2">Mỗi linh kiện — <em>một quốc gia</em></h3>
          <p>UNCTAD ước tính (2013): khoảng <b>80% thương mại thế giới</b> gắn với chuỗi giá trị do công ty xuyên quốc gia điều phối ${cite('wir2013')}. Đây là hình thức TNC <b>phân chia thị trường và các khâu sản xuất theo không gian</b> (nhóm vận dụng).</p>
          <p>Ví dụ minh họa từ báo cáo bắt buộc của chính doanh nghiệp: một tập đoàn công nghệ Mỹ dựa vào đối tác gia công tại Trung Quốc đại lục, Ấn Độ, Nhật Bản, Hàn Quốc, Đài Loan và <b>Việt Nam</b>; phần cứng gần như được lắp ráp hoàn toàn ở châu Á. ${cite('apple-10k')}</p>
        </div>
        <div class="phone__step" data-step="2">
          <p class="eyebrow">Bản vẽ kỹ thuật</p>
          <h3 class="display t-h2">Giá trị <em class="c-gold">thu về</em> nằm ở tri thức & độc quyền — không ở ốc vít</h3>
          <p>Giá trị do lao động trên <b>toàn chuỗi</b> tạo ra — kể cả công nhân lắp ráp. Nhưng ai nắm thiết kế chip, bằng sáng chế, thương hiệu thì có vị thế độc quyền để định giá, nên <b>thu về phần lớn giá trị gia tăng</b> — tập đoàn trong ví dụ đạt biên lợi nhuận gộp ${String(SCALE.appleGrossMargin).replace('.', ',')}% ${cite('apple-10k')}.</p>
          <p class="t-small c-dim">Lý luận: R&amp;D, thiết kế là <b>lao động phức tạp</b>, tạo nhiều giá trị hơn trong cùng thời gian; còn độc quyền cho phép “bán cao, mua thấp” — phân phối lại giá trị thặng dư về hai đầu chuỗi ${cite('gt-ktct')}. Việt Nam cần chuyển <b>từ gia công, lắp ráp sang tự thiết kế, sở hữu công nghệ</b> ${cite('most-gii')}.</p>
        </div>
        <div class="phone__step" data-step="3">
          <p class="eyebrow">Đáp án câu hỏi mở đầu</p>
          <h3 class="display t-h2">Ước tính của nhóm: <em class="c-red" data-answer>${HOOK_OPTIONS.find((o) => o.k === HOOK_ANSWER)!.t}</em></h3>
          <p>Cục Thống kê: Việt Nam <b>chủ yếu lắp ráp</b>, chưa làm chủ khâu thiết kế và R&amp;D; linh kiện, bo mạch, chip phần lớn nhập khẩu ${cite('nso-dientu')}. Chiến lược bán dẫn đặt mục tiêu giá trị gia tăng tại Việt Nam của điện tử – bán dẫn đạt <b>${ELECTRONICS.vaTarget2030}%</b> vào 2030 — lộ trình nâng dần từ mức thấp hiện nay ${cite('qd1018')}.</p>
          <p class="t-small c-dim">Phân biệt: <b>tỷ lệ GTGT nội địa</b> = phần giá trị xuất khẩu do yếu tố sản xuất trong nước tạo ra; <b>tỷ lệ nội địa hóa</b> = phần đầu vào mua trong nước (điện tử ~${TEXTILE.localisation.electronics}%, dệt may ~${TEXTILE.localisation.textile}% ${cite('vcci-loc')}). Dệt may có tỷ lệ giá trị nội địa tăng thêm ~${TEXTILE.domesticValueAdded2025}% (2025) ${cite('nd-dm-2025')}.</p>
          <p class="mono t-small c-dim" data-classvote></p>
        </div>
      </div>
    </div>
  </section>`,

  mount(el, { engine, stage, phone }) {
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    stage?.zone({ scene: 'phone', mode: 'phone', range })

    renderChart(el.querySelector('[data-chart="elec"]') as HTMLElement, {
      kind: 'columns',
      categories: ELECTRONICS.years,
      series: [
        { key: 'x', label: 'Xuất khẩu', color: 'c1', values: ELECTRONICS.exports },
        { key: 'm', label: 'Nhập khẩu', color: 'c2', values: ELECTRONICS.imports },
      ],
      unit: 'tỷ USD',
      digits: 1,
      labelAt: [0, 2],
      height: 210,
    })

    const at = (f: number) => () => {
      const [s, e] = range()
      return s + (e - s) * f
    }
    const stationDefs: Array<[number, string, number, string]> = [
      [0.04, 'Một thiết bị điện tử “Made in Vietnam”', 30, notes('Biểu hiện mới thứ 4: phân chia thị trường thế giới — hôm nay diễn ra qua <b>chuỗi giá trị toàn cầu</b> (nhóm vận dụng).', 'Số liệu Cục Thống kê, nhóm máy vi tính – điện tử – linh kiện (chưa gồm điện thoại): xuất khẩu 107,7 tỷ USD năm 2025, nhưng nhập khẩu cùng nhóm 150,7 tỷ USD. 2016: xuất 18,5 – nhập 27,8; 2024: xuất 72,6 – nhập 107,1 (số 2024 lấy ở mục “Giai đoạn 2024–2025” của bài Cục Thống kê, khớp mức tăng 48,4% năm 2025).', 'Ý nghĩa: nhập linh kiện về lắp ráp rồi xuất đi — kim ngạch lớn chưa chắc phần giữ lại lớn.')],
      [0.42, 'Tách lớp: mỗi linh kiện một quốc gia', 30, notes('UNCTAD ước tính (2013): khoảng 80% thương mại thế giới gắn với chuỗi giá trị do TNC điều phối.', 'Ví dụ trích từ báo cáo 10-K của Apple (nộp cho SEC): đối tác gia công ở nhiều nước, có Việt Nam — minh họa mô hình thuê ngoài, KHÔNG đánh giá doanh nghiệp cụ thể. Giáo trình gọi “hệ thống gia công” là biểu hiện của độc quyền dưới dạng mới.', 'Nhãn vàng: khâu công nghệ lõi; nhãn đỏ: gia công, lắp ráp.')],
      [0.7, 'Bản vẽ: giá trị thu về nằm ở tri thức & độc quyền', 25, notes('Nhấn mạnh khác biệt: giá trị do lao động trên toàn chuỗi TẠO RA (kể cả lắp ráp); nhưng phần giá trị gia tăng mỗi khâu THU VỀ thì dồn về bên nắm công nghệ, thương hiệu.', 'Hai lý do theo lý luận: (1) R&D, thiết kế là lao động phức tạp, tạo nhiều giá trị hơn trong cùng thời gian; (2) độc quyền cho phép “bán cao, mua thấp” → lợi nhuận độc quyền, phân phối lại giá trị thặng dư về hai đầu.')],
      [0.93, 'Đáp án: phần ở lại Việt Nam', 35, notes('Công bố: ước tính của nhóm là D — dưới 20 USD. So với kết quả bình chọn của lớp.', 'Căn cứ: Cục Thống kê (Việt Nam chủ yếu lắp ráp, linh kiện phần lớn nhập khẩu) và QĐ 1018/QĐ-TTg (mục tiêu GTGT tại Việt Nam của điện tử – bán dẫn đạt 10–15% vào 2030, tức hiện nay còn thấp hơn). Đây là ước tính có căn cứ, không phải số đo trực tiếp.', 'Phân biệt nội địa hóa (đầu vào mua trong nước) với GTGT nội địa. Dệt may: giá trị nội địa tăng thêm ~52% (VITAS, 2025).', 'Chuyển ý: “Hiện tượng này có tên — đường cong nụ cười.”')],
    ]
    stationDefs.forEach(([f, label, sec, n], i) =>
      engine.addStation({ id: `phone-${i}`, chapter: 5, label, y: at(f), seconds: sec, notes: n }),
    )

    // kết quả bình chọn của lớp
    const cv = el.querySelector('[data-classvote]') as HTMLElement
    const showVotes = (v: number[]) => {
      const total = v.reduce((a, b) => a + b, 0)
      if (!total) return void (cv.textContent = '')
      const k = HOOK_OPTIONS.findIndex((o) => o.k === HOOK_ANSWER)
      cv.textContent = `Lớp mình: ${Math.round((v[k] / total) * 100)}% chọn đúng (${v[k]}/${total} phiếu)`
    }
    document.addEventListener('hook:votes', (e) => showVotes((e as CustomEvent<number[]>).detail))
    showVotes(hookVotes())

    const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'))
    const labels = Array.from(el.querySelectorAll<HTMLElement>('[data-layer]'))
    let cur = -1
    const show = (i: number) => {
      if (i === cur) return
      steps.forEach((s, k) => {
        if (k === i) gsap.fromTo(s, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.6, ease: 'power3.out', overwrite: true })
        else if (k === cur) gsap.to(s, { autoAlpha: 0, y: -20, duration: reduceMotion ? 0 : 0.3, overwrite: true })
        else gsap.set(s, { autoAlpha: 0 })
      })
      cur = i
    }

    engine.onFrame((y) => {
      const [s, e] = range()
      const p = Math.min(1, Math.max(0, (y - s) / (e - s)))
      const i = STEPS.findIndex(([a, b]) => p >= a && p < b)
      show(i < 0 ? (p >= 1 ? 3 : 0) : i)
      // nhãn lớp: hiện khi đã tách lớp, ẩn ở pha cuối
      const vis = p > 0.3 && p < 0.8 && !!phone && stage?.state?.scene === 'phone'
      labels.forEach((l, k) => {
        if (!vis || !phone) return void (l.style.opacity = '0')
        // trải nhãn theo chiều dọc để không chồng nhau: lớp trước ở cao, lớp sau ở thấp
        const pt = phone.project(l.dataset.layer!, 0.46 - k * 0.135)
        const appear = Math.min(1, Math.max(0, (p - 0.3 - k * 0.025) / 0.06))
        l.style.transform = `translate(${pt.x + 8}px, ${pt.y}px) translateY(-50%)`
        l.style.opacity = String(appear)
      })
    })
  },
}

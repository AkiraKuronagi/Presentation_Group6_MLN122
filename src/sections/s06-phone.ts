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
          <h3 class="display t-h2">Một chiếc điện thoại <em class="c-gold">“Made in Vietnam”</em></h3>
          <p>Điện thoại, máy tính, linh kiện điện tử là nhóm hàng xuất khẩu lớn nhất; khối FDI chiếm phần lớn kim ngạch, xuất khẩu chủ yếu theo hình thức <b>gia công cho nhãn hàng nước ngoài</b>. ${cite('vgp-930')}</p>
          <p class="cite">Cuộn tiếp để “mổ xẻ” chiếc điện thoại →</p>
        </div>
        <div class="phone__step" data-step="1">
          <p class="eyebrow">Tách lớp</p>
          <h3 class="display t-h2">Mỗi linh kiện — <em>một quốc gia</em></h3>
          <p>Chuỗi giá trị toàn cầu do các công ty xuyên quốc gia điều phối chiếm khoảng <b>80% thương mại thế giới</b>. ${cite('wir2013')}</p>
          <p>Ví dụ minh họa từ báo cáo bắt buộc của chính doanh nghiệp: một tập đoàn công nghệ Mỹ dựa vào đối tác gia công tại Trung Quốc đại lục, Ấn Độ, Nhật Bản, Hàn Quốc, Đài Loan và <b>Việt Nam</b>; phần cứng gần như được lắp ráp hoàn toàn ở châu Á. ${cite('apple-10k')}</p>
        </div>
        <div class="phone__step" data-step="2">
          <p class="eyebrow">Bản vẽ kỹ thuật</p>
          <h3 class="display t-h2">Giá trị nằm ở <em class="c-gold">tri thức</em>, không ở ốc vít</h3>
          <p>Thiết kế chip, phần mềm, bằng sáng chế, thương hiệu do công ty mẹ nắm giữ — cũng tập đoàn ấy đạt <b>biên lợi nhuận gộp ${String(SCALE.appleGrossMargin).replace('.', ',')}%</b>. ${cite('apple-10k')}</p>
          <p>Việt Nam có tỷ trọng xuất khẩu công nghệ cao thuộc nhóm đầu thế giới nhưng thu nhập từ sở hữu trí tuệ còn thấp — cần chuyển <b>từ gia công, lắp ráp sang tự thiết kế, sở hữu công nghệ</b>. ${cite('most-gii')}</p>
        </div>
        <div class="phone__step" data-step="3">
          <p class="eyebrow">Đáp án câu hỏi mở đầu</p>
          <h3 class="display t-h2">Phần ở lại Việt Nam: <em class="c-red" data-answer>${HOOK_OPTIONS.find((o) => o.k === HOOK_ANSWER)!.t}</em></h3>
          <p>Tỷ lệ nội địa hóa ngành điện tử chỉ khoảng <b>${TEXTILE.localisation.electronics}%</b>, so với ${TEXTILE.localisation.textile}% của dệt may ${cite('vcci-loc')}. Ngay cả mục tiêu đến 2030, giá trị gia tăng tại Việt Nam của ngành điện tử và bán dẫn cũng chỉ đặt ở mức <b>${ELECTRONICS.vaTarget2030}%</b> ${cite('qd1018')}.</p>
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

    const at = (f: number) => () => {
      const [s, e] = range()
      return s + (e - s) * f
    }
    const stationDefs: Array<[number, string, number, string]> = [
      [0.04, 'Một chiếc điện thoại “Made in Vietnam”', 35, notes('Biểu hiện mới thứ 4: phân chia thị trường thế giới — hôm nay diễn ra qua <b>chuỗi giá trị toàn cầu</b>.', 'Giới thiệu chiếc điện thoại: mặt lưng ghi thiết kế ở nước ngoài, linh kiện từ nhiều quốc gia, lắp ráp tại Việt Nam.')],
      [0.42, 'Tách lớp: mỗi linh kiện một quốc gia', 50, notes('UNCTAD: chuỗi giá trị do TNC điều phối chiếm khoảng 80% thương mại toàn cầu.', 'Ví dụ trích từ báo cáo 10-K của Apple (nguồn chính thức nộp cho SEC): đối tác gia công tại nhiều nước, trong đó có Việt Nam. Đây là “hệ thống gia công” mà giáo trình gọi là độc quyền dưới dạng mới.', 'Chỉ vào nhãn: các lớp màu vàng là khâu giá trị cao (chip, màn hình, camera), lớp đỏ là gia công, lắp ráp.')],
      [0.7, 'Bản vẽ: giá trị nằm ở tri thức', 45, notes('Vật liệu tan đi, chỉ còn bản vẽ: thứ tạo ra phần lớn giá trị là tri thức — thiết kế, bằng sáng chế, phần mềm, thương hiệu.', 'Bộ KH&CN (từ kết quả GII 2026): xuất khẩu công nghệ cao rất lớn nhưng thu nhập từ sở hữu trí tuệ thấp.')],
      [0.93, 'Đáp án: phần ở lại Việt Nam', 45, notes('Công bố đáp án D — dưới 20 USD. So với kết quả bình chọn của lớp.', 'Bằng chứng: nội địa hóa điện tử ~15–18% (dệt may 45–48%); mục tiêu GTGT tại Việt Nam của điện tử – bán dẫn đến 2030 chỉ 10–15% (QĐ 1018/QĐ-TTg).', 'Chuyển ý: “Hiện tượng này có tên — đường cong nụ cười.”')],
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
        const pt = phone.project(l.dataset.layer!)
        const appear = Math.min(1, Math.max(0, (p - 0.3 - k * 0.025) / 0.06))
        l.style.transform = `translate(${pt.x + 8}px, ${pt.y}px) translateY(-50%)`
        l.style.opacity = String(appear)
      })
    })
  },
}

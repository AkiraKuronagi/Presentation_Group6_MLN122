import { SKILLS, TEXTILE } from '../content/data'
import { cite } from '../content/sources'
import { docTop, gsap, reduceMotion } from '../core/engine'
import { type Section, notes } from './types'

type Mode = 'dien-tu' | 'det-may'

const STAGES: Record<Mode, string[][]> = {
  'dien-tu': [
    ['R&D', 'thiết kế chip'],
    ['Phần mềm', 'bằng sáng chế'],
    ['Linh kiện lõi', 'chip, màn hình'],
    ['Lắp ráp', 'kiểm thử'],
    ['Logistics', 'phân phối'],
    ['Marketing', 'bán hàng'],
    ['Thương hiệu', 'dịch vụ'],
  ],
  'det-may': [
    ['Thiết kế', 'xu hướng (ODM)'],
    ['Sợi', 'dệt vải'],
    ['Nhuộm', 'hoàn tất'],
    ['Cắt – may', 'gia công (CMT)'],
    ['Đóng gói', 'vận chuyển (FOB)'],
    ['Phân phối', 'bán lẻ'],
    ['Thương hiệu', 'riêng (OBM)'],
  ],
}

const NOTES: Record<Mode, Array<{ h: string; p: string }>> = {
  'dien-tu': [
    { h: 'Hai đầu — TNC nắm giữ', p: `R&D, thiết kế chip, phần mềm, thương hiệu: nơi thu về phần lớn giá trị gia tăng nhờ sở hữu trí tuệ và vị thế độc quyền của công ty mẹ. ${cite('gvc2017')}` },
    { h: 'Đáy — Việt Nam đang đứng', p: `Lắp ráp, kiểm thử: nội địa hóa ngành điện tử chỉ ~${TEXTILE.localisation.electronics}%. ${cite('vcci-loc')}` },
    { h: 'Lối ra — leo lên hai đầu', p: `Mục tiêu 2030: ≥100 doanh nghiệp thiết kế chip; đào tạo ≥${new Intl.NumberFormat('vi-VN').format(SKILLS.chipTotalTarget)} nhân lực bán dẫn. ${cite('qd1018', 'qd1017')}` },
  ],
  'det-may': [
    { h: 'Hai đầu — thu về giá trị cao', p: `Sợi, dệt, nhuộm và thương hiệu, phân phối thu về phần lớn giá trị gia tăng với ít lao động. Giá trị nội địa tăng thêm toàn ngành ~${TEXTILE.domesticValueAdded2025}% (2025). ${cite('nd-dm-smile', 'nd-dm-2025')}` },
    { h: 'Đáy — 80% lao động, 18–20% giá trị thu về', p: `Khâu may dùng ~${TEXTILE.sewingLabourShare}% lao động nhưng chỉ thu về ${TEXTILE.sewingValueShare}% giá trị; hiện CMT ~${TEXTILE.modes.cmt}%, FOB ~${TEXTILE.modes.fob}%, ODM ~${TEXTILE.modes.odm}%, OBM ~${TEXTILE.modes.obm}% (10 năm trước CMT 70–80%) — đang leo dần. ${cite('nd-dm-smile')}` },
    { h: 'Nút thắt — nguyên liệu & “luật chơi”', p: `Xuất khẩu ~${TEXTILE.export2025} tỷ USD (2025) ${cite('nd-dm-2025')} nhưng phải nhập ~${TEXTILE.fabricImport2025} tỷ USD vải; quy tắc xuất xứ “từ vải” (EVFTA), “từ sợi” (CPTPP) khiến tỷ lệ tận dụng ưu đãi chỉ ~${TEXTILE.coUtilisation.cptpp}% (CPTPP), ${TEXTILE.coUtilisation.evfta}% (EVFTA). ${cite('nd-dm-vai', 'moit-roo')}` },
  ],
}

const W = 1000
const H = 470
const X0 = 70
const X1 = 930
const YTOP = 70
const YBOT = 360
/** t ∈ [-1, 1] → toạ độ trên "nụ cười" */
const pt = (t: number) => {
  const x = X0 + ((t + 1) / 2) * (X1 - X0)
  const y = YBOT - (YBOT - YTOP) * Math.pow(Math.abs(t), 1.65)
  return [x, y]
}
const TS = [-0.92, -0.62, -0.31, 0, 0.31, 0.62, 0.92]

function curvePath() {
  let d = ''
  for (let i = 0; i <= 80; i++) {
    const t = -1 + (2 * i) / 80
    const [x, y] = pt(t)
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }
  return d
}

export const smile: Section = {
  id: 'duong-cong',
  html: () => {
    const d = curvePath()
    const [vx, vy] = pt(0)
    const [lx, ly] = pt(-0.82)
    const [rx, ry] = pt(0.82)
    return `
  <section class="sec smile" id="duong-cong" aria-label="Đường cong nụ cười">
    <div class="smile__pin">
      <div class="wrap">
        <div class="smile__head">
          <div>
            <p class="eyebrow">Đường cong nụ cười · Stan Shih (1992)</p>
            <h2 class="display t-h2">Ai giữ <em class="c-gold">hai đầu</em>, ai ở <em class="c-red">đáy?</em></h2>
            <p class="t-small c-dim" style="margin:8px 0 0;max-width:70ch">Giáo trình cảnh báo nguy cơ hội nhập khiến nước đang phát triển <b>“có vị trí bất lợi và thua thiệt trong chuỗi giá trị toàn cầu”</b> ${cite('gt-ktct')}, Ch.6 mục II.2. Đường cong đo phần giá trị gia tăng mỗi khâu <b>thu về</b>, không phải nơi giá trị được tạo ra.</p>
          </div>
          <div class="seg-toggle" role="group" aria-label="Chọn ngành">
            <button type="button" aria-pressed="true" data-mode="dien-tu">Điện tử</button>
            <button type="button" aria-pressed="false" data-mode="det-may">Dệt may</button>
          </div>
        </div>
        <div class="smile__stage">
          <svg class="smile__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Đường cong nụ cười: giá trị gia tăng cao ở hai đầu chuỗi, thấp ở khâu sản xuất, lắp ráp">
            <line x1="${X0 - 30}" y1="${YBOT + 40}" x2="${X1 + 30}" y2="${YBOT + 40}" class="smile__axis"/>
            <line x1="${X0 - 30}" y1="${YTOP - 40}" x2="${X0 - 30}" y2="${YBOT + 40}" class="smile__axis"/>
            <text x="${X0 - 22}" y="${YTOP - 46}" class="smile__axis-t">GIÁ TRỊ GIA TĂNG ↑</text>
            <text x="${X1 + 30}" y="${YBOT + 62}" class="smile__axis-t" text-anchor="end">CÁC KHÂU CỦA CHUỖI GIÁ TRỊ →</text>
            <text x="${X0}" y="${YBOT + 62}" class="smile__axis-t">TRƯỚC SẢN XUẤT</text>
            <path d="${d}L${X1},${YBOT + 40}L${X0},${YBOT + 40}Z" class="smile__area" data-area/>
            <path d="${d}" class="smile__curve" data-curve/>
            <path d="M${vx - 18},${vy - 14} Q${(vx + lx) / 2 - 40},${(vy + ly) / 2 + 30} ${lx + 18},${ly + 30}" class="smile__arrow" data-arrow marker-end="url(#ah)"/>
            <path d="M${vx + 18},${vy - 14} Q${(vx + rx) / 2 + 40},${(vy + ry) / 2 + 30} ${rx - 18},${ry + 30}" class="smile__arrow" data-arrow marker-end="url(#ah)"/>
            <defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--red)"/></marker></defs>
            ${TS.map((t, i) => {
              const [x, y] = pt(t)
              // nhãn đặt ra phía ngoài đường cong: nửa trái canh phải, nửa phải canh trái, đáy đặt bên dưới
              const bottom = t === 0
              const tx = bottom ? x : t < 0 ? x - 16 : x + 16
              const anchor = bottom ? 'middle' : t < 0 ? 'end' : 'start'
              const ty = bottom ? y + 36 : y - 4
              return `<g data-st="${i}">
                <circle cx="${x}" cy="${y}" r="7" class="smile__dot"/>
                <text x="${tx}" y="${ty}" class="smile__stage-t" text-anchor="${anchor}" data-st-t></text>
                <text x="${tx}" y="${ty + 18}" class="smile__stage-d" text-anchor="${anchor}" data-st-d></text>
              </g>`
            }).join('')}
            <g data-vn>
              <circle cx="${vx}" cy="${vy}" r="12" class="smile__vn"/>
              <circle cx="${vx}" cy="${vy}" r="22" class="smile__vn-ring" data-ring/>
              <text x="${vx + 34}" y="${vy + 5}" class="smile__stage-t" style="fill:var(--red)">← Việt Nam hôm nay</text>
            </g>
          </svg>
        </div>
        <div class="smile__note" data-notes></div>
      </div>
    </div>
  </section>`
  },

  mount(el, { engine }) {
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    const at = (f: number) => () => {
      const [s, e] = range()
      return s + (e - s) * f
    }
    engine.addStation({
      id: 'smile-1',
      chapter: 5,
      label: 'Đường cong nụ cười — điện tử',
      y: at(0.62),
      seconds: 30,
      notes: notes(
        'Khái niệm của Stan Shih (nhà sáng lập Acer, ~1992), được WTO, World Bank, OECD trình bày trong Báo cáo phát triển chuỗi giá trị toàn cầu 2017.',
        'Lưu ý lý luận: đường cong biểu diễn phần giá trị gia tăng mỗi khâu THU VỀ (đo bằng giá cả), không phải nơi giá trị được TẠO RA. Hai đầu thu về nhiều nhờ lao động phức tạp và nhờ vị thế độc quyền công nghệ, thương hiệu (lợi nhuận độc quyền).', 'Giáo trình Ch.6 mục II.2 cảnh báo nguy cơ “có vị trí bất lợi và thua thiệt trong chuỗi giá trị toàn cầu” — đáy đường cong chính là vị trí đó.',
        'Bấm nút “Dệt may” để so sánh.',
      ),
    })
    engine.addStation({
      id: 'smile-2',
      chapter: 5,
      label: 'Đường cong nụ cười — dệt may',
      y: at(0.97),
      seconds: 30,
      notes: notes(
        'Dệt may: khâu may dùng ~80% lao động nhưng chỉ thu về 18–20% giá trị gia tăng (chuyên gia trên Báo Nhân Dân, 2024). Phương thức hiện nay: CMT ~35%, FOB ~55%, ODM ~9%, OBM ~1% (TS Hoàng Xuân Hiệp, Báo Nhân Dân 2024); 10 năm trước CMT 70–80% → đang dịch chuyển lên. (Bộ Công Thương 2023 từng nêu CMT ~65% — khác phương pháp, nếu bị hỏi thì giải thích.)',
        'Nút thắt: nhập ~17 tỷ USD vải năm 2025; quy tắc xuất xứ “từ vải” (EVFTA), “từ sợi” (CPTPP) → tỷ lệ tận dụng ưu đãi chỉ ~15% (CPTPP), 30–35% (EVFTA). Đây là “luật chơi” mà người chơi lớn đặt ra — liên hệ biểu hiện mới 4 & 5.',
        'QĐ 1643/QĐ-TTg: chuyển từ gia công sang quản lý chuỗi cung ứng, thiết kế, thương hiệu.',
      ),
    })

    const notesEl = el.querySelector('[data-notes]') as HTMLElement
    const btns = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-mode]'))
    let mode: Mode = 'dien-tu'
    let revealed = reduceMotion
    const setMode = (m: Mode, animate = true) => {
      mode = m
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)))
      STAGES[m].forEach(([t, d], i) => {
        const g = el.querySelector(`[data-st="${i}"]`)!
        const tt = g.querySelector('[data-st-t]')!
        const dd = g.querySelector('[data-st-d]')!
        tt.textContent = t
        dd.textContent = d
      })
      notesEl.innerHTML = NOTES[m].map((n) => `<div class="card"><h3 class="t-h3" style="margin:0 0 8px">${n.h}</h3><p class="t-small c-dim" style="margin:0">${n.p}</p></div>`).join('')
      if (animate && !reduceMotion) gsap.fromTo(notesEl.children, { autoAlpha: 0, y: 14 }, { autoAlpha: revealed ? 1 : 0, y: 0, duration: 0.5, stagger: 0.07 })
      else if (revealed) gsap.set(notesEl.children, { autoAlpha: 1 })
    }
    // bấm tay thì giữ lựa chọn; cuộn ngược về nửa đầu thì trả lại chế độ tự động
    let manual = false
    btns.forEach((b) =>
      b.addEventListener('click', () => {
        manual = true
        setMode(b.dataset.mode as Mode)
      }),
    )
    setMode('dien-tu', false)

    if (reduceMotion || window.innerWidth < 900) {
      gsap.set(notesEl.children, { autoAlpha: 1 })
      return
    }

    const curve = el.querySelector('[data-curve]') as SVGPathElement
    const len = curve.getTotalLength()
    const area = el.querySelector('[data-area]')
    const stg = el.querySelectorAll('[data-st]')
    const vn = el.querySelector('[data-vn]')
    const arrows = el.querySelectorAll('[data-arrow]')
    gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len })
    gsap.set([area, vn], { autoAlpha: 0 })
    gsap.set(stg, { autoAlpha: 0, y: 10 })
    arrows.forEach((a) => {
      const l = (a as SVGPathElement).getTotalLength()
      gsap.set(a, { strokeDasharray: `6 6`, strokeDashoffset: 0, autoAlpha: 0 })
      void l
    })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const r = self.progress > 0.62
          if (r !== revealed) {
            revealed = r
            gsap.to(notesEl.children, { autoAlpha: r ? 1 : 0, y: r ? 0 : 14, duration: 0.5, stagger: 0.08, overwrite: true })
          }
          // tự chuyển sang dệt may ở đoạn cuối để người thuyết trình không cần bấm
          if (self.progress < 0.5) manual = false
          const want: Mode = self.progress > 0.84 ? 'det-may' : 'dien-tu'
          if (!manual && want !== mode) setMode(want)
        },
      },
    })
    tl.to(curve, { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, 0)
      .to(area, { autoAlpha: 1, duration: 0.1 }, 0.18)
      .to(stg, { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.03 }, 0.2)
      .to(vn, { autoAlpha: 1, duration: 0.06 }, 0.45)
      .to(arrows, { autoAlpha: 1, duration: 0.06 }, 0.55)
      .to({}, { duration: 0.3 })
    gsap.to(el.querySelector('[data-ring]'), { attr: { r: 34 }, opacity: 0, duration: 1.6, repeat: -1, ease: 'power1.out' })
  },
}

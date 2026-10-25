import { docTop } from '../core/engine'
import { type Section, notes } from './types'

export const HOOK_OPTIONS = [
  { k: 'A', t: 'Trên 60 USD' },
  { k: 'B', t: '40 – 60 USD' },
  { k: 'C', t: '20 – 40 USD' },
  { k: 'D', t: 'Dưới 20 USD' },
]
/** Đáp án (công bố ở chương 5 — điện thoại tách lớp) */
export const HOOK_ANSWER = 'D'

const store = { votes: [0, 0, 0, 0] }

/** Trạng thái bình chọn dùng chung để chương 5 hiển thị lại kết quả của lớp */
export const hookVotes = () => store.votes.slice()

export const hook: Section = {
  id: 'cau-hoi',
  html: () => `
  <section class="sec sec--pad sec--screen hook" id="cau-hoi" aria-label="Câu hỏi mở đầu">
    <div class="wrap">
      <div class="chapter-tag"><span class="chapter-tag__n">01</span><span class="eyebrow">Câu hỏi mở đầu · bình chọn</span></div>
      <h2 class="display t-h2 hook__q" data-split>Trong <em class="c-gold">100 USD</em> một thiết bị điện tử “Made in Vietnam” xuất khẩu, bao nhiêu USD giá trị gia tăng <em class="c-red">ở lại Việt Nam?</em></h2>
      <div class="hook__opts" data-stagger>
        ${HOOK_OPTIONS.map(
          (o, i) => `
          <div class="opt" data-opt="${i}" data-hover>
            <span class="opt__k">${o.k}</span>
            <span class="opt__t">${o.t}</span>
            <span class="opt__n mono" data-n="${i}">0 phiếu</span>
            <div class="tally">
              <button type="button" data-tally="${i}" data-d="1" aria-label="Thêm 1 phiếu cho ${o.k}">+</button>
              <button type="button" data-tally="${i}" data-d="-1" aria-label="Bớt 1 phiếu cho ${o.k}">−</button>
            </div>
            <i class="opt__bar" data-bar="${i}"></i>
          </div>`,
        ).join('')}
      </div>
      <div class="hook__foot">
        <p class="cite">Cách chơi: mời cả lớp giơ tay theo từng phương án, người điều khiển bấm “+” để ghi phiếu. Đáp án được công bố ở <b>Phần 5</b>.</p>
        <button class="btn" type="button" data-reset>Đặt lại phiếu</button>
      </div>

      <div class="roadmap" data-stagger>
        <div><span class="mono c-red">Câu hỏi 1</span><p>Độc quyền “đổi áo” thế nào trong điều kiện ngày nay?</p></div>
        <div><span class="mono c-red">Câu hỏi 2</span><p>Việt Nam đang đứng ở đâu trong chuỗi giá trị do tập đoàn xuyên quốc gia điều phối?</p></div>
        <div><span class="mono c-red">Câu hỏi 3</span><p>CNTB đóng vai trò gì trong lịch sử — và sinh viên chúng ta cần làm gì?</p></div>
      </div>
    </div>
  </section>`,

  mount(el, { engine }) {
    engine.addStation({
      id: 'hook',
      chapter: 1,
      label: 'Câu hỏi mở đầu — bình chọn',
      y: () => docTop(el),
      seconds: 45,
      notes: notes(
        'Đọc câu hỏi, mời cả lớp giơ tay cho A, B, C, D. Bấm “+” để ghi phiếu.',
        'Không tiết lộ đáp án — hẹn công bố khi tách lớp chiếc điện thoại ở Phần 5.',
        'Giới thiệu 3 câu hỏi dẫn dắt của bài (khớp với câu hỏi cốt lõi trong đề).',
      ),
    })

    const render = () => {
      const total = store.votes.reduce((a, b) => a + b, 0)
      store.votes.forEach((v, i) => {
        const n = el.querySelector(`[data-n="${i}"]`) as HTMLElement
        const bar = el.querySelector(`[data-bar="${i}"]`) as HTMLElement
        const pct = total ? Math.round((v / total) * 100) : 0
        n.textContent = `${v} phiếu${total ? ` · ${pct}%` : ''}`
        bar.style.width = `${pct}%`
      })
      document.dispatchEvent(new CustomEvent('hook:votes', { detail: hookVotes() }))
    }
    el.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest('[data-tally]') as HTMLElement | null
      if (t) {
        const i = +t.dataset.tally!
        store.votes[i] = Math.max(0, store.votes[i] + +t.dataset.d!)
        render()
      }
      if ((e.target as HTMLElement).closest('[data-reset]')) {
        store.votes = [0, 0, 0, 0]
        render()
      }
    })
    render()
  },
}

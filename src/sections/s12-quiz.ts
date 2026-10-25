import qrcode from 'qrcode-generator'
import { meta } from '../content/meta'
import { docTop, gsap, reduceMotion } from '../core/engine'
import { type Section, notes } from './types'

interface Q {
  q: string
  opts: string[]
  a: number
  why: string
}

/** 5 câu ≤ 5 phút (FAQ Q4 trong file Assignment) — mọi đáp án đều có trong bài */
const QUIZ: Q[] = [
  {
    q: 'Theo giáo trình, “hệ thống gia công” giữa tập đoàn lớn và doanh nghiệp vừa, nhỏ được xem là gì?',
    opts: ['Cạnh tranh tự do kiểu mới', 'Độc quyền dưới dạng mới', 'Một hình thức sở hữu nhà nước', 'Xuất khẩu hàng hóa thuần túy'],
    a: 1,
    why: 'Giáo trình KTCT (Ch.4 mục III.1): DN nhỏ phụ thuộc Concern/Conglomerate về nhiều mặt — đó là độc quyền dưới dạng mới.',
  },
  {
    q: 'Năm 2025, khu vực có vốn FDI chiếm khoảng bao nhiêu % kim ngạch xuất khẩu hàng hóa của Việt Nam?',
    opts: ['Khoảng 45%', 'Khoảng 60%', 'Khoảng 77%', 'Khoảng 95%'],
    a: 2,
    why: 'Cục Thống kê: 367,09/475,04 tỷ USD = 77,3% (9 tháng 2026: 80,7%).',
  },
  {
    q: 'Vì sao khâu lắp ráp, gia công chỉ THU VỀ phần nhỏ giá trị gia tăng của chuỗi?',
    opts: ['Vì lao động lắp ráp không tạo ra giá trị', 'Vì bên nắm công nghệ, thương hiệu có vị thế độc quyền nên thu về phần lớn giá trị', 'Vì khâu lắp ráp dùng ít lao động', 'Vì Nhà nước đánh thuế khâu lắp ráp rất cao'],
    a: 1,
    why: 'Lao động lắp ráp vẫn tạo ra giá trị; nhưng độc quyền công nghệ, thương hiệu cho phép “bán cao, mua thấp” → lợi nhuận độc quyền dồn về hai đầu đường cong.',
  },
  {
    q: 'Ví dụ nào là biểu hiện mới của độc quyền nhà nước TRONG CNTB?',
    opts: ['Đạo luật CHIPS của Mỹ dành 52,7 tỷ USD hỗ trợ các tập đoàn bán dẫn', 'Một cartel thỏa thuận giá bán', 'Quy tắc xuất xứ “từ vải trở đi” của EVFTA', 'Một doanh nghiệp nhỏ nhận gia công cho tập đoàn'],
    a: 0,
    why: 'Nhà nước tư sản dùng ngân sách, trợ cấp làm công cụ điều tiết, phục vụ lợi ích tập đoàn. Cartel là hình thức độc quyền tư nhân; quy tắc xuất xứ là luật chơi của khối liên kết; gia công là “hệ thống gia công”.',
  },
  {
    q: 'Theo giáo trình, gốc rễ các giới hạn của CNTB là mâu thuẫn giữa…?',
    opts: ['Cung và cầu trên thị trường', 'Trình độ xã hội hóa ngày càng cao của LLSX và chế độ chiếm hữu tư nhân TBCN', 'Nhà nước và thị trường', 'Xuất khẩu và nhập khẩu'],
    a: 1,
    why: 'Giáo trình KTCT Ch.4 mục III.3: QHSX TBCN tự điều chỉnh được trong giới hạn nhất định nên CNTB còn phát triển, nhưng không khắc phục triệt để được mâu thuẫn cơ bản này.',
  },
]

export const quiz: Section = {
  id: 'minigame',
  chapter: { n: 10, title: 'Minigame & thảo luận', short: 'Tương tác' },
  html: () => `
  <section class="sec sec--pad sec--screen" id="minigame" aria-label="Minigame và thảo luận">
    <div class="wrap">
      <div class="chapter-tag"><span class="chapter-tag__n">10</span><span class="eyebrow">Minigame · 5 câu · tối đa 5 phút</span></div>
      <div class="quiz">
        <div>
          <p class="mono c-gold" data-qn></p>
          <h2 class="display t-h2 quiz__q" data-q></h2>
          <div class="quiz__opts" data-opts></div>
          <div class="quiz__explain" data-why hidden></div>
          <div class="quiz__nav">
            <div class="quiz__dots" data-dots>${QUIZ.map(() => '<i></i>').join('')}</div>
            <button class="btn" type="button" data-prevq>← Câu trước</button>
            <button class="btn" type="button" data-reveal-btn>Hiện đáp án</button>
            <button class="btn btn--solid" type="button" data-nextq>Câu tiếp →</button>
          </div>
        </div>
        <aside class="score" aria-label="Bảng điểm">
          <p class="eyebrow">Bảng điểm đội</p>
          ${['Đội A', 'Đội B', 'Đội C'].map(
            (t, i) => `<div class="score__team"><span>${t}: <b data-score="${i}">0</b></span><div><button type="button" data-pt="${i}" data-d="1" aria-label="Cộng điểm ${t}">+</button><button type="button" data-pt="${i}" data-d="-1" aria-label="Trừ điểm ${t}">−</button></div></div>`,
          ).join('')}
          <p class="cite">Chia lớp thành 3 đội theo dãy bàn; đội giơ tay nhanh và đúng được +1.</p>
        </aside>
      </div>

      <div class="discuss" style="margin-top:clamp(60px,11vh,140px)" data-discuss>
        <div>
          <p class="eyebrow">Câu hỏi mở — không có đáp án duy nhất</p>
          <h2 class="display t-h2" data-split>Sau khi tốt nghiệp, bạn chọn <em class="c-gold">học việc trong tập đoàn FDI</em> hay <em class="c-red">xây năng lực cho doanh nghiệp Việt?</em></h2>
          <p class="t-lead">Hãy trả lời bằng một khái niệm của bài: chuỗi giá trị, nội địa hóa, độc lập – tự chủ, hay lượng – chất.</p>
          <div class="poll" data-poll>
            ${['Làm cho tập đoàn FDI để học hỏi', 'Doanh nghiệp Việt / khởi nghiệp', 'Lộ trình: FDI trước, rồi về DN Việt'].map(
              (t, i) => `<div class="poll__row"><span>${t}</span><div class="poll__bar"><i data-pbar="${i}"></i></div><b data-pn="${i}">0</b><button type="button" data-pv="${i}" aria-label="Thêm phiếu: ${t}">+</button></div>`,
            ).join('')}
          </div>
        </div>
        <div data-qr-wrap ${meta.pollUrl ? '' : 'hidden'}>
          <div class="qr" data-qr></div>
          <p class="cite" style="margin-top:10px">Quét mã để gửi ý kiến ẩn danh</p>
        </div>
      </div>
    </div>
  </section>`,

  mount(el, { engine }) {
    const discuss = el.querySelector('[data-discuss]') as HTMLElement
    engine.addStation({
      id: 'quiz',
      chapter: 10,
      label: 'Minigame 5 câu',
      y: () => docTop(el),
      seconds: 125,
      notes: notes(
        'Chia lớp 3 đội. Đọc câu hỏi → đội giơ tay → bấm vào phương án đội chọn → “Hiện đáp án” → cộng điểm.',
        'Mỗi câu ~40 giây; tổng không quá 5 phút (theo FAQ của môn).',
        'Phím ←/→ của trang vẫn dùng để đổi phần; nút trên màn hình dùng để đổi câu.',
      ),
    })
    engine.addStation({
      id: 'discuss',
      chapter: 10,
      label: 'Câu hỏi mở & khảo sát',
      y: () => docTop(discuss) - window.innerHeight * 0.2,
      seconds: 40,
      notes: notes(
        'Câu hỏi mở (tiêu chí 1.5 — yếu tố “mở”): mời 2–3 bạn trả lời, yêu cầu dùng một khái niệm của bài.',
        'Gợi ý chốt: không có lựa chọn sai — điều quan trọng là “lộ trình tích lũy” để bước lên khâu giá trị cao, đúng quy luật lượng – chất.',
      ),
    })

    // ── Quiz ──
    let i = 0
    let shown = false
    let picked = -1
    const $ = (k: string) => el.querySelector(`[${k}]`) as HTMLElement
    const render = () => {
      const q = QUIZ[i]
      shown = false
      picked = -1
      $('data-qn').textContent = `Câu ${i + 1}/${QUIZ.length}`
      $('data-q').textContent = q.q
      $('data-opts').innerHTML = q.opts
        .map((o, k) => `<button type="button" class="quiz__opt" data-o="${k}"><b>${'ABCD'[k]}</b><span>${o}</span></button>`)
        .join('')
      $('data-why').hidden = true
      $('data-why').textContent = q.why
      el.querySelectorAll('[data-dots] i').forEach((d, k) => d.classList.toggle('is-on', k <= i))
      if (!reduceMotion) gsap.fromTo($('data-opts').children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.35 })
    }
    const reveal = () => {
      if (shown) return
      shown = true
      const q = QUIZ[i]
      el.querySelectorAll<HTMLElement>('[data-o]').forEach((b) => {
        const k = +b.dataset.o!
        b.classList.toggle('is-right', k === q.a)
        b.classList.toggle('is-wrong', k !== q.a)
      })
      $('data-why').hidden = false
    }
    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      const o = t.closest('[data-o]') as HTMLElement | null
      if (o && !shown) {
        picked = +o.dataset.o!
        el.querySelectorAll('[data-o]').forEach((b) => b.classList.toggle('is-picked', b === o))
      }
      if (t.closest('[data-reveal-btn]')) reveal()
      if (t.closest('[data-nextq]') && i < QUIZ.length - 1) {
        i++
        render()
      }
      if (t.closest('[data-prevq]') && i > 0) {
        i--
        render()
      }
      const pt = t.closest('[data-pt]') as HTMLElement | null
      if (pt) {
        const s = el.querySelector(`[data-score="${pt.dataset.pt}"]`) as HTMLElement
        s.textContent = String(Math.max(0, +s.textContent! + +pt.dataset.d!))
      }
      const pv = t.closest('[data-pv]') as HTMLElement | null
      if (pv) {
        const n = el.querySelector(`[data-pn="${pv.dataset.pv}"]`) as HTMLElement
        n.textContent = String(+n.textContent! + 1)
        const vals = [0, 1, 2].map((k) => +(el.querySelector(`[data-pn="${k}"]`) as HTMLElement).textContent!)
        const max = Math.max(1, ...vals)
        vals.forEach((v, k) => ((el.querySelector(`[data-pbar="${k}"]`) as HTMLElement).style.width = `${(v / max) * 100}%`))
      }
      void picked
    })
    render()

    // ── QR khảo sát ──
    if (meta.pollUrl) {
      const qr = qrcode(0, 'M')
      qr.addData(meta.pollUrl)
      qr.make()
      $('data-qr').innerHTML = qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true })
    }
  },
}

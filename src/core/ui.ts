import gsap from 'gsap'
import { type Deck, reduceMotion } from './deck'

const CHANNEL = 'mln122-g6-deck'

export interface UIOptions {
  brand: string
  budgetMinutes: number
  onTheme: (light: boolean) => void
}

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* trình duyệt chặn bộ nhớ — bỏ qua */
  }
}

const fmt = (s: number) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

/** HUD, thanh tiến độ, rail chương, ghi chú người nói, trợ giúp phím, đồng hồ, con trỏ, âm thanh, theme. */
export function mountUI(engine: Deck, opts: UIOptions) {
  const root = document.createElement('div')
  root.className = 'ui'
  root.innerHTML = `
    <div class="hud hud--tl"><span class="hud__mark">${opts.brand}</span></div>
    <div class="hud hud--tr">
      <span class="hud__chapter" data-ui="chapter"></span>
      <span class="hud__count mono" data-ui="count"></span>
    </div>
    <div class="progress"><div class="progress__bar" data-ui="bar"></div></div>
    <nav class="rail" aria-label="Mục lục" data-ui="rail"></nav>
    <div class="hud hud--br mono">
      <span class="clock" data-ui="clock" hidden></span>
    </div>
    <aside class="notes" data-ui="notes" aria-live="polite" hidden>
      <div class="notes__head mono"><span data-ui="notes-label"></span><span data-ui="notes-time"></span></div>
      <div class="notes__body" data-ui="notes-body"></div>
    </aside>
    <div class="help" data-ui="help" hidden>
      <div class="help__card">
        <p class="eyebrow">Điều khiển khi thuyết trình</p>
        <dl>
          <dt><kbd>↓</kbd> <kbd>→</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd></dt><dd>Slide tiếp theo</dd>
          <dt><kbd>↑</kbd> <kbd>←</kbd> <kbd>PgUp</kbd></dt><dd>Slide trước</dd>
          <dt><kbd>1</kbd>–<kbd>9</kbd>, <kbd>0</kbd></dt><dd>Nhảy tới slide 1–9 (0 = slide 10)</dd>
          <dt><kbd>Home</kbd> / <kbd>End</kbd></dt><dd>Về đầu / cuối</dd>
          <dt><kbd>N</kbd></dt><dd>Bật/tắt ghi chú người nói</dd>
          <dt><kbd>P</kbd></dt><dd>Mở cửa sổ người thuyết trình (màn hình phụ)</dd>
          <dt><kbd>T</kbd></dt><dd>Đồng hồ bấm giờ (R = đặt lại)</dd>
          <dt><kbd>L</kbd></dt><dd>Giao diện sáng / tối (phòng sáng đèn)</dd>
          <dt><kbd>F</kbd></dt><dd>Toàn màn hình</dd>
          <dt><kbd>M</kbd></dt><dd>Âm thanh chuyển cảnh</dd>
          <dt><kbd>?</kbd></dt><dd>Đóng/mở bảng này</dd>
        </dl>
        <p class="cite">Cuộn chuột / vuốt: mỗi lần một slide.</p>
      </div>
    </div>
    <div class="cursor" data-ui="cursor" aria-hidden="true"><span></span></div>
  `
  document.body.appendChild(root)
  const $ = <T extends HTMLElement>(k: string) => root.querySelector(`[data-ui="${k}"]`) as T

  // ── Rail chương ─────────────────────────────────────────────
  const rail = $('rail')
  rail.innerHTML = engine.chapters
    .map(
      (c) =>
        `<button class="rail__dot" data-ch="${c.n}" aria-label="Phần ${c.n}: ${c.title}"><span class="rail__label">${String(c.n).padStart(2, '0')} · ${c.short}</span></button>`,
    )
    .join('')
  rail.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('[data-ch]') as HTMLElement | null
    if (b) engine.goChapter(+b.dataset.ch!)
  })

  // ── Tiến độ ────────────────────────────────────────────────
  const bar = $('bar')
  engine.onFrame(() => {
    bar.style.transform = `scaleX(${engine.progress()})`
  })

  // ── Điểm dừng hiện tại ─────────────────────────────────────
  const chapterEl = $('chapter')
  const countEl = $('count')
  const notesBody = $('notes-body')
  const notesLabel = $('notes-label')
  const notesTime = $('notes-time')
  let bc: BroadcastChannel | null = null
  try {
    bc = new BroadcastChannel(CHANNEL)
  } catch {
    bc = null
  }
  const publish = () => {
    const i = engine.current
    const s = engine.stations[i]
    if (!s || !bc) return
    const nx = engine.stations[i + 1]
    bc.postMessage({
      type: 'state',
      i,
      total: engine.stations.length,
      chapter: `Slide ${i + 1}/${engine.stations.length}`,
      label: s.label,
      notes: s.notes ?? '',
      seconds: s.seconds ?? 0,
      next: nx ? nx.label : '— Hết —',
      startedAt: clockStart,
      running: clockRunning,
    })
  }
  engine.onStation((s, i) => {
    const ch = engine.chapters.find((c) => c.n === s.chapter)
    chapterEl.textContent = ch ? `${String(ch.n).padStart(2, '0')} — ${ch.title}` : ''
    countEl.textContent = `${String(i + 1).padStart(2, '0')}/${String(engine.stations.length).padStart(2, '0')}`
    rail.querySelectorAll<HTMLElement>('.rail__dot').forEach((d) => d.classList.toggle('is-on', +d.dataset.ch! === s.chapter))
    notesLabel.textContent = s.label
    notesTime.textContent = s.seconds ? `~${Math.round(s.seconds / 6) / 10} phút` : ''
    notesBody.innerHTML = s.notes ?? '<p class="c-dim">(Không có ghi chú)</p>'
    if (soundOn) tick()
    publish()
  })

  // ── Đồng hồ ────────────────────────────────────────────────
  const clock = $('clock')
  let clockStart = 0
  let clockRunning = false
  let clockShown = false
  const budget = opts.budgetMinutes * 60
  setInterval(() => {
    if (!clockShown) return
    const el = clockRunning ? (Date.now() - clockStart) / 1000 : 0
    clock.textContent = `${fmt(el)} / ${fmt(budget)}`
    clock.dataset.state = el > budget ? 'over' : el > budget * 0.85 ? 'warn' : 'ok'
  }, 500)

  // ── Theme ──────────────────────────────────────────────────
  const setTheme = (light: boolean) => {
    document.documentElement.dataset.theme = light ? 'light' : 'dark'
    safeSet('g6-theme', light ? 'light' : 'dark')
    opts.onTheme(light)
  }
  if (safeGet('g6-theme') === 'light') setTheme(true)

  // ── Âm thanh (WebAudio tổng hợp — không cần file) ──────────
  let soundOn = false
  let ac: AudioContext | null = null
  const tick = () => {
    try {
      ac = ac ?? new AudioContext()
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(880, ac.currentTime)
      o.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.12)
      g.gain.setValueAtTime(0.0001, ac.currentTime)
      g.gain.exponentialRampToValueAtTime(0.05, ac.currentTime + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.18)
      o.connect(g).connect(ac.destination)
      o.start()
      o.stop(ac.currentTime + 0.2)
    } catch {
      /* không hỗ trợ âm thanh */
    }
  }

  // ── Bảng ghi chú / trợ giúp ────────────────────────────────
  const notes = $('notes')
  const help = $('help')
  const toggle = (el: HTMLElement, force?: boolean) => {
    const show = force ?? el.hidden
    el.hidden = !show
  }
  help.addEventListener('click', (e) => {
    if (e.target === help) toggle(help, false)
  })

  // ── Bàn phím ───────────────────────────────────────────────
  const typing = (t: EventTarget | null) => {
    const el = t as HTMLElement | null
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
  }
  window.addEventListener('keydown', (e) => {
    if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return
    const k = e.key
    // chuyển slide (mũi tên, Space, PgUp/PgDn, Home/End) do Deck xử lý
    if (/^[0-9]$/.test(k)) {
      engine.goChapter(k === '0' ? 10 : +k)
    } else if (k === 'n' || k === 'N') {
      toggle(notes)
    } else if (k === '?' || k === '/') {
      toggle(help)
    } else if (k === 'Escape') {
      toggle(help, false)
      toggle(notes, false)
    } else if (k === 'l' || k === 'L') {
      setTheme(document.documentElement.dataset.theme !== 'light')
    } else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen?.().catch(() => {})
    } else if (k === 'm' || k === 'M') {
      soundOn = !soundOn
      if (soundOn) tick()
    } else if (k === 't' || k === 'T') {
      clockShown = !clockShown
      clock.hidden = !clockShown
      if (clockShown && !clockRunning) {
        clockRunning = true
        clockStart = Date.now()
      }
      publish()
    } else if (k === 'r' || k === 'R') {
      clockStart = Date.now()
      clockRunning = true
      publish()
    } else if (k === 'p' || k === 'P') {
      const url = new URL(location.href)
      url.hash = ''
      url.searchParams.set('presenter', '1')
      window.open(url.toString(), 'g6-presenter', 'width=1100,height=720')
      setTimeout(publish, 900)
    }
  })

  // Lệnh từ cửa sổ người thuyết trình
  bc?.addEventListener('message', (ev) => {
    const d = ev.data
    if (d?.type !== 'cmd') return
    // trang chính bị che (trình duyệt dừng hoạt ảnh) → nhảy tức thì để không bị "đứng"
    if (d.cmd === 'next') document.hidden ? engine.goTo(engine.current + 1, true) : engine.next()
    else if (d.cmd === 'prev') engine.goTo(engine.current - 1, document.hidden)
    else if (d.cmd === 'hello') publish()
    else if (d.cmd === 'clock') {
      clockStart = Date.now()
      clockRunning = true
      publish()
    }
  })

  // ── Con trỏ tùy biến + tự ẩn khi đứng yên (đỡ rối mắt khi chiếu) ──
  const cursor = $('cursor')
  const fine = window.matchMedia('(pointer: fine)').matches
  if (fine && !reduceMotion) {
    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
    let idle = 0
    window.addEventListener('pointermove', (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      document.documentElement.classList.remove('cursor-idle')
      window.clearTimeout(idle)
      idle = window.setTimeout(() => document.documentElement.classList.add('cursor-idle'), 2600)
      const hot = (e.target as HTMLElement).closest('a,button,[data-hover],input,label,select')
      cursor.classList.toggle('is-hot', !!hot)
    })
    window.addEventListener('pointerdown', () => cursor.classList.add('is-down'))
    window.addEventListener('pointerup', () => cursor.classList.remove('is-down'))
  } else {
    cursor.remove()
  }

  return { setTheme }
}

/** Cửa sổ người thuyết trình (?presenter=1) — điều khiển trang chính qua BroadcastChannel. */
export function mountPresenter() {
  document.documentElement.classList.add('presenter-mode')
  document.body.innerHTML = `
    <main class="pc">
      <header class="pc__top mono">
        <span>NGƯỜI THUYẾT TRÌNH · Nhóm 6 · MLN122</span>
        <span class="pc__clock" data-pc="clock">00:00</span>
      </header>
      <section class="pc__now">
        <p class="eyebrow" data-pc="chapter">Đang chờ trang chính…</p>
        <h1 class="display t-h2" data-pc="label">Mở trang thuyết trình ở cửa sổ còn lại</h1>
        <div class="pc__notes" data-pc="notes"></div>
      </section>
      <footer class="pc__bottom">
        <button class="btn" data-pc="prev">← Trước</button>
        <div class="pc__next"><span class="eyebrow">Tiếp theo</span><span data-pc="next">—</span></div>
        <span class="mono pc__count" data-pc="count"></span>
        <button class="btn btn--solid" data-pc="next-btn">Tiếp →</button>
      </footer>
    </main>`
  const $ = (k: string) => document.querySelector(`[data-pc="${k}"]`) as HTMLElement
  let bc: BroadcastChannel
  try {
    bc = new BroadcastChannel(CHANNEL)
  } catch {
    $('label').textContent = 'Trình duyệt không hỗ trợ BroadcastChannel — hãy dùng phím N trên trang chính.'
    return
  }
  let startedAt = 0
  let running = false
  let budget = 0
  let shownAt = Date.now()
  bc.onmessage = (ev) => {
    const d = ev.data
    if (d?.type !== 'state') return
    $('chapter').textContent = d.chapter
    $('label').textContent = d.label
    $('notes').innerHTML = d.notes || '<p>(Không có ghi chú)</p>'
    $('next').textContent = d.next
    $('count').textContent = `${d.i + 1}/${d.total}`
    startedAt = d.startedAt
    running = d.running
    budget = d.seconds || 0
    shownAt = Date.now()
  }
  setInterval(() => {
    const el = running ? (Date.now() - startedAt) / 1000 : 0
    const here = (Date.now() - shownAt) / 1000
    $('clock').textContent = `${fmt(el)}  ·  mục này ${fmt(here)}${budget ? ` / ${fmt(budget)}` : ''}`
    $('clock').dataset.state = budget && here > budget * 1.15 ? 'over' : 'ok'
  }, 500)
  $('prev').onclick = () => bc.postMessage({ type: 'cmd', cmd: 'prev' })
  $('next-btn').onclick = () => bc.postMessage({ type: 'cmd', cmd: 'next' })
  $('clock').onclick = () => bc.postMessage({ type: 'cmd', cmd: 'clock' })
  window.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault()
      bc.postMessage({ type: 'cmd', cmd: 'next' })
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault()
      bc.postMessage({ type: 'cmd', cmd: 'prev' })
    }
  })
  bc.postMessage({ type: 'cmd', cmd: 'hello' })
}

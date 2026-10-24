import { gsap, reduceMotion } from '../core/engine'

/**
 * Biểu đồ SVG tối giản theo chuẩn dataviz:
 *  - một trục y duy nhất, lưới mảnh, nhãn chọn lọc (giá trị cuối / cực trị)
 *  - cột ≤ 24px, đầu bo 4px, gap 2px; đường 2px; điểm ≥ 8px có viền màu nền
 *  - ≥ 2 chuỗi luôn có chú giải; tooltip khi rê chuột; luôn có bảng số liệu tương đương
 * Màu chuỗi lấy từ token --c1/--c2/--c3 nên tự đổi theo giao diện sáng/tối.
 */

export interface Series {
  key: string
  label: string
  color: 'c1' | 'c2' | 'c3'
  values: Array<number | null>
}

export interface ChartSpec {
  kind: 'columns' | 'lines'
  categories: string[]
  series: Series[]
  unit: string
  /** số chữ số thập phân khi hiển thị */
  digits?: number
  /** nhãn trực tiếp: chỉ điểm cuối (mặc định) hoặc danh sách chỉ số */
  labelAt?: number[]
  yMax?: number
  /** đánh dấu một mốc (vd: năm hiệp định có hiệu lực) */
  marker?: { at: number; text: string }
  height?: number
}

const NS = 'http://www.w3.org/2000/svg'
const nf = (d: number) => new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d })

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / p
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return step * p
}

let tip: HTMLDivElement | null = null
function tooltip() {
  if (!tip) {
    tip = document.createElement('div')
    tip.className = 'chart-tip'
    tip.setAttribute('role', 'status')
    document.body.appendChild(tip)
  }
  return tip
}
function showTip(html: string, x: number, y: number) {
  const t = tooltip()
  t.innerHTML = html
  t.style.opacity = '1'
  const r = t.getBoundingClientRect()
  const left = Math.min(window.innerWidth - r.width - 12, Math.max(12, x + 16))
  const top = Math.max(12, y - r.height - 14)
  t.style.transform = `translate(${left}px, ${top}px)`
}
function hideTip() {
  if (tip) tip.style.opacity = '0'
}

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) {
  const n = document.createElementNS(NS, tag)
  for (const k in attrs) n.setAttribute(k, String(attrs[k]))
  parent?.appendChild(n)
  return n
}

/** Path cột: đáy vuông, đỉnh bo 4px */
function colPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h)
  if (h <= 0) return ''
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

export function renderChart(host: HTMLElement, spec: ChartSpec) {
  const d = spec.digits ?? 1
  const fmt = nf(d)
  host.classList.add('chart')
  host.innerHTML = ''

  if (spec.series.length > 1) {
    const lg = document.createElement('div')
    lg.className = 'chart__legend'
    lg.innerHTML = spec.series
      .map((s) => `<span class="chart__key"><i class="sw sw--${spec.kind === 'lines' ? 'line' : 'box'}" style="--sw: var(--${s.color})"></i>${s.label}</span>`)
      .join('')
    host.appendChild(lg)
  }

  const box = document.createElement('div')
  box.className = 'chart__plot'
  host.appendChild(box)

  // Bảng số liệu tương đương (truy cập được, không phụ thuộc màu)
  const details = document.createElement('details')
  details.className = 'chart__table'
  details.innerHTML = `<summary class="mono">Bảng số liệu</summary><div class="chart__tablewrap"><table><thead><tr><th></th>${spec.categories
    .map((c) => `<th>${c}</th>`)
    .join('')}</tr></thead><tbody>${spec.series
    .map((s) => `<tr><th>${s.label}</th>${s.values.map((v) => `<td>${v == null ? '–' : fmt.format(v)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table><p class="cite">Đơn vị: ${spec.unit}</p></div>`
  host.appendChild(details)

  let played = false
  const draw = () => {
    const W = Math.max(280, box.clientWidth)
    const H = spec.height ?? Math.round(Math.min(440, Math.max(240, W * 0.46)))
    const m = { t: 28, r: 64, b: 34, l: 52 }
    const iw = W - m.l - m.r
    const ih = H - m.t - m.b
    const all = spec.series.flatMap((s) => s.values.filter((v): v is number => v != null))
    const yMax = spec.yMax ?? niceMax(Math.max(...all) * 1.08)
    const y = (v: number) => m.t + ih - (v / yMax) * ih
    const n = spec.categories.length
    const band = iw / n
    const cx = (i: number) => m.l + band * (i + 0.5)

    box.innerHTML = ''
    const svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': spec.series.map((s) => s.label).join(', ') }, box)

    // lưới + trục y
    const ticks = 4
    for (let k = 0; k <= ticks; k++) {
      const v = (yMax / ticks) * k
      const yy = Math.round(y(v)) + 0.5
      el('line', { x1: m.l, x2: W - m.r + 8, y1: yy, y2: yy, class: k === 0 ? 'ax-base' : 'ax-grid' }, svg)
      const t = el('text', { x: m.l - 10, y: yy + 4, class: 'ax-tick', 'text-anchor': 'end' }, svg)
      t.textContent = nf(v % 1 === 0 ? 0 : 1).format(v)
    }
    // nhãn trục x (thưa bớt khi hẹp)
    const every = W < 520 ? Math.ceil(n / 6) : 1
    spec.categories.forEach((c, i) => {
      if (i % every !== 0 && i !== n - 1) return
      const t = el('text', { x: cx(i), y: H - 10, class: 'ax-tick', 'text-anchor': 'middle' }, svg)
      t.textContent = c
    })

    if (spec.marker) {
      const mx = cx(spec.marker.at)
      el('line', { x1: mx, x2: mx, y1: m.t - 6, y2: m.t + ih, class: 'ax-marker' }, svg)
      const t = el('text', { x: mx + 6, y: m.t - 10, class: 'ax-marker-t' }, svg)
      t.textContent = spec.marker.text
    }

    const labelIdx = spec.labelAt ?? [n - 1]
    const anims: Array<() => void> = []

    if (spec.kind === 'columns') {
      const k = spec.series.length
      const gap = 2
      const bw = Math.min(24, (band * 0.72 - gap * (k - 1)) / k)
      const groupW = bw * k + gap * (k - 1)
      spec.series.forEach((s, si) => {
        s.values.forEach((v, i) => {
          if (v == null) return
          const x = cx(i) - groupW / 2 + si * (bw + gap)
          const p = el('path', { d: colPath(x, y(v), bw, m.t + ih - y(v)), fill: `var(--${s.color})`, class: 'mk' }, svg)
          p.style.transformOrigin = `0px ${m.t + ih}px`
          p.style.transformBox = 'view-box'
          anims.push(() => gsap.fromTo(p, { scaleY: 0 }, { scaleY: 1, duration: 1.1, delay: i * 0.05 + si * 0.08, ease: 'expo.out' }))
          if (labelIdx.includes(i)) {
            const t = el('text', { x: x + bw / 2, y: y(v) - 8, class: 'dl', 'text-anchor': 'middle' }, svg)
            t.textContent = fmt.format(v)
          }
        })
      })
    } else {
      spec.series.forEach((s, si) => {
        const pts = s.values.map((v, i) => (v == null ? null : [cx(i), y(v)] as [number, number]))
        const dpath = pts.reduce((acc, p, i) => {
          if (!p) return acc
          const prev = pts[i - 1]
          return acc + `${prev ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`
        }, '')
        if (spec.series.length === 1) {
          const first = pts.find(Boolean)!
          const last = [...pts].reverse().find(Boolean)!
          el('path', { d: `${dpath}L${last[0]},${m.t + ih}L${first[0]},${m.t + ih}Z`, fill: `var(--${s.color})`, opacity: 0.1 }, svg)
        }
        const line = el('path', { d: dpath, fill: 'none', stroke: `var(--${s.color})`, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'mk' }, svg)
        const len = line.getTotalLength()
        anims.push(() =>
          gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, delay: si * 0.15, ease: 'power2.inOut' }),
        )
        pts.forEach((p, i) => {
          if (!p) return
          const isLabel = labelIdx.includes(i)
          if (isLabel) {
            el('circle', { cx: p[0], cy: p[1], r: 5, fill: `var(--${s.color})`, stroke: 'var(--bg)', 'stroke-width': 2 }, svg)
            const v = s.values[i]!
            const t = el('text', { x: p[0] + 10, y: p[1] + 4, class: 'dl' }, svg)
            t.textContent = fmt.format(v)
          }
        })
        void si
      })
    }

    // lớp rê chuột theo cột danh mục (vùng chạm rộng)
    const cross = el('line', { x1: 0, x2: 0, y1: m.t, y2: m.t + ih, class: 'ax-cross', opacity: 0 }, svg)
    spec.categories.forEach((c, i) => {
      const hit = el('rect', { x: m.l + band * i, y: m.t, width: band, height: ih, fill: 'transparent', tabindex: 0, 'data-hover': '' }, svg)
      const html = () =>
        `<b>${c}</b>` +
        spec.series
          .map((s) => `<span><i class="sw sw--${spec.kind === 'lines' ? 'line' : 'box'}" style="--sw: var(--${s.color})"></i>${s.label}: <b>${s.values[i] == null ? '–' : fmt.format(s.values[i]!)}</b> ${spec.unit}</span>`)
          .join('')
      const on = (ev: { clientX: number; clientY: number }) => {
        cross.setAttribute('x1', String(cx(i)))
        cross.setAttribute('x2', String(cx(i)))
        cross.setAttribute('opacity', '1')
        showTip(html(), ev.clientX, ev.clientY)
      }
      hit.addEventListener('pointermove', on)
      hit.addEventListener('pointerleave', () => {
        cross.setAttribute('opacity', '0')
        hideTip()
      })
      hit.addEventListener('focus', () => {
        const r = hit.getBoundingClientRect()
        on({ clientX: r.left + r.width / 2, clientY: r.top + 20 })
      })
      hit.addEventListener('blur', () => {
        cross.setAttribute('opacity', '0')
        hideTip()
      })
    })

    if (!played && !reduceMotion) {
      // chuẩn bị trạng thái ẩn; phát khi phần tử vào khung nhìn
      svg.querySelectorAll<SVGPathElement>('.mk').forEach((p) => {
        if (spec.kind === 'columns') gsap.set(p, { scaleY: 0 })
        else {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        }
      })
      ;(host as HTMLElement & { _play?: () => void })._play = () => {
        if (played) return
        played = true
        anims.forEach((a) => a())
      }
    }
  }

  draw()
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          ;(host as HTMLElement & { _play?: () => void })._play?.()
          io.disconnect()
        }
      })
    },
    { threshold: 0.35 },
  )
  io.observe(host)
  let rt = 0
  let lastW = box.clientWidth
  const ro = new ResizeObserver(() => {
    if (Math.abs(box.clientWidth - lastW) < 2) return
    lastW = box.clientWidth
    window.clearTimeout(rt)
    rt = window.setTimeout(() => {
      played = true
      draw()
    }, 120)
  })
  ro.observe(box)
}

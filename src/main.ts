import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/deck.css'
import './styles/slides.css'

import type * as THREE from 'three'
import { Deck } from './core/deck'
import { mountUI, mountPresenter } from './core/ui'
import { countUp, drawLines } from './core/fx'
import { Stage, type GLScene } from './gl/stage'
import { Globe, type ArcSpec } from './gl/globe'
import { Phone } from './gl/phone'
import landDots from './data/land-dots.json'
import { meta } from './content/meta'
import { HUBS_IN, MARKETS_OUT } from './content/geo'
import { SLIDES } from './slides'

/** Các cảnh 3D còn lại (tháp, container, đồng xu, cây cầu…) tự đăng ký qua create(renderer, light) */
const SCENES = import.meta.glob<{ create?: (r: THREE.WebGLRenderer, light: boolean) => GLScene }>('./gl/*.ts', { eager: true })

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
const isLight = () => document.documentElement.dataset.theme === 'light'

function palettes() {
  const light = isLight()
  return {
    globe: {
      dot: light ? '#3b3a36' : '#cfc8b8',
      vn: css('--red'),
      gold: light ? '#b07a16' : '#e9b44c',
      red: css('--red'),
      atmo: light ? '#9c6a12' : '#5f86b5',
    },
    phone: { line: light ? '#2b2a27' : '#d9d2c2', accent: css('--gold'), red: css('--red'), bg: css('--bg') },
    light,
  }
}

function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

async function boot() {
  if (new URLSearchParams(location.search).has('presenter')) {
    mountPresenter()
    return
  }

  // WebGL (bỏ qua êm nếu máy không hỗ trợ — chữ và biểu đồ vẫn đầy đủ)
  let stage: Stage | null = null
  let globe: Globe | null = null
  let phone: Phone | null = null
  if (webglOK()) {
    try {
      const th = palettes()
      stage = new Stage(document.getElementById('gl') as HTMLCanvasElement)
      const arcs: ArcSpec[] = [
        ...HUBS_IN.map((h) => ({ from: [h.lat, h.lon] as [number, number], to: h.to, kind: 'in' as const })),
        ...MARKETS_OUT.map((m) => ({ from: m.from, to: [m.lat, m.lon] as [number, number], kind: 'out' as const })),
      ]
      globe = new Globe(landDots, arcs, th.globe)
      phone = new Phone(stage.renderer, th.phone, ['THIẾT KẾ: Ở NƯỚC NGOÀI', 'LINH KIỆN: NHIỀU QUỐC GIA', 'LẮP RÁP TẠI VIỆT NAM'])
      stage.add(globe)
      stage.add(phone)
      for (const mod of Object.values(SCENES)) if (mod.create) stage.add(mod.create(stage.renderer, th.light))
    } catch (err) {
      console.warn('WebGL không khởi tạo được, dùng chế độ tĩnh.', err)
      stage = null
    }
  }

  const deck = new Deck(document.getElementById('app')!, SLIDES, stage)
  deck.mountAll()
  if (stage) deck.onFrame(() => stage!.tick())
  // số đếm & nét vẽ chạy lại mỗi khi vào slide
  deck.onStation((_, i) => {
    countUp(deck.els[i], 0.7)
    drawLines(deck.els[i], 0.6)
  })

  mountUI(deck, {
    brand: `<b>N6</b> · ${meta.courseCode}`,
    budgetMinutes: meta.budgetMinutes,
    onTheme: () => {
      const th = palettes()
      globe?.setPalette(th.globe, th.light)
      phone?.setPalette(th.phone)
      stage?.setTheme(th.light)
    },
  })

  await document.fonts?.ready
  // vào đúng slide nếu URL có ?s=<số> (tập dượt từng phần) hoặc #<số>
  const q = new URLSearchParams(location.search).get('s')
  const h = /^#(\d+)$/.exec(location.hash)
  deck.goTo((q ? +q : h ? +h[1] : 1) - 1, true)
  document.documentElement.classList.add('is-ready')

  // kiểm thử tự động / tập dượt từ console: __deck.go(5)
  Object.assign(window, {
    __deck: {
      count: () => deck.count,
      go: (i: number) => deck.goTo(i, true),
      labels: () => deck.stations.map((s) => s.label),
      /** xuất kịch bản: slide, thời lượng gợi ý, ghi chú */
      script: () =>
        deck.stations.map((s, i) => ({
          chapter: i + 1,
          chapterTitle: s.label,
          label: s.label,
          seconds: s.seconds ?? 0,
          notes: s.notes ?? '',
        })),
    },
  })
}

boot()

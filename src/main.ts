import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/sections.css'

import { Engine, ScrollTrigger, reduceMotion } from './core/engine'
import { mountUI, mountPresenter } from './core/ui'
import { initReveals, splitWords, staticCounts } from './core/fx'
import { Stage } from './gl/stage'
import { Globe, type ArcSpec } from './gl/globe'
import { Phone } from './gl/phone'
import landDots from './data/land-dots.json'
import { meta } from './content/meta'
import { HUBS_IN, MARKETS_OUT } from './content/geo'
import { SECTIONS } from './sections'
import type { Ctx } from './sections/types'

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()

function glTheme() {
  const light = document.documentElement.dataset.theme === 'light'
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

  const app = document.getElementById('app')!
  app.innerHTML = SECTIONS.map((s) => s.html()).join('')

  const engine = new Engine()
  const ctx: Ctx = { engine, stage: null, globe: null, phone: null }

  // WebGL (bỏ qua êm nếu máy không hỗ trợ — nội dung chữ vẫn đầy đủ)
  if (webglOK()) {
    try {
      const th = glTheme()
      const stage = new Stage(document.getElementById('gl') as HTMLCanvasElement)
      const arcs: ArcSpec[] = [
        ...HUBS_IN.map((h) => ({ from: [h.lat, h.lon] as [number, number], to: h.to, kind: 'in' as const })),
        ...MARKETS_OUT.map((m) => ({ from: m.from, to: [m.lat, m.lon] as [number, number], kind: 'out' as const })),
      ]
      const globe = new Globe(landDots, arcs, th.globe)
      const phone = new Phone(stage.renderer, th.phone, ['THIẾT KẾ: Ở NƯỚC NGOÀI', 'LINH KIỆN: NHIỀU QUỐC GIA', 'LẮP RÁP TẠI VIỆT NAM'])
      stage.add(globe)
      stage.add(phone)
      engine.onFrame((y) => stage.tick(y))
      Object.assign(ctx, { stage, globe, phone })
    } catch (err) {
      console.warn('WebGL không khởi tạo được, dùng chế độ tĩnh.', err)
    }
  }

  // Chương
  SECTIONS.forEach((s) => {
    const el = document.getElementById(s.id)!
    if (s.chapter) engine.chapters.push({ ...s.chapter, el })
  })

  splitWords(app)
  SECTIONS.forEach((s) => s.mount(document.getElementById(s.id)!, ctx))
  if (reduceMotion) staticCounts(app)
  else initReveals(app)

  mountUI(engine, {
    brand: `<b>N6</b> · ${meta.courseCode}`,
    budgetMinutes: meta.budgetMinutes,
    onTheme: () => {
      const th = glTheme()
      ctx.globe?.setTheme(th.globe, th.light)
      ctx.phone?.setTheme(th.phone)
    },
  })

  await document.fonts?.ready
  engine.refresh()
  ScrollTrigger.addEventListener('refresh', () => engine.sortStations())
  // về đúng chương nếu URL có #id
  if (location.hash) {
    const el = document.querySelector(location.hash) as HTMLElement | null
    if (el) engine.lenis.scrollTo(el, { immediate: true })
  }
  document.documentElement.classList.add('is-ready')
}

boot()

/**
 * Xem thử một cảnh 3D độc lập (chỉ dùng khi phát triển):
 *   /dev/scene.html?scene=towers&mode=rise&p=1&from=0&x=1300&y=560&light=0
 * Khung nét đứt = sân khấu thiết kế 1920×1080 đã co vừa màn hình (giống chế độ trình chiếu).
 * Mỗi module cảnh mới trong src/gl/ xuất `create(renderer, light): GLScene`.
 */
import * as THREE from 'three'
import { DESIGN_H, DESIGN_W, Stage, type GLScene } from '../gl/stage'
import { Globe, type ArcSpec } from '../gl/globe'
import { Phone } from '../gl/phone'
import landDots from '../data/land-dots.json'
import { HUBS_IN, MARKETS_OUT } from '../content/geo'

const q = new URLSearchParams(location.search)
const name = q.get('scene') ?? 'globe'
const mode = q.get('mode') ?? ''
const light = q.get('light') === '1'
if (light) document.body.classList.add('light')

const modules = import.meta.glob('../gl/*.ts')

const stage = new Stage(document.getElementById('gl') as HTMLCanvasElement)
const frame = document.getElementById('frame') as HTMLElement
const mapper = () => {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  const left = (window.innerWidth - DESIGN_W * s) / 2
  const top = (window.innerHeight - DESIGN_H * s) / 2
  Object.assign(frame.style, { left: `${left}px`, top: `${top}px`, width: `${DESIGN_W * s}px`, height: `${DESIGN_H * s}px` })
  return { s, left, top }
}
stage.setMapper((x, y) => {
  const m = mapper()
  return { x: m.left + x * m.s, y: m.top + y * m.s, k: (DESIGN_H * m.s) / window.innerHeight }
})

async function make(): Promise<GLScene> {
  if (name === 'globe') {
    const arcs: ArcSpec[] = [
      ...HUBS_IN.map((h) => ({ from: [h.lat, h.lon] as [number, number], to: h.to, kind: 'in' as const })),
      ...MARKETS_OUT.map((m) => ({ from: m.from, to: [m.lat, m.lon] as [number, number], kind: 'out' as const })),
    ]
    return new Globe(landDots, arcs, { dot: '#cfc8b8', vn: '#e5383b', gold: '#e9b44c', red: '#e5383b', atmo: '#5f86b5' })
  }
  if (name === 'phone') return new Phone(stage.renderer, { line: '#d9d2c2', accent: '#e9b44c', red: '#e5383b', bg: '#0a0b0d' }, ['THIẾT KẾ: Ở NƯỚC NGOÀI', 'LINH KIỆN: NHIỀU QUỐC GIA', 'LẮP RÁP TẠI VIỆT NAM'])
  const key = `../gl/${name}.ts`
  const mod = (await modules[key]?.()) as { create?: (r: THREE.WebGLRenderer, light: boolean) => GLScene } | undefined
  if (!mod?.create) throw new Error(`Không tìm thấy create() trong ${key}`)
  return mod.create(stage.renderer, light)
}

make().then((scene) => {
  stage.add(scene)
  scene.setTheme?.(light)
  stage.show({
    scene: scene.name,
    mode,
    p: q.has('p') ? +q.get('p')! : 1,
    from: q.has('from') ? +q.get('from')! : 0,
    x: q.has('x') ? +q.get('x')! : 960,
    y: q.has('y') ? +q.get('y')! : 540,
    speed: q.has('speed') ? +q.get('speed')! : 0.55,
  })
  const hud = document.getElementById('hud')!
  const loop = () => {
    stage.tick()
    const st = stage.state
    hud.textContent = st ? `${st.scene} · ${st.mode} · p=${st.p.toFixed(2)}` : ''
    requestAnimationFrame(loop)
  }
  loop()
  Object.assign(window, { __scene: scene, __stage: stage })
})

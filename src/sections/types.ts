import type { Engine } from '../core/engine'
import type { Stage } from '../gl/stage'
import type { Globe } from '../gl/globe'
import type { Phone } from '../gl/phone'

export interface Ctx {
  engine: Engine
  stage: Stage | null
  globe: Globe | null
  phone: Phone | null
}

export interface Section {
  id: string
  /** chương mà section này mở đầu (nếu có) — dùng cho rail & phím số */
  chapter?: { n: number; title: string; short: string }
  html(): string
  mount(el: HTMLElement, ctx: Ctx): void
}

/** Đoạn ghi chú người nói: mảng câu → HTML */
export const notes = (...lines: string[]) => lines.map((l) => (l.startsWith('• ') ? `<p>• ${l.slice(2)}</p>` : `<p>${l}</p>`)).join('')

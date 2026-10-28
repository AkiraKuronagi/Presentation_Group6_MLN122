import { SRC } from '../content/sources'

/** Ghi chú người nói: mảng câu → HTML (dòng bắt đầu bằng "• " là gạch đầu dòng) */
export const notes = (...lines: string[]) => lines.map((l) => (l.startsWith('• ') ? `<p>• ${l.slice(2)}</p>` : `<p>${l}</p>`)).join('')

const nfCache = new Map<number, Intl.NumberFormat>()
/** Định dạng số kiểu Việt Nam: 27,62 · 45.416 */
export const nf = (v: number, d = 0) => {
  if (!nfCache.has(d)) nfCache.set(d, new Intl.NumberFormat('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }))
  return nfCache.get(d)!.format(v)
}

/** Số đếm dần khi slide hiện (fx.countUp đọc data-count) */
export const count = (v: number, d = 0) => `<span data-count="${v}" data-digits="${d}">${nf(v, d)}</span>`

/** Tên ngắn của nguồn (APA đầy đủ ở slide Tài liệu tham khảo) */
export const refs = (...ids: string[]) =>
  ids
    .map((id) => {
      const s = SRC[id]
      if (!s) throw new Error(`Thiếu nguồn: ${id}`)
      return `<span title="${s.apa.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;')}">${s.short}</span>`
    })
    .join('; ')

/** Dòng nguồn ở chân slide */
export const source = (html: string) => `<p class="src">Nguồn: ${html}</p>`

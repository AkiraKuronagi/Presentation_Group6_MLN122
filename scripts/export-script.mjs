// Xuất kịch bản thuyết trình từ ghi chú người nói trong trang, chia theo từng bạn (meta.members[].slides):
//   docs/KICH_BAN_THUYET_TRINH.md  và  docs/KICH_BAN_THUYET_TRINH.pdf
// Cần: đã build bản 1 file (npm run build:single) và có gói puppeteer-core + Chrome.
// Chạy: node scripts/export-script.mjs [đường-dẫn-chrome]
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const chrome = process.argv[2] ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const { default: puppeteer } = await import(process.env.PUPPETEER_PATH ?? 'puppeteer-core')

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900 })
await page.goto(pathToFileURL(resolve(root, 'dist-single/index.html')).href, { waitUntil: 'load' })
await page.waitForFunction(() => window.__deck, { timeout: 20000 })
const rows = await page.evaluate(() => window.__deck.script())
const members = await page.evaluate(() => window.__deck.members())

const strip = (h) =>
  h
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<b>|<\/b>/g, '**')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim()
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
const owner = (n) => members.find((m) => n >= m.slides[0] && n <= m.slides[1])
const parts = members.map((m) => ({ ...m, rows: rows.map((r, i) => ({ ...r, n: i + 1 })).filter((r) => owner(r.n) === m) }))
parts.forEach((p) => (p.seconds = p.rows.reduce((a, r) => a + r.seconds, 0)))
const total = rows.reduce((a, r) => a + r.seconds, 0)

// ─── Markdown ───
let md = '# Kịch bản thuyết trình — Nhóm 6 · MLN122\n\n'
md += '> Tự động xuất từ ghi chú người nói trong trang (phím **N** hoặc **P** khi trình chiếu). Sửa lời ở `src/slides/*.ts`, phân công ở `src/content/meta.ts`, rồi chạy lại `node scripts/export-script.mjs`.\n>\n'
md += '> Mỗi slide là đúng một khung hình: **↓ / → / Space** sang slide sau, **↑ / ←** quay lại. Slide 2 mở ở năm 1916 — nhấn ↓ lần đầu để lật sang “ngày nay”.\n\n'
md += '| Người trình bày | Slide | Phần | Thời lượng |\n|---|---|---|---|\n'
parts.forEach((p) => (md += `| ${p.name} | ${p.slides[0]}–${p.slides[1]} | ${p.part} | ${mmss(p.seconds)} |\n`))
md += `\n**Tổng thời lượng gợi ý: ${mmss(total)}** (Rubric 2.1: 10–20 phút, không vượt 20 phút).\n`
parts.forEach((p) => {
  md += `\n---\n\n# ${p.name} — slide ${p.slides[0]}–${p.slides[1]} (${mmss(p.seconds)})\n\n_${p.part}_\n`
  p.rows.forEach((r) => {
    const body = strip(r.notes)
      .split('\n')
      .filter(Boolean)
      .map((l) => (l.startsWith('• ') ? `- ${l.slice(2)}` : l))
      .join('\n\n')
    md += `\n## Slide ${r.n} · ${r.label} — ${mmss(r.seconds)}\n\n${body}\n`
  })
})
mkdirSync(resolve(root, 'docs'), { recursive: true })
writeFileSync(resolve(root, 'docs/KICH_BAN_THUYET_TRINH.md'), md)

// ─── PDF: mỗi bạn bắt đầu ở trang mới ───
const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;')
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  body { font-family: 'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif; font-size: 11.5pt; line-height: 1.55; color: #1b1b1b; }
  h1 { font-size: 20pt; margin: 0 0 4pt; } h2 { font-size: 15pt; margin: 0 0 2pt; color: #8a5a00; }
  h3 { font-size: 12pt; margin: 16pt 0 4pt; padding-top: 6pt; border-top: 1px solid #ddd; }
  h3 span { float: right; font-weight: 400; color: #777; }
  .sub { color: #666; margin: 0 0 12pt; } .part { page-break-before: always; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; } td, th { border: 1px solid #ccc; padding: 5pt 7pt; text-align: left; vertical-align: top; }
  th { background: #f3efe6; } p { margin: 0 0 6pt; } b { color: #000; }
</style></head><body>
  <h1>Kịch bản thuyết trình — Nhóm 6 · MLN122</h1>
  <p class="sub">Chủ đề 6 · Lớp SE1919 · Giảng viên BinhNV26 · Tổng thời lượng gợi ý ${mmss(total)} (không vượt 20 phút)</p>
  <table><tr><th>Người trình bày</th><th>Slide</th><th>Phần</th><th>Thời lượng</th></tr>
  ${parts.map((p) => `<tr><td>${p.name}</td><td>${p.slides[0]}–${p.slides[1]}</td><td>${p.part}</td><td>${mmss(p.seconds)}</td></tr>`).join('')}</table>
  <p class="sub">Điều khiển: ↓ / → / Space sang slide sau, ↑ / ← quay lại. Slide 2 mở ở năm 1916 — nhấn ↓ lần đầu để lật 5 thẻ sang “ngày nay”, nhấn ↓ lần nữa mới sang slide 3. Đây là gợi ý lời nói — mỗi bạn tập nói bằng lời của mình, không đọc nguyên văn.</p>
  ${parts
    .map(
      (p) => `<section class="part"><h2>${p.name}</h2><p class="sub">Slide ${p.slides[0]}–${p.slides[1]} · ${p.part} · ${mmss(p.seconds)}</p>
      ${p.rows.map((r) => `<h3>Slide ${r.n} · ${r.label}<span>${mmss(r.seconds)}</span></h3>${esc(r.notes)}`).join('')}</section>`,
    )
    .join('')}
</body></html>`
const pdf = await browser.newPage()
await pdf.setContent(html, { waitUntil: 'load' })
await pdf.pdf({ path: resolve(root, 'docs/KICH_BAN_THUYET_TRINH.pdf'), format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8pt;width:100%;text-align:center;color:#888"><span class="pageNumber"></span> / <span class="totalPages"></span></div>', margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' } })
await browser.close()
console.log(`OK: ${rows.length} slide, tổng ${mmss(total)} · ${parts.map((p) => `${p.name} ${mmss(p.seconds)}`).join(' · ')}`)

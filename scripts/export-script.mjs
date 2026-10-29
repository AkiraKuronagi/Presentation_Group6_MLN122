// Xuất kịch bản thuyết trình từ ghi chú người nói trong trang, chia theo từng bạn (meta.members[].slides):
//   docs/KICH_BAN_THUYET_TRINH.md (bản PDF nội dung nói nằm ngoài repo, thư mục ban-in/)
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

await browser.close()
console.log(`OK: ${rows.length} slide, tổng ${mmss(total)} · ${parts.map((p) => `${p.name} ${mmss(p.seconds)}`).join(' · ')}`)

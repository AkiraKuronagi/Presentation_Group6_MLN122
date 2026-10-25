// Xuất kịch bản thuyết trình (docs/KICH_BAN_THUYET_TRINH.md) từ ghi chú người nói trong trang.
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
await browser.close()

const strip = (h) =>
  h
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<b>|<\/b>/g, '**')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim()
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

let total = 0
let md = `# Kịch bản thuyết trình — Nhóm 6 · MLN122\n\n`
md += `> Tự động xuất từ ghi chú người nói trong trang (phím **N** hoặc **P** khi trình chiếu). Sửa nội dung ở \`src/sections/*.ts\` rồi chạy lại \`node scripts/export-script.mjs\`.\n\n`
md += `| # | Chương | Điểm dừng | Thời lượng | Cộng dồn | Người trình bày |\n|---|---|---|---|---|---|\n`
rows.forEach((r, i) => {
  total += r.seconds
  md += `| ${i + 1} | ${String(r.chapter).padStart(2, '0')} · ${r.chapterTitle} | ${r.label} | ${mmss(r.seconds)} | ${mmss(total)} | «…» |\n`
})
md += `\n**Tổng thời lượng gợi ý: ${mmss(total)}** (Rubric 2.1: 10–20 phút, không vượt 20 phút; minigame ≤ 5 phút theo FAQ).\n\n---\n`
let ch = -1
rows.forEach((r, i) => {
  if (r.chapter !== ch) {
    ch = r.chapter
    md += `\n## ${String(r.chapter).padStart(2, '0')} · ${r.chapterTitle}\n`
  }
  md += `\n### ${i + 1}. ${r.label} — ${mmss(r.seconds)}\n\n${strip(r.notes)
    .split('\n')
    .filter(Boolean)
    .map((l) => (l.startsWith('• ') ? `- ${l.slice(2)}` : l))
    .join('\n\n')}\n`
})
mkdirSync(resolve(root, 'docs'), { recursive: true })
writeFileSync(resolve(root, 'docs/KICH_BAN_THUYET_TRINH.md'), md)
console.log(`OK: ${rows.length} điểm dừng, tổng ${mmss(total)}`)

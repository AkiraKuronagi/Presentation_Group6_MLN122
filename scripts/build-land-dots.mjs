// Tạo dữ liệu chấm cho quả địa cầu (Natural Earth 110m, public domain, qua gói world-atlas).
// Chạy: npm run data:land  →  src/data/land-dots.json
//   land: [lat, lon, ...]  — lục địa, lưới gần-đều diện tích ~1°
//   vn:   [lat, lon, ...]  — lãnh thổ Việt Nam, lưới dày 0,3° + quần đảo Hoàng Sa, Trường Sa
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { feature } from 'topojson-client'
import { geoContains } from 'd3-geo'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (f) => JSON.parse(readFileSync(resolve(root, 'node_modules/world-atlas', f), 'utf8'))

const landTopo = read('land-110m.json')
const land = feature(landTopo, landTopo.objects.land)
const countriesTopo = read('countries-110m.json')
const vietNam = feature(countriesTopo, countriesTopo.objects.countries).features.find((f) => String(f.id) === '704')
if (!vietNam) throw new Error('Không tìm thấy Việt Nam (id 704) trong countries-110m')

const r2 = (v) => +v.toFixed(2)

// Lục địa
const ROWS = 180
const landOut = []
for (let r = 0; r < ROWS; r++) {
  const lat = -90 + (r + 0.5) * (180 / ROWS)
  if (lat < -60) continue // bỏ Nam Cực cho gọn
  const n = Math.max(1, Math.round(2 * ROWS * Math.cos((lat * Math.PI) / 180)))
  for (let c = 0; c < n; c++) {
    const lon = -180 + (c + 0.5) * (360 / n)
    if (geoContains(vietNam, [lon, lat])) continue // Việt Nam vẽ riêng, dày hơn
    if (geoContains(land, [lon, lat])) landOut.push(r2(lat), r2(lon))
  }
}

// Việt Nam — lưới dày
const vnOut = []
const STEP = 0.3
for (let lat = 8; lat <= 23.6; lat += STEP) {
  for (let lon = 102; lon <= 110; lon += STEP) {
    if (geoContains(vietNam, [lon, lat])) vnOut.push(r2(lat), r2(lon))
  }
}
// Quần đảo Hoàng Sa (Đà Nẵng) và Trường Sa (Khánh Hòa) — chủ quyền của Việt Nam.
// Bản đồ 110m không vẽ đảo nhỏ nên thêm thủ công các điểm tiêu biểu.
const archipelagos = [
  // Hoàng Sa
  [16.83, 112.33], [16.53, 111.61], [16.45, 111.7], [16.95, 112.27], [16.66, 112.73], [16.08, 111.79], [16.25, 112.0],
  // Trường Sa
  [8.64, 111.92], [11.43, 114.33], [9.88, 114.33], [10.18, 114.36], [10.37, 114.48], [7.89, 112.91], [8.17, 113.3],
  [10.86, 114.08], [9.3, 113.0], [8.85, 112.6], [10.5, 115.0],
]
for (const [lat, lon] of archipelagos) vnOut.push(lat, lon)

mkdirSync(resolve(root, 'src/data'), { recursive: true })
writeFileSync(resolve(root, 'src/data/land-dots.json'), JSON.stringify({ land: landOut, vn: vnOut }))
console.log(`land dots: ${landOut.length / 2}, vn dots: ${vnOut.length / 2}`)

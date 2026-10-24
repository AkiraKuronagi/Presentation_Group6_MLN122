import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`         → dist/ (đưa lên GitHub Pages / máy chủ tĩnh)
// `npm run build:single`  → dist-single/index.html: MỘT file duy nhất, mở trực tiếp bằng trình duyệt
//                            (không cần mạng, không cần máy chủ) — dùng cho máy chiếu ở lớp.
export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    base: './',
    plugins: single ? [viteSingleFile({ removeViteModuleLoader: true })] : [],
    build: {
      outDir: single ? 'dist-single' : 'dist',
      assetsInlineLimit: single ? 100_000_000 : 4096,
      chunkSizeWarningLimit: 2000,
      target: 'es2020',
    },
  }
})

import { SOURCES } from '../content/sources'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

/** Danh mục tài liệu tham khảo riêng (Checklist Tab 4 – mục 4), APA 7, theo thứ tự xuất hiện trong sources.ts */
export const refs: Section = {
  id: 'tai-lieu',
  chapter: { n: 11, title: 'Tài liệu tham khảo', short: 'Nguồn' },
  html: () => `
  <section class="sec sec--pad" id="tai-lieu" aria-label="Tài liệu tham khảo">
    <div class="wrap">
      <div class="lede">
        <div>
          <div class="chapter-tag"><span class="chapter-tag__n">11</span><span class="eyebrow">APA 7 · ${SOURCES.length} nguồn</span></div>
          <h2 class="display t-h1">Tài liệu tham khảo</h2>
        </div>
        <div>
          <p class="t-small c-dim">Chỉ dùng nguồn chính thống: giáo trình, văn kiện Đảng, văn bản pháp luật, cơ quan nhà nước, báo Đảng – Chính phủ, tổ chức thuộc LHQ và quốc tế, báo cáo bắt buộc của doanh nghiệp nộp cơ quan quản lý. Các phép so sánh “lần GDP”, tỷ lệ năm 2016–2017 do nhóm tự tính từ số liệu gốc.</p>
          <p class="t-small c-dim">Nhóm có sử dụng công cụ AI hỗ trợ tìm nguồn, dựng giao diện và phản biện; mọi số liệu đã được đối chiếu lại với nguồn gốc — chi tiết trong <b>Phụ lục AI</b> nộp kèm.</p>
        </div>
      </div>
      <ol class="refs">
        ${SOURCES.map((s) => `<li id="ref-${s.id}">${s.apa}${s.url ? ` <a href="${s.url}" target="_blank" rel="noopener">${s.url.replace(/^https?:\/\//, '').slice(0, 70)}${s.url.length > 78 ? '…' : ''}</a>` : ''}</li>`).join('')}
      </ol>
    </div>
  </section>`,
  mount(el, { engine }) {
    engine.addStation({
      id: 'refs',
      chapter: 11,
      label: 'Tài liệu tham khảo',
      y: () => docTop(el),
      seconds: 10,
      notes: notes('Lướt qua: nguồn chính thống, trích dẫn APA 7; nhắc tới Phụ lục AI đã nộp kèm.'),
    })
  },
}

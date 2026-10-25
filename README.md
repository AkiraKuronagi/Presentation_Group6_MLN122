# Ai nắm giữ chuỗi giá trị? — Nhóm 6 · MLN122

Trang thuyết trình dạng cuộn (scrollytelling) cho **Chủ đề 6 — Kinh tế chính trị Mác – Lênin (MLN122)**:
*Biểu hiện mới của độc quyền, độc quyền nhà nước trong điều kiện ngày nay: các tập đoàn xuyên quốc gia, chuỗi giá trị toàn cầu và vai trò lịch sử của chủ nghĩa tư bản.*

- Lý luận: Giáo trình KTCT Mác – Lênin (Bộ GD&ĐT, 2021) Ch.4 mục III; phụ trợ Ch.6 mục II. Lăng kính phụ: Giáo trình Triết học (2021) — lượng – chất, LLSX – QHSX.
- Minh chứng bắt buộc: số liệu FDI, xuất khẩu, tỷ lệ giá trị gia tăng nội địa (điện tử + dệt may) từ Cục Thống kê, cơ quan nhà nước, tổ chức thuộc LHQ; văn kiện Đảng.
- 12 phần · 35 điểm dừng · ~18 phút 40 giây (Rubric 2.1: không vượt 20 phút).

## Trình chiếu ở lớp (không cần mạng)

Mở **`dist-single/index.html`** bằng Chrome hoặc Edge — chỉ một file, chạy offline. Nhấn `F` để toàn màn hình.

| Phím | Tác dụng |
|---|---|
| `→` `Space` `PgDn` / `←` `PgUp` | Điểm dừng tiếp theo / trước |
| `1`…`9`, `0` | Nhảy tới phần (0 = phần 10) |
| `N` | Bật/tắt ghi chú người nói |
| `P` | Mở cửa sổ người thuyết trình (ghi chú + đồng hồ, điều khiển trang chính) |
| `T` / `R` | Đồng hồ bấm giờ / đặt lại |
| `L` | Giao diện sáng (phòng nhiều đèn, máy chiếu mờ) |
| `?` | Bảng phím tắt |

Mở thẳng một điểm dừng để tập dượt: `index.html?s=15` (điểm dừng số 15).

> Cửa sổ người thuyết trình (`P`) đồng bộ tốt nhất khi chạy qua máy chủ (`npm run preview` hoặc GitHub Pages). Mở trực tiếp file thì dùng phím `N`.

## Trước khi nộp — nhóm cần tự sửa

1. **`src/content/meta.ts`** — mã lớp, tên giảng viên, học kỳ, họ tên + MSSV các thành viên, link khảo sát (Google Form/Mentimeter, để trống thì ẩn QR).
2. **Số trang giáo trình KTCT**: đề bài ghi Ch.4 mục III “tr.134–151”, nhưng mục lục bản in 6/2021 (ISBN 978-604-57-6588-3) ghi **tr.149–168** (Ch.6 mục II: tr.260–286). Trang hiện chỉ trích theo *chương/mục*; nhóm đối chiếu cuốn sách đang dùng rồi mới ghi số trang.
3. **`docs/PHU_LUC_AI.md`** — bản nháp Phụ lục AI theo mẫu Tab 6: đọc, sửa cho đúng việc nhóm thực sự làm, điền link minh chứng.
4. **`docs/KICH_BAN_THUYET_TRINH.md`** — điền cột “Người trình bày”; tập nói bằng lời của mình (không đọc slide).
5. **`docs/PHAN_BIEN_DU_KIEN.md`** — câu hỏi phản biện 3C dự kiến + hướng trả lời (phần trả lời phản biện không được dùng AI).

Sau khi sửa: `npm run build:single` để tạo lại `dist-single/index.html`.

## Phát triển

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build:single
```

- `npm run build` → `dist/` (đưa lên GitHub Pages hoặc máy chủ tĩnh bất kỳ).
- `npm run data:land` → tạo lại dữ liệu chấm quả địa cầu (Natural Earth 110m; có thêm quần đảo Hoàng Sa, Trường Sa của Việt Nam).
- `node scripts/export-script.mjs` → xuất lại kịch bản từ ghi chú người nói (cần `puppeteer-core`).

### Cấu trúc

```
src/content/   nội dung & số liệu (sửa chữ ở đây): meta, theory, data, sources (APA 7), geo
src/sections/  từng chương: bố cục + ghi chú người nói + thời lượng
src/gl/        cảnh WebGL tự sinh bằng code: quả địa cầu (Three.js), điện thoại tách lớp → bản vẽ
src/charts/    biểu đồ SVG (bảng màu đã kiểm định cho người mù màu, có bảng số liệu tương đương)
src/core/      cuộn mượt (Lenis + GSAP), điểm dừng, phím tắt, cửa sổ người thuyết trình
```

Mọi hình ảnh động đều tự sinh bằng code — **không dùng ảnh/video AI**, không có hình ảnh lãnh tụ (tránh cờ ĐỎ #5 / VÀNG #5 trong Tab 4).

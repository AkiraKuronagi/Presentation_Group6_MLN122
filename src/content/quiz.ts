/** Minigame — 5 câu ≤ 5 phút (FAQ Q4 trong file Assignment); mọi đáp án đều có trong bài */
export interface Q {
  q: string
  opts: string[]
  a: number
  why: string
}

/** 5 câu ≤ 5 phút (FAQ Q4 trong file Assignment) — mọi đáp án đều có trong bài */
export const QUIZ: Q[] = [
  {
    q: 'Theo giáo trình, “hệ thống gia công” giữa tập đoàn lớn và doanh nghiệp vừa, nhỏ được xem là gì?',
    opts: ['Cạnh tranh tự do kiểu mới', 'Độc quyền dưới dạng mới', 'Một hình thức sở hữu nhà nước', 'Xuất khẩu hàng hóa thuần túy'],
    a: 1,
    why: 'Giáo trình KTCT (Ch.4 mục III.1): DN nhỏ phụ thuộc Concern/Conglomerate về nhiều mặt — đó là độc quyền dưới dạng mới.',
  },
  {
    q: 'Năm 2025, khu vực có vốn FDI chiếm khoảng bao nhiêu % kim ngạch xuất khẩu hàng hóa của Việt Nam?',
    opts: ['Khoảng 45%', 'Khoảng 60%', 'Khoảng 77%', 'Khoảng 95%'],
    a: 2,
    why: 'Cục Thống kê: 367,09/475,04 tỷ USD = 77,3% (9 tháng 2026: 80,7%).',
  },
  {
    q: 'Vì sao khâu lắp ráp, gia công chỉ THU VỀ phần nhỏ giá trị gia tăng của chuỗi?',
    opts: ['Vì lao động lắp ráp không tạo ra giá trị', 'Vì bên nắm công nghệ, thương hiệu có vị thế độc quyền nên thu về phần lớn giá trị', 'Vì khâu lắp ráp dùng ít lao động', 'Vì Nhà nước đánh thuế khâu lắp ráp rất cao'],
    a: 1,
    why: 'Lao động lắp ráp vẫn tạo ra giá trị; nhưng độc quyền công nghệ, thương hiệu cho phép “bán cao, mua thấp” → lợi nhuận độc quyền dồn về hai đầu đường cong.',
  },
  {
    q: 'Ví dụ nào là biểu hiện mới của độc quyền nhà nước TRONG CNTB?',
    opts: ['Đạo luật CHIPS của Mỹ dành 52,7 tỷ USD hỗ trợ các tập đoàn bán dẫn', 'Một cartel thỏa thuận giá bán', 'Quy tắc xuất xứ “từ vải trở đi” của EVFTA', 'Một doanh nghiệp nhỏ nhận gia công cho tập đoàn'],
    a: 0,
    why: 'Nhà nước tư sản dùng ngân sách, trợ cấp làm công cụ điều tiết, phục vụ lợi ích tập đoàn. Cartel là hình thức độc quyền tư nhân; quy tắc xuất xứ là luật chơi của khối liên kết; gia công là “hệ thống gia công”.',
  },
  {
    q: 'Theo giáo trình, gốc rễ các giới hạn của CNTB là mâu thuẫn giữa…?',
    opts: ['Cung và cầu trên thị trường', 'Trình độ xã hội hóa ngày càng cao của LLSX và chế độ chiếm hữu tư nhân TBCN', 'Nhà nước và thị trường', 'Xuất khẩu và nhập khẩu'],
    a: 1,
    why: 'Giáo trình KTCT Ch.4 mục III.3: QHSX TBCN tự điều chỉnh được trong giới hạn nhất định nên CNTB còn phát triển, nhưng không khắc phục triệt để được mâu thuẫn cơ bản này.',
  },
]

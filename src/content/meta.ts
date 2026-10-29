/**
 * ✏️  THÔNG TIN BÌA — nhóm tự sửa trước khi nộp.
 * (Checklist Tab 4 – mục 4: "Có trang bìa đầy đủ thông tin".)
 */
export const meta = {
  school: 'Trường Đại học FPT',
  courseCode: 'MLN122',
  courseName: 'Kinh tế chính trị Mác – Lênin',
  className: 'SE1919',
  lecturer: 'BinhNV26',
  group: 'Nhóm 6',
  topicNo: 'Chủ đề 6',
  /** slides: [từ, đến] — phần trình bày của từng bạn (dùng khi xuất kịch bản PDF); đổi tùy nhóm */
  members: [
    { name: 'Nguyễn Đình Ngọc Ân', slides: [1, 3], part: 'Mở đầu & lý luận: Lênin → biểu hiện mới, lăng kính triết học' },
    { name: 'Ngô Gia Kiệt', slides: [4, 6], part: 'Tập đoàn, tư bản tài chính & xuất khẩu tư bản (FDI)' },
    { name: 'Huỳnh Đăng Khoa', slides: [7, 11], part: 'Chuỗi giá trị toàn cầu: điện tử & dệt may' },
    { name: 'Đào Tâm Hoàng', slides: [12, 14], part: 'Biên giới mềm, độc quyền nhà nước, vai trò lịch sử của CNTB' },
    { name: 'Hồ Hữu Hoàng Huân', slides: [15, 18], part: 'Lựa chọn của Việt Nam, bài học sinh viên, kết luận' },
  ],
  /** Nhóm phản biện theo phân công */
  critics: ['Nhóm 7', 'Nhóm 8', 'Nhóm 9'],
  /**
   * Link khảo sát/thảo luận cho khán giả (Google Form, Mentimeter, Slido…).
   * Để trống '' thì trang tự ẩn mã QR.
   */
  pollUrl: '',
  /** Thời lượng thuyết trình tối đa theo Rubric 2.1 (phút) */
  budgetMinutes: 20,
}

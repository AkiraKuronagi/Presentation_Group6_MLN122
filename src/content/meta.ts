/**
 * ✏️  THÔNG TIN BÌA — nhóm tự sửa các dòng có dấu « » trước khi nộp.
 * (Checklist Tab 4 – mục 4: "Có trang bìa đầy đủ thông tin".)
 */
export const meta = {
  school: 'Trường Đại học FPT',
  courseCode: 'MLN122',
  courseName: 'Kinh tế chính trị Mác – Lênin',
  className: '«Mã lớp»',
  lecturer: '«Tên giảng viên»',
  group: 'Nhóm 6',
  topicNo: 'Chủ đề 6',
  semester: '«Học kỳ – năm học»',
  members: [
    { name: '«Họ và tên 1»', id: '«MSSV»', role: 'Trưởng nhóm' },
    { name: '«Họ và tên 2»', id: '«MSSV»', role: '' },
    { name: '«Họ và tên 3»', id: '«MSSV»', role: '' },
    { name: '«Họ và tên 4»', id: '«MSSV»', role: '' },
    { name: '«Họ và tên 5»', id: '«MSSV»', role: '' },
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

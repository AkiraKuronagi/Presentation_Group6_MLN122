import { SKILLS } from './data'
import { nf, refs } from '../slides/util'

/** Chọn ngành → vị trí trên "đường cong nụ cười" (slide Bài học cho sinh viên) */
export interface Major {
  id: string
  name: string
  /** vị trí trên đường cong, -1 (R&D) … 0 (lắp ráp) … 1 (thương hiệu) */
  t: number
  stage: string
  skills: Array<[string, string]>
  fact: string
}

export const MAJORS: Major[] = [
  {
    id: 'ic',
    name: 'Thiết kế vi mạch',
    t: -0.92,
    stage: 'R&D · thiết kế chip — đỉnh trái',
    skills: [
      ['Thiết kế số & tương tự', 'nền tảng điện tử, vật lý bán dẫn'],
      ['Công cụ EDA, kiểm chứng', 'học qua dự án, phòng thí nghiệm trường'],
      ['Tiếng Anh kỹ thuật', 'đọc tài liệu chuẩn quốc tế'],
      ['Sở hữu trí tuệ', 'bằng sáng chế, bí mật kinh doanh'],
    ],
    fact: `Cả nước mới có khoảng ${nf(SKILLS.chipDesignEngineers)} kỹ sư thiết kế chip; mục tiêu đào tạo ít nhất ${nf(SKILLS.chipDesignTarget)} nhân lực khâu thiết kế đến 2030 (${refs('most-chip', 'qd1017')})`,
  },
  {
    id: 'ai',
    name: 'Trí tuệ nhân tạo · Dữ liệu',
    t: -0.8,
    stage: 'R&D · công nghệ lõi — đỉnh trái',
    skills: [
      ['Toán, thống kê, học máy', 'nền tảng không thể “đi tắt”'],
      ['Dữ liệu & điện toán', 'xử lý dữ liệu lớn, MLOps'],
      ['Đạo đức & pháp lý AI', 'dùng AI có trách nhiệm'],
      ['Giải bài toán Việt Nam', 'ngôn ngữ, y tế, nông nghiệp…'],
    ],
    fact: `ILO: khoảng ${nf(SKILLS.aiExposedWorkersM, 1)} triệu lao động Việt Nam làm nghề có thể chịu tác động của AI tạo sinh (${refs('ilo-2026')})`,
  },
  {
    id: 'se',
    name: 'Kỹ thuật phần mềm',
    t: -0.6,
    stage: 'Phần mềm · sản phẩm số — sườn trái',
    skills: [
      ['Xây sản phẩm, không chỉ “gia công code”', 'từ outsourcing sang sản phẩm riêng'],
      ['Kiến trúc hệ thống, bảo mật', 'chất lượng chuẩn quốc tế'],
      ['Tư duy sản phẩm & người dùng', 'hiểu thị trường'],
      ['Bản quyền phần mềm', 'giữ giá trị ở lại'],
    ],
    fact: `Kinh tế số mới đạt ${nf(SKILLS.digitalEconomy2025, 2)}% GDP (2025); mục tiêu ${SKILLS.digitalEconomyTarget2030}% vào 2030 (${refs('nso-digital', 'nq57')})`,
  },
  {
    id: 'design',
    name: 'Thiết kế · Mỹ thuật số',
    t: -0.72,
    stage: 'Thiết kế sản phẩm (ODM) — sườn trái',
    skills: [
      ['Thiết kế sản phẩm, UX', 'tự đề xuất mẫu thay vì nhận mẫu'],
      ['Nghiên cứu xu hướng', 'dữ liệu người tiêu dùng'],
      ['Vật liệu & sản xuất', 'thiết kế làm ra được'],
      ['Bản sắc Việt', 'khác biệt khó sao chép'],
    ],
    fact: `Dệt may mới ~9% làm ODM, ~1% làm OBM (${refs('nd-dm-smile')}); Chiến lược đến 2030 yêu cầu chuyển sang thiết kế, thương hiệu (${refs('qd1643')})`,
  },
  {
    id: 'logi',
    name: 'Kinh doanh quốc tế · Logistics',
    t: 0.42,
    stage: 'Phân phối · chuỗi cung ứng — sườn phải',
    skills: [
      ['Quy tắc xuất xứ, FTA', 'EVFTA, CPTPP: “từ vải”, “từ sợi”'],
      ['Quản trị chuỗi cung ứng', 'tìm nguồn, tối ưu chi phí'],
      ['Luật thương mại quốc tế', 'phòng vệ thương mại, thuế quan'],
      ['Đàm phán với nhãn hàng', 'từ CMT lên FOB'],
    ],
    fact: `Tỷ lệ tận dụng ưu đãi C/O của dệt may chỉ ~15% (CPTPP), 30–35% (EVFTA) (${refs('moit-roo')})`,
  },
  {
    id: 'mkt',
    name: 'Marketing · Quản trị kinh doanh',
    t: 0.8,
    stage: 'Thương hiệu · bán hàng — đỉnh phải',
    skills: [
      ['Xây dựng thương hiệu (OBM)', 'từ “làm thuê” sang “làm chủ”'],
      ['Marketing số, thương mại điện tử', 'tiếp cận khách hàng toàn cầu'],
      ['Tài chính & quản trị rủi ro', 'đọc hiểu báo cáo, dòng vốn'],
      ['Kinh doanh có trách nhiệm', 'tuân thủ pháp luật, ESG'],
    ],
    fact: `Dệt may: chỉ ~1% làm thương hiệu riêng (OBM), theo TS Hoàng Xuân Hiệp (${refs('nd-dm-smile')})`,
  },
  {
    id: 'lang',
    name: 'Ngôn ngữ (Anh · Nhật · Hàn · Trung)',
    t: 0.6,
    stage: 'Cầu nối thị trường, dịch vụ — sườn phải',
    skills: [
      ['Ngoại ngữ + một chuyên môn', 'ngôn ngữ là công cụ, không là đích'],
      ['Hiểu văn hóa đối tác', 'Hàn Quốc, Singapore, Nhật Bản dẫn đầu vốn FDI'],
      ['Biên – phiên dịch chuyên ngành', 'kỹ thuật, pháp lý, thương mại'],
      ['Bản lĩnh văn hóa', 'hội nhập mà không “hòa tan”'],
    ],
    fact: `Lũy kế FDI: Hàn Quốc 94,6 tỷ USD, Singapore 89,8 tỷ USD (31/12/2025) (${refs('fia-2025')})`,
  },
]

/**
 * Tài liệu tham khảo — APA 7. Mỗi nguồn có id ngắn để trích dẫn trong bài: cite('nso-2025').
 * Chỉ dùng nguồn chính thống: giáo trình, văn kiện, cơ quan nhà nước, báo Đảng/Chính phủ,
 * tổ chức thuộc LHQ & quốc tế, báo cáo bắt buộc của doanh nghiệp (SEC).
 * ⚠️ Số trang giáo trình KTCT: đề bài ghi Ch.4 mục III "tr.134–151", nhưng mục lục bản in 6/2021
 *    (ISBN 978-604-57-6588-3) ghi Ch.4 mục III = tr.149–168, Ch.6 mục II = tr.260–286.
 *    Slide hiện ghi số trang theo cách đánh số của ĐỀ BÀI (Ch.4 mục III = tr.134–151, theo góp ý của giảng viên).
 *    Bản scan in 6/2021 lệch khoảng +15 trang (vd. concern/conglomerate: tr.150; “hệ thống gia công”: tr.151;
 *    5 đặc điểm của Lênin: tr.136–144) → nhóm đối chiếu cuốn sách đang dùng và ghi rõ bản in khi bị hỏi.
 */
export interface Source {
  id: string
  /** trích dẫn ngắn trong bài, kiểu APA: (Tác giả, năm) */
  short: string
  /** mục tài liệu tham khảo đầy đủ (HTML, tiêu đề in nghiêng bằng <i>) */
  apa: string
  url?: string
}

export const SOURCES: Source[] = [
  // ── Giáo trình, kinh điển, văn kiện ──────────────────────────────
  {
    id: 'gt-ktct',
    short: 'Bộ GD&ĐT, 2021a',
    apa: 'Bộ Giáo dục và Đào tạo. (2021a). <i>Giáo trình Kinh tế chính trị Mác – Lênin (Dành cho bậc đại học hệ không chuyên lý luận chính trị)</i>. Nxb. Chính trị quốc gia Sự thật. (Ch.2 mục I; Ch.4 mục II–III, tr.134–151; Ch.6 mục II)',
  },
  {
    id: 'gt-triet',
    short: 'Bộ GD&ĐT, 2021b',
    apa: 'Bộ Giáo dục và Đào tạo. (2021b). <i>Giáo trình Triết học Mác – Lênin (Dành cho bậc đại học hệ không chuyên lý luận chính trị)</i>. Nxb. Chính trị quốc gia Sự thật. (tr.241–244, 292–305, 317–323)',
  },
  {
    id: 'lenin-t27',
    short: 'Lênin, 2005',
    apa: 'Lênin, V. I. (2005). <i>Toàn tập</i> (T.27: Chủ nghĩa đế quốc, giai đoạn tột cùng của chủ nghĩa tư bản). Nxb. Chính trị quốc gia.',
  },
  {
    id: 'npt-2021',
    short: 'Nguyễn Phú Trọng, 2021',
    apa: 'Nguyễn Phú Trọng. (2021). Một số vấn đề lý luận và thực tiễn về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam. <i>Báo Nhân Dân điện tử</i>.',
    url: 'https://nhandan.vn/tin-tuc-su-kien/mot-so-van-de-ly-luan-va-thuc-tien-ve-chu-nghia-xa-hoi-va-con-duong-di-len-chu-nghia-xa-hoi-o-viet-nam-646305/',
  },
  {
    id: 'hp-2013',
    short: 'Hiến pháp, 2013',
    apa: 'Quốc hội. (2013). <i>Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam</i> (sửa đổi, bổ sung năm 2025; Điều 50, 51). Cổng Thông tin điện tử Chính phủ.',
    url: 'https://chinhphu.vn/hien-phap-nam-2013/chuong-iii-kinh-te-xa-hoi-van-hoa-giao-duc-khoa-hoc-cong-nghe-va-moi-truong-10052989',
  },
  {
    id: 'dh13',
    short: 'ĐCSVN, 2021',
    apa: 'Đảng Cộng sản Việt Nam. (2021). <i>Văn kiện Đại hội đại biểu toàn quốc lần thứ XIII</i> (T.I, tr.135–136). Nxb. Chính trị quốc gia Sự thật.',
    url: 'https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/gioi-thieu-van-kien-dang/quan-diem-moi-ve-xay-dung-nen-kinh-te-viet-nam-doc-lap-tu-chu-trong-van-kien-dai-hoi-xiii-cua-dang-3766',
  },
  {
    id: 'dh14',
    short: 'ĐCSVN, 2026',
    apa: 'Đảng Cộng sản Việt Nam. (2026). Toàn văn Nghị quyết Đại hội đại biểu toàn quốc lần thứ XIV của Đảng. <i>Báo Điện tử Chính phủ</i>.',
    url: 'https://baochinhphu.vn/toan-van-nghi-quyet-dai-hoi-dai-bieu-toan-quoc-lan-thu-xiv-cua-dang-102260206211344712.htm',
  },
  {
    id: 'nq59',
    short: 'Bộ Chính trị, 2025',
    apa: 'Bộ Chính trị. (2025). <i>Nghị quyết số 59-NQ/TW ngày 24/01/2025 về hội nhập quốc tế trong tình hình mới</i>. Báo Nhân Dân (chuyên trang).',
    url: 'https://nhandan.vn/special/nghi-quyet-59-ve-hoi-nhap-quoc-te-trong-tinh-hinh-moi/index.html',
  },
  {
    id: 'nq57',
    short: 'Bộ Chính trị, 2024',
    apa: 'Bộ Chính trị. (2024). <i>Nghị quyết số 57-NQ/TW ngày 22/12/2024 về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia</i>. Cổng TTĐT Chính phủ.',
    url: 'https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm',
  },

  // ── Số liệu Việt Nam ─────────────────────────────────────────────
  {
    id: 'nso-series',
    short: 'Tổng cục Thống kê, 2015–2025',
    apa: 'Tổng cục Thống kê. (2015–2025). <i>Báo cáo / Thông cáo báo chí tình hình kinh tế – xã hội quý IV và cả năm</i> (các năm 2015–2024; đường dẫn từng năm ở slide Tài liệu tham khảo). nso.gov.vn.',
  },
  {
    id: 'nso-2025',
    short: 'Cục Thống kê, 2026a',
    apa: 'Cục Thống kê – Bộ Tài chính. (2026a, tháng 1). <i>Báo cáo tình hình kinh tế – xã hội quý IV và năm 2025</i>. nso.gov.vn.',
    url: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/01/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2025/',
  },
  {
    id: 'nso-9m2026',
    short: 'Cục Thống kê, 2026b',
    apa: 'Cục Thống kê – Bộ Tài chính. (2026b, 03/10). <i>Báo cáo tình hình kinh tế – xã hội quý III và 9 tháng năm 2026</i>.',
    url: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/10/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iii-va-9-thang-nam-2026/',
  },
  {
    id: 'nso-dientu',
    short: 'Cục Thống kê, 2025',
    apa: 'Cục Thống kê – Bộ Tài chính. (2025, 10/10). <i>Xuất, nhập khẩu điện tử, máy tính và linh kiện: Động lực tăng trưởng xuất khẩu của Việt Nam giai đoạn 2016–2025</i>. nso.gov.vn.',
    url: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2025/10/xuat-nhap-khau-dien-tu-may-tinh-va-linh-kien-dong-luc-tang-truong-xuat-khau-cua-viet-nam-giai-doan-2016-2025/',
  },
  {
    id: 'nso-fdi-2025',
    short: 'Cục Thống kê, 2026d',
    apa: 'Cục Thống kê – Bộ Tài chính. (2026d, 01). <i>Ngành công nghiệp chế biến, chế tạo thu hút mạnh mẽ nhất dòng vốn đầu tư trực tiếp nước ngoài năm 2025</i>. nso.gov.vn.',
    url: 'https://www.nso.gov.vn/tin-tuc-thong-ke/2026/01/nganh-cong-nghiep-che-bien-che-tao-thu-hut-manh-me-nhat-dong-von-dau-tu-truc-tiep-nuoc-ngoai-nam-2025/',
  },
  {
    id: 'tttctt-2026',
    short: 'Minh Nhật, 2026',
    apa: 'Minh Nhật. (2026, 09/01). Năm 2025: Xuất nhập khẩu vượt mốc 930 tỷ USD, xuất siêu hơn 20 tỷ USD (số liệu Cục Thống kê). <i>Tạp chí Thị trường Tài chính Tiền tệ</i>.',
    url: 'https://thitruongtaichinhtiente.vn/nam-2025-xuat-nhap-khau-vuot-moc-930-ty-usd-xuat-sieu-hon-20-ty-usd-76025.html',
  },
  {
    id: 'fia-2025',
    short: 'Thời báo Tài chính VN, 2026',
    apa: 'Luyện Vũ. (2026, 12/01). FDI năm 2025 giữ nhịp tăng trưởng trong bối cảnh nhiều biến động (số liệu Cục Đầu tư nước ngoài). <i>Thời báo Tài chính Việt Nam</i>.',
    url: 'https://thoibaotaichinhvietnam.vn/fdi-nam-2025-giu-nhip-tang-truong-trong-boi-canh-nhieu-bien-dong-190432.html',
  },
  {
    id: 'fia-2026',
    short: 'Nguyễn Duy Quý & Đào Thanh Hương, 2026',
    apa: 'Nguyễn Duy Quý, & Đào Thanh Hương. (2026, 14/07). Phát triển kinh tế có vốn đầu tư nước ngoài: Thực trạng và định hướng. <i>Tạp chí Kinh tế – Tài chính</i>.',
    url: 'https://tapchikinhtetaichinh.vn/phat-trien-kinh-te-co-von-dau-tu-nuoc-ngoai-thuc-trang-va-dinh-huong-161738.html',
  },
  {
    id: 'qd1018',
    short: 'Thủ tướng Chính phủ, 2024b',
    apa: 'Thủ tướng Chính phủ. (2024b). <i>Quyết định số 1018/QĐ-TTg ngày 21/9/2024 ban hành Chiến lược phát triển công nghiệp bán dẫn Việt Nam đến năm 2030, tầm nhìn 2050</i>. Báo Nhân Dân.',
    url: 'https://nhandan.vn/den-2050-quy-mo-doanh-thu-cong-nghiep-ban-dan-tai-viet-nam-dat-tren-100-ty-usdnam-post832501.html',
  },
  {
    id: 'qd1017',
    short: 'Thủ tướng Chính phủ, 2024a',
    apa: 'Thủ tướng Chính phủ. (2024a). <i>Quyết định số 1017/QĐ-TTg ngày 21/9/2024 phê duyệt Chương trình “Phát triển nguồn nhân lực ngành công nghiệp bán dẫn đến năm 2030, định hướng đến năm 2050”</i>. Báo Điện tử Chính phủ.',
    url: 'https://baochinhphu.vn/den-nam-2030-dao-tao-it-nhat-50000-nhan-luc-dai-hoc-tro-len-phuc-vu-nganh-cong-nghiep-ban-dan-102240921174315997.htm',
  },
  {
    id: 'ilo-2026',
    short: 'ILO, 2026',
    apa: 'ILO. (2026, 16/04). <i>Generative AI could transform millions of jobs in Viet Nam, new ILO brief shows</i>. International Labour Organization.',
    url: 'https://www.ilo.org/resource/news/generative-ai-could-transform-millions-jobs-viet-nam-new-ilo-brief-shows',
  },
  {
    id: 'most-chip',
    short: 'Bộ KH&CN, 2026a',
    apa: 'Bộ Khoa học và Công nghệ. (2026a, 10/03). Việt Nam bước đầu hình thành nền tảng phát triển ngành công nghiệp bán dẫn. <i>Cổng TTĐT Bộ KH&CN</i>.',
    url: 'https://mst.gov.vn/viet-nam-buoc-dau-hinh-thanh-nen-tang-phat-trien-nganh-cong-nghiep-ban-dan-197260310202559254.htm',
  },
  {
    id: 'most-gii',
    short: 'Bộ KH&CN, 2026b',
    apa: 'Bộ Khoa học và Công nghệ. (2026b, 12/10). Từ kết quả GII 2026 đến nâng cao năng lực làm chủ công nghệ. <i>Cổng TTĐT Bộ KH&CN</i>.',
    url: 'https://mst.gov.vn/tu-ket-qua-gii-2026-den-nang-cao-nang-luc-lam-chu-cong-nghe-197261012203459288.htm',
  },
  {
    id: 'nso-digital',
    short: 'Cục Thống kê, 2026c',
    apa: 'Cục Thống kê – Bộ Tài chính. (2026c, 05/01). <i>Thông cáo báo chí tỷ trọng giá trị tăng thêm của kinh tế số trong GDP, GRDP giai đoạn 2021–2025</i>. nso.gov.vn.',
    url: 'https://www.nso.gov.vn/?p=59576',
  },

  // ── Dệt may ─────────────────────────────────────────────────────
  {
    id: 'nd-dm-2025',
    short: 'Báo Nhân Dân, 2025',
    apa: 'Báo Nhân Dân. (2025, 25/11). Xuất khẩu dệt may năm 2025 ước đạt 46 tỷ USD (họp báo của Hiệp hội Dệt may Việt Nam – VITAS). <i>Báo Nhân Dân điện tử</i>.',
    url: 'https://nhandan.vn/xuat-khau-det-may-nam-2025-uoc-dat-46-ty-usd-post925678.html',
  },
  {
    id: 'nd-dm-vai',
    short: 'Báo Nhân Dân, 2026',
    apa: 'Báo Nhân Dân. (2026, 20/3). Dệt may trước bài toán tự chủ nguyên liệu. <i>Báo Nhân Dân điện tử</i>.',
    url: 'https://nhandan.vn/det-may-truoc-bai-toan-tu-chu-nguyen-lieu-post949327.html',
  },
  {
    id: 'tcct-npl',
    short: 'Lê Thị Hồng Hạnh, 2026',
    apa: 'Lê Thị Hồng Hạnh. (2026, 03/8). Tác động của nhập khẩu nguyên phụ liệu đến năng lực cạnh tranh của ngành dệt may Việt Nam (dẫn số liệu sơ bộ của Cục Hải quan). <i>Tạp chí Công Thương – Các kết quả nghiên cứu khoa học và ứng dụng công nghệ</i>, (15).',
    url: 'https://tapchicongthuong.vn/tac-dong-cua-nhap-khau-nguyen-phu-lieu-den-nang-luc-canh-tranh-cua-nganh-det-may-viet-nam-538472.htm',
  },
  {
    id: 'nd-dm-smile',
    short: 'Hoàng Anh, 2024',
    apa: 'Hoàng Anh. (2024, 02/01). Nâng tầm giá trị dệt may – Bài 1: Định vị giá trị trong chuỗi. <i>Báo Nhân Dân điện tử</i>.',
    url: 'https://nhandan.vn/nang-tam-gia-tri-det-may-post790243.html',
  },
  {
    id: 'moit-roo',
    short: 'Bộ Công Thương, 2025',
    apa: 'Bộ Công Thương. (2025, 19/11). Gỡ nút thắt nguyên phụ liệu dệt may, tận dụng dài hạn C/O ưu đãi. <i>Cổng TTĐT Bộ Công Thương</i>.',
    url: 'https://moit.gov.vn/tin-tuc/thi-truong-nuoc-ngoai/go-nut-that-nguyen-phu-lieu-det-may-tan-dung-dai-han-c-o-uu-dai.html',
  },
  {
    id: 'qd1643',
    short: 'Thủ tướng Chính phủ, 2022',
    apa: 'Thủ tướng Chính phủ. (2022). <i>Quyết định số 1643/QĐ-TTg ngày 29/12/2022 phê duyệt Chiến lược phát triển ngành Dệt May và Da Giầy Việt Nam đến năm 2030, tầm nhìn đến năm 2035</i>.',
    url: 'https://vanban.chinhphu.vn/?docid=207102&pageid=27160',
  },
  {
    id: 'vcci-loc',
    short: 'VCCI, 2025',
    apa: 'VCCI. (2025). Tỷ lệ nội địa hóa dệt may được cải thiện đáng kể (đăng lại từ Báo Đầu tư). <i>vcci.com.vn</i>.',
    url: 'https://www.vcci.com.vn/tin-tuc/ty-le-noi-dia-hoa-det-may-duoc-cai-thien-dang-ke',
  },

  // ── Quốc tế ─────────────────────────────────────────────────────
  {
    id: 'wir2026',
    short: 'UNCTAD, 2026',
    apa: 'UNCTAD. (2026). <i>World Investment Report 2026</i>. United Nations.',
    url: 'https://unctad.org/system/files/official-document/wir2026_en.pdf',
  },
  {
    id: 'wir2013',
    short: 'UNCTAD, 2013',
    apa: 'UNCTAD. (2013). <i>World Investment Report 2013: Global value chains – Investment and trade for development</i> (Overview). United Nations.',
    url: 'https://unctad.org/system/files/official-document/wir2013overview_en.pdf',
  },
  {
    id: 'gvc2017',
    short: 'WTO và cộng sự, 2017',
    apa: 'WTO, World Bank Group, OECD, IDE-JETRO, & UIBE. (2017). <i>Global Value Chain Development Report 2017</i> (Ch.2, tr.54 – “smile curve”).',
    url: 'https://www.wto.org/english/res_e/booksp_e/gvcs_report_2017_chapter2.pdf',
  },
  {
    id: 'wipr2017',
    short: 'WIPO, 2017',
    apa: 'World Intellectual Property Organization. (2017). <i>World Intellectual Property Report 2017: Intangible capital in global value chains</i>. WIPO.',
    url: 'https://www.wipo.int/pressroom/en/articles/2017/article_0012.html',
  },
  {
    id: 'apple-10k',
    short: 'Apple Inc., 2025',
    apa: 'Apple Inc. (2025). <i>Form 10-K for the fiscal year ended September 27, 2025</i>. U.S. Securities and Exchange Commission.',
    url: 'https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm',
  },
  {
    id: 'blackrock',
    short: 'BlackRock, 2026',
    apa: 'BlackRock, Inc. (2026). <i>2025 Annual Report</i>. U.S. Securities and Exchange Commission.',
    url: 'https://www.sec.gov/Archives/edgar/data/2012383/000130817926000264/blk015204-arsa.pdf',
  },
  {
    id: 'wb-gdp',
    short: 'World Bank, 2026',
    apa: 'World Bank. (2026). <i>GDP (current US$) – Viet Nam</i> [Dữ liệu NY.GDP.MKTP.CD].',
    url: 'https://api.worldbank.org/v2/country/VNM/indicator/NY.GDP.MKTP.CD?format=json&date=2015:2025',
  },
  {
    id: 'chips-act',
    short: 'The White House, 2022',
    apa: 'The White House. (2022, 09/08). <i>Fact sheet: CHIPS and Science Act will lower costs, create jobs, strengthen supply chains, and counter China</i>.',
    url: 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/08/09/fact-sheet-chips-and-science-act-will-lower-costs-create-jobs-strengthen-supply-chains-and-counter-china/',
  },
  {
    id: 'eu-chips',
    short: 'European Commission, 2023',
    apa: 'European Commission. (2022, 08/02). <i>Digital sovereignty: Commission proposes Chips Act to confront semiconductor shortages and strengthen Europe’s technological leadership</i> (IP/22/729) — “more than €43 billion euros of public and private investments”.',
    url: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_22_729',
  },
  {
    id: 'intel-2025',
    short: 'Intel Corporation, 2025',
    apa: 'Intel Corporation. (2025, 22/8). <i>Intel, Trump Administration reach historic agreement to accelerate American technology and manufacturing leadership</i> [Thông cáo báo chí] — “equivalent to a 9.9 percent stake”. Business Wire.',
    url: 'https://www.businesswire.com/news/home/20250822458848/en',
  },
  {
    id: 'nd182',
    short: 'Báo Chính phủ, 2025d',
    apa: 'Báo Điện tử Chính phủ. (2025, 01/01). Quy định thành lập, quản lý Quỹ Hỗ trợ đầu tư (Nghị định 182/2024/NĐ-CP). <i>baochinhphu.vn</i>.',
    url: 'https://baochinhphu.vn/quy-dinh-thanh-lap-quan-ly-quy-ho-tro-dau-tu-102250101165503135.htm',
  },
  {
    id: 'oecd-pillar2',
    short: 'OECD/G20, 2021',
    apa: 'OECD/G20 Inclusive Framework on BEPS. (2021, 08/10). <i>Statement on a two-pillar solution to address the tax challenges arising from the digitalisation of the economy</i>.',
    url: 'https://www.oecd.org/content/dam/oecd/en/topics/policy-issues/beps/statement-on-a-two-pillar-solution-to-address-the-tax-challenges-arising-from-the-digitalisation-of-the-economy-october-2021.pdf',
  },
  {
    id: 'nq107',
    short: 'Báo Nhân Dân, 2023',
    apa: 'Báo Nhân Dân. (2023, 29/11). Chính thức áp thuế tối thiểu toàn cầu từ 1/1/2024 (Nghị quyết 107/2023/QH15). <i>Báo Nhân Dân điện tử</i>.',
    url: 'https://nhandan.vn/chinh-thuc-ap-thue-toi-thieu-toan-cau-tu-112024-post784978.html',
  },
  {
    id: 'nd236',
    short: 'Báo Chính phủ, 2025a',
    apa: 'Báo Điện tử Chính phủ. (2025a, 30/08). Chính phủ ban hành Nghị định về thuế tối thiểu toàn cầu (Nghị định 236/2025/NĐ-CP).',
    url: 'https://baochinhphu.vn/chinh-phu-ban-hanh-nghi-dinh-ve-thue-toi-thieu-toan-cau-102250830105805776.htm',
  },
  {
    id: 'bis-2022',
    short: 'U.S. BIS, 2022',
    apa: 'U.S. Department of Commerce, Bureau of Industry and Security. (2022, 07/10). <i>Commerce implements new export controls on advanced computing and semiconductor manufacturing items to the People’s Republic of China</i>.',
    url: 'https://www.bis.gov/press-release/commerce-implements-new-export-controls-advanced-computing-semiconductor-manufacturing-items-peoples',
  },
  {
    id: 'treasury-2022',
    short: 'U.S. Treasury, 2022',
    apa: 'U.S. Department of the Treasury. (2022, 13/04). <i>Remarks by Secretary of the Treasury Janet L. Yellen on way forward for the global economy</i>.',
    url: 'https://home.treasury.gov/news/press-releases/jy0714',
  },
  {
    id: 'vgp-tariff46',
    short: 'Báo Chính phủ, 2025b',
    apa: 'Báo Điện tử Chính phủ. (2025b, 04/04). Bộ Công Thương đề nghị Hoa Kỳ tạm hoãn áp thuế, hai bên còn không gian để đàm phán.',
    url: 'https://baochinhphu.vn/bo-cong-thuong-de-nghi-hoa-ky-tam-hoan-ap-thue-hai-ben-con-khong-gian-de-dam-phan-102250403194412688.htm',
  },
  {
    id: 'vgp-tariff20',
    short: 'Báo Chính phủ, 2025c',
    apa: 'Báo Điện tử Chính phủ. (2025c, 26/10). Việt Nam – Hoa Kỳ công bố Tuyên bố chung về khuôn khổ Hiệp định thương mại đối ứng.',
    url: 'https://baochinhphu.vn/viet-nam-hoa-ky-cong-bo-tuyen-bo-chung-ve-khuon-kho-hiep-dinh-thuong-mai-doi-ung-102251026170648115.htm',
  },
  {
    id: 'moit-2026',
    short: 'Bộ Công Thương, 2026',
    apa: 'Bộ Công Thương. (2026, 09/04). <i>Họp báo thường kỳ quý I/2026</i>. Cổng TTĐT Bộ Công Thương.',
    url: 'https://moit.gov.vn/tin-tuc/bo-cong-thuong-ho-p-ba-o-thuo-ng-ky-quy-l-2026.html',
  },
  {
    id: 'nd-301',
    short: 'Nhan Dan, 2026',
    apa: 'Nhan Dan Online. (2026). Taking initiative in response to new US tariffs. <i>en.nhandan.vn</i>.',
    url: 'https://en.nhandan.vn/taking-initiative-in-response-to-new-us-tariffs-post165522.html',
  },
  {
    id: 'wir-ineq',
    short: 'World Inequality Lab, 2025a',
    apa: 'Chancel, L., Gómez-Carrera, R., Piketty, T., và cộng sự. (2025a). <i>World Inequality Report 2026</i>. World Inequality Lab.',
    url: 'https://wir2026.wid.world/insight/global-economic-inequity/',
  },
  {
    id: 'unep-2025',
    short: 'UNEP, 2025',
    apa: 'UNEP. (2025). <i>Emissions Gap Report 2025</i> (tóm tắt qua UN News, 11/2025). United Nations Environment Programme.',
    url: 'https://news.un.org/en/story/2025/11/1166255',
  },
  {
    id: 'ipcc-2023',
    short: 'IPCC, 2023',
    apa: 'IPCC. (2023). <i>Climate Change 2023: Synthesis Report – Summary for Policymakers</i> (AR6). Intergovernmental Panel on Climate Change.',
    url: 'https://www.un.org/climatesecuritymechanism/sites/default/files/2025-07/IPCC_AR6_SYR_SPM.pdf',
  },
  {
    id: 'nq50',
    short: 'Bộ Chính trị, 2019',
    apa: 'Bộ Chính trị. (2019). <i>Nghị quyết số 50-NQ/TW ngày 20/8/2019 về định hướng hoàn thiện thể chế, chính sách, nâng cao chất lượng, hiệu quả hợp tác đầu tư nước ngoài đến năm 2030</i> (đăng trên Báo Pháp luật Việt Nam).',
    url: 'https://doanhnhan.baophapluat.vn/bo-chinh-tri-ban-hanh-nghi-quyet-ve-dau-tu-nuoc-ngoai-22033.html',
  },
  {
    id: 'wh-2025',
    short: 'The White House, 2025',
    apa: 'The White House. (2025, 31/07). <i>Further modifying the reciprocal tariff rates</i> [Executive order].',
    url: 'https://www.whitehouse.gov/presidential-actions/2025/07/further-modifying-the-reciprocal-tariff-rates/',
  },
  {
    id: 'vgp-ieepa',
    short: 'Báo Chính phủ, 2026b',
    apa: 'Báo Điện tử Chính phủ. (2026b, 23/02). Thuế quan Hoa Kỳ: Thuế đối ứng sẽ ngừng thu từ 24/2.',
    url: 'https://baochinhphu.vn/thue-quan-hoa-ky-thue-doi-ung-se-ngung-thu-tu-24-2-102260223154022631.htm',
  },
  {
    id: 'vgp-dam-phan',
    short: 'Báo Chính phủ, 2026c',
    apa: 'Báo Điện tử Chính phủ. (2026c, 07/10). Bộ Công Thương thông tin về tiến trình đàm phán Hiệp định thương mại đối ứng với Hoa Kỳ.',
    url: 'https://baochinhphu.vn/bo-cong-thuong-thong-tin-ve-tien-trinh-dam-phan-hiep-dinh-thuong-mai-doi-ung-voi-hoa-ky-102261007181551386.htm',
  },
  {
    id: 'wir-exec',
    short: 'World Inequality Lab, 2025b',
    apa: 'World Inequality Lab. (2025b). <i>World Inequality Report 2026 – Executive summary</i>.',
    url: 'https://wir2026.wid.world/insight/executive-summary/',
  },
  {
    id: 'wipo-gii',
    short: 'WIPO, 2026',
    apa: 'WIPO. (2026). <i>Global Innovation Index 2026 – Viet Nam ranking</i>. World Intellectual Property Organization.',
    url: 'https://www.wipo.int/edocs/gii-ranking/2026/vn.pdf',
  },
]

export const SRC = Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<string, Source>

/** Trích dẫn ngắn có liên kết, dùng trong HTML: cite('nso-2025') → (Cục Thống kê, 2026a) */
export function cite(...ids: string[]) {
  const parts = ids.map((id) => {
    const s = SRC[id]
    if (!s) throw new Error(`Thiếu nguồn: ${id}`)
    const n = SOURCES.indexOf(s) + 1
    return `<a href="#tai-lieu" data-ref="${n}" title="${s.apa.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;')}">${s.short}</a>`
  })
  return `<span class="cite">(${parts.join('; ')})</span>`
}

/**
 * Số liệu dùng trong bài — mỗi khối ghi rõ nguồn (id trong sources.ts).
 * Quy ước: số ước tính công bố cuối năm của Cục Thống kê; "(tự tính)" = nhóm tính từ số liệu gốc.
 */

/** Đường dẫn báo cáo năm của Tổng cục/Cục Thống kê (nso.gov.vn) dùng cho chuỗi FDI – xuất khẩu */
export const NSO_YEAR_URLS: Record<string, string> = {
  '2015': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2020/11/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2015/',
  '2016': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2020/11/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2020/',
  '2017': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2019/10/bao-cao-tinh-hinh-kinh-te-xa-hoi-nam-2017/',
  '2018': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2019/04/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2018/',
  '2019': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2019/12/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2019/',
  '2020': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2020/12/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2020/',
  '2021': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2021/12/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2021/',
  '2022': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2022/12/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2022/',
  '2023': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2023/12/thong-cao-bao-chi-ve-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2023/',
  '2024': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2025/01/thong-cao-bao-chi-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2024/',
  '2025': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/01/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iv-va-nam-2025/',
  '9T/2026': 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2026/10/bao-cao-tinh-hinh-kinh-te-xa-hoi-quy-iii-va-9-thang-nam-2026/',
}

/** FDI & xuất khẩu Việt Nam — nguồn: Tổng cục/Cục Thống kê (nso-series, nso-2025, nso-9m2026) */
export const FDI = {
  years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  /** vốn FDI thực hiện (giải ngân), tỷ USD — định nghĩa nhất quán qua các năm */
  disbursed: [14.5, 15.8, 17.5, 19.1, 20.4, 20.0, 19.74, 22.4, 23.18, 25.35, 27.62],
  /** tỷ trọng xuất khẩu của khu vực có vốn FDI (kể cả dầu thô), % — 2016, 2017 tự tính */
  exportShare: [70.9, 71.6, 72.6, 71.7, 68.8, 72.2, 73.6, 74.4, 73.1, 71.7, 77.3],
  exportShare9m2026: 80.7,
  totalExport2025: 475.04,
  fdiExport2025: 367.09,
  /** cán cân thương mại theo khu vực, tỷ USD */
  balance2025: { fdi: 49.46, domestic: -29.43 },
  balance9m2026: { fdi: 14.86, domestic: -34.28 },
  registered2025: 38.42,
  registered9m2026: 50.36,
  /** % vốn FDI thực hiện vào chế biến, chế tạo (2025) */
  manufacturingShare2025: 82.8,
  /** lũy kế đến 31/12/2025 (Cục Đầu tư nước ngoài, qua Thời báo Tài chính VN — fia-2025) */
  stock2025: { projects: 45416, registered: 529.6, disbursed: 350.22 },
  topStock: [
    { name: 'Hàn Quốc', value: 94.6, share: 18 },
    { name: 'Singapore', value: 89.8, share: 17 },
  ],
  /** vai trò của khu vực FDI (fia-2026): ~20% GDP, ~50% GTSX công nghiệp, ~5 triệu lao động */
  role: { gdp: 20, industry: 50, workersM: 5 },
}

/** Quy mô tập đoàn & tư bản tài chính (đơn vị tỷ USD) — wir2026, apple-10k, blackrock, wb-gdp */
export const SCALE = {
  vnGdp2025: 514.7,
  appleRevenueFY2025: 416.2,
  top100Revenue2025: 12677,
  top100Assets2025: 21611,
  blackrockAum2025: 14042,
  globalFdi2025: 1624,
  crossBorderMA2025: 420.5,
  appleGrossMargin: 46.9,
}

/** Dệt may — nd-dm-2025, nd-dm-vai, moit-cmt, nd-dm-smile, moit-roo, qd1643, vcci-loc */
export const TEXTILE = {
  export2025: 46,
  domesticValueAdded2025: 52,
  fabricImport2025: 17,
  modes: { cmt: 65, fob: 25, odm: 10 },
  sewingLabourShare: 80,
  sewingValueShare: '18–20',
  coUtilisation: { cptpp: 15, evfta: '30–35' },
  target2030: { export: '68–70', localisation: '56–60' },
  localisation: { textile: '45–48', electronics: '15–18' },
}

/**
 * Điện tử — chờ kết quả nghiên cứu mảng điện tử (đang chạy).
 * Đã xác minh: mục tiêu GTGT tại Việt Nam của ngành điện tử & bán dẫn đến 2030 chỉ 10–15% (qd1018);
 * nội địa hóa điện tử ~15–18% (vcci-loc); ~90% kim ngạch nhập khẩu là đầu vào sản xuất (vgp-930).
 */
export const ELECTRONICS = {
  vaTarget2030: '10–15',
  importInputsShare: 90,
}

/** Giới hạn của CNTB — wir-ineq, unep-2025, ipcc-2023 */
export const LIMITS = {
  incomeTop10: 53,
  incomeBottom50: 8,
  wealthTop10: 75,
  wealthBottom50: 2,
  wealthTop1: 37,
  emissions2024: 57.7,
  warmingCurrentPolicies: 2.8,
  warmingNdc: '2,3–2,5',
  householdTop10Emissions: '34–45',
  householdBottom50Emissions: '13–15',
}

/** Năng lực & mục tiêu — nq57, nso-digital, nso-2025, wipo-gii, qd1017, most-chip, ilo-2026 */
export const SKILLS = {
  digitalEconomy2025: 14.02,
  digitalEconomyTarget2030: 30,
  trainedLabour2025: 29.2,
  giiRank2026: 43,
  giiHumanCapitalRank2026: 79,
  chipDesignEngineers: 7000,
  chipDesignTarget: 15000,
  chipTotalTarget: 50000,
  aiExposedWorkersM: 11.5,
  rdTarget2030: 2,
}

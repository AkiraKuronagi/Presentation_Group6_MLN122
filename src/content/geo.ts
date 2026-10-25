/** Toạ độ cho các cung trên quả địa cầu (minh hoạ — không mang số liệu). */
const HN: [number, number] = [21.03, 105.85]
const BN: [number, number] = [21.18, 106.07] // Bắc Ninh
const HCM: [number, number] = [10.82, 106.63]
const HP: [number, number] = [20.86, 106.68] // Hải Phòng

/** Dòng vốn (vàng): từ các trung tâm đầu tư lớn vào Việt Nam */
export const HUBS_IN: Array<{ name: string; lat: number; lon: number; to: [number, number]; labelDy?: number }> = [
  { name: 'Singapore', lat: 1.35, lon: 103.82, to: HCM },
  { name: 'Hàn Quốc', lat: 37.57, lon: 126.98, to: BN, labelDy: -12 },
  { name: 'Nhật Bản', lat: 35.68, lon: 139.69, to: HN, labelDy: 14 },
  { name: 'Đài Loan (TQ)', lat: 25.03, lon: 121.56, to: HP },
  { name: 'Hồng Kông (TQ)', lat: 22.32, lon: 114.17, to: HCM },
  { name: 'Trung Quốc', lat: 31.23, lon: 121.47, to: HP },
  { name: 'Hà Lan', lat: 52.37, lon: 4.9, to: HCM },
  { name: 'Hoa Kỳ', lat: 37.34, lon: -121.89, to: HCM },
]

/** Dòng hàng hóa (đỏ): từ Việt Nam ra các thị trường lớn */
export const MARKETS_OUT: Array<{ name: string; lat: number; lon: number; from: [number, number] }> = [
  { name: 'Hoa Kỳ (bờ Tây)', lat: 34.05, lon: -118.24, from: HCM },
  { name: 'Hoa Kỳ (bờ Đông)', lat: 40.71, lon: -74.0, from: HP },
  { name: 'EU (Rotterdam)', lat: 51.92, lon: 4.48, from: HP },
  { name: 'Trung Quốc', lat: 39.9, lon: 116.4, from: HN },
  { name: 'Nhật Bản', lat: 34.69, lon: 135.5, from: HCM },
]

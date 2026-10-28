/**
 * Ảnh nền thật lấy từ Wikimedia Commons — chỉ giấy phép mở (PD / CC0 / CC BY / CC BY-SA), có ghi tác giả.
 * Không dùng ảnh do AI tạo; không dùng ảnh lãnh đạo, ảnh trẻ em nhận diện được.
 * Ảnh đã thu nhỏ (rộng 1920 px) nằm ở src/assets/img/<key>.jpg.
 */
export interface Photo {
  /** tên tệp gốc trên Commons */
  title: string
  author: string
  license: string
  /** trang mô tả tệp trên Commons */
  url: string
  licenseUrl: string
  /** mô tả ngắn hiện ở dòng ghi nguồn */
  caption: string
}

export const PHOTOS: Record<string, Photo> = {
  port: {
    title: 'Container Ship at the Hai Phong International Container Terminal 01.jpg',
    author: 'Nathan.cima',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    url: 'https://commons.wikimedia.org/wiki/File:Container_Ship_at_the_Hai_Phong_International_Container_Terminal_01.jpg',
    caption: 'Tàu container tại Cảng quốc tế Hải Phòng',
  },
  'factory-1910': {
    title: 'Ford assembly line - 1913.jpg',
    author: 'Không rõ tác giả (Lưu trữ Quốc gia Hoa Kỳ)',
    license: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Template:PD-US',
    url: 'https://commons.wikimedia.org/wiki/File:Ford_assembly_line_-_1913.jpg',
    caption: 'Dây chuyền lắp ráp Ford, Mỹ, 1913',
  },
  finance: {
    title: 'Manhattan at night.jpg',
    author: 'Bruno_53 (Flickr)',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    url: 'https://commons.wikimedia.org/wiki/File:Manhattan_at_night.jpg',
    caption: 'Khu tài chính Manhattan về đêm',
  },
}

const files = import.meta.glob('../assets/img/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

/** Ảnh nền cho slide; trả về undefined nếu ảnh chưa có (slide vẫn hiển thị bình thường) */
export function photo(key: string, opt: { pos?: string; dim?: number } = {}) {
  const src = files[`../assets/img/${key}.jpg`]
  const m = PHOTOS[key]
  if (!src || !m) return undefined
  // CC BY / BY-SA: ghi tác giả, giấy phép, nguồn và nói rõ ảnh đã được chỉnh (cắt khung, phủ lớp màu)
  return { src, credit: `Ảnh: ${m.caption} — ${m.author} · ${m.license} · Wikimedia Commons · đã cắt, phủ màu`, ...opt }
}

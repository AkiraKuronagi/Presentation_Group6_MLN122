import { meta } from '../content/meta'
import { docTop } from '../core/engine'
import { type Section, notes } from './types'

export const outro: Section = {
  id: 'ket',
  html: () => `
  <section class="sec sec--clear outro" id="ket" aria-label="Kết thúc">
    <div class="outro__pin">
      <div class="wrap">
        <p class="eyebrow">Thông điệp của nhóm</p>
        <h2 class="display t-mega outro__big" data-split>Hội nhập để lớn lên — <em class="c-gold">tự chủ để không bị cuốn đi.</em></h2>
        <div class="outro__foot mono">
          <span>${meta.group} · ${meta.courseCode} · ${meta.className}</span>
          <span>Cảm ơn thầy/cô và các bạn đã lắng nghe.</span>
          <span>Nhấn Home để quay lại đầu</span>
        </div>
      </div>
    </div>
  </section>`,
  mount(el, { engine, stage }) {
    const range = (): [number, number] => {
      const top = docTop(el)
      return [top, top + el.offsetHeight - window.innerHeight]
    }
    stage?.zone({ scene: 'globe', mode: 'footer', range })
    engine.addStation({
      id: 'outro',
      chapter: 12,
      label: 'Kết luận & cảm ơn',
      y: () => range()[0] + (range()[1] - range()[0]) * 0.5,
      seconds: 30,
      notes: notes(
        'Kết luận một câu: độc quyền ngày nay không biến mất mà đổi hình thức — tập đoàn xuyên quốc gia điều phối chuỗi giá trị toàn cầu và giữ hai đầu giá trị cao.',
        'Việt Nam lựa chọn hội nhập sâu rộng nhưng giữ vững độc lập, tự chủ; với sinh viên, đó là nâng năng lực để leo lên hai đầu “đường cong nụ cười”.',
        'Mời các nhóm phản biện đặt câu hỏi.',
      ),
    })
  },
}

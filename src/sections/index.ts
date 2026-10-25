import type { Section } from './types'
import { cover } from './s00-cover'
import { hook } from './s01-hook'
import { lenin } from './s02-lenin'
import { phil } from './s03-phil'
import { concentration } from './s04-concentration'
import { fdi } from './s05-fdi'
import { phone } from './s06-phone'
import { smile } from './s07-smile'
import { power } from './s08-power'
import { role } from './s09-role'
import { path } from './s10-path'
import { lesson } from './s11-lesson'
import { quiz } from './s12-quiz'
import { refs } from './s13-refs'
import { outro } from './s14-outro'

/** Thứ tự trình bày — tổng thời lượng gợi ý ~18:40 kể cả minigame (Rubric 2.1: không quá 20 phút); xem docs/KICH_BAN_THUYET_TRINH.md */
export const SECTIONS: Section[] = [cover, hook, lenin, phil, concentration, fdi, phone, smile, power, role, path, lesson, quiz, refs, outro]

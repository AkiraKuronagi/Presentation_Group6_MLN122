import type { Slide } from '../core/deck'
import { cover, hook, lenin, phil } from './intro'
import { fdi, fdiShare, towers } from './capital'
import { answer, containers, phoneBlueprint, phoneExplode, textile } from './chain'
import { softBorder, stateMono } from './power'
import { bridge, coin } from './role'
import { lesson, outro, quiz, references } from './end'

/** 20 slide — mỗi slide đúng một khung hình; thứ tự = thứ tự trình chiếu */
export const SLIDES: Slide[] = [
  cover,
  hook,
  lenin,
  phil,
  towers,
  fdi,
  fdiShare,
  containers,
  phoneExplode,
  phoneBlueprint,
  answer,
  textile,
  softBorder,
  stateMono,
  coin,
  bridge,
  lesson,
  quiz,
  outro,
  references,
]

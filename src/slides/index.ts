import type { Slide } from '../core/deck'
import { cover, lenin, phil } from './intro'
import { fdi, fdiShare, towers } from './capital'
import { answer, containers, phoneBlueprint, phoneExplode, textile } from './chain'
import { softBorder, stateMono } from './power'
import { bridge, coin } from './role'
import { lesson, outro, references } from './end'

/** 18 slide — mỗi slide đúng một khung hình; thứ tự = thứ tự trình chiếu */
export const SLIDES: Slide[] = [
  cover,
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
  outro,
  references,
]

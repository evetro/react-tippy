import prefix from './prefix'
import { matches } from './matches'
import { CONTENT } from '../../selectors.ts'

/**
* Applies the transition duration to each element
* @param {Element[]} els - Array of elements
* @param {Number} duration
*/
export default function applyTransitionDuration(els, duration) {
  els.forEach(el => {
    if (!el) return

    const isContent = matches.call(el, CONTENT)

    const _duration = isContent
      ? Math.round(duration/1.3)
      : duration

    el.style[prefix('transitionDuration')] = _duration + 'ms'
  })
}

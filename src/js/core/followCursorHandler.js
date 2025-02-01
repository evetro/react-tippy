import { Store } from './globals'

import { getCorePlacement } from '@package/utils'
import find from '../utils/find'
import prefix from '../utils/prefix'

/**
* Mousemove event listener callback method for follow cursor setting
* @param {MouseEvent} e
*/
export default function followCursorHandler(e) {
  const refData = find(Store, refData => refData.el === this)
  if (!refData) return;

  const {
    popper,
    settings: {
      offset: [dx, dy]
    }
  } = refData

  const position = getCorePlacement(
    popper.getAttribute('data-popper-placement') || 'top'
  )
  const halfPopperWidth = Math.round(popper.offsetWidth / 2)
  const halfPopperHeight = Math.round(popper.offsetHeight / 2)
  const viewportPadding = 10
  const pageWidth = document.documentElement.offsetWidth || document.body.offsetWidth

  const { pageX, pageY } = e

  let x, y

  switch (position) {
    case 'top':
      x = pageX - halfPopperWidth + dx
      y = pageY - 2.25 * halfPopperHeight
      break
    case 'left':
      x = pageX - ( 2 * halfPopperWidth ) - 10
      y = pageY - halfPopperHeight + dy
      break
    case 'right':
      x = pageX + halfPopperHeight
      y = pageY - halfPopperHeight + dy
      break
    case 'bottom':
      x = pageX - halfPopperWidth + dx
      y = pageY + halfPopperHeight / 1.5
      break
  }

  const isRightOverflowing = pageX + viewportPadding + halfPopperWidth + dx > pageWidth
  const isLeftOverflowing = pageX - viewportPadding - halfPopperWidth + dx < 0

  // Prevent left/right overflow
  if (position === 'top' || position === 'bottom') {
    if (isRightOverflowing) {
      x = pageWidth - viewportPadding - (2 * halfPopperWidth)
    }

    if (isLeftOverflowing) {
      x = viewportPadding
    }
  }

  popper.style[prefix('transform')] = `translate3d(${x}px, ${y}px, 0)`
}

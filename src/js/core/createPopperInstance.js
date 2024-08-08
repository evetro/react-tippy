import Popper from 'popper.js'

import defer from '../utils/defer'
import prefix from '../utils/prefix'
import getCorePlacement from '../utils/getCorePlacement'
import getInnerElements from '../utils/getInnerElements'
import getOffsetDistanceInPx from '../utils/getOffsetDistanceInPx'

const isObject = obj => (obj != null && (typeof obj === 'object') && !Array.isArray(obj))

/**
* Creates a new popper instance
* @param {Object} data
* @return {Object} - the popper instance
*/
export default function createPopperInstance(data) {
  const {
    el,
    popper,
    settings: {
      position,
      popperOptions,
      offset,
      distance,
      flipDuration
    }
  } = data

  const { tooltip } = getInnerElements(popper)

  const config = {
    placement: position,
    ...(isObject(popperOptions) ? popperOptions : {}),
    modifiers: {
      ...(isObject(popperOptions?.modifiers) ? popperOptions.modifiers : {}),
      flip: {
        padding: distance + 5 /* 5px from viewport boundary */,
        ...(isObject(popperOptions?.modifiers?.flip) ? popperOptions.modifiers.flip : {})
      },
      offset: {
        offset,
        ...(isObject(popperOptions?.modifiers?.offset) ? popperOptions.modifiers.offset : {})
      }
    },
    onUpdate() {
      const placementKey = getCorePlacement(popper.getAttribute('x-placement'))
      Object.assign(tooltip.style, {
        bottom: '',
        left: '',
        right: '',
        top: '',
        [placementKey]: getOffsetDistanceInPx(distance)
      })
    }
  }

  // Update the popper's position whenever its content changes
  // Not supported in IE10 unless polyfilled
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      popper.style[prefix('transitionDuration')] = '0ms'
      data.popperInstance.update()
      defer(() => {
        popper.style[prefix('transitionDuration')] = `${flipDuration}ms`
      })
    })

    observer.observe(popper, {
      childList: true,
      subtree: true,
      characterData: true
    })

    data._mutationObserver = observer
  }

  return new Popper(el, popper, config)
}

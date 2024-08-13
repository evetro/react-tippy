import { createPopperLite } from '@popperjs/core'

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

  const arrowMod = { // replaces margins in CSS stylesheet
    name: 'arrow',
    options: {
      padding: ({ placement }) => {
        if (placement?.includes?.('top') || placement?.includes?.('bottom')) {
          return { left: 9, right: 9 }
        }
        if (placement?.includes?.('left') || placement?.includes?.('right')) {
          return { top: 6, bottom: 6 }
        }
        return 0
      },
    }
  }
  
  const config = {
    placement: position,
    ...(isObject(popperOptions) ? popperOptions : {}),
    modifiers: {
      ...(isObject(popperOptions?.modifiers) ? popperOptions.modifiers : {}),
      flip: {
        padding: distance + 10 /* 5px from viewport boundary */,
        ...(isObject(popperOptions?.modifiers?.flip) ? popperOptions.modifiers.flip : {})
      },
      offset: {
        offset,
        ...(isObject(popperOptions?.modifiers?.offset) ? popperOptions.modifiers.offset : {})
      }
    },
    // TODO onUpdate is gone in v2; use a custom modifier where the property `phase` is set to 'afterWrite'
    onUpdate() {
      const placementKey = getCorePlacement(popper.getAttribute('data-popper-placement'))
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
      data.popperInstance?.forceUpdate?.()
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

  return createPopperLite(el, popper, config)
}

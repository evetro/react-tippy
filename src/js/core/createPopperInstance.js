import { createPopperLite } from '@popperjs/core'

import defer from '../utils/defer'
import prefix from '../utils/prefix'
import getCorePlacement from '../utils/getCorePlacement'
import getOffsetDistanceInPx from '../utils/getOffsetDistanceInPx'
import { TOOLTIP } from '../../selectors.ts'

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
      offset,
      distance,
      flipModifierOptions,
      flipDuration
    }
  } = data

  const options = {}
  Object.assign(
    options,
    (flipModifierOptions ?? {}),
    { padding: distance + 10 /* 10px from viewport boundary */ }
  )

  const modifiers = [{
    name: 'arrow',
    enabled: true,
    phase: 'main',
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
  }, {
    name: 'flip',
    options
  }, {
    name: 'offset',
    options: { offset }
  }, {
    name: 'computeStyles',
    options: {
      adaptive: false,
      gpuAcceleration: false,
    }
  }, {
    name: 'updateTooltipStyle',
    enabled: true,
    phase: 'afterWrite',
    fn({ state }) {
      const { attributes } = state
      const tooltip = popper.querySelector(TOOLTIP)
      const placementKey = getCorePlacement(attributes.popper['data-popper-placement'])
      Object.assign(tooltip.style, {
        bottom: '',
        left: '',
        right: '',
        top: '',
        [placementKey]: getOffsetDistanceInPx(distance)
      })
      return state
    }
  }]

  // Update the popper's position whenever its content changes
  // Not supported in IE10 unless polyfilled
  if (window?.MutationObserver) {
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

  return createPopperLite(el, popper, { placement: position, modifiers })
}

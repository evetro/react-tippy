import { Browser, Store, setBrowserTouch } from './globals'

import hideAllPoppers from './hideAllPoppers'

import closest from '../utils/closest'
import { matches } from '../utils/matches'
import { CONTROLLER, POPPER, TOOLTIPPED_EL } from '@package/selectors.ts'

/**
* Adds the needed event listeners
*/
export default function bindEventListeners() {
  const touchHandler = () => {
    setBrowserTouch(true)

    if (Browser.iOS()) {
      document.body.classList.add('tippy-touch')
    }

    if (Browser.dynamicInputDetection && window.performance) {
      document.addEventListener('mousemove', mousemoveHandler)
    }
  }

  const mousemoveHandler = (() => {
    let time

    return () => {
      const now = performance.now()

      // Chrome 60+ is 1 mousemove per rAF, therfore use 20ms time difference
      if (now - time < 20) {
        setBrowserTouch(false)
        document.removeEventListener('mousemove', mousemoveHandler)
        if (!Browser.iOS()) {
          document.body.classList.remove('tippy-touch')
        }
      }

      time = now
    }
  })()

  const clickHandler = event => {
    // Simulated events dispatched on the document
    if (!(event.target instanceof Element)) {
      return hideAllPoppers()
    }

    const el = closest(event.target, TOOLTIPPED_EL)
    const popper = closest(event.target, POPPER)

    if (popper) {
      const data = Store.find(d => d.popper === popper)
      if (!data) {
        return
      }

      const { settings: { interactive } } = data
      if (interactive) {
        return
      }
    }

    if (el) {
      const data = Store.find(d => d.el === el)
      if (!data) {
        return
      }

      const {
        settings: {
          hideOnClick,
          multiple,
          trigger
        }
      } = data

      // Hide all poppers except the one belonging to the element that was clicked IF
      // `multiple` is false AND they are a touch user, OR
      // `multiple` is false AND it's triggered by a click
      if ((!multiple && Browser.touch) || (!multiple && trigger.indexOf('click') !== -1)) {
        return hideAllPoppers(data)
      }

      // If hideOnClick is not strictly true or triggered by a click don't hide poppers
      if (hideOnClick !== true || trigger.indexOf('click') !== -1) {
        return
      }
    }

    // Don't trigger a hide for tippy controllers, and don't needlessly run loop
    if (closest(event.target, CONTROLLER) || !document.querySelector(POPPER)) {
      return
    }

    hideAllPoppers()
  }

  const blurHandler = (_) => {
    const { activeElement: el } = document
    if (el && el.blur && matches.call(el, TOOLTIPPED_EL)) {
      el.blur()
    }
  }

  // Hook events
  document.addEventListener('click', clickHandler)
  document.addEventListener('touchstart', touchHandler)
  window.addEventListener('blur', blurHandler)

  if (!Browser.SUPPORTS_TOUCH && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)) {
    document.addEventListener('pointerdown', touchHandler)
  }
}

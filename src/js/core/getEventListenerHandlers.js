import { Browser } from './globals'

import isVisible from '../utils/isVisible'
import closest from '../utils/closest'
import cursorIsOutsideInteractiveBorder from '../utils/cursorIsOutsideInteractiveBorder'
import { POPPER, TOOLTIPPED_EL } from '../../selectors.ts'

/**
* Returns relevant listener callbacks for each ref
* @param {Element} el
* @param {Element} popper
* @param {Object} settings
* @return {Object} - relevant listener handlers
*/
export default function getEventListenerHandlers(el, popper, settings) {
  const {
    delay,
    interactive,
    hideOnClick,
    hideOnScroll,
    trigger,
    touchHold
  } = settings

  let showDelay, hideDelay

  const showFn = () => {
    clearTimeout(showDelay)
    clearTimeout(hideDelay)

    // Not hidden. For clicking when it also has a `focus` event listener
    if (isVisible(popper)) return

    if (delay) {
      showDelay = setTimeout(
        () => this.show(popper),
        Array.isArray(delay) ? delay[0] : delay
      )
    } else {
      this.show(popper)
    }
  }

  const hideFn = () => {
    clearTimeout(showDelay)
    clearTimeout(hideDelay)

    if (delay) {
      hideDelay = setTimeout(
        () => this.hide(popper),
        Array.isArray(delay) ? delay[1] : delay
      )
    } else {
      this.hide(popper)
    }
  }

  const handleTrigger = event => {
    const mouseenterTouch = (
      event.type === 'mouseenter' && Browser.SUPPORTS_TOUCH && Browser.touch
    )

    if (mouseenterTouch && touchHold) return

    // Toggle show/hide when clicking click-triggered tooltips
    if (
      event.type === 'click'
      && isVisible(popper)
      && hideOnClick !== 'persistent'
    ) {
      hideFn()
    } else if (typeof this.callbacks.wait === 'function') {
      this.callbacks.wait.call(popper, showFn, event)
    } else {
      showFn()
    }

    if (mouseenterTouch && Browser.iOS() && el.click) {
      el.click()
    }
  }

  const handleMouseleave = event => {
    // Don't fire 'mouseleave', use the 'touchend'
    if (
      event.type === 'mouseleave'
      && Browser.SUPPORTS_TOUCH
      && Browser.touch && touchHold
    ) {
      return
    }

    if (interactive) {
      // Temporarily handle mousemove to check if the mouse left somewhere
      // other than its popper
      const handleMousemove = event => {

        const triggerHide = () => {
          document.body.removeEventListener('mouseleave', hideFn)
          document.removeEventListener('mousemove', handleMousemove)
          document.removeEventListener('scroll', hideFn)
          hideFn()
        }

        const closestTooltippedEl = closest(event.target, TOOLTIPPED_EL)

        const isOverPopper = closest(event.target, POPPER) === popper
        const isOverEl = closestTooltippedEl === el
        const isClickTriggered = trigger.indexOf('click') !== -1
        const isOverOtherTooltippedEl = closestTooltippedEl && closestTooltippedEl !== el

        if (isOverOtherTooltippedEl) {
          return triggerHide()
        }

        if (isOverPopper || isOverEl || isClickTriggered) return

        if (cursorIsOutsideInteractiveBorder(event, popper, settings)) {
          triggerHide()
        }
      }

      if (hideOnScroll) {
        document.addEventListener('scroll', hideFn)
      }

      document.body.addEventListener('mouseleave', hideFn)
      document.addEventListener('mousemove', handleMousemove)

      return
    }

    // If it's not interactive, just hide it
    hideFn()
  }

  const handleBlur = event => {
    // Ignore blur on touch devices, if there is no `relatedTarget`, hide
    // If the related target is a popper, ignore
    if (!event.relatedTarget || Browser.touch) return
    if (closest(event.relatedTarget, POPPER)) return

    hideFn()
  }

  return {
    handleTrigger,
    handleMouseleave,
    handleBlur
  }
}

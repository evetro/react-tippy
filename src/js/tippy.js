import Defaults from '@package/defaults.ts'
import toggleEventListeners from '@package/toggleEventListeners.ts'

import { Browser, Store } from './core/globals'
import init from './core/init'

/* Utility functions */
import defer from './utils/defer'
import find from './utils/find'
import findIndex from './utils/findIndex'
import removeTitle from './utils/removeTitle'
import elementIsInViewport from './utils/elementIsInViewport'
import triggerReflow from './utils/triggerReflow'
import modifyClassList from './utils/modifyClassList'
import getInnerElements from './utils/getInnerElements'
import applyTransitionDuration from './utils/applyTransitionDuration'
import isVisible from './utils/isVisible'

/* Core library functions */
import createPopperInstance from './core/createPopperInstance'
import followCursorHandler from './core/followCursorHandler'
import getArrayOfElements from './core/getArrayOfElements'
import onTransitionEnd from './core/onTransitionEnd'
import makeSticky from './core/makeSticky'
import createTooltips from './core/createTooltips'
import evaluateSettings from './core/evaluateSettings'

/**
* @param {String|Element|Element[]} selector
* @param {Object} settings (optional) - the object of settings to be applied to the instance
*/
export default class Tippy {
  constructor(selector, settings = {}) {
    this.callbacks = {}
    this.settings = {}
    if (Browser.SUPPORTED) {
      init()
      this.destroyed = false
      this.selector = selector
      const { wait, onShow, onShown, onHide, onHidden } = settings
      Object.assign(this.callbacks, {
        wait,
        show: onShow,
        shown: onShown,
        hide: onHide,
        hidden: onHidden
      })
      Object.assign(
        this.settings,
        Defaults,
        Object.entries(settings).reduce(nullishFilter, {})
      )
      this.store = createTooltips.call(this, getArrayOfElements(selector))
      Store.push.apply(Store, this.store)
    } else {
      this.destroyed = true
      this.store = []
    }
  }

  /**
  * Returns the reference element's popper element
  * @param {Element} el
  * @return {Element}
  */
  getPopperElement(el) {
    try {
      return find(this.store, d => d.el === el).popper
    } catch (e) {
      console.error('[getPopperElement]: Element passed as the argument does not exist in the instance')
    }
  }

  /**
  * Returns a popper's reference element
  * @param {Element} popper
  * @return {Element}
  */
  getReferenceElement(popper) {
    try {
      return find(this.store, d => d.popper === popper).el
    } catch (e) {
      console.error('[getReferenceElement]: Popper passed as the argument does not exist in the instance')
    }
  }

  /**
  * Returns the reference data object from either the reference element or popper element
  * @param {Element} ref (reference element or popper)
  * @return {Object}
  */
  getReferenceData(ref) {
    return find(this.store, d => d.el === ref || d.popper === ref)
  }

  /**
  * Enable a Popper element
  * @param {DOMElement} - popper
  */
  enable(popper) {
    this.updateSettings(popper, 'disabled', false)
    find(
      this.store, d => d.popper === popper
    )?.el?.setAttribute?.('disabled', '')
  }

  /**
  * Disable a Popper element
  * @param {DOMElement} - popper
  */
  disable(popper) {
    this.updateSettings(popper, 'disabled', true)
    find(
      this.store, d => d.popper === popper
    )?.el?.setAttribute?.('disabled', 'disabled')
    if (isVisible(popper)) this.hide(popper)
  }

  /**
  * Update settings
  * @param {DOMElement} - popper
  * @param {string} - name
  * @param {string} - value
  */
  updateSettings(popper, name, value) {
    const data = find(this.store, d => d.popper === popper)
    if (!data) return

    const newSettings = {
      ...data.settings,
      [name]: value,
    }
    data.settings = evaluateSettings(newSettings);

    const i = this.store.findIndex(d => d.popper === popper)
    if (i >= 0 && name !== 'disabled' && name !== 'open') {
      this.destroy(popper)
      Object.assign(this.settings, data.settings)
      const [tooltip] = createTooltips.call(this, [data.el])
      Store.push(tooltip)
      this.store[i] = tooltip
    }
  }

  /**
  * Shows a popper
  * @param {Element} popper
  * @param {Number} customDuration (optional)
  */
  show(popper, customDuration = undefined) {
    if (this.destroyed || isVisible(popper)) return

    const data = find(this.store, d => d.popper === popper)
    if (!data) return
    if (data?.el.getAttribute?.('disabled') === 'disabled') return

    const { tooltip, circle, content } = getInnerElements(popper)

    if (!document.body.contains(data.el)) {
      this.destroy(popper)
      return
    }

    this.callbacks.show?.call?.(popper)

    if (data.settings && data.settings.open === false) {
      return
    }

    const {
      el,
      settings: {
        appendTo,
        renderVirtualDom,
        sticky,
        interactive,
        followCursor,
        flipDuration,
        duration,
      }
    } = data

    renderVirtualDom?.(popper)

    const _duration = customDuration !== undefined
      ? customDuration
      : Array.isArray(duration) ? duration[0] : duration

    // Prevent a transition when popper changes position
    applyTransitionDuration([popper, tooltip, circle], 0)
  
    if (!appendTo.contains(popper)) {
      /**
      * Appends the popper and creates a popper instance if one does not exist
      * Also updates its position if need be and enables event listeners
      */
      appendTo.appendChild(popper)
  
      if (!data.popperInstance) {
        data.popperInstance = createPopperInstance(data)
      } else {
        data.popperInstance.forceUpdate()
      }
  
      // Since touch is determined dynamically, followCursor is set on mount
      if (followCursor && !Browser.touch) {
        el.addEventListener('mousemove', followCursorHandler)
        toggleEventListeners(data.popperInstance)
      } else {
        toggleEventListeners(data.popperInstance, true)
      }
    }

    popper.style.visibility = 'visible'
    popper.setAttribute('aria-hidden', 'false')
    el.setAttribute('aria-describedby', popper.id)

    // Wait for popper's position to update
    const fn = () => {
      // Sometimes the arrow will not be in the correct position, force another update
      if (!followCursor || Browser.touch) {
        data.popperInstance?.forceUpdate?.()
        applyTransitionDuration([popper], flipDuration)
      }

      // Re-apply transition durations
      applyTransitionDuration([tooltip, circle], _duration)

      // Make content fade out a bit faster than the tooltip if `animateFill`
      if (circle) content.style.opacity = 1

      // Interactive tooltips receive a class of 'active'
      if (interactive) {
        el.classList.add('active')
      }

      // Update popper's position on every animation frame
      if (sticky) {
        makeSticky(data)
      }

      // Repaint/reflow is required for CSS transition when appending
      triggerReflow(tooltip, circle)

      modifyClassList([tooltip, circle], list => {
        if (list.contains('tippy-notransition')) {
          list.remove('tippy-notransition')
        }
        list.remove('leave')
        list.add('enter')
      })

      // Wait for transitions to complete
      const cb = () => {
        if (!isVisible(popper) || data._onShownFired) return

        // Focus interactive tooltips only
        if (interactive) {
          popper.focus()
        }
        // Remove transitions from tooltip
        tooltip.classList.add('tippy-notransition')
        // Prevents shown() from firing more than once from early transition cancellations
        data._onShownFired = true

        this.callbacks.shown?.call?.(popper)
      }
      onTransitionEnd(data, _duration, cb)
    }
    defer(fn)
  }

  /**
  * Hides a popper
  * @param {Element} popper
  * @param {Number} customDuration (optional)
  */
  hide(popper, customDuration = undefined) {
    if (this.destroyed || !isVisible(popper)) return

    this.callbacks.hide?.call?.(popper)

    const data = find(this.store, d => d.popper === popper)
    if (!data) return;

    const { tooltip, circle, content } = getInnerElements(popper)

    // Prevent hide if open
    if (data?.settings?.disabled === false && data?.settings?.open) {
      return;
    }

    const {
      el,
      settings: {
        appendTo,
        interactive,
        html,
        trigger,
        unmountFromVirtualDom,
        unmountHTMLWhenHide,
        duration
      }
    } = data

    const _duration = customDuration !== undefined
      ? customDuration
      : Array.isArray(duration) ? duration[1] : duration

    data._onShownFired = false
    if (interactive) {
      el.classList.remove('active')
    }

    popper.style.visibility = 'hidden'
    popper.setAttribute('aria-hidden', 'true')
    el.removeAttribute('aria-describedby')

    applyTransitionDuration([tooltip, circle, circle ? content : null], _duration)

    if (circle) {
      content.style.opacity = 0
    }

    modifyClassList([tooltip, circle], list => {
      if (list.contains('tippy-tooltip')) {
        list.remove('tippy-notransition')
      }
      list.remove('enter')
      list.add('leave')
    })

    // Re-focus click-triggered HTML elements
    // and the tooltipped element IS in the viewport (otherwise it causes unsightly scrolling
    // if the tooltip is closed and the element isn't in the viewport anymore)
    if (html && trigger.indexOf('click') !== -1 && elementIsInViewport(el)) {
      el.focus()
    }

    // Wait for transitions to complete
    const fn = () => {
      // `isVisible` is not completely reliable to determine if we shouldn't
      // run the hidden callback, we need to check the computed opacity style.
      // This prevents glitchy behavior of the transition when quickly showing
      // and hiding a tooltip.
      if (
        isVisible(popper) ||
        !appendTo.contains(popper) ||
        getComputedStyle(tooltip).opacity === '1'
      ) return

      el.removeEventListener('mousemove', followCursorHandler)
      toggleEventListeners(data.popperInstance)
      appendTo.removeChild(popper)

      this.callbacks.hidden?.call?.(popper)

      if (unmountHTMLWhenHide) {
        unmountFromVirtualDom?.(content)
      }
    }
    onTransitionEnd(data, _duration, fn)
  }

  /**
  * Updates a popper with new content
  * @param {Element} popper
  */
  update(popper) {
    if (this.destroyed) return

    const data = find(this.store, d => d.popper === popper)
    if (!data) return;

    const { content } = getInnerElements(popper)
    const { el, settings: { html } } = data

    if (html instanceof Element) {
      console.warn('Aborted: update() should not be used if `html` is a DOM element')
    } else if (html) {
      content.innerHTML = document.getElementById(html.replace('#', '')).innerHTML
    } else {
      content.innerHTML = el.getAttribute('title') || el.getAttribute('data-original-title')
      removeTitle(el)
    }
  }

  /**
  * Destroys a popper
  * @param {Element} popper
  */
  destroy(popper) {
    if (this.destroyed) return
    const data = find(this.store, d => d.popper === popper)
    if (!data) return;

    const {
      el,
      popperInstance,
      listeners,
      _mutationObserver
    } = data

    // Ensure the popper is hidden
    if (isVisible(popper)) {
      this.hide(popper, 0)
    }

    // Remove Tippy-only event listeners from tooltipped element
    listeners.forEach(listener => el.removeEventListener(listener.event, listener.handler))

    // Restore original title
    const originalTitle = el.getAttribute('data-original-title')
    if (originalTitle) {
      el.setAttribute('title', originalTitle)
    }

    el.removeAttribute('data-original-title')
    el.removeAttribute('data-tooltipped')
    el.removeAttribute('aria-describedby')

    popperInstance?.destroy?.()
    _mutationObserver?.disconnect?.()

    // Remove from store
    Store.splice(findIndex(Store, d => d.popper === popper), 1)
  }

  /**
  * Destroys all tooltips created by the instance
  */
  destroyAll() {
    if (this.destroyed) return

    const storeLength = this.store.length

    this.store.forEach(({ popper }, index) => {
      this.destroy(popper)
      // Ensures that the filter method is called only once
      if (index === storeLength - 1) {
        this.store = Store.filter(d => d.tippyInstance === this)
      }
    })

    this.store = null
    this.destroyed = true
  }
}

//
// private utility modules
//

function nullishFilter(obj, [key, value]) {
  if (value == null) return obj
  return { ...obj, [key]: value }
}

import ReactDOM from 'react-dom'

import {
  Browser,
  Store,
  Selectors,
  Defaults
} from './core/globals'
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
import noop from './utils/noop'

/* Core library functions */
import followCursorHandler from './core/followCursorHandler'
import getArrayOfElements from './core/getArrayOfElements'
import onTransitionEnd from './core/onTransitionEnd'
import mountPopper from './core/mountPopper'
import makeSticky from './core/makeSticky'
import createTooltips from './core/createTooltips'
import evaluateSettings from './core/evaluateSettings'

/**
* @param {String|Element|Element[]} selector
* @param {Object} settings (optional) - the object of settings to be applied to the instance
*/
class Tippy {
  constructor(selector, settings = {}) {
    // Use default browser tooltip on unsupported browsers
    if (!Browser.SUPPORTED) return

    init()

    this.state = {
      destroyed: false
    }

    this.selector = selector

    this.settings = { ...Defaults, ...settings }

    this.callbacks = {
      wait: settings.wait,
      show: settings.onShow || noop,
      shown: settings.onShown || noop,
      hide: settings.onHide || noop,
      hidden: settings.onHidden || noop
    }

    this.store = createTooltips.call(this, getArrayOfElements(selector))
    Store.push.apply(Store, this.store)
  }

  /**
  * Returns the reference element's popper element
  * @param {Element} el
  * @return {Element}
  */
  getPopperElement(el) {
    try {
      return find(this.store, data => data.el === el).popper
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
      return find(this.store, data => data.popper === popper).el
    } catch (e) {
      console.error('[getReferenceElement]: Popper passed as the argument does not exist in the instance')
    }
  }

  /**
  * Returns the reference data object from either the reference element or popper element
  * @param {Element} x (reference element or popper)
  * @return {Object}
  */
  getReferenceData(x) {
    return find(this.store, data => data.el === x || data.popper === x)
  }

  /**
  * Update settings
  * @param {DOMElement} - popper
  * @param {string} - name
  * @param {string} - value
  */

  updateSettings(popper, name, value) {
    const data = find(this.store, data => data.popper === popper)
    if (!data) return

    const newSettings = {
      ...data.settings,
      [name]: value,
    }
    data.settings = evaluateSettings(newSettings);
  };

  /**
  * Shows a popper
  * @param {Element} popper
  * @param {Number} customDuration (optional)
  */
  show(popper, customDuration) {
    if (this.state.destroyed) return

    const data = find(this.store, data => data.popper === popper)
    if (!data) return;

    const { tooltip, circle, content } = getInnerElements(popper)

    if (!document.body.contains(data.el)) {
      this.destroy(popper)
      return
    }

    this.callbacks.show.call(popper)

    if (data.settings && data.settings.open === false) {
      return;
    }

    // begin custom react logic
    if (data.settings.reactDOM) {
      ReactDOM.render(
        data.settings.reactDOM,
        popper.querySelector(Selectors.CONTENT)
      );
    }
    // end custom react logic

    const {
      el,
      settings: {
        sticky,
        interactive,
        followCursor,
        flipDuration,
        duration,
        dynamicTitle
      }
    } = data

    if (dynamicTitle) {
      const title = el.getAttribute('title')
      if (title) {
        content.innerHTML = title
        removeTitle(el)
      }
    }

    const _duration = customDuration !== undefined
      ? customDuration
      : Array.isArray(duration) ? duration[0] : duration

    // Prevent a transition when popper changes position
    applyTransitionDuration([popper, tooltip, circle], 0)

    mountPopper(data)

    popper.style.visibility = 'visible'
    popper.setAttribute('aria-hidden', 'false')
    el.setAttribute('aria-describedby', popper.id)

    // Wait for popper's position to update
    const fn = () => {
      // Sometimes the arrow will not be in the correct position, force another update
      if (!followCursor || Browser.touch) {
        data.popperInstance.update()
        applyTransitionDuration([popper], flipDuration)
      }

      // Re-apply transition durations
      applyTransitionDuration([tooltip, circle], _duration)

      // Make content fade out a bit faster than the tooltip if `animateFill`
      if (circle) content.style.opacity = 1

      // Interactive tooltips receive a class of 'active'
      interactive && el.classList.add('active')

      // Update popper's position on every animation frame
      sticky && makeSticky(data)

      // Repaint/reflow is required for CSS transition when appending
      triggerReflow(tooltip, circle)

      modifyClassList([tooltip, circle], list => {
        list.contains('tippy-notransition') && list.remove('tippy-notransition')
        list.remove('leave')
        list.add('enter')
      })

      // Wait for transitions to complete
      const cb = () => {
        if (!isVisible(popper) || data._onShownFired) return

        // Focus interactive tooltips only
        interactive && popper.focus()
        // Remove transitions from tooltip
        tooltip.classList.add('tippy-notransition')
        // Prevents shown() from firing more than once from early transition cancellations
        data._onShownFired = true

        if (typeof this.callbacks.shown === 'function') {
          this.callbacks.shown.call(popper)
        }
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
  hide(popper, customDuration) {
    if (this.state.destroyed) return

    this.callbacks.hide.call(popper)

    const data = find(this.store, data => data.popper === popper)
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
        duration
      }
    } = data

    const _duration = customDuration !== undefined
      ? customDuration
      : Array.isArray(duration) ? duration[1] : duration

    data._onShownFired = false
    interactive && el.classList.remove('active')

    popper.style.visibility = 'hidden'
    popper.setAttribute('aria-hidden', 'true')
    el.removeAttribute('aria-describedby')

    applyTransitionDuration([tooltip, circle, circle ? content : null], _duration)

    if (circle) content.style.opacity = 0

    modifyClassList([tooltip, circle], list => {
      list.contains('tippy-tooltip') && list.remove('tippy-notransition')
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
      data.popperInstance.disableEventListeners()
      appendTo.removeChild(popper)

      this.callbacks.hidden.call(popper)

      // begin custom react logic
      if (data && data.settings && data.settings.unmountHTMLWhenHide && data.settings.reactDOM) {
        ReactDOM.unmountComponentAtNode(content);
      }
      // end custom react logic
    }
    onTransitionEnd(data, _duration, fn)
  }

  /**
  * Updates a popper with new content
  * @param {Element} popper
  */
  update(popper) {
    if (this.state.destroyed) return

    const data = find(this.store, data => data.popper === popper)
    if (!data) return;

    const { content } = getInnerElements(popper)
    const { el, settings: { html } } = data

    if (html instanceof Element) {
      console.warn('Aborted: update() should not be used if `html` is a DOM element')
      return
    }

    content.innerHTML = html
      ? document.getElementById(html.replace('#', '')).innerHTML
      : el.getAttribute('title') || el.getAttribute('data-original-title')

    if (!html) removeTitle(el)
  }

  /**
  * Destroys a popper
  * @param {Element} popper
  * @param {Boolean} _isLast - private param used by destroyAll to optimize
  */
  destroy(popper, _isLast) {
    if (this.state.destroyed) return

    const data = find(this.store, data => data.popper === popper)
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

    popperInstance && popperInstance.destroy()
    _mutationObserver && _mutationObserver.disconnect()

    // Remove from store
    Store.splice(findIndex(Store, data => data.popper === popper), 1)

    // Ensures that the filter method is called only once
    if (_isLast === undefined || _isLast) {
      this.store = Store.filter(data => data.tippyInstance === this)
    }
  }

  /**
  * Destroys all tooltips created by the instance
  */
  destroyAll() {
    if (this.state.destroyed) return

    const storeLength = this.store.length

    this.store.forEach(({popper}, index) => {
      this.destroy(popper, index === storeLength - 1)
    })

    this.store = null
    this.state.destroyed = true
  }
}

function tippy(selector, settings) {
  return new Tippy(selector, settings)
}

tippy.Browser = Browser
tippy.Defaults = Defaults
tippy.disableDynamicInputDetection = () => Browser.dynamicInputDetection = false
tippy.enableDynamicInputDetection = () => Browser.dynamicInputDetection = true

export default tippy

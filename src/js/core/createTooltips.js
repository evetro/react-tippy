import createPopperElement  from './createPopperElement'
import createTrigger from './createTrigger'
import getEventListenerHandlers from './getEventListenerHandlers'
import evaluateSettings from './evaluateSettings'

import removeTitle from '../utils/removeTitle'

/**
* Creates tooltips for all el elements that match the instance's selector
* @param {Element[]} els Resolved array of Element instances
* @return {Object[]} Array of ref data objects
*/
export default function createTooltips(els) {
  const settings = evaluateSettings(this.settings)
  const { trigger, touchHold, useVirtualDom } = settings

  const cb = (store, el, index) => {
    const id = index + 1

    const title = el.getAttribute('title')
    if (!title && !useVirtualDom) return store

    el.setAttribute('data-tooltipped', '')
    removeTitle(el)

    const popper = createPopperElement(id, title, settings)
    const handlers = getEventListenerHandlers.call(this, el, popper, settings)

    const fn = (list, event) => (
      list.concat(createTrigger(event, el, handlers, touchHold))
    )
    const listeners = trigger.trim().split(' ').reduce(fn, [])

    store.push({
      id,
      el,
      popper,
      settings,
      listeners,
      tippyInstance: this
    })

    return store
  }

  return els.reduce(cb, [])
}

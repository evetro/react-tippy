import createPopperElement  from './createPopperElement'
import createTrigger from './createTrigger'
import getEventListenerHandlers from './getEventListenerHandlers'
import evaluateSettings from './evaluateSettings'

import removeTitle from '../utils/removeTitle'

/**
* Creates tooltips for all el elements that match the instance's selector
* @param {Element[]} els
* @return {Object[]} Array of ref data objects
*/
export default function createTooltips(els) {
  return els.reduce((a, el, index) => {
    const id = index + 1

    const settings = evaluateSettings(this.settings)

    const { reactDOM, trigger, touchHold } = settings

    const title = el.getAttribute('title')
    if (!title && !reactDOM) return a

    el.setAttribute('data-tooltipped', '')
    removeTitle(el)

    const popper = createPopperElement(id, title, settings)
    const handlers = getEventListenerHandlers.call(this, el, popper, settings)

    let listeners = []

    trigger.trim().split(' ').forEach(event =>
      listeners = listeners.concat(createTrigger(event, el, handlers, touchHold))
    )

    a.push({
      id,
      el,
      popper,
      settings,
      listeners,
      tippyInstance: this
    })

    return a
  }, [])
}

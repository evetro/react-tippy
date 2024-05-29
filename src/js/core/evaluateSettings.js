/**
* Evaluates and mutates the given settings object parameter for appropriate behavior
* @param {Object} settings
* @return {Object} modified/evaluated settings
*/
export default function evaluateSettings(settings) {
  // animateFill should be disabled if `arrow` is set to true
  if (settings.arrow) {
    Object.assign(settings, { animateFill: false })
  }

  // reassign appendTo onto the result of evaluating appendTo
  // if it's set as a function instead of Element
  if (settings.appendTo && typeof settings.appendTo === 'function') {
    settings.appendTo = settings.appendTo()
  }

  return settings
}

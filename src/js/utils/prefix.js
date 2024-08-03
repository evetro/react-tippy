/**
* Returns the supported prefixed property
* Only `webkit` is needed, `moz`, `ms` and `o` are obsolete
* @param {String} property
* @return {String} - browser supported prefixed property
*/
export default function prefix(property) {
  if (styleExists(property)) {
    return property
  }
  const upperProp = property.charAt(0).toUpperCase() + property.slice(1)
  const prefixedProperty = 'webkit'.concat(upperProp)
  if (styleExists(prefixedProperty)) {
    return prefixedProperty
  }
  return null
}

function styleExists(property) {
  try {
    return (typeof window.document.body.style[property] !== 'undefined')
  } catch { return false }
}

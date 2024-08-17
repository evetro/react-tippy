import { CONTENT, TOOLTIP, CIRCLE } from '../../selectors.ts'

/**
* Returns inner elements of the popper element
* @param {Element} popper
* @return {Object}
*/
export default function getInnerElements(popper) {
  return {
    tooltip: popper.querySelector(TOOLTIP),
    circle: popper.querySelector(CIRCLE),
    content: popper.querySelector(CONTENT)
  }
}

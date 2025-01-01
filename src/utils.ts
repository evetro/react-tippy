export function getAttributeName(selector: string): string {
	if (selector.startsWith('.')) {
		return selector.substring(1)
	}
	if (selector.startsWith('[') && selector.endsWith(']')) {
		return selector.substring(1, selector.length - 1)
	}
	return selector
}

export function getCorePlacement(placement: string): string {
	return placement.replace(/-.+/, '')
}

/**
* Returns an array of elements based on the selector input
*/
export function getArrayOfElements(
	selector?: string | Element | Element[] | NodeListOf<Element>
): Element[] {
	if (selector instanceof Element) {
		return [selector]
	}

	if (selector instanceof NodeList) {
		return Array.from(selector) as Element[]
	}

	if (Array.isArray(selector)) {
		return selector
	}
  
	return [].slice.call(document.querySelectorAll(selector))
}

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

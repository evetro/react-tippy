import { getAttributeName, getCorePlacement, getArrayOfElements } from '../src/utils'
import { POPPER, TOOLTIP, CONTENT, CONTROLLER, TOOLTIPPED_EL, ARROW, CIRCLE } from '../src/selectors'
import createNewElement from './createNewElement'

describe('getAttributeName module', () => {
	it('remains prefix dot from class IDs', () => {
		expect(getAttributeName(POPPER)).toBe('tippy-popper')
		expect(getAttributeName(TOOLTIP)).toBe('tippy-tooltip')
		expect(getAttributeName(CONTENT)).toBe('tippy-tooltip-content')
	})
	it('removes attribute selector paranthesis', () => {
		expect(getAttributeName(CONTROLLER)).toBe('data-tippy-controller')
		expect(getAttributeName(TOOLTIPPED_EL)).toBe('data-tooltipped')
		expect(getAttributeName(ARROW)).toBe('data-popper-arrow')
		expect(getAttributeName(CIRCLE)).toBe('data-popper-circle')
	})
	it('default returns', () => {
		expect(getAttributeName('tippy.popper')).toBe('tippy.popper')
		expect(getAttributeName('tippy-tooltip.')).toBe('tippy-tooltip.')
		expect(getAttributeName('data-tooltipped]')).toBe('data-tooltipped]')
		expect(getAttributeName('[data-popper-arrow')).toBe('[data-popper-arrow')
	})
})

describe('getCorePlacement module', () => {
	it('recognizes the four absolute positions automatically', () => {
		expect(getCorePlacement('bottom')).toBe('bottom')
		expect(getCorePlacement('top')).toBe('top')
		expect(getCorePlacement('right')).toBe('right')
		expect(getCorePlacement('left')).toBe('left')
	})
	it('filters out "start" suffixes', () => {
		expect(getCorePlacement('bottom-start')).toBe('bottom')
		expect(getCorePlacement('top-start')).toBe('top')
		expect(getCorePlacement('right-start')).toBe('right')
		expect(getCorePlacement('left-start')).toBe('left')
	})
	it('filters out "end" suffixes', () => {
		expect(getCorePlacement('bottom-end')).toBe('bottom')
		expect(getCorePlacement('top-end')).toBe('top')
		expect(getCorePlacement('right-end')).toBe('right')
		expect(getCorePlacement('left-end')).toBe('left')
	})
})

describe('getArrayOfElements', () => {
	it('returns an empty array with no arguments', () => {
		expect(Array.isArray(getArrayOfElements())).toBe(true)
	})

	it('returns the same array if given an array', () => {
		const arr = []
		expect(getArrayOfElements(arr)).toBe(arr)
	})

	it('returns an array of elements when given a valid selector string', () => {
		const fn = () => createNewElement()
		const isElement = (value) => (value instanceof Element)
		const list = [...Array(10)]
		list.forEach(fn)
		const allAreElements = getArrayOfElements('__tippy').every(isElement)
		expect(allAreElements).toBe(true)
	})

	it('returns an empty array when given an invalid selector string', () => {
		const arr = getArrayOfElements('😎')

		expect(Array.isArray(arr)).toBe(true)
		expect(arr.length).toBe(0)
	})

	it('returns an array of length 1 if the value is a DOM element', () => {
		const ref = createNewElement()
		const arr = getArrayOfElements(ref)

		expect(arr[0]).toBe(ref)
		expect(arr.length).toBe(1)
	})

	it('returns an array if given a NodeList', () => {
		const ref = createNewElement()
		const arr = getArrayOfElements(
			document.querySelectorAll('.__tippy')
		)

		expect(arr[0]).toBe(ref)
		expect(Array.isArray(arr)).toBe(true)
	})
})

import { getAttributeName, getCorePlacement } from '../src/utils'
import { POPPER, TOOLTIP, CONTENT, CONTROLLER, TOOLTIPPED_EL, ARROW, CIRCLE } from '../src/selectors'

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

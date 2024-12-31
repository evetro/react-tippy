import { createPopperLite, Modifier, Options } from '@popperjs/core'

import toggleEventListeners from '../src/toggleEventListeners'
import newPopperElement from '../src/js/core/createPopperElement'

describe('toggleEventListeners', () => {
	it('disables event listeners', () => {
		const modifiers: Modifier<'eventListeners', Options>[] = [
			{ name: 'eventListeners', enabled: false, phase: 'write', fn(){} },
			{ name: 'eventListeners', enabled: true, phase: 'write', fn(){} }
		]
		const popperInstance = createPopperLite(
			createContainerElement(),
			createPopperElement(),
			{ placement: 'bottom', modifiers }
		)

		toggleEventListeners(popperInstance)

		const result = modifiers.every(({ enabled }) => !enabled)
		expect(result).toBe(true)
	})
	it('enables event listeners', () => {
		const modifiers: Modifier<'eventListeners', Options>[] = [
			{ name: 'eventListeners', enabled: false, phase: 'write', fn(){} },
			{ name: 'eventListeners', enabled: false, phase: 'write', fn(){} }
		]
		const popperInstance = createPopperLite(
			createContainerElement(),
			createPopperElement(),
			{ placement: 'bottom', modifiers }
		)

		toggleEventListeners(popperInstance, true)

		const result = modifiers.every(({ enabled }) => enabled)
		expect(result).toBe(true)
	})
	it('adds event listeners', () => {
		const modifiers: Modifier<'eventListeners', Options>[] = []
		const popperInstance = createPopperLite(
			createContainerElement(),
			createPopperElement(),
			{ placement: 'bottom', modifiers }
		)

		toggleEventListeners(popperInstance, true)

		const result = modifiers.every(({ enabled }) => enabled)
		expect(result).toBe(true)
		expect(modifiers.length).toBe(1)
	})
})

function createContainerElement() {
	const el = document.createElement('button')
	el.className = '__tippy'
	document.body.appendChild(el)
	return el
}

function createPopperElement(): HTMLElement {
	return newPopperElement(
		10,
		'TIPPY',
		{
			position: 'bottom',
			distance: 20,
			zIndex: 5,
			theme: 'dark',
			size: 10,
			animation: 'none'
		}
	) as HTMLElement
}

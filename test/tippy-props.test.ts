import defaultProps from '@package/defaults.ts'
import { Store } from '@package/js/core/globals.js'
import isVisible from '@package/js/utils/isVisible.js'
import { CONTENT } from '@package/selectors'
import { Position } from '@package/types'
import { getAttributeName } from '@package/utils'
import { fireEvent } from '@testing-library/dom'

import tippyFactory from "../src/tippyFactory"
import Tippy from '../src/js/tippy'
import createNewElement from './createNewElement'

let instance: Tippy | null | undefined

afterEach(() => {
	instance?.destroyAll?.()
})

describe.skip('followCursor, headless', () => {
	// NOTE: the simulated window dimensions are 1024 x 768. These values
	// should be within that
	const defaultPosition = { clientX: 1, clientY: 1 }

	const first = { clientX: 317, clientY: 119 }
	const second = { clientX: 240, clientY: 500 }

	const placements = ['top', 'bottom', 'left', 'right']

	let rect: DOMRect

	const match = (
		top: number,
		bottom: number,
		left: number,
		right: number
	) => {
		const isVerticalPlacement = ['top', 'bottom'].includes(
			instance.store[0].popperInstance.state.placement.split('-')[0]
		)

		expect(isVerticalPlacement).toBe(true)
		expect(rect.top).toBe(top)
		expect(rect.bottom).toBe(bottom)
		expect(rect.left).toBe(left)
		expect(rect.right).toBe(right)
	}

	it('true: follows both axes', () => {
		placements.forEach((placement) => {
			const position = placement as Position
			instance = tippyFactory(createNewElement(), { followCursor: true, position })

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.store[0].popper.getBoundingClientRect()
			match(
				first.clientY,
				first.clientY,
				first.clientX,
				first.clientX
			)

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.store[0].popper.getBoundingClientRect()
			match(
				second.clientY,
				second.clientY,
				second.clientX,
				second.clientX
			)
		})
	})

	it('follows x-axis', () => {
		placements.forEach((placement) => {
			const position = placement as Position
			instance = tippyFactory(createNewElement(), {
				followCursor: true,
				position
			})
			const referenceRect = instance.store[0].el.getBoundingClientRect()

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.store[0].popper.getBoundingClientRect()

			match(
				referenceRect.top,
				referenceRect.bottom,
				first.clientX,
				first.clientX
			)

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.store[0].popper.getBoundingClientRect()

			match(
				referenceRect.top,
				referenceRect.bottom,
				second.clientX,
				second.clientX
			)
		})
	})

	it('follows y-axis', () => {
		placements.forEach((placement) => {
			const position = placement as Position
			instance = tippyFactory(createNewElement(), { followCursor: true, position })
			const referenceRect = instance.store[0].el.getBoundingClientRect()

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.store[0].popper.getBoundingClientRect()

			match(
				first.clientY,
				first.clientY,
				referenceRect.left,
				referenceRect.right
			)

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.store[0].popper.getBoundingClientRect()

			match(
				second.clientY,
				second.clientY,
				referenceRect.left,
				referenceRect.right
			)
		})
	})

	it('is at correct position after a delay', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true, delay: 100 })

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		vi.advanceTimersByTime(100)

		rect = instance.store[0].popper.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)
	})

	it('is at correct position after a content update', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true })
		const data = instance.store[0]

		fireEvent.mouseEnter(data.el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(data.el, first)

		rect = instance.store[0].popper.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)

		instance.updateSettings(data.popper, 'title', 'hello')

		vi.runAllTimers()

		rect = instance.store[0].popper.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)
	})

	it('does not continue to follow if interactive: true and cursor is over popper', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			interactive: true
		})

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		const referenceRect = instance.store[0].el.getBoundingClientRect()
		rect = instance.store[0].popper.getBoundingClientRect()

		fireEvent.mouseMove(instance.store[0].el, second)

		match(
			referenceRect.top,
			referenceRect.bottom,
			first.clientX,
			first.clientX
		)
	})

	it('should reset popperInstance.reference if triggered by `focus`', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			delay: 1000
		})

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)
		fireEvent.mouseLeave(instance.store[0].el)

		fireEvent.mouseMove(instance.store[0].el, second)

		instance.hide(instance.store[0].popper)

		fireEvent.focus(instance.store[0].el)

		expect(instance.settings.getReferenceClientRect).toBe(null)
	})

	it('works with manual trigger and .show()', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			trigger: 'manual'
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		fireEvent.mouseMove(document, first)

		rect = instance.store[0].popper.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)
	})

	it('is cleaned up if untriggered before showing', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true, delay: 100 })

		fireEvent.mouseEnter(instance.store[0].el, first)
		fireEvent.mouseLeave(instance.store[0].el)
		fireEvent.mouseMove(instance.store[0].el, second)

		expect(instance.settings.getReferenceClientRect).toBe(null)
	})
})

describe('animateFill', () => {
	const getChildrenContent = (el: HTMLDivElement) => {
		const childNodes = Array.from(el.children) as HTMLDivElement[]
		return childNodes.find((node) =>
			node.classList.contains(getAttributeName(CONTENT))
		) as HTMLDivElement
	}

	it('`settings.animateFill` set to its default', () => {
		instance = tippyFactory(createNewElement(), { ...defaultProps })
		expect(instance.settings.animateFill).toBe(true)
	})

	it('`settings.animateFill` set to `true`', () => {
		instance = tippyFactory(createNewElement(), { ...defaultProps, animateFill: true })
		expect(instance.settings.animateFill).toBe(true)
	})

	it('`settings.animateFill` set to `false`', () => {
		instance = tippyFactory(createNewElement(), { ...defaultProps, animateFill: false })
		expect(instance.settings.animateFill).toBe(false)
	})

	it('true: sets `data-animatefill` attribute on tooltip', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: true })

		expect(
			instance.store[0].popper.firstElementChild.hasAttribute('data-animatefill')
		).toBe(true)
	})

	it('false: does not set `data-animatefill` attribute on tooltip', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: false })

		expect(
			instance.store[0].popper.firstElementChild.hasAttribute('data-animatefill')
		).toBe(false)
	})

	it('true: sets `transitionDelay` style on content element', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: true, duration: 120 })
		const content = getChildrenContent(instance.store[0].popper)

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(content.style.transitionDelay).toBe(`${120 / 10}ms`)
	})

	it('false: does not set `transitionDelay` style on content element', () => {
		const instance = tippyFactory(createNewElement(), {
			animateFill: false,
			duration: 120
		})
		const content = getChildrenContent(instance.store[0].popper)

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(content.style.transitionDelay).toBe('')
	})

	it('true: sets `"leave" class in document', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: true })
		expect(instance?.store?.[0]?.popper?.innerHTML?.includes?.('leave')).toBe(true)
	})

	it('false: does not set `"leave" class in document', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: false })
		instance.show(instance.store[0].popper)
		vi.runAllTimers()
		expect(instance?.store?.[0]?.popper?.innerHTML?.includes?.('leave')).toBe(false)
	})
})

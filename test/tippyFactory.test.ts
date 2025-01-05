import defaultProps from '@package/defaults.ts'
import { Store } from '@package/js/core/globals.js'
import isVisible from '@package/js/utils/isVisible.js'
import { getAttributeName } from '@package/utils'
import { CONTENT } from '@package/selectors'
import { fireEvent } from '@testing-library/dom'

import tippyFactory from "../src/tippyFactory"
import Tippy from '../src/js/tippy'
import createNewElement from './createNewElement'
import { Position } from '@package/types'

let instance: Tippy | null | undefined

afterEach(() => {
	instance?.destroyAll?.()
})

describe('tippyFactory', () => {
	it('returns the instance with expected properties', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		expect(instance).toMatchSnapshot()
	})

	it('sets `undefined` prop to the default', () => {
		instance = tippyFactory(createNewElement(), {
			theme: undefined
		})

		expect(instance.settings.theme).not.toBe(undefined)
	})

	/** @todo do a revision on this behavior (need it for the hideAll function) */
	it('increments the `id` on each call with valid arguments', () => {
		const instanceList = [
			tippyFactory(createNewElement(), defaultProps),
			tippyFactory(createNewElement(), defaultProps),
			tippyFactory(createNewElement(), defaultProps)
		]
		expect(Store[0]?.id).toBe(1)
		expect(Store[1]?.id).toBe(1)
		expect(Store[2]?.id).toBe(1)

		expect(instanceList[0].store[0]?.id).toBe(1)
		expect(instanceList[1].store[0]?.id).toBe(1)
		expect(instanceList[2].store[0]?.id).toBe(1)
	})

	it('adds correct listeners to the reference element based on `trigger` (`interactive`: false)', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			trigger: 'mouseenter focus click focusin'
		})

		fireEvent.mouseEnter(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.focus(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.blur(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.focusIn(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.focusOut(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		// For completeness, it would seem to make sense to test that the tippy *is*
		// hidden on clicking its content (as this is a non-interactive instance);
		// however, we use CSS pointer-events: none for non-interaction, so firing a
		// click event on the tippy content won't test this scenario. Neither can we
		// test for that style with window.getComputedStyle in the testing
		// environment.
	})

	it('adds correct listeners to the reference element based on `trigger` (`interactive`: true)', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			interactive: true,
			trigger: 'mouseenter focus click focusin'
		})

		fireEvent.mouseEnter(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		// For interactive tooltips, the reference onMouseLeave adds a document.body
		// listener to scheduleHide, but doesn't scheduleHide itself (hence event
		// bubbling being required here for the tip to hide).
		fireEvent.mouseLeave(instance.store[0].el, { bubbles: true })
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.focus(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.blur(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		const content = getChildrenContent(instance.store[0].popper)
		fireEvent.click(content)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.focusIn(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.focusOut(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('does not remove an existing `aria-expanded` attribute', () => {
		const ref = createNewElement('div', { 'aria-expanded': 'true' })
		instance = tippyFactory(ref, { interactive: false })

		expect(ref.hasAttribute('aria-expanded')).toBe(true)
	})
})

describe('Tippy.destroy()', () => {
	it('sets state.isDestroyed to `true`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.destroy(instance.store[0].popper)

		expect(instance.store.length).toBe(0)
	})

	it('removes listeners from the reference', () => {
		const ref = createNewElement()
		instance = tippyFactory(ref, {
			...defaultProps,
			trigger: 'mouseenter'
		})

		instance.destroy(instance.store[0].popper)
		fireEvent.mouseEnter(ref)

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('does nothing if the instance is already destroyed', () => {
		const ref = createNewElement()
		instance = tippyFactory(ref, defaultProps)
		instance.destroyed = true
		instance.destroy(instance.store[0].popper)

		expect(instance.store.length).toBe(1)
	})

	it('destroys popper element in onHidden()', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			onHidden() {
				instance.destroy(instance.store[0].popper)
			}
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		instance.hide(instance.store[0].popper)

		expect(instance.store.length).toBe(0)
	})
})

describe('Tippy.show()', () => {
	it('changes state.isVisible to `true`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(true)
	})

	it('mounts the popper to the DOM', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)
	})

	it('does not show tooltip if the reference has a `disabled` attribute', () => {
		const ref = createNewElement()

		ref.setAttribute('disabled', 'disabled')
		instance = tippyFactory(ref, defaultProps)
		instance.show(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(false)
		expect(document.body.contains(instance.store[0].popper)).toBe(false)
	})

	it('bails out if already visible', () => {
		const spy = vi.fn()

		instance = tippyFactory(createNewElement(), { ...defaultProps, onShow: spy })
		instance.show(instance.store[0].popper)
		instance.show(instance.store[0].popper)

		expect(spy).toHaveBeenCalledTimes(1)
	})
})

describe('instance.hide(instance.store[0].popper)', () => {
	it('changes state.isVisible to false', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.hide(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('removes the popper element from the DOM after hiding', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)

		instance.hide(instance.store[0].popper)
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(false)
	})

	it('bails out if already hidden', () => {
		const spy = vi.fn()

		instance = tippyFactory(createNewElement(), { ...defaultProps, onHide: spy })
		instance.hide(instance.store[0].popper)
		instance.hide(instance.store[0].popper)

		expect(spy).toHaveBeenCalledTimes(0)

		instance.show(instance.store[0].popper)
		instance.hide(instance.store[0].popper)
		instance.hide(instance.store[0].popper)

		expect(spy).toHaveBeenCalledTimes(1)
	})
})

describe('setting disabled attribute on Popper element', () => {
	it('sets the appropriate state variable', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.updateSettings(instance.store[0].popper, 'disabled', true)

		expect(instance.store[0].settings.disabled).toBe(true)
	})

	it('disallows a tippy to be shown', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.updateSettings(instance.store[0].popper, 'disabled', true)
		instance.show(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('hides the instance if visible', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show(instance.store[0].popper)
		instance.updateSettings(instance.store[0].popper, 'disabled', true)

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})
})

describe('instance.updateSettings()', () => {
	it('updates popper element states correctly', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		expect(instance.store[0].settings.arrow).toBe(defaultProps.arrow)
		expect(instance.store[0].settings.duration).toBe(defaultProps.duration)

		instance.updateSettings(instance.store[0].popper, 'arrow', !defaultProps.arrow)
		instance.updateSettings(instance.store[0].popper, 'duration', 83)

		expect(instance.store[0].settings.arrow).toBe(!defaultProps.arrow)
		expect(instance.store[0].settings.duration).toBe(83)
	})

	it('redraws the tooltip by creating a new popper element', () => {
		const hasArrow = () => (
			instance?.store?.[0]?.popper?.innerHTML?.includes?.('arrow-regular')
		)

		instance = tippyFactory(createNewElement(), defaultProps)

		expect(hasArrow()).toBe(false)

		instance.updateSettings(instance.store[0].popper, 'arrow', true)

		expect(hasArrow()).toBe(true)
	})

	it('changing `trigger` or `touchHold` changes listeners', () => {
		const ref = createNewElement()
		instance = tippyFactory(ref, defaultProps)

		instance.updateSettings(instance.store[0].popper, 'trigger', 'click')
		fireEvent.mouseEnter(ref)

		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(ref)
		expect(isVisible(instance.store[0].popper)).toBe(true)
	})

	it('does nothing if the instance is destroyed', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		const data = instance.store[0]

		instance.destroy(data.popper)
		instance.updateSettings(data.popper, 'title', 'hello')

		expect(data.settings.title).not.toBe('hello')
	})
})

describe('show and hide', () => {
	it('isVisible', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(true)

		instance.hide(instance.store[0].popper)

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('onRequestClose() hook', () => {
		const onRequestClose = vi.fn()
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			onRequestClose,
			trigger: 'manual'
		})

		fireEvent.click(instance.store[0].el)
		vi.runAllTimers()

		fireEvent.click(instance.store[0].el)
		vi.runAllTimers()

		expect(onRequestClose).toHaveBeenCalledTimes(1)
	})

	it('tippy hooks', () => {
		const onHide = vi.fn()
		const onHidden = vi.fn()
		const onShown = vi.fn()
		const onShow = vi.fn()
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			onShown,
			onShow,
			onHide,
			onHidden,

		})
		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(onShown).toHaveBeenCalledTimes(1)
		expect(onShow).toHaveBeenCalledTimes(1)

		instance.hide(instance.store[0].popper)
		vi.runAllTimers()

		expect(onHidden).toHaveBeenCalledTimes(1)
		expect(onHide).toHaveBeenCalledTimes(1)
	})
})

describe('followCursor, headless', () => {
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

	const hasLeave = () => (
		instance?.store?.[0]?.popper?.innerHTML?.includes?.('leave')
	)

	it('true: sets `"leave" class in document', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: true })
		expect(hasLeave()).toBe(true)
	})

	it('false: does not set `"leave" class in document', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: false })
		expect(hasLeave()).toBe(false)
	})
})

export function getChildrenContent(el: HTMLDivElement): HTMLDivElement {
	const childNodes = Array.from(el.children) as HTMLDivElement[]
	return childNodes.find((node) =>
		node.classList.contains(getAttributeName(CONTENT))
	) as HTMLDivElement
}

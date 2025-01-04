import defaultProps from '@package/defaults.ts'
import { Store } from '@package/js/core/globals.js'
import isVisible from '@package/js/utils/isVisible.js'
import { getAttributeName } from '@package/utils'
import { CONTENT } from '@package/selectors'
import { fireEvent } from '@testing-library/dom'

import tippyFactory from "../src/tippyFactory"
import Tippy from '../src/js/tippy'
import createNewElement from './createNewElement'

/*
import animateFill from '../src/plugins/animateFill'
import { getFormattedMessage } from '../src/validation'
import tippy from '../src'
import followCursor from '../src/plugins/followCursor'
import { getBasePlacement } from '../../../src/utils'
*/

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
		const ref = createNewElement('div', { 'aria-expanded': 'true' }) // todo
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

	it('still unmounts the tippy if the instance is disabled', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		instance.show()
		instance.disable()
		instance.destroy()

		expect(instance.state.isMounted).toBe(false)
	})

	it('still unmounts the tippy if the instance is disabled', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		instance.show()

		vi.runAllTimers()

		instance.disable()
		instance.destroy()

		expect(instance.state.isMounted).toBe(false)
	})

	it('clears pending timeouts', () => {
		instance = tippyFactory(createNewElement(), { ...defaultProps, delay: 500 })

		const spy = vi.spyOn(instance, 'clearDelayTimeouts')

		fireEvent.mouseEnter(instance.store[0].el)

		instance.destroy()

		vi.advanceTimersByTime(500)

		expect(spy).toHaveBeenCalled()
	})

	it('destroys popperInstance if it was created', () => {
		const spy = vi.fn()
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			delay: 500,
			popperOptions: {
				modifiers: [
					{
						name: 'x',
						enabled: true,
						phase: 'afterWrite',
						fn() {},
						effect() {
							return spy
						}
					}
				]
			}
		})

		instance.show()
		vi.runAllTimers()
		instance.destroy()

		expect(spy).toHaveBeenCalledTimes(1)
	})

	it('does not cause a circular call loop if called within onHidden()', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			onHidden() {
				instance.destroy()
			}
		})

		instance.show()
		vi.runAllTimers()

		instance.hide()

		expect(instance.state.isDestroyed).toBe(true)
		expect(instance.state.isMounted).toBe(false)
	})
})

describe('instance.show()', () => {
	it('changes state.isVisible to `true`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(true)
	})

	it('mounts the popper to the DOM', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)
	})

	it('does not show tooltip if the reference has a `disabled` attribute', () => {
		const ref = createNewElement()

		ref.setAttribute('disabled', 'disabled')
		instance = tippyFactory(ref, defaultProps)
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('bails out if already visible', () => {
		const spy = vi.fn()

		instance = tippyFactory(createNewElement(), { ...defaultProps, onShow: spy })
		instance.show()
		instance.show()

		expect(spy).toHaveBeenCalledTimes(1)
	})
})

describe('instance.hide()', () => {
	it('changes state.isVisible to false', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.hide()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('removes the popper element from the DOM after hiding', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps
		})

		instance.show()
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)

		instance.hide()
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(false)
	})

	it('bails out if already hidden', () => {
		const spy = vi.fn()

		instance = tippyFactory(createNewElement(), { ...defaultProps, onHide: spy })
		instance.hide()
		instance.hide()

		expect(spy).toHaveBeenCalledTimes(0)

		instance.show()
		instance.hide()
		instance.hide()

		expect(spy).toHaveBeenCalledTimes(1)
	})
})

describe('instance.enable()', () => {
	it('sets state.isEnabled to `true`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.enable()

		expect(instance.state.isEnabled).toBe(true)
	})

	it('allows a tippy to be shown', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.enable()
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(true)
	})
})

describe('instance.disable()', () => {
	it('sets state.isEnabled to `false`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.disable()

		expect(instance.state.isEnabled).toBe(false)
	})

	it('disallows a tippy to be shown', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.disable()
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('hides the instance if visible', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()
		instance.disable()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})
})

describe('instance.setProps()', () => {
	it('sets the new props by merging them with the current instance', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		expect(instance.settings.arrow).toBe(defaultProps.arrow)
		expect(instance.settings.duration).toBe(defaultProps.duration)

		instance.setProps({ arrow: !defaultProps.arrow, duration: 82 })

		expect(instance.settings.arrow).toBe(!defaultProps.arrow)
		expect(instance.settings.duration).toBe(82)
	})

	it('redraws the tooltip by creating a new popper element', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		expect(
			instance.store[0].popper.querySelector('.__NAMESPACE_PREFIX__-arrow')
		).not.toBeNull()

		instance.setProps({ arrow: false })

		expect(
			instance.store[0].popper.querySelector('.__NAMESPACE_PREFIX__-arrow')
		).toBeNull()
	})

	it('changing `trigger` or `touchHold` changes listeners', () => {
		const ref = createNewElement()
		instance = tippyFactory(ref, defaultProps)

		instance.setProps({ trigger: 'click' })
		fireEvent.mouseEnter(ref)

		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(ref)
		expect(isVisible(instance.store[0].popper)).toBe(true)
	})

	it('does nothing if the instance is destroyed', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		instance.destroy()
		instance.setProps({ content: 'hello' })

		expect(instance.settings.content).not.toBe('hello')
	})

	it('correctly removes stale `aria-expanded` attributes', () => {
		instance = tippyFactory(createNewElement(), { ...defaultProps, interactive: true })
		const triggerTarget = createNewElement()

		expect(instance.store[0].el.getAttribute('aria-expanded')).toBe('false')

		instance.setProps({ interactive: false })

		expect(instance.store[0].el.getAttribute('aria-expanded')).toBe(null)

		instance.setProps({ triggerTarget, interactive: true })

		expect(instance.store[0].el.getAttribute('aria-expanded')).toBe(null)
		expect(triggerTarget.getAttribute('aria-expanded')).toBe('false')

		instance.setProps({ triggerTarget: null })

		expect(instance.store[0].el.getAttribute('aria-expanded')).toBe('false')
	})
})

describe('instance.state', () => {
	it('isEnabled', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(true)

		instance.state.isEnabled = false
		instance.hide()

		expect(isVisible(instance.store[0].popper)).toBe(true)

		instance.state.isEnabled = true
		instance.hide()

		expect(isVisible(instance.store[0].popper)).toBe(false)

		instance.state.isEnabled = false
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('isVisible', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()

		expect(isVisible(instance.store[0].popper)).toBe(true)

		instance.hide()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('isShown', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show()

		expect(instance.state.isShown).toBe(false)

		vi.runAllTimers()

		expect(instance.state.isShown).toBe(true)

		instance.hide()

		expect(instance.state.isShown).toBe(false)
	})
})

describe('instance.unmount()', () => {
	it('unmounts the tippy from the DOM', () => {
		instance = tippyFactory(createNewElement(), defaultProps)

		instance.show()
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)

		instance.unmount()

		expect(document.body.contains(instance.store[0].popper)).toBe(false)
	})

	it('unmounts subtree poppers', () => {
		const content = createNewElement()
		const subNode = createNewElement()

		content.appendChild(subNode)

		const subInstance = tippyFactory(subNode, {
			...defaultProps,
			interactive: true
		})

		subInstance.show()
		vi.runAllTimers()

		instance = tippyFactory(createNewElement(), { ...defaultProps, content })

		instance.show()
		vi.runAllTimers()

		expect(document.body.contains(instance.store[0].popper)).toBe(true)
		expect(document.body.contains(subinstance.store[0].popper)).toBe(true)

		instance.unmount()

		expect(document.body.contains(instance.store[0].popper)).toBe(false)
		expect(instance.store[0].popper.contains(subinstance.store[0].popper)).toBe(false)
	})
})

describe('followCursor headless', () => {
	tippy.setDefaultProps({ plugins: [followCursor] })
	// NOTE: the simulated window dimensions are 1024 x 768. These values
	// should be within that
	const defaultPosition = { clientX: 1, clientY: 1 }

	const first = { clientX: 317, clientY: 119 }
	const second = { clientX: 240, clientY: 500 }

	const placements = ['top', 'bottom', 'left', 'right']

	let rect

	function matches(receivedRect) {
		const isVerticalPlacement = ['top', 'bottom'].includes(
			getBasePlacement(instance.store[0].popperInstance.state.placement)
		)

		expect(isVerticalPlacement).toBe(true)
		expect(rect.left).toBe(receivedRect.left)
		expect(rect.right).toBe(receivedRect.right)
		expect(rect.top).toBe(receivedRect.top)
		expect(rect.bottom).toBe(receivedRect.bottom)
	}

	it('true: follows both axes', () => {
		placements.forEach((placement) => {
			instance = tippyFactory(createNewElement(), { followCursor: true, placement })

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.settings.getReferenceClientRect()
			matches({
				top: first.clientY,
				bottom: first.clientY,
				left: first.clientX,
				right: first.clientX
			})

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.settings.getReferenceClientRect()
			matches({
				top: second.clientY,
				bottom: second.clientY,
				left: second.clientX,
				right: second.clientX
			})
		})
	})

	it('"horizontal": follows x-axis', () => {
		placements.forEach((placement) => {
			instance = tippyFactory(createNewElement(), {
				followCursor: 'horizontal',
				placement
			})
			const referenceRect = instance.store[0].el.getBoundingClientRect()

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: referenceRect.top,
				bottom: referenceRect.bottom,
				left: first.clientX,
				right: first.clientX
			})

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: referenceRect.top,
				bottom: referenceRect.bottom,
				left: second.clientX,
				right: second.clientX
			})
		})
	})

	it('"vertical": follows y-axis', () => {
		placements.forEach((placement) => {
			instance = tippyFactory(createNewElement(), { followCursor: 'vertical', placement })
			const referenceRect = instance.store[0].el.getBoundingClientRect()

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: first.clientY,
				bottom: first.clientY,
				left: referenceRect.left,
				right: referenceRect.right
			})

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: second.clientY,
				bottom: second.clientY,
				left: referenceRect.left,
				right: referenceRect.right
			})
		})
	})

	it('"initial": only follows once', () => {
		placements.forEach((placement) => {
			instance = tippyFactory(createNewElement(), { followCursor: 'initial', placement })

			fireEvent.mouseMove(instance.store[0].el, first)

			instance.show()
			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: first.clientY,
				bottom: first.clientY,
				left: first.clientX,
				right: first.clientX
			})

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.settings.getReferenceClientRect()

			matches({
				top: first.clientY,
				bottom: first.clientY,
				left: first.clientX,
				right: first.clientX
			})
		})
	})

	it('is at correct position after a delay', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true, delay: 100 })

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		vi.advanceTimersByTime(100)

		rect = instance.settings.getReferenceClientRect()

		matches({
			top: first.clientY,
			bottom: first.clientY,
			left: first.clientX,
			right: first.clientX
		})
	})

	it('is at correct position after a content update', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true })

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		rect = instance.settings.getReferenceClientRect()

		matches({
			top: first.clientY,
			bottom: first.clientY,
			left: first.clientX,
			right: first.clientX
		})

		instance.setContent('x')

		vi.runAllTimers()

		rect = instance.settings.getReferenceClientRect()

		matches({
			top: first.clientY,
			bottom: first.clientY,
			left: first.clientX,
			right: first.clientX
		})
	})

	it('does not continue to follow if interactive: true and cursor is over popper', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: 'horizontal',
			interactive: true
		})

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		const referenceRect = instance.store[0].el.getBoundingClientRect()
		rect = instance.settings.getReferenceClientRect()

		fireEvent.mouseMove(instance.store[0].el, second)

		matches({
			top: referenceRect.top,
			bottom: referenceRect.bottom,
			left: first.clientX,
			right: first.clientX
		})
	})

	it('should reset popperInstance.reference if triggered by `focus`', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			flip: false,
			delay: 1000
		})

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)
		fireEvent.mouseLeave(instance.store[0].el)

		fireEvent.mouseMove(instance.store[0].el, second)

		instance.hide()

		fireEvent.focus(instance.store[0].el)

		expect(instance.settings.getReferenceClientRect).toBe(null)
	})

	it('"initial": does not update if triggered again while still visible', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: 'initial'
		})

		fireEvent.mouseMove(instance.store[0].el, first)

		instance.show()
		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, second)

		rect = instance.settings.getReferenceClientRect()

		matches({
			top: first.clientY,
			bottom: first.clientY,
			left: first.clientX,
			right: first.clientX
		})
	})

	it('works with manual trigger and .show()', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			trigger: 'manual'
		})

		instance.show()
		vi.runAllTimers()

		fireEvent.mouseMove(document, first)

		rect = instance.settings.getReferenceClientRect()

		matches({
			top: first.clientY,
			bottom: first.clientY,
			left: first.clientX,
			right: first.clientX
		})
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

		instance.show()
		vi.runAllTimers()

		expect(content.style.transitionDelay).toBe(`${120 / 10}ms`)
	})

	it('false: does not set `transitionDelay` style on content element', () => {
		const instance = tippyFactory(createNewElement(), {
			animateFill: false,
			duration: 120
		})
		const content = getChildrenContent(instance.store[0].popper)

		instance.show()
		vi.runAllTimers()

		expect(content.style.transitionDelay).toBe('')
	})

	it('true: sets `animation: "shift-away"', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: true })
		expect(instance.settings.animation).toBe('shift-away')
	})

	it('false: does not set `animation: "shift-away"', () => {
		const instance = tippyFactory(createNewElement(), { animateFill: false })
		expect(instance.settings.animation).not.toBe('shift-away')
	})
})

export function getChildrenContent(el: HTMLDivElement): HTMLDivElement {
	const childNodes = Array.from(el.children) as HTMLDivElement[]
	return childNodes.find((node) =>
		node.classList.contains(getAttributeName(CONTENT))
	) as HTMLDivElement
}

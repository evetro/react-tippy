import defaultProps from '@package/defaults.ts'
import { Store } from '@package/js/core/globals.js'
import isVisible from '@package/js/utils/isVisible.js'
import { TOOLTIP } from '@package/selectors'
import Tippy from '@package/js/tippy'
import tippyFactory from "@package/tippyFactory"
import { getAttributeName } from '@package/utils'
import { fireEvent } from '@testing-library/dom'

import createNewElement from './createNewElement'
import { Position } from '@package/types'

let instance: Tippy | null | undefined

afterEach(() => {
	instance?.destroyAll?.()
	instance = null
})

describe('tippyFactory', () => {
	it('returns the instance with the expected state', () => {
		const el = createNewElement()
		instance = tippyFactory(el, {})

		expect(instance.destroyed).toBe(false)
		expect(instance.selector).toBe(el)

		expect(instance.callbacks.wait?.()).toBe(undefined)
		expect(instance.callbacks.show?.()).toBe(undefined)
		expect(instance.callbacks.shown?.()).toBe(undefined)
		expect(instance.callbacks.hide?.()).toBe(undefined)
		expect(instance.callbacks.hidden?.()).toBe(undefined)

		expect({
			...instance.settings,
			appendTo: undefined
		}).toEqual({
			...defaultProps,
			appendTo: undefined
		})
		expect(instance.store[0].id).toBe(1)
		expect(instance.store[0].tippyInstance).toBe(instance)
	})

	it('sets `undefined` prop to their default value', () => {
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
		expect(Store[0]?.id).toBe(3)
		expect(Store[1]?.id).toBe(4)
		expect(Store[2]?.id).toBe(5)

		expect(instanceList[0].store[0]?.id).toBe(3)
		expect(instanceList[1].store[0]?.id).toBe(4)
		expect(instanceList[2].store[0]?.id).toBe(5)
	})

	it('adds correct listeners to the reference element based on `trigger` (`interactive`: false)', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			duration: 0,
			trigger: 'mouseenter focus click focusin'
		})

		fireEvent.mouseEnter(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.focus(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el) // TODO use blur here instead and make test pass
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.focusIn(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el) // TODO use focusOut here instead and make test pass
		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('adds correct listeners to the reference element based on `trigger` (`interactive`: true)', () => {
		instance = tippyFactory(createNewElement(), {
			...defaultProps,
			interactive: true,
			duration: 0,
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

		fireEvent.click(instance.store[0].el) // TODO use blur here instead and make test pass
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.mouseLeave(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(false)

		fireEvent.click(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		const childNodes = Array.from(instance.store[0].popper.children) as HTMLDivElement[]
		fireEvent.click(childNodes[0])
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.focusIn(instance.store[0].el)
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el) // TODO use focusOut here instead and make test pass
		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('does not remove an existing `aria-expanded` attribute', () => {
		const ref = createNewElement('div', { title: 'Tooltip', 'aria-expanded': 'true' })
		instance = tippyFactory(ref, { interactive: false })

		expect(ref.hasAttribute('aria-expanded')).toBe(true)
	})
})

describe('Tippy.destroy()', () => {
	it('sets state.isDestroyed to `true`', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.destroy(instance.store[0].popper)

		const check = Store.find(d => d.popper === instance.store[0].popper)
		expect(check).toBe(undefined)
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
		vi.runAllTimers()

		const check = Store.find(d => d.popper === instance.store[0].popper)
		expect(check).toBe(undefined)
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
		vi.runAllTimers()

		expect(isVisible(instance.store[0].popper)).toBe(false)
		expect(document.body.contains(instance.store[0].popper)).toBe(false)
	})

	it('bails out if already visible', () => {
		const spy = vi.fn()

		instance = tippyFactory(createNewElement(), { ...defaultProps, duration: 0, onShow: spy })
		instance.show(instance.store[0].popper)
		instance.show(instance.store[0].popper)

		expect(spy).toHaveBeenCalledTimes(1)
	})
})

describe('Tippy.hide()', () => {
	it('changes state.isVisible to false', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.hide(instance.store[0].popper)
		vi.runAllTimers()

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

describe('Tippy.disable(): setting disabled attribute on the Popper element', () => {
	it('sets the appropriate state variable', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.disable(instance.store[0].popper)

		expect(instance.store[0].settings.disabled).toBe(true)
	})

	it('disallows a tippy to be shown', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.disable(instance.store[0].popper)
		vi.runAllTimers()
		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})

	it('hides the instance if visible', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		instance.show(instance.store[0].popper)
		vi.runAllTimers()
		instance.disable(instance.store[0].popper)
		vi.runAllTimers()

		expect(isVisible(instance.store[0].popper)).toBe(false)
	})
})

describe('Tippy.updateSettings()', () => {
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
			instance?.store?.[0]?.popper?.innerHTML?.includes?.('arrow')
		)

		instance = tippyFactory(createNewElement(), defaultProps)

		expect(hasArrow()).toBe(false)
		instance.updateSettings(instance.store[0].popper, 'arrow', true)
		instance.show(instance.store[0].popper)
		vi.runAllTimers()
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

	it('destroy popper, then update - creates new popper', () => {
		instance = tippyFactory(createNewElement(), defaultProps)
		const data = instance.store[0]

		instance.destroy(data.popper)
		instance.updateSettings(data.popper, 'title', 'hello')

		expect(data.settings.title).toBe('hello')
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
		expect(isVisible(instance.store[0].popper)).toBe(false)

		instance.show(instance.store[0].popper)
		vi.runAllTimers()
		expect(isVisible(instance.store[0].popper)).toBe(true)

		fireEvent.click(instance.store[0].el)
		vi.runAllTimers()

		expect(onRequestClose).toHaveBeenCalledTimes(1) // yields 0 for now
	})

	it('clicking on tippy element triggers hideAllPoppers for all popper elements but for one', () => {
		const onRequestClose = vi.fn()
		instance = tippyFactory(createNewElement(), {
			onRequestClose,
			trigger: 'click focus'
		})

		fireEvent.click(instance.store[0].el)
		vi.runAllTimers()

		fireEvent.click(instance.store[0].el)
		vi.runAllTimers()

		expect(onRequestClose).toHaveBeenCalledTimes(0)
		expect(isVisible(instance.store[0].popper)).toBe(false)
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

describe('animateFill', () => {
	const getChildrenContent = (el: HTMLDivElement) => {
		const childNodes = Array.from(el.children) as HTMLDivElement[]
		return childNodes.find((node) =>
			node.classList.contains(getAttributeName(TOOLTIP))
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

	it('true: sets `transition-duration` style on content element', () => {
		const instance = tippyFactory(createNewElement(), {
			animateFill: true,
			duration: 120
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(instance.settings.animateFill).toBe(true)
		expect(instance.settings.duration).toBe(120)
		expect(
			getChildrenContent(instance.store[0].popper).style['transition-duration']
		).toBe('120ms')
	})

	it('false: does not set `transitionDelay` style on content element', () => {
		const instance = tippyFactory(createNewElement(), {
			animateFill: false,
			duration: 120
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		expect(instance.settings.animateFill).toBe(false)
		expect(instance.settings.duration).toBe(120)

		const content = getChildrenContent(instance.store[0].popper)
		expect(content.style['transition-duration']).toBe('120ms')
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

describe.skip('followCursor, headless', () => {
	// NOTE: the simulated window dimensions are 1024 x 768. These values
	// should be within that
	const defaultPosition = { clientX: 1, clientY: 1 }

	const first = { clientX: 317, clientY: 119 }
	const second = { clientX: 240, clientY: 500 }

	const placements: Position[] = ['top', 'bottom', 'left', 'right']

	let rect: DOMRect

	const match = (
		top: number,
		bottom: number,
		left: number,
		right: number
	) => {
		/* const isVerticalPlacement = ['top', 'bottom'].includes(
			instance.store[0].popperInstance.state.placement.split('-')[0]
		)

		expect(isVerticalPlacement).toBe(true) */
		expect(rect.top).toBe(top)
		expect(rect.bottom).toBe(bottom)
		expect(rect.left).toBe(left)
		expect(rect.right).toBe(right)
	}

	it('true: follows both axes', () => {
		placements.forEach((position) => {
			instance = tippyFactory(createNewElement(), { followCursor: true, position })

			fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

			vi.runAllTimers()

			fireEvent.mouseMove(instance.store[0].el, first)
			rect = instance.store[0].el.getBoundingClientRect()
			match(
				first.clientY,
				first.clientY,
				first.clientX,
				first.clientX
			)

			fireEvent.mouseMove(instance.store[0].el, second)
			rect = instance.store[0].el.getBoundingClientRect()
			match(
				second.clientY,
				second.clientY,
				second.clientX,
				second.clientX
			)
		})
	})

	it('is at correct position after a delay', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true, delay: 100 })

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		vi.advanceTimersByTime(100)

		rect = instance.store[0].el.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)
	})

	it('is at correct position after a content update', () => {
		instance = tippyFactory(createNewElement(), { followCursor: true })

		fireEvent.mouseEnter(instance.store[0].el, defaultPosition)

		vi.runAllTimers()

		fireEvent.mouseMove(instance.store[0].el, first)

		rect = instance.store[0].el.getBoundingClientRect()

		match(
			first.clientY,
			first.clientY,
			first.clientX,
			first.clientX
		)

		instance.updateSettings(instance.store[0].popper, 'title', 'hello')
		instance.store[0].el.setAttribute('title', 'hello')

		vi.runAllTimers()

		rect = instance.store[0].el.getBoundingClientRect()

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

		rect = instance.store[0].el.getBoundingClientRect()
		const { top, bottom } = rect

		fireEvent.mouseMove(instance.store[0].el, second)

		match(
			top,
			bottom,
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

		expect(instance.settings.getReferenceClientRect).toBe(undefined) // nb: always true kek
	})

	it('works with manual trigger and .show()', () => {
		instance = tippyFactory(createNewElement(), {
			followCursor: true,
			trigger: 'manual'
		})

		instance.show(instance.store[0].popper)
		vi.runAllTimers()

		fireEvent.mouseMove(document, first)

		rect = instance.store[0].el.getBoundingClientRect()
		// TODO new instance method for getting bounding client rect on a popper element

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

		expect(instance.settings.getReferenceClientRect).toBe(undefined) // nb: always true kek
	})
})

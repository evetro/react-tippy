import React, { useEffect } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Tippy from '@package/component'
import Class from '@package/js/tippy'
import { Store } from '@package/js/core/globals'
import isVisible from '@package/js/utils/isVisible.js'

const getData = (ref: Element) => (
	Store.find(({ popper, el }) => ref === popper || ref === el)
)

const isTippy = (ref: Element) => (
	(getData(ref).tippyInstance) instanceof Class
)

describe('<Tippy />', () => {
	it('renders only the child element', () => {
		const test = render(
			<Tippy title="tooltip">
				<button />
			</Tippy>
		)

		expect(test.container.innerHTML).toBe(
			`<div class="" style="display: inline;" data-tooltipped="" data-original-title="tooltip"><button></button></div>`
		)

		const test2 = render(
			<Tippy html={<div>tooltip</div>}>
				<button />
			</Tippy>
		)

		expect(test2.container.innerHTML).toBe(
			`<div class="" style="display: inline;" data-tooltipped=""><button></button></div>`
		)
	})

	it('cleans up after unmounting', async () => {
		render(
			<Tippy
				title="tooltip4"
				trigger="click"
				animation={false}
				hideOnClick
			>
				<button />
			</Tippy>
		)

		expect(screen.queryAllByText('tooltip4').length).toBe(0)
		// open up the tooltip
		screen.getByRole('button').click()
		vi.runAllTimers()
		await waitFor(() => {
			expect(screen.getByText('tooltip4')).toBeInTheDocument()
			expect(screen.queryAllByRole('tooltip').length).toBe(1)
		})

		// close the tooltip
		screen.getByRole('button').click()
		vi.runAllTimers()
		await waitFor(() => {
			expect(screen.queryAllByRole('tooltip').length).toBe(0)
			expect(screen.queryAllByText('tooltip4').length).toBe(0)
		})
	})

	it('props.className: extra whitespace is ignored', () => {
		const className = '   hello world  '

		const { container } = render(
			<Tippy title="tooltip" className={className}>
				<button />
			</Tippy>
		)
		expect(container?.firstElementChild?.className).toBe('hello world')
	})

	it('props.className: updating does not leave stale className behind', () => {
		const { container, rerender } = render(
			<Tippy title="tooltip" className="one">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className).toBe('one')

		rerender(
			<Tippy title="tooltip" className="two">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className).not.toBe('one')
		expect(container?.firstElementChild?.className).toBe('two')
	})

	it('props.className: syncs with children.type', () => {
		const { container, rerender } = render(
			<Tippy title="tooltip" className="one">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className).toBe('one')

		rerender(
			<Tippy title="tooltip" className="one">
				<span />
			</Tippy>
		)

		expect(container?.firstElementChild?.className).toBe('one')
	})

	it('updates children consistently', () => {
		const Button = (_: unknown, ref: React.LegacyRef<HTMLButtonElement>) => <button ref={ref} />
		const Main = (_: unknown, ref: React.LegacyRef<HTMLElement>) => <main ref={ref} />
		const Component1 = React.forwardRef(Button)
		const Component2 = React.forwardRef(Main)

		const { container, rerender } = render(
			<Tippy title="TOOLTIP-01">
				<div />
			</Tippy>
		)

		expect(container.innerHTML).toBe(
			'<div class="" style="display: inline;" data-tooltipped="" data-original-title="TOOLTIP-01"><div></div></div>'
		)

		rerender(
			<Tippy title="TOOLTIP-02">
				<span />
			</Tippy>
		)

		expect(container.innerHTML).toBe(
			'<div class="" style="display: inline;" data-tooltipped="" data-original-title="TOOLTIP-02"><span></span></div>'
		)

		rerender(
			<Tippy title="TOOLTIP-03">
				<Component1 />
			</Tippy>
		)

		expect(container.innerHTML).toBe(
			'<div class="" style="display: inline;" data-tooltipped="" data-original-title="TOOLTIP-03"><button></button></div>'
		)

		rerender(
			<Tippy title="TOOLTIP-04">
				<Component2 />
			</Tippy>
		)

		expect(container.innerHTML).toBe(
			'<div class="" style="display: inline;" data-tooltipped="" data-original-title="TOOLTIP-04"><main></main></div>'
		)
	})

	it('refs are preserved on the child', async () => {
		const testCallback = new Promise((resolve) => {
			const App = () => {
				const refObject = React.createRef<HTMLButtonElement>()
				let callbackRef: HTMLButtonElement

				useEffect(() => {
					expect(callbackRef).toBeTruthy()
					expect(callbackRef instanceof Element).toBe(true)
					expect(refObject.current instanceof Element).toBe(true)
					resolve(true)
				}, [])

				return (
					<>
						<Tippy title="tooltip2">
							<button
								ref={(node) => {
									callbackRef = node
								}}
							/>
						</Tippy>
						<Tippy title="tooltip3">
							<button ref={refObject} />
						</Tippy>
					</>
				)
			}

			render(<App />)
		})
		await testCallback
	})

	it('nesting', () => {
		const { container } = render(
			<Tippy title="tooltip" placement="bottom" open>
				<Tippy title="tooltip" placement="left" open>
					<Tippy title="tooltip" open>
						<button>Text</button>
					</Tippy>
				</Tippy>
			</Tippy>
		)

		expect(container.querySelectorAll(`div[data-original-title="tooltip"]`).length).toBe(3)
	})

	it('turning off both open and hideonclick is dubious, but permissible', () => {
		const spy = vi.spyOn(console, 'warn')

		render(
			<Tippy title="tooltip" open={false} hideOnClick={false}>
				<button />
			</Tippy>
		)

		expect(spy).not.toHaveBeenCalled()
	})

	it('adds a tippy instance to the child node', () => {
		const { getByRole, queryAllByText, container } = render(
			<Tippy title="Tooltip R">
				<button />
			</Tippy>
		)
		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(queryAllByText('Tooltip R').length).toBe(1)
		expect(isTippy(getByRole('tooltip'))).toBe(true)
		expect(isVisible(getByRole('tooltip'))).toBe(true)
	})

	it('if "open" prop is set to `false`, the tooltip element should be hidden', () => {
		const { getByRole, queryAllByText, rerender, container } = render(
			<Tippy title="Tooltip Q" open={false}>
				<button />
			</Tippy>
		)

		expect(queryAllByText('Tooltip P').length).toBe(0)
		expect(queryAllByText('Tooltip Q').length).toBe(0)
		expect(isVisible(screen.getByRole('button').parentElement)).toBe(false)

		rerender(
			<Tippy title="Tooltip P" open={true}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(queryAllByText('Tooltip P').length).toBe(1)
		expect(queryAllByText('Tooltip Q').length).toBe(0)
		expect(isVisible(getByRole('tooltip'))).toBe(true)
	})

	it('if "open" is initially set to `true`', () => {
		const { rerender, getByRole, queryAllByRole } = render(
			<Tippy title="Tooltip K" open={true}>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(1)
		expect(isVisible(getByRole('tooltip'))).toBe(true)

		rerender(
			<Tippy title="Tooltip J" open={false}>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(0)
		expect(isVisible(screen.getByRole('button').parentElement)).toBe(false)
	})

	it('if "disabled" is initially set to `true`', () => {
		const { container, rerender, getByRole, queryAllByRole } = render(
			<Tippy title="Tooltip I" disabled={true}>
				<button />
			</Tippy>
		)

		expect(queryAllByRole('tooltip').length).toBe(0)

		rerender(
			<Tippy title="Tooltip H" disabled={false}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getData(getByRole('tooltip')).settings.disabled).toBe(false)
	})

	it('renders react element content inside the content prop', () => {
		const { container, getByRole } = render(
			<Tippy html={<strong>Tooltip G</strong>}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getByRole('tooltip').querySelector('strong')).not.toBeNull()
	})

	it('`unmountHTMLWhenHide` prop is set', () => {
		const { rerender, queryAllByRole } = render(
			<Tippy html={<>Tooltip</>} open unmountHTMLWhenHide>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(1)

		rerender(
			<Tippy html={<>Tooltip</>} open={false} unmountHTMLWhenHide>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(0)
	})

	it('changing value of `html` prop', () => {
		const { container, getByRole, rerender } = render(
			<Tippy html={<strong>Tooltip</strong>}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getByRole('tooltip').querySelector('strong')).not.toBeNull()
		expect(getByRole('tooltip').querySelector('em')).toBeNull()
		
		rerender(
			<Tippy html={<em>Tooltip</em>}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getByRole('tooltip').querySelector('strong')).toBeNull()
		expect(getByRole('tooltip').querySelector('em')).not.toBeNull()
	})

	it('changing value of `html` prop 2', () => {
		const { getByRole, rerender, queryAllByRole } = render(
			<Tippy trigger="manual" open={false} html={<strong>The Tooltip</strong>}>
				<button>Booten</button>
			</Tippy>
		)

		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(0)
		
		rerender(
			<Tippy trigger="manual" open={true} html={<em>The Tooltip</em>}>
				<button>Button Element</button>
			</Tippy>
		)

		vi.runAllTimers()

		expect(getByRole('tooltip').querySelector('strong')).toBeNull()
		expect(getByRole('tooltip').querySelector('em')).not.toBeNull()
	})

	it('if "disabled" is initially set to `false`', () => {
		const { container, rerender, getByRole, queryAllByRole, queryAllByText } = render(
			<Tippy title="Tooltip F" disabled={false}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(1)
		expect(getData(getByRole('tooltip')).settings.disabled).toBe(false)

		rerender(
			<Tippy title="Tooltip E" disabled={true}>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByRole('tooltip').length).toBe(0)
		expect(queryAllByText('Tooltip E').length).toBe(0)
		expect(getData(screen.getByRole('button').parentElement)).toBe(undefined)
	})

	it('unmount destroys the tippy instance and allows garbage collection', () => {
		const { container, unmount, queryAllByRole } = render(
			<Tippy title="Tooltip D" open>
				<button />
			</Tippy>
		)

		vi.runAllTimers()

		expect(container.querySelectorAll('button').length).toBe(1)
		expect(queryAllByRole('tooltip').length).toBe(1)

		unmount()

		expect(queryAllByRole('tooltip').length).toBe(0)
		expect(container.querySelectorAll('button').length).toBe(0)
	})

	it('updating props updates the tippy instance', () => {
		const { container, rerender, getByRole, queryAllByText } = render(
			<Tippy title="Tooltip C">
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getData(getByRole('tooltip')).settings.arrow).toBe(false)
		expect(queryAllByText('Tooltip C').length).toBe(1)

		rerender(
			<Tippy title="Tooltip B" arrow>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getData(getByRole('tooltip')).settings.arrow).toBe(true)
		expect(queryAllByText('Tooltip B').length).toBe(1)
	})

	it('component as a child', () => {
		const Child = React.forwardRef<HTMLButtonElement>((_, ref) => <button ref={ref} />)

		const { container, queryAllByText } = render(
			<Tippy title="Tooltip A">
				<Child />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(queryAllByText('Tooltip A').length).toBe(1)
	})

	it('`sticky` prop', () => {
		const { container, getByRole } = render(
			<Tippy title="Tooltip" sticky stickyDuration={500}>
				<button />
			</Tippy>
		)

		fireEvent.mouseEnter(container.childNodes[0])
		vi.runAllTimers()

		expect(getData(getByRole('tooltip')).popper.style.transitionDuration).toBe('500ms')
	})
})

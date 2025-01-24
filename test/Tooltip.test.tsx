import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Tippy from '@package/component'
import { Store } from '@package/js/core/globals'
import isVisible from '@package/js/utils/isVisible.js'

const getData = (ref: Element) => (
	Store.find(({ popper }) => ref === popper)
)

const getTitle = (ref: Element) => (
	getData(ref).el.getAttribute('title')
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

	it('will not call console.warn', () => {
		const spy = vi.spyOn(console, 'warn')

		render(
			<Tippy title="tooltip" open={false} hideOnClick={false}>
				<button />
			</Tippy>
		)

		expect(spy).not.toHaveBeenCalled()
	})

	it.only('adds a tippy instance to the child node', () => {
		const { getByRole, queryAllByText } = render(
			<Tippy title="Tooltip R" open>
				<button />
			</Tippy>
		)
		vi.runAllTimers()

		expect(queryAllByText('Tooltip R').length).toBe(1)
		expect(getTitle(getByRole('tooltip'))).toBe('Tooltip R')
		expect(isVisible(getByRole('tooltip'))).toBe(true)
	})

	it('if "open" prop is set to `false`, the tooltip element should be hidden', () => {
		const { getByRole, queryAllByText, rerender } = render(
			<Tippy title="Tooltip Q" open={false}>
				<button />
			</Tippy>
		)

		expect(queryAllByText('Tooltip P').length).toBe(0)
		expect(queryAllByText('Tooltip Q').length).toBe(1)
		expect(isVisible(getByRole('tooltip'))).toBe(false)

		rerender(
			<Tippy title="Tooltip P" open={true}>
				<button />
			</Tippy>
		)

		expect(queryAllByText('Tooltip P').length).toBe(1)
		expect(queryAllByText('Tooltip Q').length).toBe(0)
		expect(isVisible(getByRole('tooltip'))).toBe(true)
	})

	it('if "open" is set, then "hideOnClick" is false by default', () => {
		const { rerender, getByRole } = render(
			<Tippy title="Tooltip O" open={true}>
				<button />
			</Tippy>
		)

		vi.runAllTimers()

		expect(getData(getByRole('tooltip')).settings.hideOnClick).toBe(false)

		rerender(
			<Tippy title="Tooltip N" open={false}>
				<button />
			</Tippy>
		)

		expect(getData(getByRole('tooltip')).settings.hideOnClick).toBe(false)

		rerender(
			<Tippy title="Tooltip M" open={false} hideOnClick={true}>
				<button />
			</Tippy>
		)

		expect(getData(getByRole('tooltip')).settings.hideOnClick).toBe(false)

		rerender(
			<Tippy title="Tooltip L" hideOnClick="persistent">
				<button />
			</Tippy>
		)

		expect(
			getData(getByRole('tooltip')).settings.hideOnClick
		).toBe('persistent')
	})

	it('if "open" is initially set to `true`', () => {
		const { rerender, getByRole } = render(
			<Tippy title="Tooltip K" open={true}>
				<button />
			</Tippy>
		)

		expect(isVisible(getByRole('tooltip'))).toBe(true)

		rerender(
			<Tippy title="Tooltip J" open={false}>
				<button />
			</Tippy>
		)

		expect(isVisible(getByRole('tooltip'))).toBe(false)
	})

	it('if "disabled" is initially set to `true`', () => {
		const { rerender, getByRole, queryAllByRole } = render(
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

		expect(getData(getByRole('tooltip')).settings.disabled).toBe(false)
	})

	it('renders react element content inside the content prop', () => {
		const { getByRole } = render(
			<Tippy html={<strong>Tooltip G</strong>}>
				<button />
			</Tippy>
		)

		expect(getByRole('tooltip').querySelector('strong')).not.toBeNull()
	})

	it('if "disabled" is initially set to `false`', () => {
		const { rerender, getByRole, queryAllByRole } = render(
			<Tippy title="Tooltip F" disabled={false}>
				<button />
			</Tippy>
		)

		expect(queryAllByRole('tooltip').length).toBe(1)
		expect(getData(getByRole('tooltip')).settings.disabled).toBe(false)

		rerender(
			<Tippy title="Tooltip E" disabled={true}>
				<button />
			</Tippy>
		)

		expect(queryAllByRole('tooltip').length).toBe(0)
		expect(getData(getByRole('tooltip')).settings.disabled).toBe(true)
	})

	it('unmount destroys the tippy instance and allows garbage collection', () => {
		const { container, unmount, queryAllByRole } = render(
			<Tippy title="Tooltip D">
				<button />
			</Tippy>
		)

		unmount()

		expect(queryAllByRole('tooltip').length).toBe(0)
		expect(container.querySelector('button')).toBe(undefined)
	})

	it('updating props updates the tippy instance', () => {
		const { rerender, getByRole } = render(
			<Tippy title="Tooltip C">
				<button />
			</Tippy>
		)

		expect(getData(getByRole('tooltip')).settings.arrow).toBe(false)
		expect(getTitle(getByRole('tooltip'))).toBe('Tooltip C')

		rerender(
			<Tippy title="Tooltip B" arrow>
				<button />
			</Tippy>
		)

		expect(getData(getByRole('tooltip')).settings.arrow).toBe(true)
		expect(getTitle(getByRole('tooltip'))).toBe('Tooltip B')
	})

	it('component as a child', () => {
		const Child = React.forwardRef<HTMLButtonElement>((_, ref) => <button ref={ref} />)

		const { getByRole } = render(
			<Tippy title="Tooltip A">
				<Child />
			</Tippy>
		)

		expect(getTitle(getByRole('tooltip'))).toBe('Tooltip A')
	})
})

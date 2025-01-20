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

		expect(test.container.innerHTML).toBe('<button></button>')

		const test2 = render(
			<Tippy html={<div>tooltip</div>}>
				<button />
			</Tippy>
		)

		expect(test2.container.innerHTML).toBe(
			'<button></button>'
		)
	})

	it('cleans up after unmounting in tests', async () => {
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

		// open up the tooltip
		screen.getByRole('button').click()
		expect(screen.getByText('tooltip4')).toBeInTheDocument()

		// close the tooltip
		screen.getByRole('button').click()
		await waitFor(() => {
			expect(screen.getByRole('tooltip').getAttribute('data-state')).toBe(
				'hidden'
			)
		})
	})

	it('props.className: extra whitespace is ignored', () => {
		const className = '   hello world  '

		const { container } = render(
			<Tippy title="tooltip" className={className}>
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className).toBe('tippy hello world')
	})

	it('props.className: updating does not leave stale className behind', () => {
		const { container, rerender } = render(
			<Tippy title="tooltip" className="one">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className?.includes('one')).toBe(true)

		rerender(
			<Tippy title="tooltip" className="two">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className?.includes('one')).toBe(false)
		expect(container?.firstElementChild?.className?.includes('two')).toBe(true)
	})

	it('props.className: syncs with children.type', () => {
		const { container, rerender } = render(
			<Tippy title="tooltip" className="one">
				<button />
			</Tippy>
		)

		expect(container?.firstElementChild?.className?.includes('one')).toBe(true)

		rerender(
			<Tippy title="tooltip" className="one">
				<span />
			</Tippy>
		)

		expect(container?.firstElementChild?.className?.includes('one')).toBe(true)
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

		expect(container.innerHTML).toBe('<div></div>')

		rerender(
			<Tippy title="TOOLTIP-02">
				<span />
			</Tippy>
		)

		expect(container.innerHTML).toBe('<span></span>')

		rerender(
			<Tippy title="TOOLTIP-03">
				<Component1 />
			</Tippy>
		)

		expect(container.innerHTML).toBe('<button></button>')

		rerender(
			<Tippy title="TOOLTIP-04">
				<Component2 />
			</Tippy>
		)

		expect(container.innerHTML).toBe('<main></main>')
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
		render(
			<Tippy title="tooltip" placement="bottom" open>
				<Tippy title="tooltip" placement="left" open>
					<Tippy title="tooltip" open>
						<button>Text</button>
					</Tippy>
				</Tippy>
			</Tippy>
		)

		expect(document.querySelectorAll('.tippy-box').length).toBe(3)
	})

	it('controlled mode warnings', () => {
		const spy = vi.spyOn(console, 'warn')

		const { rerender } = render(
			<Tippy title="tooltip" hideOnClick={false}>
				<button />
			</Tippy>
		)

		expect(spy).not.toHaveBeenCalled()

		rerender(
			<Tippy title="tooltip" open={false} hideOnClick={false}>
				<button />
			</Tippy>
		)

		expect(spy).toHaveBeenCalledWith(
			[
				'@tippyjs/react: Cannot specify `hideOnClick` prop in controlled',
				'mode (`open` prop)'
			].join(' ')
		)

		rerender(
			<Tippy title="tooltip" open={false} trigger="click">
				<button />
			</Tippy>
		)

		expect(spy).toHaveBeenCalledWith(
			[
				'@tippyjs/react: Cannot specify `trigger` prop in controlled',
				'mode (`open` prop)'
			].join(' ')
		)
	})

	it('adds a tippy instance to the child node', () => {
		const { getByRole, queryAllByTitle } = render(
			<Tippy title="Tooltip R">
				<button />
			</Tippy>
		)

		expect(queryAllByTitle('Tooltip R').length).toBe(1)
		expect(getTitle(getByRole('tooltip'))).toBe('Tooltip R')
		expect(isVisible(getByRole('tooltip'))).toBe(true)
	})

	it('if "open" prop is set to `false`, the tooltip element should be hidden', () => {
		const { getByRole, queryAllByTitle, rerender } = render(
			<Tippy title="Tooltip Q" open={false}>
				<button />
			</Tippy>
		)

		expect(queryAllByTitle('Tooltip P').length).toBe(0)
		expect(queryAllByTitle('Tooltip Q').length).toBe(1)
		expect(isVisible(getByRole('tooltip'))).toBe(false)

		rerender(
			<Tippy title="Tooltip P" open={true}>
				<button />
			</Tippy>
		)

		expect(queryAllByTitle('Tooltip P').length).toBe(1)
		expect(queryAllByTitle('Tooltip Q').length).toBe(0)
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

import React, { useEffect } from 'react'
import Tippy from '../src/component'
import { render, screen, waitFor } from '@testing-library/react'

describe('<Tippy />', () => {
	it('renders only the child element', () => {
		const stringContent = render(
			<Tippy title="tooltip">
				<button />
			</Tippy>
		)

		expect(stringContent.container.innerHTML).toBe('<button></button>')

		const reactElementContent = render(
			<Tippy html={<div>tooltip</div>}>
				<button />
			</Tippy>
		)

		expect(reactElementContent.container.innerHTML).toBe(
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
		const test = new Promise((resolve) => {
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
		await test
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
})

import React from 'react'
import Tippy from '../src/component'
import { render } from '@testing-library/react'

/** @todo write a new Tippy component here where the instance object is monitored by vitest */

describe('Tippy internal instance', () => {
	/** @warning instance object is no longer leaked to frontend, needs to be tested in tippyFactory.test.ts instead */
	let instance = null

	/** @todo move instance asserts into tippyFactory.test.ts */
	afterEach(() => {
		instance = null
	})

	/** @todo new component promise test thing for checking tippy text */
	it('updating children destroys old Tippy object and creates new one')

	it.skip('adds a tippy instance to the child node', () => {
		render(
			<Tippy title="tooltip">
				<button />
			</Tippy>
		)

		expect(instance).not.toBeNull()
	})

	it.skip('props.open initially `false`', () => {
		const { rerender } = render(
			<Tippy title="tooltip" open={false}>
				<button />
			</Tippy>
		)

		expect(instance.state.isVisible).toBe(false)

		rerender(
			<Tippy title="tooltip" open={true}>
				<button />
			</Tippy>
		)

		expect(instance.state.isVisible).toBe(true)
	})

	it.skip('props.open uses hideOnClick: false by default', () => {
		const { rerender } = render(
			<Tippy title="tooltip" open={true}>
				<button />
			</Tippy>
		)

		vi.runAllTimers()

		expect(instance.props.hideOnClick).toBe(false)

		rerender(
			<Tippy title="tooltip" open={false}>
				<button />
			</Tippy>
		)

		expect(instance.props.hideOnClick).toBe(false)

		rerender(
			<Tippy title="tooltip" open={false} hideOnClick={true}>
				<button />
			</Tippy>
		)

		expect(instance.props.hideOnClick).toBe(false)

		rerender(
			<Tippy title="tooltip" hideOnClick="toggle">
				<button />
			</Tippy>
		)

		expect(instance.props.hideOnClick).toBe('toggle')
	})

	it.skip('props.open initially `true`', () => {
		const { rerender } = render(
			<Tippy title="tooltip" open={true}>
				<button />
			</Tippy>
		)

		expect(instance.state.isVisible).toBe(true)

		rerender(
			<Tippy title="tooltip" open={false}>
				<button />
			</Tippy>
		)

		expect(instance.state.isVisible).toBe(false)
	})

	it.skip('props.disabled initially `true`', () => {
		const { rerender } = render(
			<Tippy title="tooltip" disabled={true}>
				<button />
			</Tippy>
		)

		expect(instance.state.isEnabled).toBe(false)

		rerender(
			<Tippy title="tooltip" disabled={false}>
				<button />
			</Tippy>
		)

		expect(instance.state.isEnabled).toBe(true)
	})

	it.skip('renders react element content inside the content prop', () => {
		render(
			<Tippy html={<strong>tooltip</strong>}>
				<button />
			</Tippy>
		)

		expect(instance.popper.querySelector('strong')).not.toBeNull()
	})

	it.skip('props.disabled initially `false`', () => {
		const { rerender } = render(
			<Tippy title="tooltip" disabled={false}>
				<button />
			</Tippy>
		)

		expect(instance.state.isEnabled).toBe(true)

		rerender(
			<Tippy title="tooltip" disabled={true}>
				<button />
			</Tippy>
		)

		expect(instance.state.isEnabled).toBe(false)
	})

	it.skip('unmount destroys the tippy instance and allows garbage collection', () => {
		const { container, unmount } = render(
			<Tippy title="tooltip">
				<button />
			</Tippy>
		)
		const button = container.querySelector('button')

		unmount()

		// expect(button._tippy).toBeUndefined();
		expect(instance.state.isDestroyed).toBe(true)
	})

	it.skip('updating props updates the tippy instance', () => {
		const { rerender } = render(
			<Tippy title="tooltip">
				<button />
			</Tippy>
		)

		expect(instance.props.arrow).toBe(false)

		rerender(
			<Tippy title="tooltip" arrow>
				<button />
			</Tippy>
		)

		expect(instance.props.arrow).toBe(true)
	})

	it.skip('component as a child', () => {
		const Child = React.forwardRef<HTMLButtonElement>((_, ref) => <button ref={ref} />)

		render(
			<Tippy title="tooltip">
				<Child />
			</Tippy>
		)

		expect(instance).not.toBeNull()
	})
})

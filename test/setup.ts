/// <reference types="vitest" />
import '@testing-library/jest-dom'

import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

const originalRequestAnimationFrame = window.requestAnimationFrame

beforeAll(() => {
	// @ts-expect-error the thing returns void instead of number, also expects a timestamp parameter
	window.requestAnimationFrame = (cb) => cb?.()
})

afterAll(() => {
	window.requestAnimationFrame = originalRequestAnimationFrame
})

beforeEach(() => {
	vi.useFakeTimers()
})

afterEach(() => {
	vi.useRealTimers()

	try { document.body.innerHTML = '' } catch {/** */}
})

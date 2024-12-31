/// <reference types="vitest" />
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/vitest'

import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

beforeEach(() => {
	vi.useFakeTimers()
})

afterEach(() => {
	vi.useRealTimers()

	try { document.body.innerHTML = '' } catch {/** */}
})

import { Instance, Options } from '@popperjs/core'

export default function toggleEventListeners(
	instance?: Instance,
	enabled: boolean = false
) {
	const fn = (options: Options) => {
		const eventHandlers = options.modifiers.filter(
			({ name }) => (name === 'eventListeners')
		)
		if (eventHandlers.length === 0) {
			options.modifiers.push({ name: 'eventListeners', enabled: false })
		} else {
			eventHandlers.forEach((modifier) => {
				Object.assign(modifier, { enabled })
			})
		}
		return options
	}
	instance?.setOptions?.(fn)
}

import { TooltipProps } from './types'

/**
* The default settings applied to each instance
*/
export default Object.freeze({
	html: undefined,
	position: 'top',
	animation: 'shift',
	animateFill: true,
	arrow: false,
	arrowSize: 'regular',
	delay: 0,
	trigger: 'mouseenter focus',
	duration: 350,
	interactive: false,
	interactiveBorder: 2,
	theme: 'dark',
	size: 'regular',
	distance: 10,
	offset: [0, 0] as [number, number],
	hideOnClick: true,
	hideOnScroll: false,
	multiple: false,
	followCursor: false,
	inertia: false,
	flipDuration: 350,
	sticky: false,
	stickyDuration: 200,
	appendTo: () => document.body,
	zIndex: 9999,
	touchHold: false,
	flipModifierOptions: undefined,
	open: undefined,
	onRequestClose: () => {},
}) as TippyOptions

export interface TippyOptions extends Partial<TooltipProps> {
	html?: undefined | HTMLElement
	children?: never
	className?: never
	style?: never
	tabIndex?: never
	tag?: never
	title?: never
	renderVirtualDom?: () => void
	unmountFromVirtualDom?: () => void
	useVirtualDom?: boolean
}

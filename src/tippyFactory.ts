import Tippy from './js/tippy'
import { TooltipProps } from './types'

// TS wrapper to initially be used in test environment for now
export default function tippyFactory(
	selector: string | Element | Element[],
	options: TippyOptions
) {
	return new Tippy(selector, options)
}

interface TippyOptions extends TooltipProps {
	html: undefined | HTMLElement
	children: never
	className: never
	style: never
	tabIndex: never
	title: never
	renderVirtualDom: () => void
	unmountFromVirtualDom: () => void
	useVirtualDom: boolean
}

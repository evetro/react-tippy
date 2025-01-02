import Tippy from './js/tippy'
import { TippyOptions } from './defaults'

// TS wrapper to initially be used in test environment for now
export default function tippyFactory(
	selector: string | Element | Element[],
	options: TippyOptions
) {
	return new Tippy(selector, options)
}

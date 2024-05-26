import * as React from "react"

export type Position =
	| "top"
	| "top-start"
	| "top-end"
	| "bottom"
	| "bottom-start"
	| "bottom-end"
	| "left"
	| "left-start"
	| "left-end"
	| "right"
	| "right-start"
	| "right-end"

export type Trigger = "mouseenter" | "focus" | "click" | "manual"

export type Animation = "shift" | "perspective" | "fade" | "scale" | "none"

export type Size = "small" | "regular" | "big"

export type Theme = "dark" | "light" | "transparent"

// TODO implement "appendTo" feature with 'appendTo' prop in TooltipProps
export interface TooltipProps {
	title?: string
	disabled?: boolean
	open?: boolean
	onRequestClose?: () => void
	position?: Position
	trigger?: Trigger
	tabIndex?: number
	interactive?: boolean
	interactiveBorder?: number
	delay?: number | [number, number]
	hideOnScroll?: boolean;
	hideDelay?: number
	animation?: Animation
	arrow?: boolean
	arrowSize?: Size
	animateFill?: boolean
	duration?: number
	hideDuration?: number
	distance?: number
	offset?: number
	hideOnClick?: boolean | "persistent"
	multiple?: boolean
	followCursor?: boolean
	inertia?: boolean
	transitionFlip?: boolean
	popperOptions?: any // TODO define structure PopperOptions for v2
	html?: React.ReactElement<any>
	unmountHTMLWhenHide?: boolean
	size?: Size
	sticky?: boolean
	stickyDuration?: number
	beforeShown?: () => void
	shown?: () => void
	beforeHidden?: () => void
	hidden?: () => void
	onShow?: () => void
	onShown?: () => void,
	onHide?: () => void
	onHidden?: () => void,
	theme?: Theme
	className?: string
	style?: React.CSSProperties
	children?: React.ReactNode
	zIndex?: number;
	tag?: 'div' | 'span' | 'a'
	touchHold?: boolean;
}
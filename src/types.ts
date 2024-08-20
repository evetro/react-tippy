import { Options as FlipModifierOptions } from '@popperjs/core/lib/modifiers/flip'
import React from 'react'

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

export interface TooltipProps {
	animateFill?: boolean
	animation?: Animation
	appendTo?: HTMLElement | (() => HTMLElement)
	arrow?: boolean
	arrowSize?: Size
	children?: React.ReactNode
	className?: string
	delay?: number | [number, number]
	disabled?: boolean
	distance?: number
	duration?: number
	followCursor?: boolean
	hideDelay?: number
	hideDuration?: number
	hideOnClick?: boolean | "persistent"
	hideOnScroll?: boolean
	html?: React.ReactElement<any>
	inertia?: boolean
	interactive?: boolean
	interactiveBorder?: number
	multiple?: boolean
	offset?: [number, number]
	onHidden?: () => void
	onHide?: () => void
	onRequestClose?: () => void
	onShow?: () => void
	onShown?: () => void
	open?: boolean
	flipModifierOptions?: FlipModifierOptions
	position?: Position
	size?: Size
	sticky?: boolean
	stickyDuration?: number
	style?: React.CSSProperties
	tabIndex?: number
	tag?: 'div' | 'span' | 'a'
	theme?: Theme
	title?: string
	touchHold?: boolean
	trigger?: Trigger
	unmountHTMLWhenHide?: boolean
	zIndex?: number
}


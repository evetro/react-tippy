import { Options as FlipModifierOptions } from "@popperjs/core/lib/modifiers/flip"
import React from "react"

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

export type Trigger = "manual" | ValidEvents<"click", "focus", "focusin", "mouseenter">

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
	html?: React.ReactNode
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
	open?: boolean | undefined
	flipModifierOptions?: FlipModifierOptions
	position?: Position
	size?: Size
	sticky?: boolean
	stickyDuration?: number
	style?: React.CSSProperties
	tabIndex?: number
	tag?: "div" | "span" | "a"
	theme?: Theme
	title?: string
	touchHold?: boolean
	trigger?: Trigger
	unmountHTMLWhenHide?: boolean
	zIndex?: number
}

type ValidEvents<
	S extends SupportedEvents,
	T extends SupportedEvents,
	U extends SupportedEvents,
	V extends SupportedEvents
> =
	| `${S} ${ValidEvents3<T, U, V>}`
	| `${T} ${ValidEvents3<S, U, V>}`
	| `${U} ${ValidEvents3<S, T, V>}`
	| `${V} ${ValidEvents3<S, T, U>}`
	| ValidEvents3<S, T, U>
	| ValidEvents3<S, T, V>
	| ValidEvents3<S, U, V>
	| ValidEvents3<T, U, V>

type ValidEvents3<
	S extends SupportedEvents,
	T extends SupportedEvents,
	U extends SupportedEvents
> =
	| `${S} ${ValidEvents2<T, U>}`
	| `${T} ${ValidEvents2<S, U>}`
	| `${U} ${ValidEvents2<S, T>}`
	| ValidEvents2<T, U>
	| ValidEvents2<S, U>
	| ValidEvents2<S, T>

type ValidEvents2<
	T extends SupportedEvents,
	U extends SupportedEvents
> = `${T} ${U}` | `${U} ${T}` | T | U

type SupportedEvents = "mouseenter" | "focus" | "click" | "focusin"

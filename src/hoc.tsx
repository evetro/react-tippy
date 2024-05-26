import React from 'react'

import Tooltip from './component'
import { TooltipProps } from './types'

export default function withTooltip<T>(
	Component: React.ComponentType<T>,
	options: TooltipProps = {}
) {
	const WrappedByTooltip = ({ ...props }: Readonly<T>) => (
		<Tooltip {...options}>
			<Component {...props} />
		</Tooltip>
	)
	return WrappedByTooltip
}

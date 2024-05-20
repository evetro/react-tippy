import { ReactNode } from 'react'
import { Tooltip } from '@package'

const ManualPopover = ({ children, open, onRequestClose, content }: { onRequestClose: () => void, open: boolean, content: ReactNode, children: ReactNode }) => (
	<Tooltip
		html={content}
		position="bottom"
		open={open}
		onRequestClose={onRequestClose}
		trigger="manual"
		interactive
		animateFill={false}
	>
		{children}
	</Tooltip>
)

export default ManualPopover

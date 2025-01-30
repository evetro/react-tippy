import { ReactNode, useState } from 'react'

import ManualPopover from './ManualPopover'

export default function Menu({ selected, children }: { selected: number, children: ReactNode }) {
	const [visible, setVisible] = useState(false)

	const hide = () => { setVisible(false) }
	const toggle = () => { setVisible(flag => !flag) }

	const onRequestClose = () => {
		console.log('Manual PopoverContent Close Event Triggered')
		hide()
	}

	const PopoverContent = (
		<div onClick={hide}>
			{children}
		</div>
	)

	return (
		<div>
			<ManualPopover
				open={visible}
				content={PopoverContent}
				onRequestClose={onRequestClose}
			>
				<button onClick={toggle}>Selected number: {selected}</button>
			</ManualPopover>
			<>{children}</>
		</div>
	)
}

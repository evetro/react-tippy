import { ReactNode, useState } from 'react'

import ManualPopover from './ManualPopover'

export default function Menu({ selected, children }: { selected: number, children: ReactNode }) {
	const [visible, setVisible] = useState(false)

	const hide = () => { setVisible(false) }
	const toggle = () => { setVisible(flag => !flag) }

	const onRequestClose = () => {
		console.log('manual PopoverContent CLOSE triggered')
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
				<button onClick={toggle}>{selected}</button>
			</ManualPopover>
			<>{children}</>
		</div>
	)
}

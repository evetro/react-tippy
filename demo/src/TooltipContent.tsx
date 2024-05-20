import { useEffect } from 'react'

import { useAppStore } from '../appState'

export default function TooltipContent() {
	const [content] = useAppStore()

	useEffect(() => {
		console.log('TooltipContent Mount')
		return () => {
			console.log('TooltipContent Unmount')
		}
	}, [])

	return (
		<div>
			TooltipContent here {content}
		</div>
	)
}

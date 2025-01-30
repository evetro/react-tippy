import { ReactNode, useEffect } from 'react'

export default function TooltipContent({ children }: { children: ReactNode }) {
	useEffect(() => {
		console.log('TooltipContent Mount')
		return () => {
			console.log('TooltipContent Unmount')
		}
	}, [])

	return <>{children}</>
}

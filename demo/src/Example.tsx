import { useState } from 'react'

import Menu from './Menu'

export default function Example() {
	const [value, setValue] = useState(1)
	const options = [3, 5, 1]
	const toDiv = (option: number) => {
		const isActive = option === value
		const key = `${option}`
		// console.log(`Rendering ${key}, isActive: ${isActive}`)
		const onClick = () => { setValue(option) }
		return (
			<div key={key} onClick={onClick}>
				{option}: {isActive ? "      is active" : " is not active"}
			</div>
		)
	}
	return <Menu selected={value}>{options.map(toDiv)}</Menu>
}

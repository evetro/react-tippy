import { ChangeEventHandler } from 'react'
import { Tooltip } from '@package'

import Example from './Example'
import TooltipContent from './TooltipContent'
import { HeaderWithTootip, NormalHeader } from './headers'
import logo from '../logo.svg'
import { useAppStore } from '../appState'

export default function App() {
	const [{ tooltipContent, disabled, open }, setAppState] = useAppStore()

	const setTooltipContent: ChangeEventHandler<HTMLInputElement> = (e) => {
		setAppState({ tooltipContent: e.target.value })
	}
	const openOn = () => {
		console.log('open')
		setAppState({ open: true })
	}
	const close = () => {
		console.log('close')
		setAppState({ open: false })
	}
	const setDisable = () => { setAppState(p => ({ disabled: !p.disabled })) }

	return (
		<div className="App">
			<div className="App-header" onClick={setDisable}>
				<img src={logo} className="App-logo" alt="logo" />
			</div>
			<NormalHeader />
			<hr />
			<HeaderWithTootip />
			<hr />
			<Tooltip
				title="Welcome to React"
				tag="span"
				trigger="mouseenter focus click"
				duration={300}
			>
				<p>Hover here to show popup</p>
			</Tooltip>
			<hr />
			<Tooltip
				title="Welcome to React"
				position="bottom"
				trigger="mouseenter"
				duration={3000}
				unmountHTMLWhenHide
			>
				<p>Hover here to show popup</p>
			</Tooltip>
			<hr />
			<Tooltip
				title="Sticky"
				trigger="mouseenter"
				sticky
				interactiveBorder={10}
			>
				<p style={{ animation: 'hover 2s ease-in-out infinite' }}>
					Sticky
				</p>
			</Tooltip>
			<button onClick={openOn}>
				Do something
			</button>
			<hr />
			<Tooltip
				disabled={disabled}
				title={tooltipContent}
				open={open}
				onRequestClose={close}
			>
				<span className="App-intro" onClick={openOn}>
					Big Tooltip with dynamic content: {tooltipContent} {open.toString()} {disabled.toString()}
				</span>
			</Tooltip>
			<hr />
			{disabled ? null : (
				<Tooltip
					trigger="click"
					tabIndex={0}
					unmountHTMLWhenHide
					html={<TooltipContent />}
				>
					Click here
				</Tooltip>
			)}
			<hr />
			<Tooltip
				trigger="click"
				interactive
				position="right"
				animateFill={false}
				html={(
					<div style={{ width: 400 }}>
						<p>{tooltipContent}</p>
						<input
							type="text"
							value={tooltipContent}
							onChange={setTooltipContent}
						/>
					</div>
				)}
			>
				<span className="App-intro" >Interactive tooltip</span>
			</Tooltip>
			<Example />
		</div>
	)
}

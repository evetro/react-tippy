import { ChangeEventHandler } from 'react'
import { Tooltip } from '@package'

import Example from './Example'
import TooltipContent from './TooltipContent'
import { HeaderWithTootip, NormalHeader } from './headers'
import logo from '../logo.svg'
import { useAppStore } from '../appState'
import Separator from './Separator'

export default function App() {
	const [{ tooltipContent, disabled, open }, setAppState] = useAppStore()

	const NestedChild = () => (
		<div>
			<div>
				TooltipContent: {tooltipContent}
			</div>
			<div>
				Disabled? {String(disabled)}
			</div>
			<div>
				Open? {String(open)}
			</div>
		</div>
	)

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
	const getOnHidden = (id: string) => () => console.log(`Tooltip ${id} hidden`)
	const getOnHide = (id: string) => () => console.log(`Hide Tooltip ${id}`)

	return (
		<div className="App">
			<div className="App-header" onClick={setDisable}>
				<img src={logo} className="App-logo" alt="logo" />
			</div>
			<NormalHeader />
			<Separator />
			<HeaderWithTootip />
			<Separator />
			<Tooltip
				title="Welcome to React"
				tag="span"
				trigger="mouseenter focus click"
				duration={500}
				onHide={getOnHide('A')}
				onHidden={getOnHidden('A')}
			>
				<p>Hover here to show tooltip 1</p>
			</Tooltip>
			<Separator />
			<Tooltip
				title="Welcome to React"
				position="bottom"
				trigger="mouseenter"
				duration={1500}
				unmountHTMLWhenHide
				onHide={getOnHide('B')}
				onHidden={getOnHidden('B')}
			>
				<p>Hover here to show tooltip 2</p>
			</Tooltip>
			<Separator />
			<Tooltip
				title="Sticky"
				trigger="mouseenter"
				sticky
				stickyDuration={2000}
				duration={5000}
				interactiveBorder={10}
				onHide={getOnHide('C')}
				onHidden={getOnHidden('C')}
			>
				<p style={{ animation: 'hover 2s ease-in-out infinite' }}>
					Sticky
				</p>
			</Tooltip>
			<button onClick={openOn}>
				Do something
			</button>
			<Separator />
			<Tooltip
				disabled={disabled}
				title={tooltipContent}
				open={open}
				onRequestClose={close}
				onHide={getOnHide('D')}
				onHidden={getOnHidden('D')}
			>
				<div className="App-intro" onClick={openOn}>
					Big Tooltip with dynamic content:
					<NestedChild />
				</div>
			</Tooltip>
			<Separator />
			{disabled ? null : (
				<Tooltip
					trigger="click"
					tabIndex={0}
					unmountHTMLWhenHide
					html={<TooltipContent><NestedChild /></TooltipContent>}
					onHide={getOnHide('E')}
					onHidden={getOnHidden('E')}
					>
					Click here
				</Tooltip>
			)}
			<Separator />
			<Tooltip
				trigger="click"
				interactive
				position="right"
				animateFill={false}
				onHide={getOnHide('F')}
				onHidden={getOnHidden('F')}
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
				<span className="App-intro">Interactive tooltip</span>
			</Tooltip>
			<Example />
		</div>
	)
}

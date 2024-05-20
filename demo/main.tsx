import ReactDOM from 'react-dom'
import '@package/tippy.css'

import App from './src'
import { AppProvider } from './appState'

ReactDOM.render(
	<AppProvider><App /></AppProvider>,
	document.getElementById('root')
)

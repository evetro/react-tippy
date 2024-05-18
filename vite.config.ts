import svgr from 'vite-plugin-svgr'

import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default {
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			'@package': path.resolve('../src')
		}
	},
	root: './demo'
}

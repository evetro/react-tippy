import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
	plugins: [react(), svgr()],
	root: './demo'
}

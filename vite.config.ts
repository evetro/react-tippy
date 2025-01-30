import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@package': resolve('./src')
		}
	},
	root: '.',
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/index.js'),
			name: 'reactTippy',
			// the proper extensions will be added
			fileName: 'react-tippy',
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['react', 'react-dom', 'popper.js'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'popper.js': 'Popper'
				}
			}
		}
	},
	test: {
		coverage: {
			provider: 'v8',
			enabled: true,
			reporter: 'html',
			include: ['src/**'],
			reportOnFailure: true
		},
		include: ['test/**/*.test.ts?(x)'],
		snapshotFormat: {
			printBasicPrototype: true
		},
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.ts']
	}
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

process.title = 'vite'

export default defineConfig({
	plugins: [
		react(),
	],
	build: {
		target: 'esnext',
	},
	root: 'app',
	clearScreen: false,
	server: {
		port: 3000,
		strictPort: true,
		allowedHosts: ['localhost'],
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				ws: true,
			},
		}
	},
	resolve: {
		alias: {
			'#app/*': './app/*',
		}
	}
})
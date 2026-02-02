import { sveltekit } from '@sveltejs/kit/vite'
import { type UserConfig } from 'vite'
import path from 'path'

const config: UserConfig = {
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or "modern"
				additionalData: `
				@use '$styles/variables' as *;
				@use '$styles/mixins' as *;
        `
			}
		}
	},
	plugins: [sveltekit(),],
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	}
}

export default config

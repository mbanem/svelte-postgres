import { sveltekit } from '@sveltejs/kit/vite'
import { UserConfig } from 'vite'

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
	plugins: [sveltekit(),]
}

export default config

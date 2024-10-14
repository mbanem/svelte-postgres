import { sveltekit } from '@sveltejs/kit/vite'
import { UserConfig } from 'vite'

const config: UserConfig = {
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use '$styles/variables' as *;
					@use '$styles/mixins' as *;
        `
			}
		}
	}
}

export default config

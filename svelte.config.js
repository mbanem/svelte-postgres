import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			scss: {
				prependData: `@import './src/styles/global.scss';`
			}
		})
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$styles: path.resolve('./src/styles/'),
			$routes: path.resolve('./src/routes/'),
			$params: path.resolve('./src/routes/params'),
			$lib: path.resolve('./src/lib/'),
			$actions: path.resolve('./src/lib/actions/'),
			$components: path.resolve('./src/lib/components/'),
			$server: path.resolve('./src/lib/server/'),
			$utils: path.resolve('./src/lib/utils/'),
			$store: path.resolve('./src/lib/stores'),
			$assets: path.resolve('./src/static/assets'),
			$images: path.resolve('./src/images')
		}
	}
};

export default config;

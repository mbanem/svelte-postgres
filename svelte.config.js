import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code === 'css-unused-selector') {
      return
    }
    handler(warning)
  },
  compilerOptions: {
    customElement: true,
  },
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    // methodOverride: {
    //   allowed: ['PUT', 'PATCH', 'DELETE'],
    // },
    alias: {
      $lib: './src/lib/',
      $utils: './src/lib/utils/',
      $styles: './src/styles/',
      $routes: './src/routes/',
      $params: './src/routes/params',
      $types: './src/lib/types/',
      $actions: './src/lib/actions/',
      $components: './src/lib/components/',
      $server: './src/lib/server/',
      $store: './src/lib/stores',
      $assets: './src/static/assets',
    },
  },
}

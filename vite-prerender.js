import { createServer } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// index.html placeholder that receives the rendered app
const APP_OUTLET = '<!--app-html-->'
const APP_ENTRY = '/src/App.svelte'
const SVELTE_SERVER = 'svelte/server'

/**
 * Renders App.svelte into index.html, in dev and in the build, so every browser gets the whole page as plain HTML
 * before any JS runs. src/main.js hydrates it in place; browsers that can't run module scripts keep it as-is.
 * @returns {import('vite').Plugin}
 */
export function prerenderApp() {
  return {
    name: 'prerender-app',
    async transformIndexHtml(html, { server: devServer }) {
      // Dev passes the live server (current even after Vite restarts itself). The build has none to load Svelte's
      // SSR output through, so it borrows a throwaway one.
      const server = devServer || await createServer({
        configFile: false,
        appType: 'custom',
        logLevel: 'error',
        plugins: [svelte()],
        server: { middlewareMode: true, hmr: false, ws: false },
      })
      try {
        // render must come from the same (pre-bundled) Svelte copy the component was compiled against
        const { render } = await server.ssrLoadModule(SVELTE_SERVER)
        const { default: App } = await server.ssrLoadModule(APP_ENTRY)
        return html.replace(APP_OUTLET, render(App).body)
      } finally {
        if (server !== devServer) await server.close()
      }
    },
  }
}

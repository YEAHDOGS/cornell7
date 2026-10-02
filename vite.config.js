import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { prerenderApp } from './vite-prerender.js'

// One build for every browser. index.html ships the whole app as prerendered HTML (vite-prerender.js), so the
// Potato Target (Chrome 40) reads the same page everyone else does.
// CSS is lowered by Lightning CSS all the way down: nesting, range media queries, color-mix() and modern color
// spaces become plain rules. Newer layout features that can't be lowered (grid, flex gap, dvh, container units)
// fall back to normal flow on old engines, or are gated with @supports where the fallback needs to look right.
const CSS_TARGET = ['chrome40', 'edge12', 'firefox40', 'safari9', 'ios9']
// JS only adds interactivity on top of the prerendered page, so it stays modern. Browsers without module scripts
// never load it. Safari stays at 16.4: anything lower makes Oxc rewrite every private class field in Svelte's
// runtime into WeakMap helpers for ALL browsers.
const JS_TARGET = ['chrome99', 'edge99', 'firefox97', 'safari16.4', 'ios16.4']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    prerenderApp(),
  ],
  build: {
    target: JS_TARGET,
    cssTarget: CSS_TARGET,
  },
})

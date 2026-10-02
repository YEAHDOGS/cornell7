// @ts-nocheck
import './app.css'
import App from './App.svelte'
import { hydrate } from 'svelte'

// index.html already contains the rendered app (vite-prerender.js); this only wires up the interactive parts.
// Browsers too old for module scripts never load this file and keep the static page.
const app = hydrate(App, {
  target: document.getElementById('app'),
});

export default app

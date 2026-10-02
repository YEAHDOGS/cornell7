// @ts-nocheck
import App from './App.svelte'
import './app.css'
import { mount } from 'svelte'

// index.html leaves the static fallback visible (and never defines __appMounted) on browsers too old for the app;
// never mount over it there
const IS_LEGACY_BROWSER = typeof window.__appMounted !== 'function'

const app = IS_LEGACY_BROWSER ? null : mount(App, {
  target: document.getElementById('app'),
});

// Mounted: drop the crash net from index.html so later runtime errors can't blank the page with the fallback
if (app) window.__appMounted()

export default app

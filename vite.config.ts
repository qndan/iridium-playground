import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  base: "iridium-playground",
  plugins: [svelte(), nodePolyfills({
    exclude: ["module"],
  })],
})

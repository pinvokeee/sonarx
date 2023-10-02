import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { makeOffline } from "vite-plugin-make-offline";

export default defineConfig({
  plugins: [react(), makeOffline()],
})
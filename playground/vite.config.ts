import { defineConfig } from 'vite'
import GlobalPlugin from '../src/index'

export default defineConfig({
  plugins: [
    GlobalPlugin(),
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@auth0/auth0-react': path.resolve(__dirname, 'src/mocks/authMock.jsx'),
    },
  },
})

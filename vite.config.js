import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.png'] // Esto le dice a Vite: "Tranquilo, los PNG son imágenes"
})
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts', './src/node/index.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  outDir: './dist',
  // onSuccess: 'rm ./dist/magic-string.es-LVMRUY7O.js',
})

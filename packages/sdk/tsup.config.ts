import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
    },
    ignoreWatch: ['**/dist/**', '**/node_modules/**', '*.test.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    dts: true,
    outDir: './dist',
    sourcemap: true,
    //legacyOutput: true,
  },
])

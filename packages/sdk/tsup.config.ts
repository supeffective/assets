import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: './src/index.ts',
      node: './src/node/index.ts',
    },
    clean: true,
    format: ['esm', 'cjs'],
    dts: true,
    outDir: './dist',
    sourcemap: true,
    //legacyOutput: true,
  },
  // {
  //   entry: ['./src/node/index.ts'],
  //   clean: true,
  //   format: ['esm', 'cjs'],
  //   dts: false,
  //   outDir: './dist/node',
  //   sourcemap: true,
  // },
  // {
  //   entry: {
  //     types: './src/all.ts',
  //   },
  //   clean: true,
  //   format: ['esm'],
  //   dts: true,
  //   outDir: './dist/types',
  //   onSuccess: 'rm -rf ./dist/types/all.js',
  // },
])

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
    amd: true,
    commonjs: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/out/**',
    '**/dist/**',
    '**/generated/**',
    'packages/website**',
  ],
  plugins: ['import', 'react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', 'prettier'],
  rules: {
    'jsx-a11y/alt-text': 'error',
    // components
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-key': 'error',
    'react/no-unescaped-entities': 'off',
    'newline-before-return': 'error',
  },
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
      env: {
        node: true,
        commonjs: true,
      },
    },
  ],
}

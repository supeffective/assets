module.exports = {
  root: true,
  extends: ['prettier', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/out/**',
    '**/dist/**',
    '**/generated/**',
    'packages/website**',
  ],
  plugins: ['import', 'react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
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

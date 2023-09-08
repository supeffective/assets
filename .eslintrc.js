const path = require('node:path')

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: [require.resolve('@r1stack/coding-style/eslint')],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignorePatterns: ['**/assets/**', '**/dist/**', '**/node_modules/**', '**/styled-system/**'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.mts'],
      parserOptions: {
        project: [path.resolve(__dirname, './packages/*/tsconfig.json')],
      },
    },
  ],
}

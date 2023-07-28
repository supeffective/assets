const transformIgnorePackages = ['p-pipe', 'p-limit']

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageProvider: 'v8',
  collectCoverageFrom: ['packages/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.next/',
    '/generated/',
    '/prisma/',
    'index.ts',
    'index.tsx',
    '.*.config.tsx?',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/cms',
    '.next',
    'vercel/output',
    '<rootDir>/_prev',
    '/database/.cache',
  ],
  transformIgnorePatterns: [`/node_modules/.pnpm/(?!${transformIgnorePackages.join('|')})`],
  moduleDirectories: ['node_modules', 'src'],
}

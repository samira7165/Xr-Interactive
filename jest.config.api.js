import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

// Separate from jest.config.js: these tests send real HTTP requests to a real
// Next.js server (spawned in globalSetup) backed by a real, isolated test
// database, instead of calling route handlers in-process with mocks.
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/api-http/**/*.test.js'],
  globalSetup: '<rootDir>/__tests__/api-http/setup/globalSetup.js',
  globalTeardown: '<rootDir>/__tests__/api-http/setup/globalTeardown.js',
  // Real network calls plus a couple of rate-limit loops (dozens of
  // sequential requests) run slower than in-process unit/mock tests.
  testTimeout: 30_000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)

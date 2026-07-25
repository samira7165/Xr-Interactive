import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Loads next.config.mjs and .env files into the test environment.
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // __tests__/helpers holds shared test utilities, not tests themselves —
  // Jest's default testMatch treats every file under __tests__ as a suite.
  // __tests__/api-http is a separate suite (see jest.config.api.js / `npm run
  // test:api`) that needs a real server + real test DB running via its own
  // globalSetup, so it's excluded from the default in-process run.
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/__tests__/helpers/',
    '<rootDir>/__tests__/api-http/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // The `server-only` marker package throws unconditionally outside
    // Next's own build (see node_modules/server-only) — swap in a no-op
    // so tests can import server-side modules that guard themselves with it.
    '^server-only$': '<rootDir>/__mocks__/empty.js',
  },
}

export default createJestConfig(config)

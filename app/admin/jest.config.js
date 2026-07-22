const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // match your alias setup
  },
};

module.exports = createJestConfig(customConfig);
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

// next/jest impose ses propres `transformIgnorePatterns` : on les réécrit après
// coup pour laisser passer next-intl et ses dépendances, distribués en ESM.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = [
    '/node_modules/(?!(next-intl|use-intl|@formatjs|intl-messageformat)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};

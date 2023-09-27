/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    swiper: '<rootDir>/emptyMock.ts',
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/*.test.{ts,tsx}'],
};

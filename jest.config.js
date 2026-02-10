module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/service/**/*.ts', // 비즈니스 로직만
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/**/*.d.ts',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['ts', 'js'],
};

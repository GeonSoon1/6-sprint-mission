module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/*.test.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@dto/(.*)$': '<rootDir>/src/dto/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@repository/(.*)$': '<rootDir>/src/repository/$1',
    '^@routers/(.*)$': '<rootDir>/src/routers/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@structs/(.*)$': '<rootDir>/src/structs/$1',
    '^@app-types/(.*)$': '<rootDir>/src/types/$1',
  },
};

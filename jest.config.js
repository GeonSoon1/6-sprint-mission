const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers$': '<rootDir>/src/controllers/index',
    '^@dto$': '<rootDir>/src/dto',
    '^@lib$': '<rootDir>/src/lib/index',
    '^@middlewares$': '<rootDir>/src/middlewares/index',
    '^@repositories$': '<rootDir>/src/repositories/index',
    '^@routers$': '<rootDir>/src/routers/index',
    '^@services$': '<rootDir>/src/services/index',
    '^@types$': '<rootDir>/src/types/index',
  },
};

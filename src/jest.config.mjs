export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,

  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "controllers/**/*.js",
    "services/**/*.js",
    "routes/**/*.js",
    "middlewares/**/*.js",
    "errors/**/*.js",
    "lib/**/*.js",
    "repositories/**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!server.js",
    "!socket-test-client.js",
  ],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};

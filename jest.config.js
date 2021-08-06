/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      tsconfig: "./server/tsconfig.server.json"
    }
  },

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Collect test coverage with each run
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/build/",
    "/prisma/",
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules"
  ],

  moduleNameMapper: {
    "ipaddr.js": "ipaddr.js", // this dependency is broken by the name mapping below
    "^(.*)\.js$": "$1"
  },

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/test/**/*.test.ts?(x)"
  ]
};

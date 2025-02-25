module.exports = {
  preset: 'ts-jest', // If you're using TypeScript
  testEnvironment: 'node', // For Node.js environment
  roots: ['<rootDir>/src'], // Look for tests in the src directory
  testMatch: ['**/*.test.ts'], // Match test files ending with .test.ts
  moduleFileExtensions: ['ts', 'js', 'json'], // File extensions to support
  setupFilesAfterEnv: [], // Remove or update this line if not needed
};
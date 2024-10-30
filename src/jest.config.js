module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.spec.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    coverageDirectory: '../coverage',
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverageFrom: ['**/*.ts'],
  };
  
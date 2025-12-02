/* eslint-disable */
export default {
    displayName: 'portfolio-feature-projects',
    preset: '../../../jest.preset.js',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    transform: {
      '^.+\\.(ts|mjs|js|html)$': [
        'jest-preset-angular',
        {
          tsconfig: '<rootDir>/tsconfig.spec.json',
          stringifyContentPathRegex: '\\.(html|svg)$',
        },
      ],
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    coverageDirectory: '../../../coverage/libs/portfolio/portfolio-feature-projects',
  };
  
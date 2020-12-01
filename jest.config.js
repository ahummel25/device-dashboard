module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx|tsx)$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js'
  },
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/public'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  globals: {
    __PATH_PREFIX__: '',
    'ts-jest': {
      babelConfig: true,
      tsConfig: 'tsconfig.json'
    }
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-tests.ts'],
  testURL: 'http://localhost',
  verbose: true,
  preset: 'ts-jest',
  testMatch: null
};

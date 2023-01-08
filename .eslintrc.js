module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    semi: ['error', 'always'],
    camelcase: ['error', { properties: 'always' }],
    'no-console': 1,
    'new-cap': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'spaced-comment': [
      'error',
      'always',
    ],
    'consistent-return': 0,
    'no-case-declarations': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'no-unused-vars': 0,
  },
};

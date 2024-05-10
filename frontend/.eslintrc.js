module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'linebreak-style': 0,
    'no-console': 'off',
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-restricted-globals': 'off',
    'no-use-before-define': 'off',
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'import/extensions': 'off',
  },
};

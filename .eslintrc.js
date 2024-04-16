module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["prettier", "eslint:recommended", "plugin:prettier/recommended", 'airbnb-base'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'linebreak-style': 0,
  },
};
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // 允许console输出,用于错误日志
    'prefer-const': 'error',
    'no-var': 'error',
    complexity: ['error', 10], // 圈复杂度限制
    'max-lines-per-function': ['warn', 50],
  },
};

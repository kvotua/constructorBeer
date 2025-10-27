import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: true,
        document: true,
        console: true,
      },
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      eqeqeq: ['error', 'always'],
      camelcase: ['error', { properties: 'always' }],
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },
];

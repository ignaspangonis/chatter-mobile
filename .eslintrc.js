module.exports = {
  plugins: ['react', 'react-native', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    // TODO: enable after https://github.com/import-js/eslint-plugin-import/issues/2348 performance downgrade is fixed
    'import/no-cycle': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  globals: {
    fetch: false,
  },
}

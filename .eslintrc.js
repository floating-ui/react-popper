module.exports = {
  root: true,
  extends: ['standard', 'standard-react', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: '16.3',
    },
  },
  rules: {
    // prettier
    'prettier/prettier': [
      'error',
      { trailingComma: 'all', singleQuote: true, semi: true },
    ],
    'no-unexpected-multiline': 'off',
  },
};

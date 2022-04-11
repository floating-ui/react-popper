module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
  },
  extends: ['plugin:react-hooks/recommended'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-unused-vars': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    'react/react-in-jsx-scope': 'error',
  },
};

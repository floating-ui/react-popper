module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    'react/react-in-jsx-scope': 'error',
  },
};

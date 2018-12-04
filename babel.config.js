module.exports = {
  presets: [
    ['@babel/env', { 'modules': false, 'loose': true }],
    '@babel/react',
    '@babel/flow'
  ],
  plugins: [
    '@babel/proposal-class-properties'
  ],
  env: {
    esm: {
      plugins: [
        ['@babel/transform-runtime']
      ],
      ignore: [
        '**/*.test.js',
        '**/__mocks__/**'
      ]
    },
    cjs: {
      plugins: [
        ['@babel/transform-runtime'],
        '@babel/transform-modules-commonjs'
      ],
      ignore: [
        '**/*.test.js',
        '**/__mocks__/**'
      ]
    },
    test: {
      plugins: [
        '@babel/transform-modules-commonjs'
      ]
    }
  }
}

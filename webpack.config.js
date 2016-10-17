var path = require('path');
var nodeModulesDir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    index: ['webpack/hot/dev-server', './example/index.jsx']
  },
  output: {
    path: './example',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: 'style!css!postcss!sass?sourceMap' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: './example',
  }
};

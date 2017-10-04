var path = require('path')
var examplePath = path.resolve(__dirname, 'example')

module.exports = {
  entry: path.resolve(examplePath, 'index.jsx'),
  output: {
    path: examplePath,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: examplePath,
  },
};

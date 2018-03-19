var path = require('path')
var webpack = require('webpack')
var banner = require('./webpack.banner')
var TARGET = process.env.TARGET || null

var config = {
  entry: './src/react-popper.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-popper.js',
    library: 'ReactPopper',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'transform-react-remove-prop-types',
              {
                mode: 'wrap',
              },
            ],
            'transform-inline-environment-variables',
          ],
        },
      },
    ],
  },
  plugins: [new webpack.BannerPlugin(banner)],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    },
  },
}

if (TARGET === 'minify') {
  config.output.filename = 'react-popper.min.js'
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        except: ['React', 'ReactDOM', 'Popper', 'ReactPopper'],
      },
    }),
  )
}

module.exports = config

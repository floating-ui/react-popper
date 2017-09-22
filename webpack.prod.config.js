var path = require('path')
var webpack = require('webpack')
var banner = require('./webpack.banner')
var TARGET = process.env.TARGET || null

const externals = {
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
}

var config = {
  entry: './src/react-popper.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-popper.js',
    sourceMapFilename: 'react-popper.sourcemap.js',
    library: 'ReactPopper',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{ test: /\.(js|jsx)/, loader: 'babel-loader' }],
  },
  plugins: [new webpack.BannerPlugin(banner)],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: externals,
}

if (TARGET === 'minify') {
  config.output.filename = 'react-popper.min.js'
  config.output.sourceMapFilename = 'react-popper.min.js'
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        except: ['React', 'ReactDOM', 'Popper', 'ReactPopper'],
      },
    })
  )
}

module.exports = config

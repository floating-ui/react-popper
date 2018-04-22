import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

const baseConfig = (outputFormat, fullVersion) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    input: 'src/index.js',
    plugins: [
      nodeResolve(),
      babel(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      isProduction ? minify({
        comments: false,
      }) : false,
    ],
    external: fullVersion
      ? ['react', 'react-dom', 'prop-types']
      : ['react', 'react-dom', 'prop-types', 'popper.js'],
    output: {
      name: 'ReactPopper',
      file: 'dist/react-popper.' + (fullVersion ? 'full.' : '') +
        outputFormat + (isProduction ? '.min' : '') + '.js',
      format: outputFormat,
      sourcemap: true,
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
        'popper.js': 'Popper',
      },
    },
  };
};

export default [
  baseConfig('cjs', true),
  baseConfig('cjs', false),
  baseConfig('umd', true),
  baseConfig('umd', false),
];

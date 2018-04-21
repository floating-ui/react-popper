import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [
    nodeResolve(),
    babel({
      babelrc: false,
      presets: [['env', { modules: false }], 'stage-2', 'react'],
      plugins: [
        'external-helpers',
      ],
      env: {
        production: {
          plugins: [
            ['transform-react-remove-prop-types', { removeImport: true }],
          ],
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    process.env.NODE_ENV === 'production' ? minify({
      comments: false,
    }) : false,
  ].filter(Boolean),
  external: ['react', 'react-dom', 'prop-types'],
  output: {
    sourcemap: true,
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      'popper.js': 'Popper',
    },
  },
};

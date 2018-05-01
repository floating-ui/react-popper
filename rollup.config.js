import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const input = './src/index.js';

const umdGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'popper.js': 'Popper',
};

const getBabelOptions = () => ({
  babelrc: false,
  exclude: '**/node_modules/**',
  presets: [['env', { modules: false }], 'stage-1', 'react'],
  plugins: ['external-helpers'],
});

export default [
  {
    input,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReactPopper',
      globals: umdGlobals,
    },
    external: Object.keys(umdGlobals),
    plugins: [
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      babel(getBabelOptions()),
      sizeSnapshot(),
    ],
  },

  {
    input,
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'ReactPopper',
      globals: umdGlobals,
    },
    external: Object.keys(umdGlobals),
    plugins: [
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      babel(getBabelOptions()),
      uglify(),
    ],
  },
];

import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const input = './src/index.js';

const umdGlobals = {
  react: 'React',
  'popper.js': 'Popper',
};

const getBabelOptions = () => ({
  exclude: '**/node_modules/**',
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
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
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
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(),
      uglify(),
    ],
  },

  {
    input,
    output: { file: 'dist/index.esm.js', format: 'esm' },
    external: id =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
    plugins: [babel(getBabelOptions()), sizeSnapshot()],
  },
];

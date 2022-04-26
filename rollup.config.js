import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import bundleSize from '@atomico/rollup-plugin-sizes';

const input = './src/index.js';

const umdGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@popperjs/core': 'Popper',
};

const getBabelOptions = () => ({
  exclude: '**/node_modules/**',
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
      replace({ 'process.env.NODE_ENV': JSON.stringify('development'), "preventAssignment": true }),
      bundleSize(),
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
      replace({ 'process.env.NODE_ENV': JSON.stringify('production'), "preventAssignment": true }),
      terser(),
    ],
  },

  {
    input,
    output: { file: 'dist/index.esm.js', format: 'esm' },
    external: (id) =>
      !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/'),
    plugins: [babel(getBabelOptions())],
  },
];

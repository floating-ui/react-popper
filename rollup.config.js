import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const getBabelOptions = () => ({
  babelrc: false,
  exclude: '**/node_modules/**',
  presets: [['env', { modules: false }], 'stage-1', 'react'],
  plugins: ['external-helpers'],
});

export default [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReactPopper',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    external: ['react', 'react-dom'],
    plugins: [
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      babel(getBabelOptions()),
      sizeSnapshot(),
    ],
  },
];

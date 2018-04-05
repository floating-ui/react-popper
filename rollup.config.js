import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

const common = {
  input: 'src/index.js',
  external: [
    'react',
    'react-dom',
    'popper.js',
    'create-react-context',
    'warning',
  ],
};

const commonOutput = {
  name: 'react-popper',
  sourcemap: true,
  globals: {
    react: 'react',
    'popper.js': 'PopperJS',
    'create-react-context': 'createContext',
    warning: 'warning',
  },
};

const babelConfig = {
  babelrc: false,
  presets: [['env', { modules: false }], 'stage-1', 'react'],
  plugins: [
    'external-helpers',
    ['transform-react-remove-prop-types', { mode: 'wrap' }],
  ],
};

export default [
  {
    ...common,
    plugins: [babel(babelConfig)],
    output: {
      ...commonOutput,
      format: 'umd',
      file: 'dist/react-popper.js',
    },
  },
  {
    ...common,
    plugins: [babel(babelConfig), minify()],
    output: {
      ...commonOutput,
      format: 'umd',
      file: 'dist/react-popper.min.js',
    },
  },
];

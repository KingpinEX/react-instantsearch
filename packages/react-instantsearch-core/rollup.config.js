import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const clear = x => x.filter(Boolean);

const version = process.env.VERSION || 'UNRELEASED';
const algolia = '© Algolia, inc.';
const link = 'https://community.algolia.com/react-instantsearch';
const createLicence = name =>
  `/*! ReactInstantSearch${name} ${version} | ${algolia} | ${link} */`;

const plugins = [
  babel({
    exclude: ['../../node_modules/**', 'node_modules/**'],
    plugins: ['external-helpers'],
  }),
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    namedExports: {
      'algoliasearch-helper': [
        'version',
        'AlgoliaSearchHelper',
        'SearchParameters',
        'SearchResults',
        'url',
      ],
    },
  }),
  globals(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
];

const createConfiguration = ({ name, minify = false } = {}) => ({
  input: 'src/index.js',
  external: ['react'],
  output: {
    file: `dist/umd/ReactInstantSearch${name}${minify ? '.min' : ''}.js`,
    name: `ReactInstantSearch${name}`,
    format: 'umd',
    globals: {
      react: 'React',
    },
    banner: createLicence(name),
    sourcemap: true,
  },
  plugins: plugins.concat(
    clear([
      minify &&
        uglify({
          output: {
            preamble: createLicence(name),
          },
        }),
    ])
  ),
});

export default [
  createConfiguration({
    name: 'Core',
  }),

  createConfiguration({
    name: 'Core',
    minify: true,
  }),
];

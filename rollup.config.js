import buble from 'rollup-plugin-buble';
let pkg = require('./package.json');
let {'jsnext:main': jsnext, main} = pkg;
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'src/index.js',
  plugins: [
    buble()
  ],
  targets: [{
    format: 'cjs',
    dest: main
  }, {
    format: 'es',
    dest: jsnext
  }],
  globals: {
    JSON: 'JSON',
    Promise: 'Promise'
  },
  external: external,
  sourceMap: false
};

import babel from 'rollup-plugin-babel';
var pkg = require('./package.json')
var external = Object.keys( pkg.dependencies );

export default {
    entry: 'src/index.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        })
    ],
    targets: [
        {
            format: 'cjs',
            dest: pkg['main']
        },
        {
            format: 'es',
            dest: pkg['jsnext:main']
        }
    ],
    external: external,
    sourceMap: false
};

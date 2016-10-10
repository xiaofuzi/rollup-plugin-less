var assert = require( 'assert' );
var rollup = require( 'rollup' );
var less = require( '../dist/rollup-plugin-less.js' );
var npm = require( 'rollup-plugin-node-resolve' );

require( 'source-map-support' ).install();

process.chdir( __dirname );

function executeBundle ( bundle ) {
    var generated = bundle.generate();
    var code = generated.code;

    var fn = new Function( 'assert', code );
    fn( assert );
}

describe( 'rollup-plugin-less', function () {
    it( 'converts less', function () {
        return rollup.rollup({
            entry: 'samples/main.js',
            targets: [
                {
                    format: 'cjs',
                    dest: './bundle.js'
                }
            ],
            plugins: [ less({
                insert: true
            }) ]
        }).then((bundle) => {
            bundle.write({
                dest: './dist.cjs.js',
                format: 'cjs'
            });
       });
    });
});

import fs from 'fs-extra';
import { dirname } from 'path';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';
import { insertStyle } from './style.js';
import mkdirp from 'mkdirp';

/**
 * Write to a file even if its directory does not exist
 * @param {String} path the path of the file write to
 * @param {String} contents contents of file
 * @param {Function} cb callback function when write action finish
 */
const writeFile = (path, contents, cb) => {
    mkdirp(dirname(path), function (err) {
        if (err && typeof cb === 'function') return cb(err);

        fs.writeFile(path, contents, cb);
    });
}

let renderSync = (code, option) => {
    return less.render(code, option)
        .then(function(output){
            return output.css;
        }, function(error){
            throw error;
        })
};

let fileCount = 0;

export default function plugin (options = {}) {
    options.insert = options.insert || false;
    const filter = createFilter(options.include || [ '**/*.less', '**/*.css' ], options.exclude || 'node_modules/**');

    const injectFnName = '__$styleInject'
    return {
        name: 'less',
        intro() {
            return options.insert ? insertStyle.toString().replace(/insertStyle/, injectFnName) : '';
        },
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            fileCount++;

            try {
                options.option = options.option || {};
                options.option['filename'] = id;
                options.output = options.output === undefined || options.output === true ? 'rollup.build.css' : options.output;
                if (options.plugins) {
                  options.option['plugins'] = options.plugins
                }

                let css = await renderSync(code, options.option);

                if(options.output&&isFunc(options.output)){
                    css = await options.output(css, id);
                }

                if (options.output&&isString(options.output)) {
                    if(fileCount == 1){
                        //clean the output file
                        fs.removeSync(options.output);
                    }
                    writeFile(options.output, css);
                }

                let exportCode = '';

                if(options.insert!=false){
                    exportCode = `export default ${injectFnName}(${JSON.stringify(css.toString())});`;
                }else{
                    exportCode = `export default ${JSON.stringify(css.toString())};`;
                }
                return {
                    code: exportCode,
                    map: { mappings: '' }
                };
            } catch (error) {
                throw error;
            }
        }
    };
};

function isString (str) {
    if(typeof str == 'string'){
        return true;
    }else{
        return false;
    }
}

function isFunc (fn){
    if ( typeof fn == 'function' ){
        return true;
    }else{
        return false;
    }
}

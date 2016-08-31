import fs from 'fs-extra';
import { dirname } from 'path';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';
import { insertStyle } from './style.js';

let renderSync = (code, option) => {
  return new Promise ((resolve, reject) => {
    less.render (code, option, function(e, output) {
        if(e) throw e;
        resolve(output.css);
    });
  });
};

let fileCount = 0;

export default function plugin (options = {}) {
    const filter = createFilter(options.include || [ '**/*.less', '**/*.less' ], options.exclude || 'node_modules/**');

    const injectFnName = '__$styleInject'
    return {
        name: 'less',
        intro() {
            return insertStyle.toString().replace(/insertStyle/, injectFnName);
        },
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            fileCount++;

            try {
                let css = await renderSync(code, options.option);
                
                if(options.output&&isFunc(options.output)){
                    css = await options.output(css, id);
                }

                if (options.output&&isString(options.output)) {
                    if(fileCount == 1){
                        //clean output file
                        fs.removeSync(options.output);
                    }
                    fs.appendFileSync(options.output, css);
                }

                let exportCode = '';

                if(options.insert){
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
import fs from 'fs';
import { dirname } from 'path';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';
import { insertStyle } from './style.js';

let renderSync = (code, option) => {
    return less.render(code, option)
        .then(function (output) {
            return output.css;
        }, function (error) {
            throw error;
        })
};

export default function plugin(options = {}) {
    options.insert = options.insert || false;
    options.output = options.output === undefined || options.output === true ? 'rollup.build.css' : options.output;
    options.option = options.option || {};
    
    const filter = createFilter(options.include || ['**/*.less', '**/*.css'], options.exclude || 'node_modules/**');
    const injectFnName = '__$styleInject'
    
    // mapping from source to processed css data
    let generatedData = {}
    // watcher iteration number, used to remove stale data from generatedData
    let epoch = 1
    
    return {
        name: 'less',
        intro() {
            return options.insert ? insertStyle.toString().replace(/insertStyle/, injectFnName) : '';
        },
        buildStart() { epoch++ },
        load(id) {
            if (!filter(id)) {
                return null;
            }
            if (id in generatedData) {
                // mark file used on current iteration
                generatedData[id]['epoch'] = epoch
            }
        },
        generateBundle () {
            if (options.output && isString(options.output)) {
                fs.mkdirSync(dirname(options.output), { recursive: true });

                let totalSourcesUsed = 0;
                let fd = fs.openSync(options.output, 'w')
                for (let id in generatedData) {
                    if (generatedData[id]['epoch'] < epoch) {
                        continue;
                    }
                    totalSourcesUsed++;
                    fs.appendFileSync(fd, generatedData[id]['css'])
                }
                fs.closeSync(fd)

                if (totalSourcesUsed > 0) {
                    let totalSourcesUsedMsg = totalSourcesUsed > 1 ? `${totalSourcesUsed} sources` : `one source`;
                    console.log(`rollup-plugin-less: styles from ${totalSourcesUsedMsg} are written into '${options.output}'`)
                } else {
                    console.log(`rollup-plugin-less: no styles`)
                }
            }
        },
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            // create shallow copy not to modify 'options'
            let renderOptions = Object.assign({}, options.option);
            renderOptions['filename'] = id;
            if (options.plugins) {
                renderOptions['plugins'] = options.plugins
            }

            let css = await renderSync(code, renderOptions);

            if (options.output && isFunc(options.output)) {
                css = await options.output(css, id);
            }
            console.log(`rollup-plugin-less: compile style '${id}'`)

            generatedData[id] = {epoch, css}

            let exportCode;
            if (options.insert) {
                exportCode = `export default ${injectFnName}(${JSON.stringify(css.toString())});`;
            } else {
                exportCode = `export default ${JSON.stringify(css.toString())};`;
            }
            return {
                code: exportCode,
                map: {
                    mappings: ''
                }
            };
        }
    };
};

function isString(str) {
    return (typeof str == 'string');
}

function isFunc(fn) {
    return (typeof fn == 'function');
}

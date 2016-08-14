import fs from 'fs';
import { dirname } from 'path';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';


let renderSync = (code, option) => {
  return new Promise((resolve, reject) => {
    less.render(code, option, function(e, output){
        if(e) throw e;
        resolve(output.css);
    });
  });
};

export default function plugin(options = {}) {
    const filter = createFilter(options.include || [ '**/*.less', '**/*.less' ], options.exclude || 'node_modules/**');

    return {
        name: 'less',
        async transform(code, id) {
            if (!filter(id)) {
                return null;
            }
            try {
                let css = await renderSync(code, options.option)

                if (isString(options.output)) {
                     fs.writeFileSync(options.output, css);
                }

                return {
                    code: `export default ${JSON.stringify(css.toString())};`,
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
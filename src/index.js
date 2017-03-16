import {createFilter}    from 'rollup-pluginutils';
import fs                from 'fs-extra';
import * as dflts        from './lib/consts';
import appenderGenerator from './lib/appender-generator';
import lessifier         from './lib/lessifier';

export default (options = {}) => {
  let {insert = false, include = dflts.include, exclude = dflts.exclude} = options;
  let {option = {}, plugins} = options;
  let {output = dflts.cssFilename} = option;
  const filter = createFilter(include, exclude);
  
  filter.count = 0;
  Object.assign(option, {plugins});

  return {
    name: 'less',
    
    intro() {
      return appenderGenerator(insert);
    },
    
    transform(code, id) {
      if (!filter(id)) {
        return;
      }
      
      option.filename = id;

      return lessifier(code, option).then(css => {
        if(typeof output === 'string') {
          if(++filter.count === 1) {
            fs.removeSync(output);
          }
          fs.appendFileSync(output, css);
        } else if(typeof output === 'function') {
          css = output(css, id);
        }

        return Promise.resolve(css);
      }).then(css => {
        css = JSON.stringify(css.toString());
        let code = 'export default ';
        code += insert ? `${dflts.injectFnName}(${css})` : css;
        
        return {code, map: {mappings: ''}};
      });
    }
  };
};

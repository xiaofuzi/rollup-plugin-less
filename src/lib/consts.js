const cssFilename = 'rollup.build.css';
const include = ['**/*.less', '**/*.css'];
const exclude = ['node_modules/**'];
const injectFnName = '__$styleInject';

export {
  cssFilename,
  include,
  exclude,
  injectFnName
};

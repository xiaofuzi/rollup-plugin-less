## Install

```node
npm install rollup-plugin-less --save
```

## usage

```js
import './test.less';
//generate css will be auto insert to the head tag
```

```js
import { rollup } from 'rollup';
import less from 'rollup-plugin-less';

rollup({
    entry: 'main.js',
    plugins: [
        less()
    ]
});
```


## Options

### insert

+ Default: `false`
+ Type: `Boolean`

If you specify `true`, the plugin will insert compiled CSS into `<head/>` tag.

### output

+ Type: `String|Function`

If you specify a string, it will be the path to write the generated CSS.
If you specify a function, call it passing the generated CSS as an argument.

### options

+ Type: `Object`

Options for [less](http://lesscss.org/usage/#programmatic-usage).

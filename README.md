## Install

```node
npm install rollup-plugin-less --save
```

## usage

```js
import css from './test.less';
console.log( 'css: ', css );
```

```js
import { rollup } from 'rollup';
import less from 'rollup-plugin-less';

rollup({
    entry: 'main.js',
    plugins: [
        less({
            output: '',
            option: {
                //less render option
            }
        })
    ]
});
```

## options

* output
Optional. Type: String
it will be the path to write the generated CSS. 

* option

Optional. Type: Object

Options for less.js.
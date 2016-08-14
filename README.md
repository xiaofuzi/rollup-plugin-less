## Install

```node
npm install rollup-plugin-less --save
```

## usage

```js
import md from './test.less';
console.log( `Template for render: ${md}` );
```

```js
import { rollup } from 'rollup';
import md from 'rollup-plugin-less';

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

*boption

Optional. Type: Object

Options for less.js.
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
Optional. Type: String || Function
if you specify a string, it will be the path to write the generated CSS. 
If you specify a function, call it passing the generated CSS and id(less file path) as an argument.

* option

Optional. Type: Object

Options for less.js.
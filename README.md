# rename_dynamic

This is a small node cli utility for renaming files according to the csv data provided and use regex for more flexiability. 

And it includes a small template engine which support js template literal like synatx, for instance, `-o "${id:name}_${prefix.substr(0,2)}.${ext.toLowerCase()}"` and filters which has ultimate extendibility, for example, if you want some features like `head` like bash cli, just write the following js code to `$HOME/.rename_dynamic/filters/head.js`, and then you can write the output pattern like ``-o "${id:name}_${prefix | head(2)}.${ext.toLowerCase()}"``. 

Now it only includes a few builtin filters like lowercase, uppercase and capitalize just for demonstration. But you can write your own filters. It's just a default exported function which has `(value: string): string => { // do your job, return a new string }`. If your filter would like accept some args for customization, just return the function.

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function head(limit) {
    return function (value) {
        return value.substring(0, limit);
    };
}
```

### How to run it

If you have node installed, just download [rename_dynamic](https://github.com/liudonghua123/rename_dynamic/releases/latest/download/rename_dynamic), if you have not node installed, download the latest appropriate binaries from [release page](https://github.com/liudonghua123/rename_dynamic/releases) instead.

### How to run and build locally

1. `git clone https://github.com/liudonghua123/rename_dynamic.git`
2. `cd rename_dynamic`
3. `yarn`
4. `yarn tsc`
5. `node . -h`
5. Run it, for example, ``node . -i "(?<prefix>.*)(?<id>\d+)\.(?<ext>.*)" -o "${id:name}_${prefix | lowercase}.${ext.substring(0,3)}" -s id -c sample.csv tests``

### TODOs

- [ ] refact code, separate the core functionalites and cli binary
- [x] support named group regex in the input pattern and js template literal like synatax in the output pattern.
- [x] package using `pkg` and `ncc` for deployment
- [x] support filter features in the output pattern.

### Reference


- https://regex101.com/codegen?language=javascript
- https://www.npmjs.com/package/commander#installation
- https://github.com/adaltas/node-csv
- https://github.com/mholt/PapaParse
- https://javascript.info/regexp-groups#capturing-groups-in-replacement
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
- https://github.com/janl/mustache.js
- https://github.com/handlebars-lang/handlebars.js
- https://github.com/jonschlinkert/handlebars-delimiters
- https://github.com/twitter/hogan.js
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
- https://github.com/medikoo/es6-template-strings
- https://github.com/pixcai/es6-template-string
- https://github.com/dondido/express-es6-template-engine

### License

MIT License

Copyright (c) 2022 liudonghua
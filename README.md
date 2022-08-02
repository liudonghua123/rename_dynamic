# rename_dynamic

This is a small node cli utility for renaming files according to the csv data provided and use regex for more flexiability.

### How to run it

If you have node installed, just download [rename_dynamic](https://github.com/liudonghua123/rename_dynamic/releases/latest/download/rename_dynamic), if you have not node installed, download the latest appropriate binaries from [release page](https://github.com/liudonghua123/rename_dynamic/releases) instead.

### How to run and build locally

1. `git clone https://github.com/liudonghua123/rename_dynamic.git`
2. `cd rename_dynamic`
3. `yarn`
4. `yarn tsc`
5. `node . -h`
5. ``node . -i "(?<prefix>.*)(?<id>\d+)\.(?<ext>.*)" -o "${id:name}_${prefix}.${ext}" -s id -c sample.csv tests``

### TODOs

- [ ] refact code
- [x] support template string operation in output regex, like `-o "${id:name}_${prefix.substr(0,2)}.${ext.toLowerCase()}"`
- [x] package for deployment

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
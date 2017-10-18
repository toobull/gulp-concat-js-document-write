## require-short

## Quick Start

### 1.Installation

```bash
$ npm install --save require-short
```

### 2.Usage
After install,you can use it at entry script. e.g.

```js
var requireShort = require('require-short')
var path = $require('path')

// default symbol is '@',also another symbol could be set,e.g. '@@'/'$' etc.
requireShort.startSymbol('@')

requireShort(path.resolve(__dirname, 'mymodule'))

var mymodule = $require('@mymodule/file_in_mymodule_somewhere_dont_need_surfix')
// an also can require node_modules's modules,like this
var fs = $require('fs')

or

requireShort([path.resolve(__dirname, 'mymodule1'), path.resolve(__dirname, 'mymodule2')])

var mymodule1 = $require('@mymodule1/file_in_mymodule1_somewhere_dont_need_surfix')
var mymodule2 = $require('@mymodule2/file_in_mymodule2_somewhere_dont_need_surfix')
// an also can require node_modules's modules,like this
var fs = $require('fs')
```


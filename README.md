## gulp-concat-js-document-write

## Quick Start

### 1.Installation

```bash
$ npm install --save gulp-concat-js-document-write
```

### 2.Usage
My js file is `combo.js`, '/resource/js/comboSrc/combo.js' is relative path at website's root.
```js
(function() {
     var srcPath = '/resource/js/';
     document.write('<script src="' + srcPath + 'b.js"><\/script>');
     document.write('<script src="' + srcPath + 'c.js"><\/script>');
     document.write('<script src="' + srcPath + 'd.js"><\/script>');
 }());
```

In my gulp file written like this:
```js
let concatDocumentWrite = require('gulp-concat-js-document-write')

let rootPath = 'website/root/absolute/path'
let jsSrc = 'the/path/is/resource/js/combo/src'
let jsDest = 'the/path/is/resource/js/combo/dest'

gulp.task ('js', function () {
    gulp.src (jsSrc+'/**/*.js')
        .pipe (concatDocumentWrite ({
            rootPath : rootPath
        }))
        .pipe (gulp.dest (jsDest))
})
```
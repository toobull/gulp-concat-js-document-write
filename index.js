let gutil = require ('gulp-util')
let through = require ('through2')
let Buffer = require ('buffer').Buffer
let fs = require ('fs')

const REG = {
    DOCUMENT_WRITE : /\s*document\.write.*srcPath[^'\"]+['\"]([^'\"]*\.js)['\"].*/g,
    SCRIPT_NAME    : /srcPath.*?['"](.*?)['"]/,
    SRC_PATH       : /var\s+srcPath\s*\=\s*([\'\"])([\w\-\/\.]+)\1/
}

function extractContentByPath (rootPath, filePath) {
    let fileContent = fs.readFileSync (rootPath + filePath).toString ()
    let documentWriteContent = extractDocumentWriteContent (rootPath, fileContent)

    return documentWriteContent
        ? documentWriteContent
        : fileContent
}

function extractDocumentWriteContent (rootPath, fileContent) {
    let ret = ''
    let documentWrite = fileContent.match (REG.DOCUMENT_WRITE)

    if (documentWrite) {
        let matches = fileContent.match (REG.SRC_PATH)
        let srcPath = matches ? matches[ 2 ] : ''
        if (!srcPath) {
            return ret
        }

        for (let i = 0; i < documentWrite.length; i++) {
            let scriptName = documentWrite[ i ].match (REG.SCRIPT_NAME)
            let item = srcPath + scriptName[ 1 ]

            let pos = fileContent.indexOf (documentWrite[ i ])
            if (pos === -1) {
                ret += documentWrite[ i ]
                continue
            }

            let substring = fileContent.substring (0, pos + 1)
            let inlineCommentPos = substring.lastIndexOf ('//')
            if (inlineCommentPos > -1) {
                let s = substring.substr (inlineCommentPos)
                if (s.indexOf ('\n') === -1 && s.indexOf ('\r') === -1) {
                    continue
                }
            }

            let pos1 = substring.indexOf ('/*')
            let pos2 = substring.indexOf ('*/')
            if (pos1 > -1) {
                if (pos2 === -1 || pos1 > pos2) {
                    continue
                }
            }

            ret += ret ? '\n' : ''
            ret += `/**import from \`${item}\` **/\n`
            ret += extractContentByPath (rootPath, item)
            ret += '\n'
        }
    }

    return ret
}

module.exports = function (options) {
    let rootPath = options.rootPath || ''

    if (!rootPath) {
        throw 'rootPath can\'t be empty'
    }

    return through.obj (function (file, enc, cb) {
        if (file.isNull ()) {
            this.push (file)
            return cb ()
        }

        if (file.isStream ()) {
            this.emit ('error', new gutil.PluginError ('gulp-concat-js-document-write', 'Streaming not supported'))
            return cb ()
        }

        let fileContent = String (file.contents.toString ())
        let extractContent = extractDocumentWriteContent (rootPath, fileContent)

        file.contents = new Buffer (extractContent)

        this.push (file)
        cb ()
    })
}
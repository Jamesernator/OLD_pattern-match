'use strict'
/* eslint-env node */
const folderModule = require('folder-module')

folderModule('./patterns', {
    outFile: './match.mjs',
    ignore: file => file.startsWith('--'),
})

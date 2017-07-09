const sh = require('shelljs')

// Make the initial match.js file, this can be used as the entry in
// an environment that support export { foo as bar } from "module" syntax
sh.exec('folder-module module/ match.js')

// ------- Browser entry points -----

// Create an es5 bundle for use in the browser
sh.exec('browserify -t babelify -r ./match.js:match > dist/match.browser.es5.js')

// Create an es6 module entry point for use in module capable browsers
sh.exec('babel --no-babelrc match.js --out-file dist/match.browser.es8.js --plugins=transform-export-extensions')

// ------ Node entry points -------

// Make a temporary file for pointing to build/ instead of module/
// for when we compile index.js
sh.exec('folder-module build/ match.node.js')

// Remove unneccesary files
sh.rm('build/*')

// Compile all neccesary files for the node distribution
sh.exec('babel module/ --out-dir build/')

// Create index.js from match.js
sh.exec('babel match.node.js > index.js')

// Remove match.node.js as it isn't needed anymore
sh.rm('./match.node.js')

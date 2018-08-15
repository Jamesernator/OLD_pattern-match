"use strict"

/* eslint-env node */
const loadModule = require('esm')(module)

module.exports = loadModule('./match.mjs')

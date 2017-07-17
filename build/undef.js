"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// undef returns true if the obj matched against is undefined
exports.default = {
    [_sym2.default](value) {
        if (value === undefined) {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: 'value is not undefined',
                reasonTag: `undef`
            };
        }
    }
};
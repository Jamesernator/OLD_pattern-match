"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (value === null) {
            return {
                matches: false,
                reason: `value is null`
            };
        } else if (typeof value !== 'object') {
            return {
                matches: false,
                reason: `typeof value is not object`,
                reasonTag: `object`
            };
        } else {
            return { matches: true };
        }
    }
};
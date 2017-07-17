"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = regex;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function regex(regExp) {
    if (!(regExp instanceof RegExp)) {
        throw new Error(`regex expected a regular expression not ${regExp}`);
    }
    return {
        [_sym2.default](value) {
            if (typeof value !== 'string') {
                return {
                    matches: false,
                    reason: `value is not a string`
                };
            }

            if (regExp.exec(value)) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reason: `string does not match ${regExp}`,
                    reasonTag: `regex`
                };
            }
        }
    };
}
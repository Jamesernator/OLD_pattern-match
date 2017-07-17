"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = not;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function not(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (!matches(pattern, value)) {
                return {
                    matches: true
                };
            } else {
                return {
                    matches: false,
                    reason: `expected pattern not to match`,
                    reasonTag: `not`
                };
            }
        }
    };
}
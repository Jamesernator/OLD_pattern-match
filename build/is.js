"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _is = require("babel-runtime/core-js/object/is");

var _is2 = _interopRequireDefault(_is);

exports.default = is;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// is returns true if the object is identical to the passed object
function is(other) {
    return {
        [_sym2.default](obj) {
            if ((0, _is2.default)(obj, other)) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reasonTag: `is`,
                    reason: `value is not the same as expected`
                };
            }
        }
    };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (typeof value === 'function') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reasonTag: `func`,
                reason: `typeof value is not function`
            };
        }
    }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// nil returns true if the obj matched against is null
exports.default = {
    [_sym2.default](value) {
        if (value === null) {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: `value is not null`,
                reasonTag: `nil`
            };
        }
    }
};
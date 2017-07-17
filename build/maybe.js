"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maybe;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maybe(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (value == null) {
                return { matches: true };
            } else {
                const details = matches.details(pattern, value);
                if (details) {
                    return { matches: true };
                } else {
                    return {
                        matches: false,
                        reasonTag: `maybe`,
                        reason: [`pattern did not match and is not null or undefined`, [details]]
                    };
                }
            }
        }
    };
}
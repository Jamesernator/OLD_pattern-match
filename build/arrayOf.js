"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = arrayOf;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arrayOf(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (!Array.isArray(value)) {
                return {
                    matches: false,
                    reasonTag: `arrayOf`,
                    reason: `value is not an Array`
                };
            }

            for (const [idx, item] of value.entries()) {
                const details = matches.details(pattern, item);
                if (details.matches) {
                    return {
                        matches: false,
                        reasonTag: `arrayOf`,
                        reason: [`item at index ${idx} does not match`, [details]]
                    };
                }
            }
            return { matches: true };
        }
    };
}
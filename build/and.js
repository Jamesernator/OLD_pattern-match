"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = and;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function and(...patterns) {
    return {
        [_sym2.default](value, matches) {
            for (const pattern of patterns) {
                const details = matches.details(pattern, value);
                if (!details.matches) {
                    return {
                        matches: false,
                        reasonTag: `and`,
                        reason: [`not all and values matched`, [details]]
                    };
                }
            }
            return { matches: true };
        }
    };
}
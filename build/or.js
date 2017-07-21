"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = or;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function or(...patterns) {
    return {
        [_sym2.default](value, matches) {
            const reasons = [];
            for (const pattern of patterns) {
                const details = matches.details(pattern, value);
                if (details.matches) {
                    return { matches: true, value: details.value };
                } else {
                    reasons.push(details);
                }
            }
            return {
                matches: false,
                reason: [`none of the choices to or match`, reasons],
                reasonTag: `or`
            };
        }
    };
}
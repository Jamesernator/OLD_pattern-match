"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = oneOf;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _is = require("./is.js");

var _is2 = _interopRequireDefault(_is);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function oneOf(...values) {
    return {
        [_sym2.default](value, matches) {
            const reasons = [];
            for (const val of values) {
                const details = matches.details((0, _is2.default)(val), value);
                if (details.matches) {
                    return { matches: true };
                } else {
                    reasons.push(details);
                }
            }
            return {
                matches: false,
                reason: [`none of the provided values matched`, reasons],
                reasonTag: `oneOf`
            };
        }
    };
}
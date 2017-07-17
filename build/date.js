"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = date;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function date(item) {
    if (!(item instanceof Date)) {
        throw new Error(`Expected Date object as argument to date`);
    }
    return {
        [_sym2.default](value) {
            if (!(value instanceof Date)) {
                return {
                    matches: false,
                    reasonTag: `date`,
                    reason: `value not instanceof Date`
                };
            } else if (item.getTime() !== value.getTime()) {
                return {
                    matches: false,
                    reasonTag: `date`,
                    reason: `value is not same time as ${item.toString()}`
                };
            } else {
                return { matches: true };
            }
        }
    };
}
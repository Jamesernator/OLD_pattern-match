"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cond;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cond(func, suppressErrors = false) {
    if (suppressErrors) {
        return {
            [_sym2.default](value) {
                try {
                    if (func(value)) {
                        return { matches: true };
                    } else {
                        return {
                            matches: false,
                            reasonTag: `cond`,
                            reason: `condition function returned false on value`
                        };
                    }
                } catch (error) {
                    return {
                        matches: false,
                        reasonTag: `cond`,
                        reason: [`condition function threw an error`, [error instanceof Error ? error.message : error]]
                    };
                }
            }
        };
    } else {
        return {
            [_sym2.default](value) {
                if (func(value)) {
                    return { matches: true };
                } else {
                    return {
                        matches: false,
                        reasonTag: `cond`,
                        reason: `condition function returned false on value`
                    };
                }
            }
        };
    }
}
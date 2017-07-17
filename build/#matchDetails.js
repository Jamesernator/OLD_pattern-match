'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.default = isMatch;

var _sym = require('./sym.js');

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validResult(result) {
    return typeof result === 'boolean' || typeof result === 'object' && result !== null && typeof result.matches === 'boolean';
}

function isMatch(pattern, value, matches) {
    if (typeof pattern[_sym2.default] === 'function') {
        const res = pattern[_sym2.default](value, matches);
        if (!validResult(res)) {
            throw new Error(`Expected boolean or { matches: boolean } from pattern`);
        }

        if (typeof res === 'boolean') {
            const result = (0, _create2.default)({
                value,
                reason: `No reason provided`
            });
            (0, _assign2.default)(result, {
                matches: res,
                value
            });
            return result;
        } else {
            const result = (0, _create2.default)({
                value,
                reason: `No reason provided`
            });
            (0, _assign2.default)(result, res);
            return result;
        }
    } else {
        throw new Error(`Invalid pattern object ${pattern}`);
    }
}
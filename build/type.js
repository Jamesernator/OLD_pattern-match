'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = type;

var _sym = require('./sym.js');

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const names = ['symbol', 'object', 'string', 'number', 'undefined', 'boolean', 'function'];

function type(typeName) {
    if (!names.includes(typeName)) {
        throw new Error(`${typeName} is not a valid typeof type`);
    }
    return {
        [_sym2.default](value) {
            if (typeof value === typeName) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reason: `typeof value is not ${typeName}`,
                    reasonTag: `type`
                };
            }
        }
    };
}
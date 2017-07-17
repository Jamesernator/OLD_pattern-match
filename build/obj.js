'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getOwnPropertySymbols = require('babel-runtime/core-js/object/get-own-property-symbols');

var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

exports.default = obj;

var _sym = require('./sym.js');

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* entries(object, symbols) {
    for (const name of (0, _getOwnPropertyNames2.default)(object)) {
        yield [name, object[name]];
    }

    if (symbols) {
        for (const symbol of (0, _getOwnPropertySymbols2.default)(object)) {
            yield [symbol, object[symbol]];
        }
    }
}

function obj(...args) {
    const [objectPattern, matchSymbols] = args.length === 1 ? [...args, true] : args.length === 2 ? typeof args[0] === 'object' ? args : [args[1], args[0]] : null; // TODO replace this with real error

    return {
        [_sym2.default](value, matches) {
            if (value === null || typeof value !== 'object' && typeof value !== 'function') {
                return {
                    matches: false,
                    reason: `value is not an object`,
                    reasonTag: `obj`
                };
            }

            for (const [key, pattern] of entries(objectPattern, matchSymbols)) {
                const details = matches.details(pattern, value[key]);
                if (!details.matches) {
                    return {
                        matches: false,
                        reason: [`key ${String(key)} does not match`, [details]],
                        reasonTag: `obj`
                    };
                }
            }
            return { matches: true };
        }
    };
}
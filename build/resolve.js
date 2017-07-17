"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

exports.default = resolve;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _undef = require("./undef.js");

var _undef2 = _interopRequireDefault(_undef);

var _nil = require("./nil.js");

var _nil2 = _interopRequireDefault(_nil);

var _is = require("./is.js");

var _is2 = _interopRequireDefault(_is);

var _cond = require("./cond.js");

var _cond2 = _interopRequireDefault(_cond);

var _regex = require("./regex.js");

var _regex2 = _interopRequireDefault(_regex);

var _date = require("./date.js");

var _date2 = _interopRequireDefault(_date);

var _array = require("./array.js");

var _array2 = _interopRequireDefault(_array);

var _obj = require("./obj.js");

var _obj2 = _interopRequireDefault(_obj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line complexity
function resolve(item) {
    if (item === undefined) {
        return _undef2.default;
    } else if (item === null) {
        return _nil2.default;
    } else if (typeof item[_sym2.default] === 'function') {
        return item;
    } else if (typeof item === 'number') {
        return (0, _is2.default)(item);
    } else if (typeof item === 'string') {
        return (0, _is2.default)(item);
    } else if (typeof item === 'symbol') {
        return (0, _is2.default)(item);
    } else if (typeof item === 'boolean') {
        return (0, _is2.default)(item);
    } else if (typeof item === 'function') {
        return (0, _cond2.default)(item);
    } else if (item instanceof RegExp) {
        return (0, _regex2.default)(item);
    } else if (item instanceof Date) {
        return (0, _date2.default)(item);
    } else if (item instanceof Array) {
        return (0, _array2.default)(item);
    } else if ([Object.prototype, null].includes((0, _getPrototypeOf2.default)(item))) {
        return (0, _obj2.default)(item);
    } else {
        throw new Error(`Can't resolve object ${item}`);
    }
}
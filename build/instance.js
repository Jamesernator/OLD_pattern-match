"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = instance;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _isConstructor = require("./#isConstructor.js");

var _isConstructor2 = _interopRequireDefault(_isConstructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function instance(constructor) {
    if (!(0, _isConstructor2.default)(constructor)) {
        throw new Error(`Expected a constructor`);
    }
    return {
        [_sym2.default](value) {
            if (value instanceof constructor) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reasonTag: `instance`,
                    reason: `value not instanceof ${constructor.name}`
                };
            }
        }
    };
}
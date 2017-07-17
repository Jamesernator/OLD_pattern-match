"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _isConstructor = require("./#isConstructor.js");

var _isConstructor2 = _interopRequireDefault(_isConstructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if ((0, _isConstructor2.default)(value)) {
            return { matches: true };
        } else {
            return {
                matches: false,
                reasonTag: `constructor`,
                reason: `value isn't a constructor`
            };
        }
    }
};
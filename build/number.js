"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _match = require("./match.js");

var _match2 = _interopRequireDefault(_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_match2.default](value) {
        if (typeof value === 'number') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: `typeof value is not number`,
                reasonTag: `number`
            };
        }
    }
};
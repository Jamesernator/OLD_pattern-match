"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toPrimitive = require("babel-runtime/core-js/symbol/to-primitive");

var _toPrimitive2 = _interopRequireDefault(_toPrimitive);

exports.default = makeMatch;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _matchDetails = require("./#matchDetails.js");

var _matchDetails2 = _interopRequireDefault(_matchDetails);

var _resolve = require("./resolve.js");

var _resolve2 = _interopRequireDefault(_resolve);

var _matchOn = require("./#matchOn.js");

var _matchOn2 = _interopRequireDefault(_matchOn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeMatch(resolve = _resolve2.default, baseMatch = null) {
    function match(...args) {
        if (args.length === 1) {
            return value => match(args[0], value);
        }
        const [pattern, target] = args;
        const realPattern = resolve(pattern, baseMatch);
        return (0, _matchDetails2.default)(realPattern, target, match).matches;
    }

    match.resolve = resolve;
    match[_toPrimitive2.default] = _ => _sym2.default;
    match.fork = r => makeMatch(r, baseMatch);
    match.on = value => (0, _matchOn2.default)(match, value);
    match.details = function details(...args) {
        if (args.length === 1) {
            return value => details(args[0], value);
        }
        const [pattern, target] = args;
        const realPattern = resolve(pattern, baseMatch);
        return (0, _matchDetails2.default)(realPattern, target, match);
    };

    return match;
}
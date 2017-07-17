require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isConstructor;
function isConstructor(obj) {
    try {
        // eslint-disable-next-line new-parens
        const _ = new new Proxy(obj, {
            construct() {
                return {};
            }
        })();
        return true;
    } catch (err) {
        return false;
    }
}

},{}],2:[function(require,module,exports){
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

},{"./sym.js":29,"babel-runtime/core-js/object/assign":33,"babel-runtime/core-js/object/create":34}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = matchOn;

var _or = require('./or.js');

var _or2 = _interopRequireDefault(_or);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _matchOn(match, value, patterns) {
    return {
        if(...args) {
            if (args.length < 2) {
                throw new Error(`Expected at least one pattern`);
            }
            const pattern = (0, _or2.default)(...args.slice(0, args.length - 1));
            const handler = args[args.length - 1];
            if (typeof handler !== 'function') {
                throw new Error(`Expected a function as pattern handler`);
            }
            return _matchOn(match, value, [...patterns, [pattern, handler]]);
        },

        i(...args) {
            return this.if(...args);
        },

        else(elseHandler) {
            if (typeof elseHandler !== 'function') {
                throw new Error(`Expected function as input to else`);
            }
            for (const [pattern, handler] of patterns) {
                if (match(pattern, value)) {
                    return handler(value);
                }
            }
            return elseHandler(value);
        },

        e(...args) {
            return this.else(...args);
        },

        value() {
            return this.else(_ => {
                throw new Error(`No pattern could be matched`);
            });
        },

        v(...args) {
            return this.value(...args);
        }
    };
}

function matchOn(match, value) {
    return _matchOn(match, value, { patterns: [], elseSet: false });
}

},{"./or.js":25}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = and;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function and(...patterns) {
    return {
        [_sym2.default](value, matches) {
            for (const pattern of patterns) {
                const details = matches.details(pattern, value);
                if (!details.matches) {
                    return {
                        matches: false,
                        reasonTag: `and`,
                        reason: [`not all and values matched`, [details]]
                    };
                }
            }
            return { matches: true };
        }
    };
}

},{"./sym.js":29}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default]() {
        return true;
    }
};

},{"./sym.js":29}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = array;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function array(...args) {
    if (args.length === 1) {
        const [arrayPattern] = args;
        return {
            [_sym2.default](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`
                    };
                }

                if (arrayPattern.length !== value.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value length is not the same as pattern length with no rest`
                    };
                }

                for (const [idx, pattern] of arrayPattern.entries()) {
                    const details = matches.details(pattern, value[idx]);
                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx} of array does not match corresponding pattern`, [details]]
                        };
                    }
                }
                return { matches: true };
            }
        };
    } else if (args.length === 2) {
        // TODO: Add reasons
        const [arrayPattern, restPattern] = args;
        return {
            [_sym2.default](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`
                    };
                }

                if (value.length < arrayPattern.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is shorter than expected array`
                    };
                }

                for (const [idx, pattern] of arrayPattern.entries()) {
                    const details = matches.details(pattern, value[idx]);
                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx} of array does not match corresponding pattern`, [details]]
                        };
                    }
                }

                for (const [idx, item] of value.slice(arrayPattern.length).entries()) {
                    const details = matches.details(restPattern, item);
                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx + arrayPattern.length} of array does not match rest pattern`, [details]]
                        };
                    }
                }
                return { matches: true };
            }
        };
    } else if (args.length === 3) {
        // TODO: Add reasons
        const [startPattern, restPattern, endPattern] = args;
        return {
            [_sym2.default](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`
                    };
                }

                if (value.length < startPattern.length + endPattern.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is shorter than expected array patterns`
                    };
                }

                for (const [idx, pattern] of startPattern.entries()) {
                    const details = matches.details(pattern, value[idx]);
                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx} of array does not match corresponding pattern`, [details]]
                        };
                    }
                }

                for (const [idx, pattern] of endPattern.entries()) {
                    const details = matches.details(pattern, value[value.length - endPattern.length + idx]);

                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx - endPattern.length} of array does not match corresponding pattern`, [details]]
                        };
                    }
                }

                for (const [idx, item] of value.slice(startPattern.length, value.length - endPattern.length).entries()) {
                    const details = matches.details(restPattern, item);
                    if (!details.matches) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${idx + startPattern.length} of array does not match rest pattern`, [details]]
                        };
                    }
                }
                return { matches: true };
            }
        };
    } else {
        throw new Error(`Invalid arguments`);
    }
}

},{"./sym.js":29}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = arrayOf;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arrayOf(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (!Array.isArray(value)) {
                return {
                    matches: false,
                    reasonTag: `arrayOf`,
                    reason: `value is not an Array`
                };
            }

            for (const [idx, item] of value.entries()) {
                const details = matches.details(pattern, item);
                if (details.matches) {
                    return {
                        matches: false,
                        reasonTag: `arrayOf`,
                        reason: [`item at index ${idx} does not match`, [details]]
                    };
                }
            }
            return { matches: true };
        }
    };
}

},{"./sym.js":29}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (typeof value === 'boolean') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reasonTag: `boolean`,
                reason: `typeof value is not boolean`
            };
        }
    }
};

},{"./sym.js":29}],9:[function(require,module,exports){
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

},{"./sym.js":29}],10:[function(require,module,exports){
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

},{"./#isConstructor.js":1,"./sym.js":29}],11:[function(require,module,exports){
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

},{"./sym.js":29}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _match = require("./match.js");

var _match2 = _interopRequireDefault(_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _match2.default;

},{"./match.js":17}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (typeof value === 'function') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reasonTag: `func`,
                reason: `typeof value is not function`
            };
        }
    }
};

},{"./sym.js":29}],14:[function(require,module,exports){
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

},{"./#isConstructor.js":1,"./sym.js":29}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _is = require("babel-runtime/core-js/object/is");

var _is2 = _interopRequireDefault(_is);

exports.default = is;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// is returns true if the object is identical to the passed object
function is(other) {
    return {
        [_sym2.default](obj) {
            if ((0, _is2.default)(obj, other)) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reasonTag: `is`,
                    reason: `value is not the same as expected`
                };
            }
        }
    };
}

},{"./sym.js":29,"babel-runtime/core-js/object/is":38}],16:[function(require,module,exports){
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

},{"./#matchDetails.js":2,"./#matchOn.js":3,"./resolve.js":27,"./sym.js":29,"babel-runtime/core-js/symbol/to-primitive":40}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _makeMatch = require("./makeMatch.js");

var _makeMatch2 = _interopRequireDefault(_makeMatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _makeMatch2.default)();

},{"./makeMatch.js":16}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maybe;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maybe(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (value == null) {
                return { matches: true };
            } else {
                const details = matches.details(pattern, value);
                if (details) {
                    return { matches: true };
                } else {
                    return {
                        matches: false,
                        reasonTag: `maybe`,
                        reason: [`pattern did not match and is not null or undefined`, [details]]
                    };
                }
            }
        }
    };
}

},{"./sym.js":29}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// nil returns true if the obj matched against is null
exports.default = {
    [_sym2.default](value) {
        if (value === null) {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: `value is not null`,
                reasonTag: `nil`
            };
        }
    }
};

},{"./sym.js":29}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = not;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function not(pattern) {
    return {
        [_sym2.default](value, matches) {
            if (!matches(pattern, value)) {
                return {
                    matches: true
                };
            } else {
                return {
                    matches: false,
                    reason: `expected pattern not to match`,
                    reasonTag: `not`
                };
            }
        }
    };
}

},{"./sym.js":29}],21:[function(require,module,exports){
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

},{"./match.js":17}],22:[function(require,module,exports){
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

},{"./sym.js":29,"babel-runtime/core-js/object/get-own-property-names":35,"babel-runtime/core-js/object/get-own-property-symbols":36}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (value === null) {
            return {
                matches: false,
                reason: `value is null`
            };
        } else if (typeof value !== 'object') {
            return {
                matches: false,
                reason: `typeof value is not object`,
                reasonTag: `object`
            };
        } else {
            return { matches: true };
        }
    }
};

},{"./sym.js":29}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = oneOf;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

var _is = require("./is.js");

var _is2 = _interopRequireDefault(_is);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function oneOf(...values) {
    return {
        [_sym2.default](value, matches) {
            const reasons = [];
            for (const val of values) {
                const details = matches.details((0, _is2.default)(val), value);
                if (details.matches) {
                    return { matches: true };
                } else {
                    reasons.push(details);
                }
            }
            return {
                matches: false,
                reason: [`none of the provided values matched`, reasons],
                reasonTag: `oneOf`
            };
        }
    };
}

},{"./is.js":15,"./sym.js":29}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = or;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function or(...patterns) {
    return {
        [_sym2.default](value, matches) {
            const reasons = [];
            for (const pattern of patterns) {
                const details = matches.details(pattern, value);
                if (details.matches) {
                    return { matches: true };
                } else {
                    reasons.push(details);
                }
            }
            return {
                matches: false,
                reason: [`none of the choices to or match`, reasons],
                reasonTag: `or`
            };
        }
    };
}

},{"./sym.js":29}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = regex;

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function regex(regExp) {
    if (!(regExp instanceof RegExp)) {
        throw new Error(`regex expected a regular expression not ${regExp}`);
    }
    return {
        [_sym2.default](value) {
            if (typeof value !== 'string') {
                return {
                    matches: false,
                    reason: `value is not a string`
                };
            }

            if (regExp.exec(value)) {
                return { matches: true };
            } else {
                return {
                    matches: false,
                    reason: `string does not match ${regExp}`,
                    reasonTag: `regex`
                };
            }
        }
    };
}

},{"./sym.js":29}],27:[function(require,module,exports){
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

},{"./array.js":6,"./cond.js":9,"./date.js":11,"./is.js":15,"./nil.js":19,"./obj.js":22,"./regex.js":26,"./sym.js":29,"./undef.js":32,"babel-runtime/core-js/object/get-prototype-of":37}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (typeof value === 'string') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: `typeof value is not string`,
                reasonTag: `string`
            };
        }
    }
};

},{"./sym.js":29}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _for2.default)('@jx/match');

},{"babel-runtime/core-js/symbol/for":39}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    [_sym2.default](value) {
        if (typeof value === 'symbol') {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: `typeof value is not symbol`,
                reasonTag: `symbol`
            };
        }
    }
};

},{"./sym.js":29}],31:[function(require,module,exports){
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

},{"./sym.js":29}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sym = require("./sym.js");

var _sym2 = _interopRequireDefault(_sym);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// undef returns true if the obj matched against is undefined
exports.default = {
    [_sym2.default](value) {
        if (value === undefined) {
            return { matches: true };
        } else {
            return {
                matches: false,
                reason: 'value is not undefined',
                reasonTag: `undef`
            };
        }
    }
};

},{"./sym.js":29}],33:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":41}],34:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":42}],35:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-names"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-names":43}],36:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-symbols"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-symbols":44}],37:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":45}],38:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/is"), __esModule: true };
},{"core-js/library/fn/object/is":46}],39:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/for"), __esModule: true };
},{"core-js/library/fn/symbol/for":47}],40:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/to-primitive"), __esModule: true };
},{"core-js/library/fn/symbol/to-primitive":48}],41:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":53,"../../modules/es6.object.assign":102}],42:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":53,"../../modules/es6.object.create":103}],43:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-names');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyNames(it){
  return $Object.getOwnPropertyNames(it);
};
},{"../../modules/_core":53,"../../modules/es6.object.get-own-property-names":104}],44:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/_core').Object.getOwnPropertySymbols;
},{"../../modules/_core":53,"../../modules/es6.symbol":107}],45:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":53,"../../modules/es6.object.get-prototype-of":105}],46:[function(require,module,exports){
require('../../modules/es6.object.is');
module.exports = require('../../modules/_core').Object.is;
},{"../../modules/_core":53,"../../modules/es6.object.is":106}],47:[function(require,module,exports){
require('../../modules/es6.symbol');
module.exports = require('../../modules/_core').Symbol['for'];
},{"../../modules/_core":53,"../../modules/es6.symbol":107}],48:[function(require,module,exports){
module.exports = require('../../modules/_wks-ext').f('toPrimitive');
},{"../../modules/_wks-ext":100}],49:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],50:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":69}],51:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":92,"./_to-iobject":94,"./_to-length":95}],52:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],53:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],54:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":49}],55:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],56:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":61}],57:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":62,"./_is-object":69}],58:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],59:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":80,"./_object-keys":83,"./_object-pie":84}],60:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":53,"./_ctx":54,"./_global":62,"./_hide":64}],61:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],62:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],63:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],64:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":56,"./_object-dp":75,"./_property-desc":86}],65:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":62}],66:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":56,"./_dom-create":57,"./_fails":61}],67:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":52}],68:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":52}],69:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],70:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":83,"./_to-iobject":94}],71:[function(require,module,exports){
module.exports = true;
},{}],72:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":61,"./_has":63,"./_is-object":69,"./_object-dp":75,"./_uid":98}],73:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":61,"./_iobject":67,"./_object-gops":80,"./_object-keys":83,"./_object-pie":84,"./_to-object":96}],74:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":50,"./_dom-create":57,"./_enum-bug-keys":58,"./_html":65,"./_object-dps":76,"./_shared-key":90}],75:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":50,"./_descriptors":56,"./_ie8-dom-define":66,"./_to-primitive":97}],76:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":50,"./_descriptors":56,"./_object-dp":75,"./_object-keys":83}],77:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":56,"./_has":63,"./_ie8-dom-define":66,"./_object-pie":84,"./_property-desc":86,"./_to-iobject":94,"./_to-primitive":97}],78:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":79,"./_to-iobject":94}],79:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":58,"./_object-keys-internal":82}],80:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],81:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":63,"./_shared-key":90,"./_to-object":96}],82:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":51,"./_has":63,"./_shared-key":90,"./_to-iobject":94}],83:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":58,"./_object-keys-internal":82}],84:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],85:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":53,"./_export":60,"./_fails":61}],86:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],87:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":64}],88:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],89:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":63,"./_object-dp":75,"./_wks":101}],90:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":91,"./_uid":98}],91:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":62}],92:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":93}],93:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],94:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":55,"./_iobject":67}],95:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":93}],96:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":55}],97:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":69}],98:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],99:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":53,"./_global":62,"./_library":71,"./_object-dp":75,"./_wks-ext":100}],100:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":101}],101:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":62,"./_shared":91,"./_uid":98}],102:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":60,"./_object-assign":73}],103:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":60,"./_object-create":74}],104:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":78,"./_object-sap":85}],105:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":81,"./_object-sap":85,"./_to-object":96}],106:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":60,"./_same-value":88}],107:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":50,"./_descriptors":56,"./_enum-keys":59,"./_export":60,"./_fails":61,"./_global":62,"./_has":63,"./_hide":64,"./_is-array":68,"./_keyof":70,"./_library":71,"./_meta":72,"./_object-create":74,"./_object-dp":75,"./_object-gopd":77,"./_object-gopn":79,"./_object-gopn-ext":78,"./_object-gops":80,"./_object-keys":83,"./_object-pie":84,"./_property-desc":86,"./_redefine":87,"./_set-to-string-tag":89,"./_shared":91,"./_to-iobject":94,"./_to-primitive":97,"./_uid":98,"./_wks":101,"./_wks-define":99,"./_wks-ext":100}],"match":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _and = require("./module/and.js");

Object.defineProperty(exports, "and", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_and).default;
  }
});

var _any = require("./module/any.js");

Object.defineProperty(exports, "any", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_any).default;
  }
});

var _array = require("./module/array.js");

Object.defineProperty(exports, "array", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_array).default;
  }
});

var _arrayOf = require("./module/arrayOf.js");

Object.defineProperty(exports, "arrayOf", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_arrayOf).default;
  }
});

var _boolean = require("./module/boolean.js");

Object.defineProperty(exports, "boolean", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_boolean).default;
  }
});

var _cond = require("./module/cond.js");

Object.defineProperty(exports, "cond", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_cond).default;
  }
});

var _constructor = require("./module/constructor.js");

Object.defineProperty(exports, "constructor", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_constructor).default;
  }
});

var _date = require("./module/date.js");

Object.defineProperty(exports, "date", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_date).default;
  }
});

var _default = require("./module/default.js");

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_default).default;
  }
});

var _func = require("./module/func.js");

Object.defineProperty(exports, "func", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_func).default;
  }
});

var _instance = require("./module/instance.js");

Object.defineProperty(exports, "instance", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_instance).default;
  }
});

var _is = require("./module/is.js");

Object.defineProperty(exports, "is", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_is).default;
  }
});

var _makeMatch = require("./module/makeMatch.js");

Object.defineProperty(exports, "makeMatch", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_makeMatch).default;
  }
});

var _match = require("./module/match.js");

Object.defineProperty(exports, "match", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_match).default;
  }
});

var _maybe = require("./module/maybe.js");

Object.defineProperty(exports, "maybe", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_maybe).default;
  }
});

var _nil = require("./module/nil.js");

Object.defineProperty(exports, "nil", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_nil).default;
  }
});

var _not = require("./module/not.js");

Object.defineProperty(exports, "not", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_not).default;
  }
});

var _number = require("./module/number.js");

Object.defineProperty(exports, "number", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_number).default;
  }
});

var _obj = require("./module/obj.js");

Object.defineProperty(exports, "obj", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_obj).default;
  }
});

var _object = require("./module/object.js");

Object.defineProperty(exports, "object", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_object).default;
  }
});

var _oneOf = require("./module/oneOf.js");

Object.defineProperty(exports, "oneOf", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_oneOf).default;
  }
});

var _or = require("./module/or.js");

Object.defineProperty(exports, "or", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_or).default;
  }
});

var _regex = require("./module/regex.js");

Object.defineProperty(exports, "regex", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_regex).default;
  }
});

var _resolve = require("./module/resolve.js");

Object.defineProperty(exports, "resolve", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_resolve).default;
  }
});

var _string = require("./module/string.js");

Object.defineProperty(exports, "string", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_string).default;
  }
});

var _sym = require("./module/sym.js");

Object.defineProperty(exports, "sym", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_sym).default;
  }
});

var _symbol = require("./module/symbol.js");

Object.defineProperty(exports, "symbol", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_symbol).default;
  }
});

var _type = require("./module/type.js");

Object.defineProperty(exports, "type", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_type).default;
  }
});

var _undef = require("./module/undef.js");

Object.defineProperty(exports, "undef", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_undef).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./module/and.js":4,"./module/any.js":5,"./module/array.js":6,"./module/arrayOf.js":7,"./module/boolean.js":8,"./module/cond.js":9,"./module/constructor.js":10,"./module/date.js":11,"./module/default.js":12,"./module/func.js":13,"./module/instance.js":14,"./module/is.js":15,"./module/makeMatch.js":16,"./module/match.js":17,"./module/maybe.js":18,"./module/nil.js":19,"./module/not.js":20,"./module/number.js":21,"./module/obj.js":22,"./module/object.js":23,"./module/oneOf.js":24,"./module/or.js":25,"./module/regex.js":26,"./module/resolve.js":27,"./module/string.js":28,"./module/sym.js":29,"./module/symbol.js":30,"./module/type.js":31,"./module/undef.js":32}]},{},[]);

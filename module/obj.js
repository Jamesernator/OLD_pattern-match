#!/usr/bin/env babel-node
import match from "./sym.js"

function* entries(object, symbols) {
    for (const name of Object.getOwnPropertyNames(object)) {
        yield [name, object[name]]
    }

    if (symbols) {
        for (const symbol of Object.getOwnPropertySymbols(object)) {
            yield [symbol, object[symbol]]
        }
    }
}

export default function obj(...args) {
    const [objectPattern, matchSymbols]
        = args.length === 1 ?
            [...args, true]
        : args.length === 2 ?
            typeof args[0] === 'object' ?
                args
            :
                [args[1], args[0]]
        :
            null // TODO replace this with real error

    return {
        [match](value, matches) {
            if (typeof value !== 'object' && typeof value !== 'function') {
                return false
            }

            for (const [key, pattern] of entries(objectPattern, matchSymbols)) {
                if (!matches(pattern, value[key])) {
                    return false
                }
            }
            return true
        }
    }
}

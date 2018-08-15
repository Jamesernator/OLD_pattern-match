import match from "./sym.mjs"

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
            // TODO replace this with real error
            null

    return {
        [match](value, matches) {
            if (value === null || typeof value !== 'object' && typeof value !== 'function') {
                return {
                    matches: false,
                    reason: `value is not an object`,
                    reasonTag: `obj`,
                }
            }

            for (const [key, pattern] of entries(objectPattern, matchSymbols)) {
                const details = matches.details(pattern, value[key])
                if (!details.matches) {
                    return {
                        matches: false,
                        reason: [`key ${ String(key) } does not match`, [
                            details,
                        ]],
                        reasonTag: `obj`,
                    }
                }
            }
            return { matches: true }
        },
    }
}

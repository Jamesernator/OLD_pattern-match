import match from "./sym.js"

function validResult(result) {
    return typeof result === 'boolean'
        || typeof result === 'object'
        && result !== null
        && typeof result.matches === 'boolean'
}

export default function isMatch(pattern, value, matches) {
    if (typeof pattern[match] === 'function') {
        const res = pattern[match](value, matches)
        if (!validResult(res)) {
            throw new Error(`Expected boolean or { matches: boolean } from pattern`)
        }
        if (typeof res === 'boolean') {
            return {
                matches: res,
                value,
            }
        } else {
            return res
        }
    } else {
        throw new Error(`Invalid pattern object ${ pattern }`)
    }
}

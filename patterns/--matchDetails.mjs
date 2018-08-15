import match from "./sym.mjs"

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
            const result = Object.create({
                value,
                reason: `No reason provided`,
            })
            Object.assign(result, {
                matches: res,
                value,
            })
            return result
        } else {
            const result = Object.create({
                value,
                reason: `No reason provided`,
            })
            Object.assign(result, res)
            return result
        }
    } else {
        throw new Error(`Invalid pattern object ${ pattern }`)
    }
}

import match from "./sym.js"

export default function regex(regExp) {
    if (!(regExp instanceof RegExp)) {
        throw new Error(`regex expected a regular expression not ${ regExp }`)
    }
    return {
        [match](value) {
            if (typeof value !== 'string') {
                return {
                    matches: false,
                    reason: `value is not a string`
                }
            }

            if (regExp.exec(value)) {
                return { matches: true }
            } else {
                return {
                    matches: false,
                    reason: `string does not match ${ regExp }`,
                    reasonTag: `regex`,
                }
            }
        }
    }
}

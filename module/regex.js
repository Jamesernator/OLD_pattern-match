import match from "./sym.js"

export default function regex(regExp) {
    if (!(regExp instanceof RegExp)) {
        throw new Error(`regex expected a regular expression not ${ regExp }`)
    }
    return {
        [match](value) {
            if (typeof value !== 'string') {
                return false
            }
            return Boolean(regExp.exec(value))
        }
    }
}

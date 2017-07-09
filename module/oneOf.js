import match from "./sym.js"
import is from "./is.js"

export default function oneOf(...values) {
    return {
        [match](value, matches) {
            return values.some(val => matches(is(val), value))
        }
    }
}

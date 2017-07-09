import match from "./sym.js"

export default function arrayOf(pattern) {
    return {
        [match](value, matches) {
            return Array.isArray(value)
                && value.every(item => matches(pattern, item))
        }
    }
}

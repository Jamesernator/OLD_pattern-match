import match from "./sym.js"

export default function not(pattern) {
    return {
        [match](value, matches) {
            return !matches(pattern, value)
        }
    }
}

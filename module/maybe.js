import match from "./sym.js"

export default function maybe(pattern) {
    return {
        [match](value, matches) {
            return value === null
                || value === undefined
                || matches(pattern, value)
        }
    }
}

import match from "./sym.js"

export default function or(...patterns) {
    return {
        [match](value, matches) {
            return patterns.some(pattern => matches(pattern, value))
        }
    }
}

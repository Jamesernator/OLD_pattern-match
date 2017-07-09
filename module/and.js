import match from "./sym.js"

export default function and(...patterns) {
    return {
        [match](value, matches) {
            return patterns.every(pattern => matches(pattern, value))
        }
    }
}

import match from "./sym.js"

export default function not(pattern) {
    return {
        [match](value, matches) {
            if (!matches(pattern, value)) {
                return {
                    matches: true,
                }
            } else {
                return {
                    matches: false,
                    reason: `expected pattern not to match`,
                    reasonTag: `not`,
                }
            }
        }
    }
}

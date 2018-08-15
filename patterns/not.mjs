import match from "./sym.mjs"

export default function not(pattern) {
    return {
        [match](value, matches) {
            if (matches(pattern, value)) {
                return {
                    matches: false,
                    reason: `expected pattern not to match`,
                    reasonTag: `not`,
                }
            } else {
                return {
                    matches: true,
                }
            }
        },
    }
}

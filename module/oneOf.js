import match from "./sym.js"
import is from "./is.js"

export default function oneOf(...values) {
    return {
        [match](value, matches) {
            const reasons = []
            for (const val of values) {
                const { matches: isMatch, reason } = matches.details(is(val), value)
                if (isMatch) {
                    return { matches: true }
                } else {
                    reasons.push(reason)
                }
            }
            return {
                matches: false,
                reason: [`none of the provided values matched`, reasons],
                reasonTag: `oneOf`,
            }
        }
    }
}

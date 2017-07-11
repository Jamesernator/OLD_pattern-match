import match from "./sym.js"
import is from "./is.js"

export default function oneOf(...values) {
    return {
        [match](value, matches) {
            const reasons = []
            for (const val of values) {
                const details = matches.details(is(val), value)
                if (details.matches) {
                    return { matches: true }
                } else {
                    reasons.push(details)
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

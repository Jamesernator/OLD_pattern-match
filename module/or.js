import match from "./sym.js"

export default function or(...patterns) {
    return {
        [match](value, matches) {
            const reasons = []
            for (const pattern of patterns) {
                const { matches: isMatch, reason } = matches.details(pattern, value)
                if (isMatch) {
                    return { matches: true }
                } else {
                    reasons.push(reason)
                }
            }
            return {
                matches: false,
                reason: [`none of the choices to or match`, reasons],
                reasonTag: `or`,
            }
        }
    }
}

import match from "./sym.js"

export default function or(...patterns) {
    return {
        [match](value, matches) {
            const reasons = []
            for (const pattern of patterns) {
                const details = matches.details(pattern, value)
                if (details.matches) {
                    return { matches: true, value: details.value }
                } else {
                    reasons.push(details)
                }
            }
            return {
                matches: false,
                reason: [`none of the choices to or match`, reasons],
                reasonTag: `or`,
            }
        },
    }
}

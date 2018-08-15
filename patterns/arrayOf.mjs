import match from "./sym.mjs"

export default function arrayOf(pattern) {
    return {
        [match](value, matches) {
            if (!Array.isArray(value)) {
                return {
                    matches: false,
                    reasonTag: `arrayOf`,
                    reason: `value is not an Array`,
                }
            }

            for (const [idx, item] of value.entries()) {
                const details = matches.details(pattern, item)
                if (details.matches) {
                    return {
                        matches: false,
                        reasonTag: `arrayOf`,
                        reason: [`item at index ${ idx } does not match`, [
                            details,
                        ]],
                    }
                }
            }
            return { matches: true }
        },
    }
}

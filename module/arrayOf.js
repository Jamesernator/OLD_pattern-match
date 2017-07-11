import match from "./sym.js"

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
                const { isMatch, reason } = matches.details(pattern, item)
                if (!isMatch) {
                    return {
                        matches: false,
                        reasonTag: `arrayOf`,
                        reason: [`item at index ${ idx } does not match`, [
                            reason
                        ]]
                    }
                }
            }
            return { matches: true }
        }
    }
}

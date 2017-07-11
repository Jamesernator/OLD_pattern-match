import match from "./sym.js"

export default function and(...patterns) {
    return {
        [match](value, matches) {
            for (const pattern of patterns) {
                const { matches: isMatch, reason } = matches.details(pattern, value)
                if (!isMatch) {
                    return {
                        matches: false,
                        reasonTag: `and`,
                        reason: [`not all and values matched`, [
                            reason
                        ]]
                    }
                }
            }
            return { matches: true }
        }
    }
}

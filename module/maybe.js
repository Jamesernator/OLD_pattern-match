import match from "./sym.js"

export default function maybe(pattern) {
    return {
        [match](value, matches) {
            if (value == null) {
                return { matches: true }
            } else {
                const { isMatch, reason } = matches.details(pattern, value)
                if (isMatch) {
                    return { matches: true }
                } else {
                    return {
                        matches: false,
                        reasonTag: `maybe`,
                        reason: [`pattern did not match and is not null or undefined`, [
                            reason
                        ]]
                    }
                }
            }
        }
    }
}

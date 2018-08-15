import match from "./sym.mjs"

export default function maybe(pattern) {
    return {
        [match](value, matches) {
            if (value == null) {
                return { matches: true }
            } else {
                const details = matches.details(pattern, value)
                if (details) {
                    return { matches: true }
                } else {
                    return {
                        matches: false,
                        reasonTag: `maybe`,
                        reason: [`pattern did not match and is not null or undefined`, [
                            details,
                        ]],
                    }
                }
            }
        },
    }
}

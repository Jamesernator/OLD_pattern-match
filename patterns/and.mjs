import match from './sym.mjs'

export default function and(...patterns) {
    return {
        [match](value, matches) {
            for (const pattern of patterns) {
                const details = matches.details(pattern, value)
                if (!details.matches) {
                    return {
                        matches: false,
                        reasonTag: `and`,
                        reason: [`not all and values matched`, [
                            details,
                        ]],
                    }
                }
            }
            return { matches: true }
        },
    }
}

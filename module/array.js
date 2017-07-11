import match from "./sym.js"

export default function array(...args) {
    if (args.length === 1) {
        const [arrayPattern] = args
        return {
            [match](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`,
                    }
                }

                if (arrayPattern.length !== value.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value length is not the same as pattern length with no rest`
                    }
                }

                for (const [idx, pattern] of arrayPattern.entries()) {
                    const { matches: isMatch, reason } = matches.details(pattern, value[idx])
                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx } of array does not match corresponding pattern`, [
                                reason
                            ]]
                        }
                    }
                }
                return { matches: true }
            }
        }
    } else if (args.length === 2) {
        // TODO: Add reasons
        const [arrayPattern, restPattern] = args
        return {
            [match](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`,
                    }
                }

                if (value.length < arrayPattern.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is shorter than expected array`,
                    }
                }

                for (const [idx, pattern] of arrayPattern.entries()) {
                    const { matches: isMatch, reason } = matches.details(pattern, value[idx])
                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx } of array does not match corresponding pattern`, [
                                reason
                            ]]
                        }
                    }
                }

                for (const [idx, item] of value.slice(arrayPattern.length).entries()) {
                    const { matches: isMatch, reason } = matches.details(restPattern, item)
                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx + arrayPattern.length } of array does not match rest pattern`, [
                                reason
                            ]]
                        }
                    }
                }
                return { matches: true }
            }
        }
    } else if (args.length === 3) {
        // TODO: Add reasons
        const [startPattern, restPattern, endPattern] = args
        return {
            [match](value, matches) {
                if (!Array.isArray(value)) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is not an Array`,
                    }
                }

                if (value.length < startPattern.length + endPattern.length) {
                    return {
                        matches: false,
                        reasonTag: `array`,
                        reason: `value is shorter than expected array patterns`,
                    }
                }

                for (const [idx, pattern] of startPattern.entries()) {
                    const { matches: isMatch, reason } = matches.details(pattern, value[idx])
                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx } of array does not match corresponding pattern`, [
                                reason
                            ]]
                        }
                    }
                }

                for (const [idx, pattern] of endPattern.entries()) {
                    const { matches: isMatch, reason } = matches
                        .details(pattern, value[value.length - endPattern.length + idx])

                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx - endPattern.length } of array does not match corresponding pattern`, [
                                reason
                            ]],
                        }
                    }
                }

                for (const [idx, item] of value.slice(startPattern.length, value.length - endPattern.length).entries()) {
                    const { matches: isMatch, reason } = matches.details(restPattern, item)
                    if (!isMatch) {
                        return {
                            matches: false,
                            reasonTag: `array`,
                            reason: [`element ${ idx + startPattern.length } of array does not match rest pattern`, [
                                reason
                            ]]
                        }
                    }
                }
                return { matches: true }
            }
        }
    } else {
        throw new Error(`Invalid arguments`)
    }
}

import match from "./sym.js"

export default function array(...args) {
    if (args.length === 1) {
        const [arrayPattern] = args
        return {
            [match](value, matches) {
                return Array.isArray(value)
                    && arrayPattern.length === value.length
                    && arrayPattern
                        .every((pattern, idx) => matches(pattern, value[idx]))
            }
        }
    } else if (args.length === 2) {
        const [arrayPattern, restPattern] = args
        return {
            [match](value, matches) {
                return Array.isArray(value)
                    && arrayPattern.length <= value.length
                    && arrayPattern
                        .every((pattern, idx) => matches(pattern, value[idx]))
                    && value.slice(arrayPattern.length)
                        .every(item => matches(restPattern, item))
            }
        }
    } else if (args.length === 3) {
        const [startPattern, restPattern, endPattern] = args
        return {
            [match](value, matches) {
                return Array.isArray(value)
                    && startPattern.length + endPattern.length <= value.length
                    && startPattern
                        .every((pattern, idx) => matches(pattern, value[idx]))
                    && endPattern
                        .every((pattern, idx) =>
                            matches(pattern, value[value.length - endPattern.length + idx])
                        )
                    && value.slice(startPattern.length, value.length-endPattern.length)
                        .every(item => matches(restPattern, item))
            }
        }
    } else {
        throw new Error(`Invalid arguments`)
    }
}

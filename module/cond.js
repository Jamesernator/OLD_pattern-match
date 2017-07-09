import match from "./sym.js"

export default function cond(func, suppressErrors=false) {
    if (suppressErrors) {
        return {
            [match](value) {
                try {
                    return Boolean(func(value))
                } catch (e) {
                    return false
                }
            }
        }
    } else {
        return {
            [match](value) {
                return Boolean(func(value))
            }
        }
    }
}

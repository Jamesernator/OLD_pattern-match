import match from "./sym.js"

export default {
    [match](value) {
        if (value === null) {
            return {
                matches: false,
                reason: `value is null`,
            }
        } else if (typeof value !== 'object') {
            return {
                matches: false,
                reason: `typeof value is not object`,
                reasonTag: `object`,
            }
        } else {
            return { matches: true }
        }
    }
}

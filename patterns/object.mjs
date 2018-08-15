import match from "./sym.mjs"

export default {
    [match](value) {
        if (value === null) {
            return {
                matches: false,
                reason: `value is null`,
            }
        } else if (typeof value === 'object') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: `typeof value is not object`,
                reasonTag: `object`,
            }
        }
    },
}

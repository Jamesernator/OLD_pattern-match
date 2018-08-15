import match from "./sym.js"

export default {
    [match](value) {
        if (typeof value === 'string') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: `typeof value is not string`,
                reasonTag: `string`,
            }
        }
    },
}

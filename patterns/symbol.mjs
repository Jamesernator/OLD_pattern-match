import match from "./sym.js"

export default {
    [match](value) {
        if (typeof value === 'symbol') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: `typeof value is not symbol`,
                reasonTag: `symbol`,
            }
        }
    },
}
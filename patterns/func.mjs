import match from "./sym.mjs"

export default {
    [match](value) {
        if (typeof value === 'function') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reasonTag: `func`,
                reason: `typeof value is not function`,
            }
        }
    },
}

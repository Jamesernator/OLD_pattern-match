import match from "./sym.mjs"

// undef returns true if the obj matched against is undefined
export default {
    [match](value) {
        if (value === undefined) {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: 'value is not undefined',
                reasonTag: `undef`,
            }
        }
    },
}

import match from "./sym.mjs"

// nil returns true if the obj matched against is null
export default {
    [match](value) {
        if (value === null) {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: `value is not null`,
                reasonTag: `nil`,
            }
        }
    },
}

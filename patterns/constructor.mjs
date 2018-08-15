import match from "./sym.mjs"
import isConstructor from "./--isConstructor.mjs"

export default {
    [match](value) {
        if (isConstructor(value)) {
            return { matches: true }
        } else {
            return {
                matches: false,
                reasonTag: `constructor`,
                reason: `value isn't a constructor`,
            }
        }
    },
}

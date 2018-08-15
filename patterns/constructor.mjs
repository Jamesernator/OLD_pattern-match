import match from "./sym.js"
import isConstructor from "./--isConstructor.js"

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

import match from "./sym.js"

// is returns true if the object is identical to the passed object
export default function is(other) {
    return {
        [match](obj) {
            if (Object.is(obj, other)) {
                return { matches: true }
            } else {
                return {
                    matches: false,
                    reasonTag: `is`,
                    reason: `value is not the same as expected`,
                }
            }
        }
    }
}

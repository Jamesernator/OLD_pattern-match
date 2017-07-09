import match from "./sym.js"

// is returns true if the object is identical to the passed object
export default function is(other) {
    return {
        [match](obj) {
            return Object.is(obj, other)
        }
    }
}

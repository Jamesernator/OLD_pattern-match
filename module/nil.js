import match from "./sym.js"

// nil returns true if the obj matched against is null
export default {
    [match](obj) {
        return obj === null
    }
}

import match from "./sym.js"

// undef returns true if the obj matched against is undefined
export default {
    [match](obj) {
        return obj === undefined
    }
}

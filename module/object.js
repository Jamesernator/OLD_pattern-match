import match from "./sym.js"

export default {
    [match](value) {
        return typeof value === 'object'
            && value !== null
    }
}

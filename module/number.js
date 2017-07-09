import match from "./match.js"

export default {
    [match](value) {
        return typeof value === 'number'
    }
}

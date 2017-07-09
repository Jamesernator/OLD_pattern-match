import match from "./sym.js"
import isConstructor from "./#isConstructor.js"

export default {
    [match](value) {
        return isConstructor(value)
    }
}

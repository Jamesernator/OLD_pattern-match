import match from "./sym.js"
import isConstructor from "./#isConstructor.js"

export default function instance(constructor) {
    if (!isConstructor(constructor)) {
        throw new Error(`Expected a constructor`)
    }
    return {
        [match](value) {
            return value instanceof constructor
        }
    }
}

import match from "./sym.js"
import isConstructor from "./--isConstructor.js"

export default function instance(constructor) {
    if (!isConstructor(constructor)) {
        throw new Error(`Expected a constructor`)
    }
    return {
        [match](value) {
            if (value instanceof constructor) {
                return { matches: true }
            } else {
                return {
                    matches: false,
                    reasonTag: `instance`,
                    reason: `value not instanceof ${ constructor.name }`,
                }
            }
        },
    }
}

import match from "./sym.js"

const names = [
    'symbol',
    'object',
    'string',
    'number',
    'undefined',
    'boolean',
    'function',
]

export default function type(typeName) {
    if (!names.includes(typeName)) {
        throw new Error(`${ typeName } is not a valid typeof type`)
    }
    return {
        [match](value) {
            return typeof value === typeName
        }
    }
}

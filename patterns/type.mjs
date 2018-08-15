import match from "./sym.mjs"

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
            if (typeof value === typeName) {
                return { matches: true }
            } else {
                return {
                    matches: false,
                    reason: `typeof value is not ${ typeName }`,
                    reasonTag: `type`,
                }
            }
        },
    }
}

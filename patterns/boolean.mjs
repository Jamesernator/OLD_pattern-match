import match from "./sym.mjs"

export default {
    [match](value) {
        if (typeof value === 'boolean') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reasonTag: `boolean`,
                reason: `typeof value is not boolean`,
            }
        }
    },
}

import match from "./match.mjs"

export default {
    [match](value) {
        if (typeof value === 'number') {
            return { matches: true }
        } else {
            return {
                matches: false,
                reason: `typeof value is not number`,
                reasonTag: `number`,
            }
        }
    },
}

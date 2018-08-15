import match from "./match.js"

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

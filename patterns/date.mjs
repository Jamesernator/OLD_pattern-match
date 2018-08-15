import match from "./sym.mjs"

export default function date(item) {
    if (!(item instanceof Date)) {
        throw new Error(`Expected Date object as argument to date`)
    }
    return {
        [match](value) {
            if (!(value instanceof Date)) {
                return {
                    matches: false,
                    reasonTag: `date`,
                    reason: `value not instanceof Date`,
                }
            } else if (item.getTime() === value.getTime()) {
                return { matches: true }
            } else {
                return {
                    matches: false,
                    reasonTag: `date`,
                    reason: `value is not same time as ${ item.toString() }`,
                }
            }
        },
    }
}

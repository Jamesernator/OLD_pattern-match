import match from "./sym.js"

export default function date(item) {
    return {
        [match](value) {
            return value instanceof Date
                && item.getTime() === value.getTime()
        }
    }
}

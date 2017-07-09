import match from "./match.js"
import undef from "./undef.js"
import nil from "./nil.js"
import is from "./is.js"
import cond from "./cond.js"
import regex from "./regex.js"
import date from "./date.js"
import array from "./array.js"
import obj from "./obj.js"


// eslint-disable-next-line complexity
export default function resolve(item) {
    if (item === undefined) {
        return undef
    } else if (item === null) {
        return nil
    } else if (typeof item[match] === 'function') {
        return item
    } else if (typeof item === 'number') {
        return is(item)
    } else if (typeof item === 'string') {
        return is(item)
    } else if (typeof item === 'symbol') {
        return is(item)
    } else if (typeof item === 'boolean') {
        return is(item)
    } else if (typeof item === 'function') {
        return cond(item)
    } else if (item instanceof RegExp) {
        return regex(item)
    } else if (item instanceof Date) {
        return date(item)
    } else if (item instanceof Array) {
        return array(item)
    } else if ([Object.prototype, null].includes(Object.getPrototypeOf(item))) {
        return obj(item)
    } else {
        throw new Error(`Can't resolve object ${ item }`)
    }
}

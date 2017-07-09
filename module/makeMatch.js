import matchSymbol from "./sym.js"
import isMatch from "./isMatch.js"
import defaultResolve from "./resolve.js"
import matchOn from "./#matchOn.js"

export default function makeMatch(resolve=defaultResolve, baseMatch=null) {
    function match(...args) {
        if (args.length === 1) {
            return value => match(args[0], value)
        }
        const [pattern, target] = args
        const realPattern = resolve(pattern, baseMatch)
        return isMatch(realPattern, target, match).matches
    }

    match.resolve = resolve
    match[Symbol.toPrimitive] = _ => matchSymbol
    match.fork = r => makeMatch(r, baseMatch)
    match.on = value => matchOn(match, value)

    return match
}

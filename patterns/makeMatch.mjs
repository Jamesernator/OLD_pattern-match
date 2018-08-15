import matchSymbol from "./sym.mjs"
import matchDetails from "./--matchDetails.mjs"
import defaultResolve from "./resolve.mjs"
import matchOn from "./--matchOn.mjs"

export default function makeMatch(resolve=defaultResolve, baseMatch=null) {
    function match(...args) {
        if (args.length === 1) {
            return value => match(args[0], value)
        }
        const [pattern, target] = args
        const realPattern = resolve(pattern, baseMatch)
        return matchDetails(realPattern, target, match).matches
    }

    match.resolve = resolve
    match[Symbol.toPrimitive] = _ => matchSymbol
    match.fork = r => makeMatch(r, baseMatch)
    match.on = value => matchOn(match, value)
    match.details = function details(...args) {
        if (args.length === 1) {
            return value => details(args[0], value)
        }
        const [pattern, target] = args
        const realPattern = resolve(pattern, baseMatch)
        return matchDetails(realPattern, target, match)
    }

    return match
}

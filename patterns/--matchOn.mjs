import or from "./or.js"

function _matchOn(match, value, patterns=[]) {
    return {
        if(...args) {
            if (args.length < 2) {
                throw new Error(`Expected at least one pattern`)
            }
            const pattern = or(...args.slice(0, args.length - 1))
            const handler = args[args.length-1]
            if (typeof handler !== 'function') {
                throw new Error(`Expected a function as pattern handler`)
            }
            const newPatterns = [...patterns, [pattern, handler]]
            return _matchOn(match, value, newPatterns)
        },

        i(...args) {
            return this.if(...args)
        },

        else(elseHandler) {
            if (typeof elseHandler !== 'function') {
                throw new Error(`Expected function as input to else`)
            }
            for (const [pattern, handler] of patterns) {
                const { matches, value: matchValue } = match.details(
                    pattern,
                    value,
                )
                console.log(pattern, value, match.details(pattern, value))
                if (matches) {
                    return handler(matchValue)
                }
            }
            return elseHandler(value)
        },

        e(...args) {
            return this.else(...args)
        },

        value() {
            return this.else(_ => {
                throw new Error(`No pattern could be matched`)
            })
        },

        v(...args) {
            return this.value(...args)
        },
    }
}

export default function matchOn(match, value) {
    return _matchOn(match, value)
}

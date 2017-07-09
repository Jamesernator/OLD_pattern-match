import or from "./or.js"

function _matchOn(match, value, patterns) {
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
            return _matchOn(match, value, [...patterns, [pattern, handler]])

        },

        i(...args) {
            return this.if(...args)
        },

        else(elseHandler) {
            if (typeof elseHandler !== 'function') {
                throw new Error(`Expected function as input to else`)
            }
            for (const [pattern, handler] of patterns) {
                if (match(pattern, value)) {
                    return handler(value)
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
        }
    }
}

export default function matchOn(match, value) {
    return _matchOn(match, value, { patterns: [], elseSet: false })
}

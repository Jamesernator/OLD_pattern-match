import match from "./sym.js"

export default function cond(func, suppressErrors=false) {
    if (suppressErrors) {
        return {
            [match](value) {
                try {
                    if (func(value)) {
                        return { matches: true }
                    } else {
                        return {
                            matches: false,
                            reasonTag: `cond`,
                            reason: `condition function returned false on value`,
                        }
                    }
                } catch (error) {
                    return {
                        matches: false,
                        reasonTag: `cond`,
                        reason: [`condition function threw an error`, [
                            error instanceof Error
                                ? error.message
                                : error
                        ]]
                    }
                }
            }
        }
    } else {
        return {
            [match](value) {
                if (func(value)) {
                    return { matches: true }
                } else {
                    return {
                        matches: false,
                        reasonTag: `cond`,
                        reason: `condition function returned false on value`,
                    }
                }
            }
        }
    }
}

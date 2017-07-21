# Match

## Experiemental package designed for
## trying out semantics of [the pattern matching proposal](https://github.com/tc39/proposal-pattern-matching)

# Test a value matches a pattern

```js
import match, { string, number } from "@jx/match"

match([string, string, number], ['cats', 'hats', 2]) // true

match.on('fizz')
    .if(string, val => console.log("Got a string!")
    .else(_ => { throw new Error("Not a string") })
```

### Methods docs coming soon


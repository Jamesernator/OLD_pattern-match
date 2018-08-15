
export default function isConstructor(obj) {
    try {
        // eslint-disable-next-line new-parens
        const _ = new new Proxy(obj, {
            construct() {
                return {}
            },
        })
        return true
    } catch (err) {
        return false
    }
}

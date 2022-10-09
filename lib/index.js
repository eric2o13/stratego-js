const Ranks = require('./ranks')
Object.getOwnPropertyNames(Ranks).map(p => global[p] = Ranks[p])

const any       = f => pipe(map(f), reduce(or)(false))
const add       = o1 => o2 => ({...o1, x: o1.x + o2.x, y: o1.y + o2.y})
const addX      = o1 => o2 => ({...o1, x: o1.x + o2.x, y: o1.y})
const addY      = o1 => o2 => ({...o1, x: o1.x, y: o1.y + o2.y})
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
const all       = f => pipe(map(f), reduce(and)(true))
const and       = x => y => x && y
const apply     = fn => fn.apply()
const append    = x => xs => xs.concat(x)
const prepend   = x => xs => [ x, ...xs]
const concat    = xs => x => xs.concat(x)
const converge  = (converger, fns) => (...args) => converger(...fns.map(fn => fn.apply(null, args)))
const compose   = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const dropFirst = xs => xs.slice(1)
const dropX     = xs => x => xs.filter((o) => !equals(x)(o))
const duplicates= xs => xs.find((x) => xs.filter(equals(x)).length > 1)
const equals    = o1 => o2 => o1.x === o2.x && o1.y === o2.y
const every     = f => xs => xs.every(f) 
const isObject  = o => o != null && typeof o === 'object'
const notEquals = o1 => o2 => !equals(o1)(o2)
const isMove    = move1 => move2 => and(equals(move1.from)(move2.from))(equals(move1.to)(move2.to))
const someEqual = pos => pipe(some(equals(pos)))
const fn        = s => eval(s)
const last      = xs => xs[xs.length - 1]
const id        = x => x
const ifelse    = c => t => f => x => c(x) ? t(x) : f(x)
const inc       = n => n + 1
const index     = n => xs => xs[n]
const isTrue    = x => x === true 
const isFalse   = x => x === false
const k         = x => y => x
const key       = o => index(0)(Object.keys(o))
const map       = f => xs => xs.map(f)
const filter    = f => xs => xs.filter(f)
const find      = f => xs => xs.find((x) => f(x))
const first     = xs => xs.find(x => true)
const flat      = xs => xs.flat(1)
const gt        = a => b => a > b
const gte       = a => b => a >= b
const some      = f => xs => xs.some(f)
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
const filteri   = f => xs => xs.filter((x, i) => f(x)(i))
const merge     = o1 => o2 => Object.assign({}, o1, o2)
const not       = x => !x
const or        = x => y => x || y
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const reverse   = xs => xs.reverse()
const reduce    = f => z => xs => xs.reduce((acc, x) => f(acc)(x), z)
const prop      = k => o => o[k]
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const repeat    = c => n => map(k(c))(range(0)(n))
const takeUntil = f => xs => {
                    let idx = 0;
                    while (idx < xs.length && f(xs[idx])) { idx += 1 }
                    return xs.slice(0, idx + 1)
                  }
const takeWhile = f => xs => {
                    let idx = 0;
                    while (idx < xs.length && f(xs[idx])) { idx += 1 }
                    return xs.slice(0, idx)
                  }
const splitEvery = n => xs => {
                    let result = []; let idx = 0;
                    while (idx < xs.length){ 
                      result.push(xs.slice(idx, idx += n, xs))
                    }
                    return result 
                  }
const split     = x => s => s.split(x)
const unique    = xs => xs.filter((v, i, a) => a.indexOf(v) === i);



module.exports = {
    any,
    add,
    addX,
    addY,
    adjust,
    all,
    and,
    append,
    apply,
    concat,
    converge,
    compose,
    dropFirst,
    dropX,
    duplicates,
    equals,
    every,
    isObject,
    notEquals,
    isMove,
    someEqual,
    fn,
    last,
    id,
    ifelse,
    inc,
    index,
    isTrue,
    isFalse,
    k,
    key,
    map,
    filter,
    find,
    first,
    flat,
    gt,
    gte,
    some,
    mapi,
    filteri,
    merge,
    not,
    or,
    pipe,
    reverse,
    reduce,
    prepend,
    prop,
    range,
    repeat,
    takeUntil,
    takeWhile,
    split,
    splitEvery,
    unique
}
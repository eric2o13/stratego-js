const lib = require('../lib')
Object.getOwnPropertyNames(lib).map(p => global[p] = lib[p])

//Game play

//Special Pieces
const isBomb        = piece => piece.rank === 200
const isFlag        = piece => piece.rank === 0
const isScout       = piece => piece.rank === 20
const isMiner       = piece => piece.rank === 30
const isMarshal     = piece => piece.rank === 100
const isSpy         = piece => piece.rank === 10
const moveablePiece = piece => !isBomb(piece) && !isFlag(piece)

//Directions
const north     = () => ({ x: 0, y:-1 })
const south     = () => ({ x: 0, y: 1 })
const east      = () => ({ x: 1, y: 0 })
const west      = () => ({ x:-1, y: 0 })

//Active player / pieces
const players = state => [state.red, state.blue]
const pieces = state => [state.red.pieces, state.blue.pieces]
const activePlayer = pipe(
    ifelse(prop('redToMove'))(prop('red'))(prop('blue'))
)
const activePieces = compose(prop('pieces'), activePlayer)
const nonActivePieces = compose(
    prop('pieces'),
    ifelse(prop('redToMove'))(prop('blue'))(prop('red'))
)
const activeColor = state => state.redToMove ? 'red' : 'blue'
const nonActiveColor = state => state.redToMove ? 'blue' : 'red'

//Converting pieces into array and  back.
const pairKeyObject = o => xs =>
     xs.map(c => o[c].length ? o[c].map((x) => [c, x]): [[c]])

const piecesToArray = o =>  pipe(
    Object.keys,
    pairKeyObject(o),
    flat
)(o)
const arrayToPieces = xsxs => xsxs.reduce((sum, value) => {
    if (!sum[value[0]]) {
        sum[value[0]] = []
    }
    if (value[1]) {
        sum[value[0]].push(value[1])
    }
    return sum
}, {})


//Moving Pieces
const dropPos = pos => xsxs => 
    xsxs.map(xs => xs.filter((o) => !equals(pos)(o)))
const dropPosition = pos => pipe(
    piecesToArray,
    dropPos(pos),
    arrayToPieces
)
const addPosition = pos => name => pipe(
    piecesToArray,
    append([[name,pos]]),
    arrayToPieces
)
const takePieceList = f => xsxs => xsxs.find((xs) => f(xs[1]))
const listToObjectReducer  = sum => value => {
    (typeof value === 'string') ?
    sum[value] = value : sum[key(sum)] = value
    return sum
}
// @returns { general: [ { x: 0, y: 6 } ] }
const activePieceOnPosition = pos => pipe(
    activePieces,
    Object.entries,
    takePieceList(someEqual(pos)),
    reduce(listToObjectReducer)({})
)

//@param Pieces
const pieceOnPosition = pos => pipe(
    Object.entries,
    takePieceList(someEqual(pos)),
    reduce(listToObjectReducer)({})
)

const movePiece = from => to => name => pipe(
    addPosition(to)(name),
    dropPosition(from),
) 

const positionsFromPieces = pipe(
    Object.entries,
    map(prop(1)),
    flat
)
//@ returns {pos} | undefined
const clashed = pipe(
    pieces,
    map(positionsFromPieces),
    flat,
    duplicates
)

//@returns // ['bomb', 'marshal'] | ['scout'] if both pieces are of similar rank
const clashingPieces = state => pipe(
    pieces,
    map(pieceOnPosition(clashed(state))),
    map(Object.keys),
    flat,
    unique
)(state)

const attackerIsSpy = pos => pipe(
    nonActivePieces,
    pieceOnPosition(pos),
    key,
    fn,
    apply,
    isSpy
)

//Illegal positions
const withinX       = pos => state =>  pos.x >= 0 && pos.x < state.cols
const withinY       = pos => state =>  pos.y >= 0 && pos.y < state.rows
const isBlocked     = pos => pipe(prop('blocked'), some(equals(pos)))
const isOccupied    = pos => state => any(isTrue)([
    someEqual(pos)(positionsFromPieces(state.red.pieces)),
    someEqual(pos)(positionsFromPieces(state.blue.pieces)),
    someEqual(pos)(state.blocked)
])
const isOwnColor     = pos => pieces => pipe(
    positionsFromPieces,
    someEqual(pos)
)(pieces)
const legitPosition = pos => pieces => state => all(isTrue)([
    withinX(pos)(state),
    withinY(pos)(state),
    !isBlocked(pos)(state),
    !isOwnColor(pos)(pieces)
])


//Potential positions for scouts
const filterRow = n => f => pipe(
    prop('cols'),
    repeat(''),
    mapi(v => i => ({x:i, y: n})),
    filter(f)
)
const filterColumn = n => f => pipe(
    prop('rows'),
    repeat(''),
    mapi(v => i => ({x:n, y: i})),
    filter(f)
)
const northPositions = move => pipe(
    filterColumn(move.from.x)((p) => gte(move.to.y)(p.y)),
    reverse
)
const southPositions = move => pipe(
    filterColumn(move.from.x)((p) => move.to.y <= p.y)
)
const eastPositions = move => pipe(
    filterRow(move.from.y)((p) => move.to.x <= p.x)
)
const westPositions = move => pipe(
    filterRow(move.from.y)((p) => move.to.x >= p.x),
    reverse
)

//Moves
const move = {from, to} = compose(first, prop('moves'))
const lastMove = {from, to} = compose(first, prop('lastMoves'))
const noMoves = state => !state.moves.length > 0

//Available & valid moves
const availableMoves = direction => pos => pieces => state => {

    const pieceList = pieceOnPosition(pos)(pieces)
    const piece = compose(apply, fn, key)(pieceList)

    if (!moveablePiece(piece)) {
        return []
    }
    
    const move = { from: pos, to: add(pos)(direction())}
    const positions = equals(direction())(north()) ? 
        northPositions(move)(state) : equals(direction())(south()) ?
            southPositions(move)(state) : equals(direction())(east()) ? 
                eastPositions(move)(state) : 
                    westPositions(move)(state) 

    return !isScout(piece) ? [ move ] :
        [...takeUntil((x) => !isOccupied(x)(state))(positions)
            .map( x => ({ from: pos, to: x }))
            .filter((x) => !isOwnColor(x.from)(x.to))]
}

/**
 * Get the available moves for a specific piece
 * on a specific position. 
 * @example availableMovesForPosition(Red.pieces)(state)({x: 0, y: 3})
 * @return [{from: pos, to: pos}]
 */
const availableMovesForPosition = pieces => state => pos => 
    [
        ...availableMoves(north)(pos)(pieces)(state),
        ...availableMoves(south)(pos)(pieces)(state),
        ...availableMoves(east)(pos)(pieces)(state),
        ...availableMoves(west)(pos)(pieces)(state),
    ]
    .filter((m) => legitPosition(m.to)(pieces)(state))
    .filter((move) => !nonRepeatableMove(
        getColorFromPieces(pieces)(state)
    )(move)(state)
    
    )

/**
 * @example availableMovesForPieces(Red.pieces)(state)  
 * @return [{from: pos, to: pos}]
 * @see Game.moves
*/   
const availableMovesForPieces = pieces => state => pipe(
    positionsFromPieces,
    map(availableMovesForPosition(pieces)(state)),
    flat
)(pieces)
const moves = state => pieces => pipe(
    positionsFromPieces,
    map(availableMovesForPosition(pieces)(state)),
    flat
)(pieces)

const moveIsValid = move => pieces => pipe(
    availableMovesForPieces(pieces),
    some(isMove(move))
)

const movesForActivePlayer = state => compose(
    moves(state),
    activePieces
)(state)

const movesForNonActivePlayer = state => compose(
    moves(state),
    nonActivePieces
)(state)

const nextPossibleMoves = state => color => pipe(
    prop(color),
    prop('pieces'),
    moves(state)
)(state)

//Repeating moves
const isBackAndForth = xs => 
    xs[0] && xs[1] && 
        all(isTrue)([
            equals(xs[0].from)(xs[1].to),
            equals(xs[1].to)(xs[0].from)
        ])  

const redFlag = pipe(
    prop('red'),
    prop('pieces'),
    prop('flag'),
    first
)
//Quick & dirty. Try avoid using.
const getColorFromPieces = pieces => state =>
    equals(first(pieces.flag))(redFlag(state)) ? 
        'red' : 'blue'

const nonRepeatableMove = color => move => state => pipe(
    prop('lastMoves'),
    filteri(x => i => i < 8),
    filter(x => x[0] === color),
    map(prop(1)),
    splitEvery(2),
    takeWhile(isBackAndForth),
    takeWhile(some(isMove(move))),
    flat,
    some(isMove(move))
)(state)

//Next pieces
const nextRedPieces = state =>
    noMoves(state) || !state.redToMove ?
        state.red.pieces : nextPieces('red')(state)

const nextBluePieces = state => 
    noMoves(state) || state.redToMove ?
        state.blue.pieces : nextPieces('blue')(state)

const nextPieces = color => state => {
    const {from, to} =  move(state)
    const name = compose(key, activePieceOnPosition(from))
    const pieces = pipe(prop(color), prop('pieces'))(state)
    return merge(pieces)(movePiece(from)(to)(name(state))(activePieces(state)))
}
const dropRedPiece = pos => compose(dropPosition(pos),nextRedPieces)
const dropBluePiece = pos => compose(dropPosition(pos),nextBluePieces)

const dropRedPieceFromPosition = pos => state => ({
    ...state,
    red: { ...state.red, pieces: dropRedPiece(pos)(state) },
    blue: { ...state.blue, pieces: nextBluePieces(state) },    
})
const dropBluePieceFromPosition = pos => state => ({
    ...state,
    red: { ...state.red, pieces: nextRedPieces(state) },
    blue: { ...state.blue, pieces: dropBluePiece(pos)(state) },    
})
const dropBothPiecesFromPosition = pos => state => ({
    ...state,
    red: { ...state.red, pieces: dropRedPiece(pos)(state) },
    blue: {...state.blue, pieces: dropBluePiece(pos)(state) },    
})

//Next positions
const nextRedPositions = compose(
    positionsFromPieces,
    prop('pieces'),
    prop('red')
)
const nextBluePositions = compose(
    positionsFromPieces, 
    prop('pieces'),
    prop('blue')
)

//Next dead pieces
const getPieceCount = pieces => {
    let o = {}
    Object.keys(pieces).forEach((c) => {
        o[c] = pieces[c].length
    })
    return o
}
const pieceCountDifference = o1 => o2 => {
    let o = {}
    Object.keys(o1).forEach((c) => {
        o[c] = o1[c] - o2[c]
    })
    return o
}
const nextRedDeadPieces = state => 
     pieceCountDifference(
        getPieceCount(State.initialState().red.pieces)
    )(getPieceCount(state.red.pieces))

const nextBlueDeadPieces = state => 
    pieceCountDifference(
        getPieceCount(State.initialState().blue.pieces)
    )(getPieceCount(state.blue.pieces))



module.exports  = {
    //Special Pieces
    isBomb,
    isFlag,
    isScout,
    isMiner,
    isMarshal,
    isSpy,
    moveablePiece,

    // directions
    north,
    south,
    east,
    west,

    //Active player / pieces
    players,
    pieces,
    activePlayer,
    activePieces,
    nonActivePieces,
    activeColor,
    nonActiveColor,

    //Converting pieces into array and  back.
    pairKeyObject,
    piecesToArray,
    arrayToPieces,
    
    //Moving Pieces
    dropPos,
    dropPosition,
    addPosition,
    takePieceList,
    listToObjectReducer,
    activePieceOnPosition,
    pieceOnPosition,
    movePiece,
    positionsFromPieces,
    clashed,
    clashingPieces,
    attackerIsSpy,

    //Illegal positions
    withinX,
    withinY,
    isBlocked,
    isOccupied,
    isOwnColor,
    legitPosition,
    
    //Moves
    move,
    moves,
    lastMove,
    noMoves,
    availableMoves,
    movesForActivePlayer,
    movesForNonActivePlayer,
    nextPossibleMoves,

    //Potential positions for scouts
    filterRow,
    filterColumn,
    northPositions,
    southPositions,
    eastPositions,
    westPositions,

    //Available & valid moves
    availableMovesForPosition,
    availableMovesForPieces,
    moveIsValid,

    //Next Pieces
    nextRedPieces,
    nextBluePieces,
    nextPieces,
    dropRedPiece,
    dropBluePiece,
    dropRedPieceFromPosition,
    dropBluePieceFromPosition,
    dropBothPiecesFromPosition,

    //Next positions
    nextRedPositions,
    nextBluePositions,

    //Next dead pieces
    getPieceCount,
    pieceCountDifference,
    nextRedDeadPieces,
    nextBlueDeadPieces
}


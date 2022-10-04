const lib = require('./lib')
Object.getOwnPropertyNames(lib).map(p => global[p] = lib[p])

const game = require('./game')
Object.getOwnPropertyNames(game).map(p => global[p] = game[p])

const Blue = {}
Blue.positions = []
Blue.pieces = {
    flag: [ { x: 0, y: 0}],
    bomb: [ {x: 9, y: 2}, {x: 1, y: 1}, {x: 1, y: 2},
            {x: 8, y: 3}, {x: 7, y: 0}, {x: 7, y: 1}],//6
    miner: [{x: 2, y: 0}, {x: 6, y: 0}, {x: 5, y: 0},
            {x: 7,y: 3}, {x: 7,y: 2}],//5
    scout: [{x: 2, y:3}, {x: 3, y:3}, {x: 0, y: 1}, {x: 0, y: 3},
            {x: 2, y:1}, {x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1}],//8
    general: [{x: 9, y: 3}],
    spy: [{x: 1, y: 3}],
    marshal: [{x: 0, y: 2}],
    colonel: [{x: 8, y: 0}, {x: 6, y: 1}],//2
    major: [{x: 9, y: 0}, {x: 2, y: 2}, {x: 3, y: 2}],//3
    captain: [{x: 9, y: 1}, {x: 6,y: 2}, {x: 5,y: 2}, {x: 4,y: 2}],//4
    lieutenant: [{x: 8, y: 1},{x: 6,y: 3}, {x: 5,y: 3}, {x: 4,y: 3} ],//4
    sergeant: [{x:8, y: 2}, {x: 1, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}]//4
}
Blue.deadPieces = {}
Blue.visiblePieces = []
Blue.moves = []

const Red = {}
Red.positions = []
Red.pieces = {
    flag: [ {x: 0, y: 9}],//1
    bomb: [{x: 1, y: 8},{x: 2, y: 8}, {x: 3, y: 8},
           {x: 4, y: 8},{x: 5, y: 8}, {x: 6, y: 8}],//6
    miner: [{x: 3, y:6}, {x: 1, y: 9}, {x: 2, y: 9},
            {x: 4, y:6}, {x: 5, y: 6}], //5
    scout: [{x: 1, y: 6}, { x: 0, y: 7}, { x: 1, y: 7}, { x: 2, y: 7},
            {x: 3, y: 7}, { x: 4, y: 7}, { x: 5, y: 7}, { x: 6, y: 7}],//8
    general: [{ x: 0, y: 8}], //1
    spy: [{x: 2, y: 6}],//1
    marshal: [{x: 0, y: 6}],//1
    colonel: [{x: 8, y: 9}, {x: 7, y: 6}], //2
    major: [{x: 9, y: 9},{x: 6, y: 6}, {x:7, y: 7}],//3
    captain: [{x: 9, y: 8}, {x:7, y: 9}, {x:6, y: 9}, {x:7, y:8}],//4
    lieutenant: [{x: 8, y: 8}, {x:3,y: 9}, {x:4,y: 9}, {x:5,y: 9}],//4
    sergeant: [{x: 8, y: 7 }, {x: 9, y: 7 }, {x: 9, y: 6 }, {x: 8, y: 6 }]//4

}
Red.deadPieces = {}
Red.visiblePieces = []
Red.moves = []

State = {}
State.initialState = () => ({
    cols: 10,
    rows: 10,
    blocked: [
        {x: 2, y: 4},{x: 2, y: 5},
        {x: 3, y: 4},{x: 3, y: 5},
        {x: 6, y: 4},{x: 6, y: 5},
        {x: 7, y: 4},{x: 7, y: 5},
    ],
    red: Red,
    blue: Blue,    
    moves: [],    
    lastMoves: [], 
    redToMove: true,
    winner: null, //null | red | blue,
    winningMove: null //
})


const pos   = pipe(clashed)
const red   = pipe(clashingPieces, first)
const blue  = pipe(clashingPieces, reverse, first)
const ranks = compose(map(apply),map(fn))
const plays = xs => xs.length > 0


State.nextPotentialEnd = state => 
    !plays(movesForActivePlayer(state)) ? 
        merge(state)({
            ...state,
            winner: nonActiveColor(state),
            winningMove: 'Opposing player ran out of moves'
        }) : 
    !plays(movesForNonActivePlayer(state)) ?
        merge(state)({
            ...state,
            winner: activeColor(state)   ,
            winningMove: 'Opposing player ran out of moves'
        }) :
        state
State.nextPossibleMoves = state => merge(state)({
    ...state,
    red: {...state.red, moves: nextPossibleMoves(state)('red')},
    blue: {...state.blue, moves: nextPossibleMoves(state)('blue')},    
})
State.nextPositions = state =>merge(state)({
    ...state,
    red: {...state.red, positions: nextRedPositions(state)},
    blue: {...state.blue, positions: nextBluePositions(state)},
})
State.nextMove = state => 
    noMoves(state) ? state :
        merge(state)({
        ...state,
        red: { 
            ...state.red,
            pieces: nextRedPieces(state),
        },
        blue: {
            ...state.blue,
            pieces: nextBluePieces(state),
        },    
        moves: dropFirst(state.moves),
        lastMoves: prepend([
            activeColor(state),
            move(state)
        ])(state.lastMoves),
        redToMove: !state.redToMove,
})
State.nextVisiblePieces = state => 
    !clashed(state) ? state :
    merge(state)({
        ...state,
        red: { 
            ...state.red,
            visiblePieces: [
            ...state.red.visiblePieces, 
            ...[[red(state), pos(state)]]],
        },
        blue: {
            ...state.blue,
            visiblePieces: [
            ...state.blue.visiblePieces,
            ...[[blue(state), pos(state)]]],
        },    
    })
State.nextClash = state => {

    if (!clashed(state)) {
        return state
    }

    if (some(isFlag)(ranks([red(state), blue(state)]))) {
        return merge(state)({
            ...state,
            winner: lastMove(state)[0],
            winningMove: lastMove(state)[1] 
        })
    }

    const pos = clashed(state)

    if (clashingPieces(state).length === 1) {
        return merge(state)(dropBothPiecesFromPosition(pos)(state))
    }

    const pieces = [redPiece, bluePiece] = ranks([red(state), blue(state)])

    if (some(isBomb)(pieces) && some(isMiner)(pieces)) {
        return merge(state)(
            gt(redPiece.rank)(bluePiece.rank) ? 
            dropRedPieceFromPosition(pos)(state):
            dropBluePieceFromPosition(pos)(state)
        )
    }

    if (some(isSpy)(pieces) && some(isMarshal)(pieces)) {
        const dropSpy = isSpy(bluePiece) ?
            dropBluePieceFromPosition(pos)(state):
            dropRedPieceFromPosition(pos)(state)

        const dropMarshal = isMarshal(bluePiece) ? 
            dropBluePieceFromPosition(pos)(state): 
            dropRedPieceFromPosition(pos)(state) 
        
        return merge(state)(
            attackerIsSpy(pos)(state) ?
            dropMarshal: dropSpy
        )
    }

    return merge(state)(
        gt(redPiece.rank)(bluePiece.rank) ? 
        dropBluePieceFromPosition(pos)(state):
        dropRedPieceFromPosition(pos)(state)
    )
}
State.nextDeadPieces = state => merge(state)({
    ...state,
    red: {...state.red, deadPieces: nextRedDeadPieces(state)},
    blue: {...state.blue, deadPieces: nextBlueDeadPieces(state)},    
})
State.next = pipe(
    State.nextPotentialEnd,
    State.nextPossibleMoves,
    State.nextPositions,
    State.nextMove,
    State.nextVisiblePieces,
    State.nextClash,
    State.nextDeadPieces,
)
 

State.enqueue = (state, move) => {

    const color         = state.redToMove ? 'red' : 'blue'
    const pieces        = state[color].pieces
    const valid         = pipe(availableMovesForPieces(pieces),
                          find(isMove(move)))

    if (!valid(state)) {
        return state    
    }

    state.moves = [...state.moves, move]

}

State.debug = (state, spaces = 4) => {
    const lastMoves = state.lastMoves.filter((x, i) => i < 9)
    return JSON.stringify({...state, lastMoves}, null, spaces)
}


module.exports = exports = new Proxy(State, {
    apply: (target, thisArg, args) => new State(...args),
})

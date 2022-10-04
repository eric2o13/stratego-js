const State = require('./state')
/**
 * Special pieces
 *
 * flag             ◈  Game is lost when captured.
 * bomb             ⊗  Can only lose to miners.
 * scout            ♜  Can jump over empty spaces     
 * marshal          ⓜ Outranks all pieces, but can be captured by spy
 * miner            ⚒  Can disable bombs
 * spy              ⚉  Can capture Marshal, but only when attacking
 * 
 * Regular pieces
 * 
 * general         9
 * colonel         8
 * major           7 
 * captain         6
 * lieutenant      5
 * sergeant        4
 */
 const Matrix = require('./matrix')

//AIs
const A = require('./example-ai')
const B = require('./basic-ai')

//Assign colors to AI's
const isRed = Math.random() > 0.5
const RED   = isRed ? A : B
const BLUE  = isRed ? B : A
const Red   = state => Object.freeze({
    ...state,
    color: 'red',
    blue: {
        ...state.blue,
        pieces: {},
        moves: []
    }
})
const Blue  = state => Object.freeze({
    ...state,
    color: 'blue',
    red: {
        ...state.red,
        pieces: {},
        moves: []
    }
})


let state = State.initialState()
    state = State.next(state)


const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(state)))
const step = () => {

    if (state.winner) {
        const AI = state.winner === 'red' ? RED.name : BLUE.name     
        console.log('winning move:')
        console.log(state.winningMove)   
        console.log(`${AI} won the game with the ${state.winner} pieces.`)
        console.log('Current state')
        console.log(State.debug(state))
        throw 'Game over.'
    }

    let move = state.redToMove ? 
        RED.playMove(Red(state)) :
        BLUE.playMove(Blue(state))

    State.enqueue(state, move)
    state = State.next(state)

}

const ms = 100 //Increase if it's too fast
show()
setInterval(() => { step(); show()},ms)
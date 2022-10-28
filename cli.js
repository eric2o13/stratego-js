const State = require('./internal/state')
const Matrix = require('./lib/matrix')

const A = require('./ai/example-ai')
const B = require('./ai/basic-ai')

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

const readline = require('readline')
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log('blue state')
    console.log(State.debug(Blue(state),0))
    console.log('red state')
    console.log(State.debug(Red(state),0))
    process.exit()
}
});

const ms = 10
show()
setInterval(() => { step(); show()},ms)
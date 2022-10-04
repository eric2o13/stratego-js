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

//Mock AI's
const getRandomInt = max => Math.floor(Math.random() * max)

const A = {
    name: 'Algorithm A',
    playMove(state) {

        /**
         * Implement your algorithm here.
         * Some important variables that are available to you:
         */
        
        const opponent = state.color === 'red' ? 'blue' : 'red'
        //Available / valid moves you are allowed to play
        const availableMoves = state[state.color].moves
        //The matrix the AI is able to see
        const matrix = Matrix.toString(Matrix.fromColor(state.color)(state))
        //Your pieces
        const pieces = state[state.color].pieces
        //Pieces of your opponent that were once visible
        const visiblePieces = state[opponent].visiblePieces
        //Positions of your opponent's pieces
        const opposingPositions = state[opponent].positions
        //Last moves (made by both players)
        const lastMoves = state.lastMoves
        //Readable & copieable state with a max of 10 lastMoves (for debugging).
        const debugState = State.debug(state) 
        //Less readable but more compact state (for debugging)
        const compactState = State.debug(state,0)
        //Ranks of all the pieces
        const Rank = require('./ranks')
        //Get the rank of a single piece
        const marshal = Rank.marshal()
        const bomb = Rank.bomb() 
        
        //Debugging / Displaying matrix 
        /*
        if (state.lastMoves.length > 0) {
            console.log(visiblePieces)
            console.log(matrix)
            console.log('The last moves: ')
            state.lastMoves.forEach((x) => {
                console.log(x)
            })

            //Use 'throw' for stopping script
            throw 'debug mode for player'
        }
        */
    

        //Play a random move
        const randomInt = getRandomInt(availableMoves.length)   
        return availableMoves[randomInt]

        //Or, play the first available move
        return availableMoves[0]
    }
}

const B = {
    name: 'Algorithm B',
    playMove(state) {
        const randomInt = getRandomInt(state[state.color].moves.length)   
        return state[state.color].moves[randomInt]
    }
}

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
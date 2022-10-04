const Matrix = require('./matrix')

const name = 'Example Algorithm'
const playMove = state => {

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
    if (state.lastMoves.length > 20) {
        // console.log(visiblePieces)
        // console.log(matrix)
        // console.log('The last moves: ')
        // state.lastMoves.forEach((x) => {
        //     console.log(x)
        // })

        //Use 'throw' for stopping script
        throw 'debug mode for player'
    }
    */

    /**
     * @example: Play a random move
     */
    const getRandomInt = max => Math.floor(Math.random() * max)
    const randomInt = getRandomInt(availableMoves.length)   
    return availableMoves[randomInt]

    /**
     * @example: Play the first possible move
     */
     return state[state.color].moves[0]
}


module.exports = {
    name,
    playMove
}


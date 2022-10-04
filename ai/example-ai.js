/** 
 * Important information about pieces and gameplay.
 * 
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

//Matrix, for visualizing the current state
const Matrix = require('../lib/matrix')

// Ranks of all the pieces
const Rank = require('../lib/ranks')

//The name of your AI
const name = 'Example Algorithm'

//Return the move you want to play
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
    //Get the rank of a single piece
    const marshal = Rank.marshal()
    const bomb = Rank.bomb() 
    
    // Debugging / Displaying matrix 
    /* Uncomment for debug mode after x moves
    if (state.lastMoves.length > 20) {
        // console.log(visiblePieces)
        // console.log(matrix)
        // console.log('The last moves: ')
        // state.lastMoves.forEach((x) => {
        //     console.log(x)
        // })

        //Use 'throw' for stopping script
        throw 'debug mode for player'
    }*/

    /**
     * @param {from: {x: int, y: int}, to: {x: int, y: int}} move
     * @example: Play a random move
     */
    const getRandomInt = max => Math.floor(Math.random() * max)
    const randomInt = getRandomInt(availableMoves.length)   
    return availableMoves[randomInt]

    /**
     * @param {from: {x: int, y: int}, to: {x: int, y: int}} move
     * @example: Play the first possible move
     */
     return state[state.color].moves[0]
}


module.exports = {
    name,
    playMove
}


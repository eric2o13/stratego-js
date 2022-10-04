const Matrix = require('./matrix')

const name = 'Most Basic Algorithm'
const playMove = state => {
    //Play the first available move
    return state[state.color].moves[0]
}

module.exports = {
    name,
    playMove
}


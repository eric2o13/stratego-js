const AI = require('../secret/evaluate')

const name = 'Erics Algorithm'
const playMove = state => AI.playMove(state)

module.exports = {
    name,
    playMove
}


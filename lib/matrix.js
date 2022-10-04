
const Color = {}
Color.black   = s => `\x1b[30m${s}\x1b[0m`
Color.red     = s => `\x1b[31m${s}\x1b[0m`
Color.green   = s => `\x1b[32m${s}\x1b[0m`
Color.yellow  = s => `\x1b[33m${s}\x1b[0m`
Color.blue    = s => `\x1b[34m${s}\x1b[0m`
Color.magenta = s => `\x1b[35m${s}\x1b[0m`
Color.cyan    = s => `\x1b[36m${s}\x1b[0m`
Color.white   = s => `\x1b[37m${s}\x1b[0m`

const Bg = {}
Bg.red = s => `\u001b[41m${s}\u001b[0m`
Bg.blue = s => `\u001b[44m${s}\u001b[0m`

const Matrix        = {}
Matrix.make         = state => repeat(repeat('.')(state.cols))(state.rows)
Matrix.set          = val => pos => adjust(pos.y)(adjust(pos.x)(k(val)))
Matrix.toString     = xsxs => xsxs.map(xs => xs.join('  ')).join('\r\n')
Matrix.addBlocked   = state => pipe(...map(Matrix.set('#'))(state.blocked))

Matrix.addBlueFlag  = state => pipe(...map(Matrix.set(Color.blue('◈')))(state.blue.pieces.flag))
Matrix.addRedFlag = state => pipe(...map(Matrix.set(Color.red('◈')))(state.red.pieces.flag))
Matrix.addBlueBombs = state => pipe(...map(Matrix.set(Color.blue('⊗')))(state.blue.pieces.bomb))
Matrix.addRedBombs = state => pipe(...map(Matrix.set(Color.red('⊗')))(state.red.pieces.bomb))
Matrix.addBlueScouts = state => pipe(...map(Matrix.set(Color.blue('♜')))(state.blue.pieces.scout))
Matrix.addRedScouts = state => pipe(...map(Matrix.set(Color.red('♜')))(state.red.pieces.scout))
Matrix.addBlueGenerals = state => pipe(...map(Matrix.set(Bg.blue('9')))(state.blue.pieces.general))
Matrix.addRedGenerals = state => pipe(...map(Matrix.set(Bg.red('9')))(state.red.pieces.general))
Matrix.addBlueMiners = state => pipe(...map(Matrix.set(Color.blue('⚒')))(state.blue.pieces.miner))
Matrix.addRedMiners = state => pipe(...map(Matrix.set(Color.red('⚒')))(state.red.pieces.miner))
Matrix.addBlueSpies = state => pipe(...map(Matrix.set(Color.blue('⚉')))(state.blue.pieces.spy))
Matrix.addRedSpies = state => pipe(...map(Matrix.set(Color.red('⚉')))(state.red.pieces.spy))
Matrix.addBlueMarshals = state => pipe(...map(Matrix.set(Color.blue('ⓜ')))(state.blue.pieces.marshal))
Matrix.addRedMarshals = state => pipe(...map(Matrix.set(Color.red('ⓜ')))(state.red.pieces.marshal))
Matrix.addBlueColonels = state => pipe(...map(Matrix.set(Color.blue('8')))(state.blue.pieces.colonel))
Matrix.addRedColonels = state => pipe(...map(Matrix.set(Color.red('8')))(state.red.pieces.colonel))
Matrix.addBlueMajors = state => pipe(...map(Matrix.set(Color.blue('7')))(state.blue.pieces.major))
Matrix.addRedMajors = state => pipe(...map(Matrix.set(Color.red('7')))(state.red.pieces.major))
Matrix.addBlueCaptains = state => pipe(...map(Matrix.set(Color.blue('6')))(state.blue.pieces.captain))
Matrix.addRedCaptains = state => pipe(...map(Matrix.set(Color.red('6')))(state.red.pieces.captain))
Matrix.addBlueLieutenants = state => pipe(...map(Matrix.set(Color.blue('5')))(state.blue.pieces.lieutenant))
Matrix.addRedLieutenants = state => pipe(...map(Matrix.set(Color.red('5')))(state.red.pieces.lieutenant))
Matrix.addBlueSergeants = state => pipe(...map(Matrix.set(Color.blue('4')))(state.blue.pieces.sergeant))
Matrix.addRedSergeants = state => pipe(...map(Matrix.set(Color.red('4')))(state.red.pieces.sergeant))
Matrix.addBluePositions = state => pipe(...map(Matrix.set(Color.blue('X')))(state.blue.positions))
Matrix.addRedPositions = state => pipe(...map(Matrix.set(Color.red('X')))(state.red.positions))


Matrix.fromState = state => pipe(
    Matrix.make,
    Matrix.addBlocked(state),
    Matrix.addBlueFlag(state),
    Matrix.addRedFlag(state),
    Matrix.addBlueBombs(state),
    Matrix.addRedBombs(state),
    Matrix.addBlueScouts(state),
    Matrix.addRedScouts(state),
    Matrix.addBlueGenerals(state),
    Matrix.addRedGenerals(state),
    Matrix.addBlueMiners(state),
    Matrix.addRedMiners(state),
    Matrix.addBlueSpies(state),
    Matrix.addRedSpies(state),
    Matrix.addBlueMarshals(state),
    Matrix.addRedMarshals(state),
    Matrix.addBlueColonels(state),
    Matrix.addRedColonels(state),
    Matrix.addBlueMajors(state),
    Matrix.addRedMajors(state),
    Matrix.addBlueCaptains(state),
    Matrix.addRedCaptains(state),
    Matrix.addBlueLieutenants(state),
    Matrix.addRedLieutenants(state),
    Matrix.addBlueSergeants(state),
    Matrix.addRedSergeants(state),
  )(state)


Matrix.fromColor = color => state =>
    color === 'red' ? 
    pipe(
        Matrix.make,
        Matrix.addBlocked(state),
        Matrix.addRedFlag(state),
        Matrix.addRedBombs(state),
        Matrix.addRedScouts(state),
        Matrix.addRedGenerals(state),
        Matrix.addRedMiners(state),
        Matrix.addRedSpies(state),
        Matrix.addRedMarshals(state),
        Matrix.addRedColonels(state),
        Matrix.addRedMajors(state),
        Matrix.addRedCaptains(state),
        Matrix.addRedLieutenants(state),
        Matrix.addRedSergeants(state),
        Matrix.addBluePositions(state),
    )(state):
    pipe(
        Matrix.make,
        Matrix.addBlocked(state),
        Matrix.addBlueFlag(state),
        Matrix.addBlueBombs(state),
        Matrix.addBlueScouts(state),
        Matrix.addBlueGenerals(state),
        Matrix.addBlueMiners(state),
        Matrix.addBlueSpies(state),
        Matrix.addBlueMarshals(state),
        Matrix.addBlueColonels(state),
        Matrix.addBlueMajors(state),
        Matrix.addBlueCaptains(state),
        Matrix.addBlueLieutenants(state),
        Matrix.addBlueSergeants(state),
        Matrix.addRedPositions(state),
    )(state)

module.exports = Matrix
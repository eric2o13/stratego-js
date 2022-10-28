const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let state = State.initialState()
    state = State.next(state)

const x = c => Math.round(c * canvas.width / state.cols) 
const y = r => Math.round(r * canvas.height / state.rows)

const board = ctx => {

  const cellWidth = canvas.width / state.cols
  const cellHeight = canvas.height / state.rows
  const yAxis = Array(state.cols).fill('').map((x,i) => cellHeight * i)
  const xAxis = Array(state.rows).fill('').map((x,i) => cellWidth * i)

  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#333'
  yAxis.forEach(x => {
    ctx.fillRect(0, x, canvas.width, 1)
  })

  xAxis.forEach(y => {
    ctx.fillRect(y, 0, 1, canvas.height)
  })

  return ctx
  
} 

const piece = color => name => X => Y => ctx => {
  
  const a = X + 0.1
  const b = 1 - 0.2
  const c = 1 - 0.2

  ctx.fillStyle = color
  ctx.fillRect(x(a), y(Y), x(b), y(c))

  const d = X + 0.2 
  const e = Y + 0.3
  
  ctx.fillStyle = 'white'
  ctx.font = "12px Arial";
  ctx.fillText(name, x(d), y(e))

  return ctx

}

const blocked = X => Y => ctx => {
  ctx.fillStyle = '#333'
  ctx.fillRect(x(X), y(Y), x(1), y(1))
  return ctx
}

const drawBlocked = pipe(
  blocked(2)(4),
  blocked(2)(5),
  blocked(3)(4),
  blocked(3)(5),
  blocked(6)(4),
  blocked(6)(5),
  blocked(7)(4),
  blocked(7)(5),
)

const drawPieces = color => ctx => {
  Object.keys(state[color].pieces).forEach(name => {
    state[color].pieces[name].forEach(pos => {
      piece(color)(name)(pos.x)(pos.y)(ctx)
    })
  }) 
  return ctx
}

// Game loop draw
const draw = () => {
  pipe(
    board,
    drawBlocked,
    drawPieces('blue'),
    drawPieces('red'),
  )(ctx)
}
  
const A = {
  name: 'eric',
  playMove(state) {
    return state[state.color].moves[0]
  }
}
const B = {
  name: 'oor',
  playMove(state) {
    /**
     * Evaluate your moves here
     */
    return state[state.color].moves[0]
  }
}

const isRed = Math.random() > 0.5
const RED   = isRed ? A : B
const BLUE  = isRed ? B : A
const RedState   = state => Object.freeze({
    ...state,
    color: 'red',
    blue: {
        ...state.blue,
        pieces: {},
        moves: []
    }
})
const BlueState  = state => Object.freeze({
    ...state,
    color: 'blue',
    red: {
        ...state.red,
        pieces: {},
        moves: []
    }
})

const step = () => {

  if (state.winner) {
    //Game ended. Not sure what needs to happen now.
      const AI = state.winner === 'red' ? RED.name : BLUE.name     
      console.log('winning move:')
      console.log(state.winningMove)   
      console.log(`${AI} won the game with the ${state.winner} pieces.`)
      console.log('Current state')
      console.log(State.debug(state))
      throw 'Game over.'
  }

  let move = state.redToMove ? 
      RED.playMove(RedState(state)) :
      BLUE.playMove(BlueState(state))

  State.enqueue(state, move)
  state = State.next(state)

}


const animate = () => {
  step()  
  draw()
  requestAnimationFrame(animate)
}
animate()
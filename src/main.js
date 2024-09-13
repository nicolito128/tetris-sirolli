import './style.css'
import {
  BLOCK_SIZE,
  MATRIX_HEIGHT,
  MATRIX_WIDTH,
  EVENT_MOVEMENTS,
  PIECES
} from './consts'

const canvas = document.querySelector('#tetris')
const context = canvas.getContext('2d')

canvas.width = BLOCK_SIZE * MATRIX_WIDTH
canvas.height = BLOCK_SIZE * MATRIX_HEIGHT
context.scale(BLOCK_SIZE, BLOCK_SIZE)

const pieceBoxCanvas = document.querySelector('#pieceBox')
const pieceBoxContext = pieceBoxCanvas.getContext('2d')

pieceBoxCanvas.width = BLOCK_SIZE * 7
pieceBoxCanvas.height = BLOCK_SIZE * 7
pieceBoxContext.scale(BLOCK_SIZE, BLOCK_SIZE)

const scoreLabel = document.querySelector('#scoreLabel')
let score = 0

const levelLabel = document.querySelector('#levelLabel')

const mainTheme = document.querySelector('#mainTheme')
mainTheme.volume = 0.85

const dropTheme = document.querySelector('#dropTheme')
dropTheme.volume = 1

const gameOverTheme = document.querySelector('#gameOverTheme')
gameOverTheme.volume = 1

const matrix = Array.from({ length: MATRIX_HEIGHT }, () => new Array(MATRIX_WIDTH).fill(0));

let bagOfPieces = [...PIECES]

function pickPieceFromBag() {
  const curPiece = bagOfPieces.splice(0, 1)[0]
  if (bagOfPieces.length === 0) {
    bagOfPieces = [...PIECES]
    shuffleBag()
  }

  return curPiece
}

function shuffleBag() {
  let currentIndex = bagOfPieces.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [bagOfPieces[currentIndex], bagOfPieces[randomIndex]] = [
      bagOfPieces[randomIndex], bagOfPieces[currentIndex]]
  }
}

let playerPiece = null

function getPiecePos(x, y) {
  return {
    px: x + playerPiece.position.x,
    py: y + playerPiece.position.y
  }
}

function drawPlayerPiece() {
  playerPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        // Draw piece
        const { px, py } = getPiecePos(x, y)
        context.fillStyle = playerPiece.color
        context.fillRect(px, py, 1, 1)

        // Draw Shadow
        const limits = []
        let shawY = py + 1
        while (shawY < MATRIX_HEIGHT) {
          const cell = matrix[shawY][px]
          if (cell === 0 && !limits.some(l => l[0] === px || l[1] === shawY)) {
            context.clearRect(px, shawY, 1, 1)
            context.fillStyle = 'rgba(118, 103, 194, 0.05)'
            context.fillRect(px, shawY, 1, 1)
          } else {
            limits.push([px, shawY])
          }
          shawY++
        }
      }
    })
  })
}

function drawBoard() {
  context.fillStyle = '#090426'
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const cell = matrix[y][x]
      if (cell !== 0) {
        const piece = PIECES[cell - 1]
        context.fillStyle = piece.color
        context.fillRect(x, y, 1, 1)
      }
    }
  }
}

let pieceBox = null

function savePiece() {
  if (pieceBox === null) {
    pieceBox = Object.assign({}, playerPiece)
    playerPiece = pickPieceFromBag()
  } else {
    const aux = Object.assign({}, playerPiece)
    playerPiece = Object.assign({}, pieceBox)
    pieceBox = aux
  }

  resetPlayerPos()
}

function drawPieceBox() {
  pieceBoxContext.fillStyle = '#090426'
  pieceBoxContext.fillRect(0, 0, pieceBoxCanvas.width, pieceBoxCanvas.height)

  if (pieceBox) {
    pieceBox.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          pieceBoxContext.fillStyle = pieceBox.color
          pieceBoxContext.fillRect(x + 2, y + 2, 1, 1)
        }
      })
    })
  }
}

function draw() {
  drawBoard()
  drawPieceBox()
  drawPlayerPiece()
}

// Main game loop
let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    playerPiece.position.y++
    fixFallCollision()

    // Dificultad
    if (score >= 1000) {
      const unit = parseInt(score / 1000)
      dropCounter = parseInt((unit * 100) * (55 / 100))

      levelLabel.textContent = unit
    } else {
      dropCounter = 0
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function checkPlayerCollision() {
  return playerPiece.shape.find((row, y) => {
    return row.find((value, x) => {
      const { px, py } = getPiecePos(x, y)
      return (
        value &&
        value !== 0 &&
        matrix[py]?.[px] !== 0
      )
    })
  })
}

function fixFallCollision() {
  if (checkPlayerCollision()) {
    playerPiece.position.y--
    solidifyPlayerPiece()
    clearRows()

    return true
  }

  return false
}

function solidifyPlayerPiece() {
  playerPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const { px, py } = getPiecePos(x, y)
        matrix[py][px] = playerPiece.id
      }
    })
  })

  playerPiece = pickPieceFromBag()
  resetPlayerPos()

  if (checkPlayerCollision()) {
    mainTheme.pause()
    mainTheme.currentTime = 0

    gameOverTheme.play()
    alert('Game Over!')

    resetGame()
  }
}

function clearRows() {
  matrix.forEach((row, y) => {
    if (row.every(value => value !== 0)) {
      matrix.splice(y, 1)
      const newRow = Array(MATRIX_WIDTH).fill(0)
      matrix.unshift(newRow)
      updateScore(250)
    }
  })
}

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

function rotatePlayerPiece() {
  const rotated = []
  const prevShape = clone(playerPiece.shape)

  // Transponer la matriz
  for (let i = 0; i < playerPiece.shape[0].length; i++) {
    const row = []

    for (let j = playerPiece.shape.length - 1; j >= 0; j--) {
      row.push(playerPiece.shape[j][i])
    }

    rotated.push(row)
  }

  playerPiece.shape = rotated
  if (checkPlayerCollision()) {
    playerPiece.shape = prevShape
  }
}

function dropPiece() {
  while (!fixFallCollision()) {
    playerPiece.position.y++
  }
  dropTheme.play()
}

function updateScore(value) {
  score += value
  scoreLabel.textContent = score
}

function resetMatrix() {
  matrix.forEach(row => row.fill(0))
}

function resetPlayerPos() {
  playerPiece.position.x = 4
  playerPiece.position.y = 0
}

function resetGame() {
  resetMatrix()

  bagOfPieces = [...PIECES]
  shuffleBag()

  playerPiece = pickPieceFromBag()
  resetPlayerPos()

  pieceBox = null

  score = 0
  scoreLabel.textContent = 0

  levelLabel.textContent = 0

  mainTheme.play()
}

const startScreen = document.querySelector('#startScreen')
let started = false

function start() {
  resetGame()
  update()
}

document.addEventListener('keydown', event => {
  event.preventDefault()

  switch (event.key) {
    case EVENT_MOVEMENTS.LEFT:
      playerPiece.position.x--
      if (checkPlayerCollision()) {
        playerPiece.position.x++
      }

      break

    case EVENT_MOVEMENTS.RIGHT:
      playerPiece.position.x++
      if (checkPlayerCollision()) {
        playerPiece.position.x--
      }

      break

    case EVENT_MOVEMENTS.DOWN:
      playerPiece.position.y++
      fixFallCollision()

      break

    case EVENT_MOVEMENTS.ROTATE:
      rotatePlayerPiece()
      break

    case EVENT_MOVEMENTS.DROP:
      dropPiece()
      break

    case EVENT_MOVEMENTS.SAVE_PIECE:
      savePiece()
      break
    
    default:
      if (!started) {
        started = true
        startScreen.remove()
        start()
      }
  }
})

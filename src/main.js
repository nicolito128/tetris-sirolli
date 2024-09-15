import { Matrix } from './matrix'
import { Renderer } from './renderer'
import { Bag } from './pieces'
import './style.css'

const EVENT_MOVEMENTS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE: 'ArrowUp',
    DROP: ' ',
    SAVE_PIECE: 'Tab',
}

class Game {
    #DEFAULT_MATRIX_WIDTH = 10
    #DEFAULT_MATRIX_HEIGHT = 20
    #DEFAULT_PIXEL_SIZE = 25

    #DEFAULT_PIECE_BOX_WIDTH = 7
    #DEFAULT_PIECE_BOX_HEIGHT = 7
    #DEFAULT_PIECE_BOX_SIZE = 20

    constructor() {
        this.tetris = new Renderer(this, {
            id: '#tetris',
            width: this.#DEFAULT_MATRIX_WIDTH,
            height: this.#DEFAULT_MATRIX_HEIGHT,
            size: this.#DEFAULT_PIXEL_SIZE,
        })

        this.pieceBox = new Renderer(this, {
            id: '#pieceBox',
            width: this.#DEFAULT_PIECE_BOX_WIDTH,
            height: this.#DEFAULT_PIECE_BOX_HEIGHT,
            size: this.#DEFAULT_PIECE_BOX_SIZE,
        })

        this.matrix = new Matrix(this.tetris, {
            width: this.#DEFAULT_MATRIX_WIDTH,
            height: this.#DEFAULT_MATRIX_HEIGHT,
        })

        this.matrixBox = new Matrix(this.pieceBox, {
            width: 7,
            height: 7,
        })

        // UI
        this.startScreen = document.querySelector('#startScreen')
        this.levelLabel = document.querySelector('#levelLabel')
        this.scoreLabel = document.querySelector('#scoreLabel')

        // Audio
        this.mainTheme = document.querySelector('#mainTheme')
        this.mainTheme.volume = 0.85

        this.dropTheme = document.querySelector('#dropTheme')
        this.dropTheme.volume = 1

        this.overTheme = document.querySelector('#overTheme')
        this.overTheme.volume = 1

        // States
        this.started = false

        this.dropCounter = 0

        this.lastTime = 0

        this.score = 0

        this.level = 0

        this.box = null

        this.bag = new Bag()

        this.player = this.bag.shift()
    }

    start() {
        if (!this.started) {
            this.started = true
            this.startScreen.remove()
            this.reset()
            this.update()
        }
    }

    update(time = 0) {
        const deltaTime = time - this.lastTime
        this.lastTime = time
        this.updateDropCounter(deltaTime)

        this.drawAll()
        window.requestAnimationFrame(t => this.update(t))
    }

    updateDropCounter(delta) {
        this.dropCounter += delta
        if (this.dropCounter > 1000) {
            this.player.position.y++
            this.fixFallCollision()
            this.updateLevel()
        }
    }

    updateLevel() {
        // Ajusta la 'dificultad' (velocidad de caída)
        const unit = parseInt(this.score / 1000)
        this.levelLabel.textContent = unit

        let diff = 50
        if (this.score >= 1000) {
            diff = parseInt((unit * 100) * (45 / 100) + unit)
        }

        this.dropCounter = diff
    }

    drawAll() {
        this.matrix.draw(this.tetris.canvas, this.tetris.context)
        this.drawPieceBox()
        this.drawWithShadow(this.tetris.context)
    }

    drawWithShadow(ctx) {
        this.player.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const { dx, dy } = this.player.getPosition(x, y)
                    ctx.fillStyle = this.player.color
                    ctx.fillRect(dx, dy, 1, 1)

                    let sy = dy + 1
                    while (sy < this.matrix.height) {
                        const cell = this.matrix.look(dx, sy)
                        if (cell === 0 && sy > (this.player.position.y)) {
                            ctx.clearRect(dx, sy, 1, 1)
                            ctx.fillStyle = 'rgba(118, 103, 194, 0.05)'
                            ctx.fillRect(dx, sy, 1, 1)
                        }
                        sy++
                    }
                }
            })
        })
    }

    checkCollision() {
        return this.player.shape.find((row, y) => {
            return row.find((value, x) => {
                const { dx, dy } = this.player.getPosition(x, y)
                return (
                    value &&
                    value !== 0 &&
                    this.matrix.body[dy]?.[dx] !== 0
                )
            })
        })
    }

    fixFallCollision() {
        if (this.checkCollision()) {
            this.player.position.y--
            this.solidify()
            this.clearRows()
      
            return true
        }
        
        return false
    }

    solidify() {
        this.player.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const { dx, dy } = this.player.getPosition(x, y)
                    this.matrix.body[dy][dx] = this.player.id
                }
            })
        })
        
        this.player = this.bag.shift()
        this.player.resetPosition()
        
        if (this.checkCollision()) {
            this.gameOver()
        }
    }

    clearRows() {
        this.matrix.body.forEach((row, y) => {
            if (row.every(value => value !== 0)) {
                const newRow = Array(this.#DEFAULT_MATRIX_WIDTH).fill(0)
                this.matrix.body.splice(y, 1)
                this.matrix.body.unshift(newRow)
                this.updateScore(250)
                this.updateLevel()
            }
        })
    }

    rotatePiece() {
        const rotated = this.player.rotate()
        const prev = this.player.shape

        this.player.shape = rotated
        if (this.checkCollision()) {
            this.player.shape = prev
        }
    }

    gameOver() {
        this.mainTheme.pause()
        this.mainTheme.currentTime = 0

        this.overTheme.play()
        alert('Game Over!')

        this.reset()
    }

    reset() {
        this.matrix.clear()

        this.bag = new Bag()

        this.player = this.bag.shift()
        this.player.resetPosition()

        this.box = null
        this.matrixBox.clear()
        
        this.score = 0
        this.updateScore()
        
        this.levelLabel.textContent = 0
        
        this.mainTheme.play()
    }

    updateScore(value = 0) {
        if (value) this.score += value
        this.scoreLabel.textContent = this.score.toString()
    }

    moveLeft() {
        this.player.position.x--
        if (this.checkCollision()) {
            this.player.position.x++
        }
    }

    moveRight() {
        this.player.position.x++
        if (this.checkCollision()) {
            this.player.position.x--
        }
    }

    moveDown() {
        this.player.position.y++
        this.fixFallCollision()
    }

    dropPiece() {
        while (!this.fixFallCollision()) {
            this.player.position.y++
        }
        this.dropTheme.play()
    }

    savePiece() {
        if (this.box) {
            const aux = this.player.clone()
            this.player = this.box
            this.box = aux
        } else {
            this.box = this.player.clone()
            this.player = this.bag.shift()
        }
        this.player.resetPosition()
    }

    drawPieceBox() {
        this.pieceBox.context.fillStyle = '#090426'
        this.pieceBox.context.fillRect(0, 0, this.pieceBox.canvas.width, this.pieceBox.canvas.height)
      
        if (this.box) {
            this.box.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        this.pieceBox.context.fillStyle = this.box.color
                        this.pieceBox.context.fillRect(x + 2, y + 2, 1, 1)
                    }
                })
            })
        }
    }
}

const game = new Game()
document.addEventListener('keydown', event => {
    event.preventDefault()    
    switch (event.key) {
        case EVENT_MOVEMENTS.LEFT:
            game.moveLeft()
        break
        
        case EVENT_MOVEMENTS.RIGHT:
            game.moveRight()
        break
  
        case EVENT_MOVEMENTS.DOWN:
            game.moveDown()
        break
  
        case EVENT_MOVEMENTS.ROTATE:
            game.rotatePiece()
        break
  
        case EVENT_MOVEMENTS.DROP:
            game.dropPiece()
        break
  
        case EVENT_MOVEMENTS.SAVE_PIECE:
            game.savePiece()
        break
      
        default: 
            game.start()
    }
})

// Pieces: O, I, T, L, J, S, Z
class Tetrimino {
    #DEFAULT_POS_X = 4
    #DEFUALT_POS_Y = 0

    constructor({ id, color, shape }) {
        this.id = id
        this.color = color
        this.shape = shape
        this.position = { x: this.#DEFAULT_POS_X, y: this.#DEFUALT_POS_Y}
    }

    getPosition(x, y) {
        return {
            dx: x + this.position.x,
            dy: y + this.position.y,
        }
    }

    draw(ctx) {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const { dx, dy } = this.getPosition(x, y)
                    ctx.fillStyle = this.color
                    ctx.fillRect(dx, dy, 1, 1)
                }
            })
        })
    }

    rotate() {
        const rotated = []
        // Transponer la matriz
        for (let i = 0; i < this.shape[0].length; i++) {
            const row = []
            for (let j = this.shape.length - 1; j >= 0; j--) {
                row.push(this.shape[j][i])
            }
            rotated.push(row)    
        }
        return rotated
    }

    resetPosition() {
        this.position.x = this.#DEFAULT_POS_X
        this.position.y = this.#DEFUALT_POS_Y
    }

    clone() {
        return new Tetrimino({
            id: this.id,
            color: this.color,
            shape: this.shape,
        })
    }
}

export const O = new Tetrimino({
    id: 1,
    color: 'rgb(223, 235, 52)',
    shape: [
        [1, 1],
        [1, 1],
    ]
})

export const I = new Tetrimino({
    id: 2,
    color: 'rgb(52, 195, 235)',
    shape: [
        [1, 1, 1, 1],
    ],
})

export const T = new Tetrimino({
    id: 3,
    color: 'rgb(165, 52, 235)',
    shape: [
        [0, 1, 0],
        [1, 1, 1],
    ],
})

export const L = new Tetrimino({
    id: 4,
    color: 'rgb(235, 101, 52)',
    shape: [
        [0, 0, 1],
        [1, 1, 1],
    ],
})

export const J = new Tetrimino({
    id: 5,
    color: 'rgb(58, 52, 235)',
    shape: [
        [1, 0, 0],
        [1, 1, 1],
    ],
})

export const S = new Tetrimino({
    id: 6,
    color: 'rgb(64, 235, 52)',
    shape: [
        [0, 1, 1],
        [1, 1, 0],
    ],
})

export const Z = new Tetrimino({
    id: 7,
    color: 'rgb(235, 64, 52)',
    shape: [
        [1, 1, 0],
        [0, 1, 1],
    ],
})

export const PIECES = [O, I, T, L, J, S, Z]

export class Bag {
    constructor() {
        this.pieces = [...PIECES]
        this.shuffle()
    }

    shift() {
        const head = this.pieces.splice(0, 1)[0]
        if (this.pieces.length === 0) {
            this.pieces = [...PIECES]
            this.shuffle()
        }

        return head
    }

    shuffle() {
        let currentIndex = this.pieces.length;

        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [this.pieces[currentIndex], this.pieces[randomIndex]] = [
                this.pieces[randomIndex], this.pieces[currentIndex]]
        }
    }
}
import { PIECES } from "./pieces";

export class Matrix {
    constructor({ width, height }) {
        this.width = width
        this.height = height
        this.body = Array.from({ length: height }, () => new Array(width).fill(0));
    }

    draw(canvas, ctx) {
        ctx.fillStyle = '#090426'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let y = 0; y < this.body.length; y++) {
            for (let x = 0; x < this.body[y].length; x++) {
                const cell = this.body[y][x]
                if (cell !== 0) {
                    const piece = PIECES[cell - 1]
                    ctx.fillStyle = piece.color
                    ctx.fillRect(x, y, 1, 1)
                }
            }
        }
    }

    look(x, y) {
        if (!this.body[y]) return undefined
        return this.body[y][x]
    }

    clear() {
        this.body.forEach(row => row.fill(0))
    }
}
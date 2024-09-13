
export class Renderer {
    constructor(game, {id, width, height, size}) {
        this.game = game

        this.canvas = document.querySelector(id)
        this.context = this.canvas.getContext('2d')
        this.width = width
        this.height = height
        this.pixelSize = size

        this.canvas.width = this.pixelSize * this.width
        this.canvas.height = this.pixelSize * this.height

        this.context.scale(this.pixelSize, this.pixelSize)
    }
}
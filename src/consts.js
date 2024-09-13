export const BLOCK_SIZE = 26

export const MATRIX_WIDTH = 10

export const MATRIX_HEIGHT = 20

export const EVENT_MOVEMENTS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    ROTATE: 'ArrowUp',
    DROP: ' ',
    SAVE_PIECE: 'Tab',
}

// Pieces: O, I, T, L, J, S, Z
export const PIECES = [
  {
    id: 1,
    name: "O-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(223, 235, 52)',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    id: 2,
    name: "I-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(52, 195, 235)',
    shape: [
      [1, 1, 1, 1],
    ],
  },
  {
    id: 3,
    name: "T-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(165, 52, 235)',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  {
    id: 4,
    name: "L-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(235, 101, 52)',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    id: 5,
    name: "J-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(58, 52, 235)',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    id: 6,
    name: "S-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(64, 235, 52)',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    id: 7,
    name: "Z-Tetrimino",
    position: { x: 4, y: 0 },
    color: 'rgb(235, 64, 52)',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
]
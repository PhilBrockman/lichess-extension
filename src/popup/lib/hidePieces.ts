import {
  ChessPiece,
  SerializedChessPiece,
  chessPieceColors,
  chessPieceNames,
  stringifyChessPieceIdentifier,
} from '../types'

function getChessPiecePosition(
  width: number,
  height: number,
  transformX: number,
  transformY: number,
) {
  const boardParent = document.querySelector('cg-container')?.parentElement
  if (!boardParent) throw new Error('Could not find board parent')
  // Calculate the size of each square on the chessboard
  const squareSize = width / 8
  // Apply the transformation to find the final position of the piece
  const finalX = transformX + squareSize / 2 // add half of square size to account for the piece's center position
  const finalY = transformY + squareSize / 2

  if (boardParent.classList.contains('orientation-white')) {
    // Divide the final position of the piece by the size of each square to get its rank and file
    const file = 1 + Math.floor(finalX / squareSize)
    const rank = 8 - Math.floor(finalY / squareSize) // invert the y-coordinate to account for the fact that the board is numbered from bottom to top

    // Return an object with the rank and file of the piece
    return {
      rank,
      file,
    }
  } else {
    // Divide the final position of the piece by the size of each square to get its rank and file
    const file = 8 - Math.floor(finalX / squareSize)
    const rank = 1 + Math.floor(finalY / squareSize) // invert the y-coordinate to account for the fact that the board is numbered from bottom to top

    // Return an object with the rank and file of the piece
    return {
      rank,
      file,
    }
  }
}

function getChessBoardDimensions() {
  const board = document.querySelector('cg-container')
  if (!board) throw new Error('Could not find chessboard')
  // Get the width and height of the chessboard
  const width = board.clientWidth
  const height = board.clientHeight

  // Return an object with the width and height of the chessboard
  return {
    width,
    height,
  }
}

export function getTransformationFromChessNotation(columnAsLetter: string, row: number) {
  // Get the width and height of the chessboard
  const { width, height } = getChessBoardDimensions()

  // Calculate the size of each square on the chessboard
  const squareSize = width / 8

  // Calculate the x and y coordinates of the square
  const x = (columnAsLetter.charCodeAt(0) - 97) * squareSize
  const y = (8 - row) * squareSize

  return {
    translate: {
      x,
      y,
    },
  }
}

function getTransformDirections(transform: string) {
  const regex = /translate\((.+)px,\s*(.+)px\)/
  const match = transform.match(regex)

  if (!match) {
    throw new Error(`Invalid transformation string: ${transform}`)
  }

  const [_, x, y] = match // extract the x and y values from the regex match

  return [parseInt(x), parseInt(y)]
}

function getChessPieceLocation(piece: HTMLElement): SerializedChessPiece | undefined {
  // Get the width and height of the chessboard
  const { width, height } = getChessBoardDimensions()

  // Get the transform values of the piece
  const transform = piece.style.transform

  if (!transform) return
  const [transformX, transformY] = getTransformDirections(transform)

  // Get the rank and file of the piece
  const { rank, file } = getChessPiecePosition(width, height, transformX, transformY)

  // Return an object with the rank and file of the piece
  const [color, pieceName] = piece.className.split(' ')
  return {
    row: rank,
    column: String.fromCharCode(96 + file),
    color,
    pieceName,
    originalPosition: piece,
  }
}

const classNamesToChessPiece = (classNames: string): ChessPiece | undefined => {
  const [color, pieceName] = classNames.split(' ') as [
    keyof typeof chessPieceColors,
    keyof typeof chessPieceNames,
  ]
  if (chessPieceNames[pieceName] === undefined) return undefined
  if (chessPieceColors[color] === undefined) return undefined
  return {
    color: color,
    name: pieceName,
  }
}

export const hidePieces = (PIECES_THAT_I_CAN_HIDE?: Set<string>) => {
  if (!PIECES_THAT_I_CAN_HIDE?.size) return
  const pieces = document.querySelectorAll('piece')
  const hiddenPieces: SerializedChessPiece[] = []
  pieces.forEach((piece) => {
    if (piece.className.indexOf('ghost') !== -1) return
    // convert piece to a chess piece
    const chessPiece = classNamesToChessPiece(piece.className)
    if (!chessPiece) return

    if (PIECES_THAT_I_CAN_HIDE.has(stringifyChessPieceIdentifier(chessPiece))) {
      // if any of the class names are in PIECES_THAT_I_CAN_HIDE, hide the piece
      ;(piece as HTMLElement).style.opacity = '0'
      const loc = getChessPieceLocation(piece as HTMLElement)
      if (loc) hiddenPieces.push(loc)
    } else {
      ;(piece as HTMLElement).style.opacity = '1'
    }
  })
  return hiddenPieces
}

export const showAllPieces = () => {
  const pieces = document.querySelectorAll('piece')
  pieces.forEach((piece) => {
    ;(piece as HTMLElement).style.opacity = '1'
  })
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { stringifyChessPieceIdentifier } from './helpers'
import { ChessPiece, CHESS_PIECE_COLORS, CHESS_PIECE_NAMES, SerializedChessPiece } from './types'

function getBoardOrientation(): CHESS_PIECE_COLORS {
  const boardParent = document.querySelector('cg-container')?.parentElement
  if (!boardParent) throw new Error('Could not find board parent')
  return boardParent.classList.contains('orientation-white')
    ? CHESS_PIECE_COLORS.WHITE
    : CHESS_PIECE_COLORS.BLACK
}

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

  if (getBoardOrientation() === 'white') {
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
  if (Object.values(CHESS_PIECE_COLORS).indexOf(color as any) === -1) return undefined
  if (Object.values(CHESS_PIECE_NAMES).indexOf(pieceName as any) === -1) return undefined
  return {
    row: rank,
    column: String.fromCharCode(96 + file),
    color: color as CHESS_PIECE_COLORS,
    pieceName: pieceName as CHESS_PIECE_NAMES,
    originalPosition: piece,
  }
}

const classNamesToChessPiece = (classNames: string): ChessPiece | undefined => {
  const [color, pieceName] = classNames.split(' ') as [CHESS_PIECE_COLORS, CHESS_PIECE_NAMES]
  if (Object.values(CHESS_PIECE_COLORS).indexOf(color) === -1) return undefined
  if (Object.values(CHESS_PIECE_NAMES).indexOf(pieceName) === -1) return undefined
  return {
    color: color,
    name: pieceName,
  }
}

export const useHidePieces = ({
  PIECES_THAT_I_CAN_HIDE,
  setHiddenPieces,
  delayTime,
  isActive,
}: {
  PIECES_THAT_I_CAN_HIDE: Set<string>
  setHiddenPieces: any
  delayTime: number
  isActive: boolean
}) => {
  const [triggerEffect, setTriggerEffect] = useState(false)
  const triggerRef = useRef(false)

  useEffect(() => {
    triggerRef.current = triggerEffect
  }, [triggerEffect])

  const pieces = document.querySelectorAll('piece')
  // Set the initial opacity of the pieces
  pieces.forEach((piece) => {
    if (piece.className.indexOf('ghost') !== -1) return

    // Convert piece to a chess piece
    const chessPiece = classNamesToChessPiece(piece.className)
    if (!chessPiece) return

    if (PIECES_THAT_I_CAN_HIDE.has(stringifyChessPieceIdentifier(chessPiece))) {
      // if opacity is 0, then the piece is hidden
      if (!isActive) {
        ;(piece as HTMLElement).style.opacity = '1'
        return
      }
      if ((piece as HTMLElement).style.opacity === '0') return
      ;(piece as HTMLElement).style.opacity = '0.4'
    } else {
      ;(piece as HTMLElement).style.opacity = '1'
    }
  })

  const handleTimeout = useCallback(() => {
    const hiddenPieces: SerializedChessPiece[] = []
    pieces.forEach((piece) => {
      if (piece.className.indexOf('ghost') !== -1) return

      // Convert piece to a chess piece
      const chessPiece = classNamesToChessPiece(piece.className)
      if (!chessPiece) return

      if (PIECES_THAT_I_CAN_HIDE.has(stringifyChessPieceIdentifier(chessPiece))) {
        // Hide the piece
        ;(piece as HTMLElement).style.opacity = '0'
        const loc = getChessPieceLocation(piece as HTMLElement)
        if (loc) hiddenPieces.push(loc)
      } else {
        ;(piece as HTMLElement).style.opacity = '1'
      }
    })
    setHiddenPieces(hiddenPieces)

    const container = document.querySelector('.puzzle__moves.areplay')
    if (container) {
      setTimeout(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      }, 150)
    }
  }, [pieces])

  useEffect(() => {
    if (triggerRef.current && isActive) {
      const intervalId = setInterval(() => {
        handleTimeout()
      }, delayTime)

      return () => clearInterval(intervalId)
    }
  }, [triggerRef, handleTimeout, delayTime, isActive])

  return {
    hidePieces: () => setTriggerEffect(true),
  }
}

export const showAllPieces = () => {
  const pieces = document.querySelectorAll('piece')
  pieces.forEach((piece) => {
    ;(piece as HTMLElement).style.opacity = '1'
  })
}

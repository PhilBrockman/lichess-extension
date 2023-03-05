import { ChessPiece, SerializedChessPiece, isValidColor, isValidName } from '../types'

export const urlFromPiece = (piece: ChessPiece) => {
  const letter =
    piece.name === 'king'
      ? 'k'
      : piece.name === 'queen'
      ? 'q'
      : piece.name === 'bishop'
      ? 'b'
      : piece.name === 'knight'
      ? 'n'
      : piece.name === 'rook'
      ? 'r'
      : 'p'
  return `https://www.chess.com/chess-themes/pieces/neo/150/${piece.color.slice(0, 1) + letter}.png`
}

export function HiddenPiece(piece: SerializedChessPiece) {
  if (piece.color === 'ghost') {
    return null
  }
  if (!isValidColor(piece.color)) {
    throw new Error('Invalid color: ' + piece.color!)
  }
  if (!isValidName(piece.pieceName)) {
    throw new Error('Invalid name: ' + piece.pieceName)
  }

  const url = urlFromPiece({
    color: piece.color,
    name: piece.pieceName,
  })

  const handleClick = () => {
    // if the piece is already visible, make it invisible
    if (piece.originalPosition.style.opacity === '1') {
      piece.originalPosition.style.opacity = '0'
    } else {
      piece.originalPosition.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    piece.originalPosition.style.opacity = '0'
  }

  return (
    <button
      className="flex flex-row gap-2 items-center cursor-pointer px-2 py-1 rounded-lg border border-1 border-gray-300  bg-gray-200 flex-shrink-0 hover:bg-gray-300 transition-all hover:border-gray-400 hover:shadow-lg active:bg-gray-400 active:border-gray-500 active:scale-95 scale-100 duration-100"
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <img src={url} className="w-8 h-8" />
      <span>
        <span>{piece.column.toUpperCase()}</span>
        <span>{piece.row}</span>
      </span>
    </button>
  )
}

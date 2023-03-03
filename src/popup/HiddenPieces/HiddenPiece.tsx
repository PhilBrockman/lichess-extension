import { SerializedChessPiece } from '../types'

export function HiddenPiece(piece: SerializedChessPiece) {
  if (piece.color === 'ghost') return null

  const letter =
    piece.pieceName === 'king'
      ? 'k'
      : piece.pieceName === 'queen'
      ? 'q'
      : piece.pieceName === 'bishop'
      ? 'b'
      : piece.pieceName === 'knight'
      ? 'n'
      : piece.pieceName === 'rook'
      ? 'r'
      : 'p'

  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + letter
  }.png`

  const handleClick = () => {
    // make the piece visible
    console.log('original position', piece.originalPosition)
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

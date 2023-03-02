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
    piece.originalPosition.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    piece.originalPosition.style.opacity = '0'
  }

  return (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-md bg-gray-200 flex-shrink-0"
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      role="button"
    >
      <img src={url} className="w-8 h-8" />
      <div>
        <span>{piece.column}</span>
        <span>{piece.row}</span>
      </div>
    </div>
  )
}

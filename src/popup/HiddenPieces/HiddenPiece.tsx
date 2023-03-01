import { SerializedChessPiece } from '../types'

export function HiddenPiece(piece: SerializedChessPiece) {
  if (piece.color === 'ghost') return null
  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + piece.pieceName.slice(0, 1)
  }.png`

  const handleClick = () => {
    console.log(piece)
  }

  return (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer"
      onClick={handleClick}
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

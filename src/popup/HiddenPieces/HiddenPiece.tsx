import { boardElement } from '../Popup'
import { getTransformationFromChessNotation } from '../lib/hidePieces'
import { SerializedChessPiece } from '../types'

export function HiddenPiece(piece: SerializedChessPiece) {
  if (piece.color === 'ghost') return null
  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + piece.pieceName.slice(0, 1)
  }.png`

  const handleClick = () => {
    // make the piece visible
    piece.originalPosition.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    // reset
    piece.originalPosition.style.opacity = '0'
    piece.originalPosition.style.filter = 'none'
  }

  return (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer p-2 rounded-md "
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

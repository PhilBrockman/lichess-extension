import { SerializedChessPiece } from '../types'

export function HiddenPiece(piece: SerializedChessPiece) {
  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + piece.pieceName.slice(0, 1)
  }.png`

  return (
    <div className="flex flex-row">
      <img src={url} className="w-8 h-8" />

      <div>{piece.column}</div>
      <div>{piece.row}</div>
    </div>
  )
}

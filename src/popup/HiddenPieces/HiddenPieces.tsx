import { SerializedChessPiece } from '../types'
import { HiddenPiece } from './HiddenPiece'

export function HiddenPieces({ pieces }: { pieces: SerializedChessPiece[] }) {
  return (
    <div className="flex flex-col flex-wrap">
      {pieces.map(
        (piece) =>
          piece &&
          piece.row &&
          piece.column && <HiddenPiece key={`${piece.row}${piece.column}`} {...piece} />,
      )}
    </div>
  )
}

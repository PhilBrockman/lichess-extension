import { SerializedChessPiece } from '../types'
import { HiddenPiece } from './HiddenPiece'

export function HiddenPieces({ pieces }: { pieces: SerializedChessPiece[] }) {
  return (
    <div className="flex flex-row flex-wrap">
      {pieces.map(
        (piece, i) =>
          piece &&
          piece.row &&
          piece.column &&
          piece.color !== 'ghost' && <HiddenPiece key={i} {...piece} />,
      )}
    </div>
  )
}

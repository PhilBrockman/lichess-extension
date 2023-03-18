import { SerializedChessPiece } from '../lib/types'
import { HiddenPiece } from './HiddenPiece'

export function HiddenPieces({ pieces }: { pieces: SerializedChessPiece[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {pieces
        .sort((a, b) => {
          // sort by column
          if (a.column < b.column) return -1
          if (a.column > b.column) return 1
          // sort by row
          if (a.row < b.row) return -1
          if (a.row > b.row) return 1

          return 0
        })
        .map(
          (piece, i) =>
            piece &&
            piece.row &&
            piece.column &&
            piece.color !== 'ghost' && <HiddenPiece key={i} {...piece} />,
        )}
    </div>
  )
}

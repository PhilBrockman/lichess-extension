import { CHESS_PIECE_COLORS, SerializedChessPiece } from '../lib/types'
import { HiddenPiece } from './HiddenPiece'

export function HiddenPieces({ pieces }: { pieces: SerializedChessPiece[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[CHESS_PIECE_COLORS.WHITE, CHESS_PIECE_COLORS.BLACK].map((color) => {
        return (
          <div className="grid grid-cols-2 gap-2" key={color}>
            {pieces
              .filter((piece) => piece.color === color)
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
      })}
    </div>
  )
}

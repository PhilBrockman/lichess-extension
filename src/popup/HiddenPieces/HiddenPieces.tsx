import { HiddenPiece } from './HiddenPiece'

export function HiddenPieces({
  pieces,
}: {
  pieces: {
    row: number
    column: string
    color: string
    pieceName: string
  }[]
}) {
  return (
    <div className="flex flex-col">
      {pieces.map((piece) => (
        <HiddenPiece key={`${piece.row}${piece.column}`} {...piece} />
      ))}
    </div>
  )
}
import { useEffect, useState } from 'react'
import PieceCheckBox from './PieceCheckBox'

const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']

export default function PiecesCheckBoxes({
  pieces,
  onChange,
}: {
  pieces: string[]
  onChange: (pieces: string[]) => void
}) {
  const [checkedPieces, setCheckedPieces] = useState(pieces)

  useEffect(() => {
    onChange(checkedPieces)
  }, [checkedPieces])

  return (
    <div className="pieces-checkboxes">
      {pieceTypes.map((pieceType) => (
        <PieceCheckBox
          key={pieceType}
          pieceType={pieceType}
          isChecked={checkedPieces.includes(pieceType)}
          onChange={(pieceType) => {
            if (checkedPieces.includes(pieceType)) {
              setCheckedPieces(checkedPieces.filter((p) => p !== pieceType))
            } else {
              setCheckedPieces([...checkedPieces, pieceType])
            }
          }}
        />
      ))}
    </div>
  )
}

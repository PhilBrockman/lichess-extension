export default function PieceCheckBox({
  pieceType,
  isChecked,
  onChange,
}: {
  pieceType: string
  isChecked: boolean
  onChange: (pieceType: string) => void
}) {
  return (
    <div className="flex flex-row gap-2">
      <input
        type="checkbox"
        id={pieceType}
        checked={isChecked}
        onChange={() => onChange(pieceType)}
      />
      <label htmlFor={pieceType}>{pieceType}</label>
    </div>
  )
}

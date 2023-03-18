import { urlFromPiece } from '../HiddenPieces/HiddenPiece'
import { CHESS_PIECE_COLORS, CHESS_PIECE_NAMES, stringifyChessPieceIdentifier } from '../types'

export default function PieceCheckBox({
  isChecked,
  onChange,
  name,
  color,
}: {
  name: CHESS_PIECE_NAMES
  color: CHESS_PIECE_COLORS
  isChecked: boolean
  onChange: (pieceType: string) => void
}) {
  const commonClasses = 'absolute inset-0 flex items-center justify-center '
  const visibleIcon = commonClasses + 'opacity-100'
  const hiddenIcon = commonClasses + 'opacity-0'

  const pieceAsString = stringifyChessPieceIdentifier({
    name,
    color,
  })

  return (
    <div className="flex flex-row gap-2 items-center">
      <input
        type="checkbox"
        id={pieceAsString}
        checked={isChecked}
        onChange={() => onChange(pieceAsString)}
        className="cursor-pointer"
      />
      <label htmlFor={pieceAsString} className="flex flex-row gap-2 items-center cursor-pointer">
        <div className="relative w-6 h-6">
          <div className={isChecked ? visibleIcon : hiddenIcon}>
            <span className="text-4xl text-gray-700 group-hover:text-gray-600">
              <img
                src={urlFromPiece({
                  name,
                  color,
                })}
              />
            </span>
          </div>
          <div className={isChecked ? hiddenIcon : visibleIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
        </div>
      </label>
    </div>
  )
}

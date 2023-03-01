import { useEffect, useState } from 'react'
import PieceCheckBox from './PieceCheckBox'

const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']

const ALL_HIDDEN = {
  label: 'Board only',
  helper: 'Hide all game pieces',
  data: ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'],
}
const PAWNS_ONLY = {
  label: 'Pawns rule',
  helper: 'Only pawns will be visible',
  data: ['rook', 'knight', 'bishop', 'queen', 'king'],
}
const KINGS_ROOKS_AND_QUEENS = {
  label: 'Revolution',
  helper: 'Hide all pieces except kings and queens',
  data: ['queen', 'king'],
}

function arraysAreEqual(arr1: string[], arr2: string[]) {
  // Sort both arrays
  const sortedArr1 = arr1.slice().sort()
  const sortedArr2 = arr2.slice().sort()

  // Compare the sorted arrays using JSON.stringify()
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)
}

const Preset = ({
  preset,
  setCheckedPieces,
  isActive,
}: {
  preset: {
    label: string
    helper: string
    data: string[]
  }
  setCheckedPieces: (pieces: string[]) => void
  isActive: boolean
}) => {
  return (
    <div key={preset.label} className="flex flex-col gap-1">
      <button
        className={
          !isActive
            ? 'px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
            : 'px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200'
        }
        onClick={() => setCheckedPieces(preset.data)}
      >
        {isActive && <span className="mr-1">✓</span>}
        {preset.label}
      </button>
      <span className="text-xs text-gray-500">{preset.helper}</span>
    </div>
  )
}

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

  const preconfigured = [ALL_HIDDEN, PAWNS_ONLY, KINGS_ROOKS_AND_QUEENS]

  return (
    <div className="p-3 space-y-10 text-left">
      <div className="space-y-3 border border-gray-200 rounded-md p-3">
        <div>Basic</div>
        <div className="ml-3 space-y-3">
          <p>Use the presets to quickly set which pieces are hidden in your games</p>
          <div className="flex flex-row gap-2">
            {preconfigured.map((preset) => (
              <Preset
                key={preset.label}
                preset={preset}
                setCheckedPieces={setCheckedPieces}
                isActive={arraysAreEqual(checkedPieces, preset.data)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3 border border-gray-200 rounded-md p-3">
        <div>Advanced</div>
        <div className="ml-3 space-y-3">
          <p>Use the checkboxes to set which pieces are hidden in your games</p>{' '}
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
        </div>
      </div>
      <Preset
        preset={{
          label: 'All visible',
          helper: 'Do not hide any pieces (or pawns)',
          data: [],
        }}
        setCheckedPieces={setCheckedPieces}
        isActive={arraysAreEqual(checkedPieces, [])}
      />
    </div>
  )
}

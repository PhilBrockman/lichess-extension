import { useEffect, useState } from 'react'
import PieceCheckBox from './PieceCheckBox'
import * as Tabs from '@radix-ui/react-tabs'

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
    <div key={preset.label} className={`flex-grow`}>
      <div className="flex flex-col gap-1 group flex-grow-0">
        <button
          id={preset.label}
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
        <label
          htmlFor={preset.label}
          className="text-xs text-gray-400 group-hover:text-gray-600 cursor-pointer"
        >
          {preset.helper}
        </label>
      </div>
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
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <Tabs.Root
      className="flex flex-col w-[300px] shadow-[0_2px_10px] shadow-blackA4"
      defaultValue="tab1"
      value={activeTab}
      onValueChange={(t) => setActiveTab(t)}
    >
      <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
        <Tabs.Trigger
          className={`${
            activeTab === 'tab1' && 'border-b-2 border-purple-700 '
          } text-purple-700 grow px-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black`}
          value="tab1"
        >
          Basic
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`${
            activeTab === 'tab2' && 'border-b-2 border-purple-700 '
          } text-purple-700 grow px-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black`}
          value="tab2"
        >
          Advanced
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none " value="tab1">
        <div className="ml-3 space-y-3">
          <p>Use the presets to quickly set which pieces are hidden in your games</p>
          <div className="flex flex-row gap-2 w-full">
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
        <Preset
          preset={{
            label: 'All visible',
            helper: 'Do not hide any pieces (or pawns)',
            data: [],
          }}
          setCheckedPieces={setCheckedPieces}
          isActive={arraysAreEqual(checkedPieces, [])}
        />
      </Tabs.Content>
      <Tabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        <div className="ml-3 space-y-3">
          <p>Use the checkboxes to set which pieces are hidden in your games</p>{' '}
          <div className="pieces-checkboxes">
            {pieceTypes.map((pieceType) => (
              <PieceCheckBox
                key={pieceType}
                pieceType={pieceType}
                isChecked={!checkedPieces.includes(pieceType)}
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
      </Tabs.Content>
    </Tabs.Root>
  )
}

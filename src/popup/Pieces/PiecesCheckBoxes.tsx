import { useEffect, useState } from 'react'
import PieceCheckBox from './PieceCheckBox'
import * as Tabs from '@radix-ui/react-tabs'

const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']

const ALL_HIDDEN = {
  label: 'Pieceless Puzzles',
  helper: 'Hide all game pieces',
  data: ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'],
}
const PAWNS_ONLY = {
  label: 'Pawn Party',
  helper: 'Hide all pieces except pawns',
  data: ['rook', 'knight', 'bishop', 'queen', 'king'],
}
const KINGS_ROOKS_AND_QUEENS = {
  label: 'Vive la révolution!',
  helper: 'The king and queen are nowhere to be found',
  data: ['queen', 'king'],
}

function arraysAreEqual(arr1: string[], arr2: string[]) {
  // Sort both arrays
  const sortedArr1 = arr1.slice().sort()
  const sortedArr2 = arr2.slice().sort()

  // Compare the sorted arrays using JSON.stringify()
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)
}

export const PieceMap = {
  king: '♔',
  queen: '♕',
  rook: '♖',
  bishop: '♗',
  knight: '♘',
  pawn: '♙',
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
  const commonClasses =
    'relative flex flex-col flex-grow-0 items-center justify-center gap-1 p-3 rounded-md border '
  const activeClasses =
    'bg-blue-100 text-gray-800 hover:text-gray-900 cursor-default border-blue-500'
  const inactiveClasses =
    'cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 border-gray-300'
  return (
    <div key={preset.label} className="relative">
      <div
        className={commonClasses + (isActive ? activeClasses : inactiveClasses)}
        onClick={() => setCheckedPieces(preset.data)}
        role="button"
      >
        {isActive && (
          <div className="absolute top-0 right-0">
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
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
        )}
        <div className="text-center text-xl">{preset.label}</div>
        <div className="flex flex-row gap-1">
          {preset.data.map((piece) => (
            <span key={piece} className="text-4xl text-gray-400 group-hover:text-gray-600">
              {PieceMap[piece as keyof typeof PieceMap]}
            </span>
          ))}
        </div>
        <p className="text-md text-gray-500 group-hover:text-gray-700">{preset.helper}</p>
      </div>
    </div>
  )
}

const inactiveHoveringClasses = 'hover:border-2 hover:bg-gray-100 hover:border-gray-300'
const Trigger = ({
  value,
  children,
  activeTab,
}: {
  value: string
  activeTab: string
  children: React.ReactNode
}) => {
  return (
    <Tabs.Trigger
      className={`${
        activeTab === value ? 'border-b-2 border-purple-700 ' : inactiveHoveringClasses
      } text-purple-700 grow px-5 rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black`}
      value={value}
    >
      {children}
    </Tabs.Trigger>
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
  const preconfigured = [
    ALL_HIDDEN,
    PAWNS_ONLY,
    KINGS_ROOKS_AND_QUEENS,
    {
      label: 'Show all pieces',
      helper: 'Always show all pieces',
      data: [],
    },
  ]
  const isUsingPreconfigured = preconfigured.some((p) => arraysAreEqual(p.data, checkedPieces))
  const [activeTab, setActiveTab] = useState(isUsingPreconfigured ? 'tab1' : 'tab2')
  return (
    <Tabs.Root
      className="flex flex-col w-[300px] shadow-[0_2px_10px] shadow-blackA4"
      defaultValue="tab1"
      value={activeTab}
      onValueChange={(t) => setActiveTab(t)}
    >
      <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
        <Trigger value="tab1" activeTab={activeTab}>
          Presets
        </Trigger>
        <Trigger value="tab2" activeTab={activeTab}>
          Custom
        </Trigger>
      </Tabs.List>
      <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none " value="tab1">
        <div className="ml-3 space-y-3 text-gray-500">
          <p>Use the presets to choose which pieces are hidden in your games</p>
          <div className="flex flex-col gap-2 w-full">
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
      </Tabs.Content>
      <Tabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        <div className="ml-3 space-y-3">
          <p>Choose which pieces are kept on the board:</p>
          <div className="flex flex-col gap-2 w-full">
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

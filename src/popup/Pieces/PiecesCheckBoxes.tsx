import { useContext, useEffect, useState } from 'react'
import PieceCheckBox from './PieceCheckBox'
import * as Tabs from '@radix-ui/react-tabs'
import { AppStateContext, CHESS_PIECE_COLORS, CHESS_PIECE_NAMES } from '../lib/types'
import { stringifyChessPieceIdentifier } from '../lib/helpers'
import { Preset } from './Preset'

const ALL_HIDDEN = {
  label: 'Blindfold',
  helper: 'Hide all game pieces',
  data: new Set([
    'white_king',
    'white_queen',
    'white_rook',
    'white_bishop',
    'white_knight',
    'white_pawn',
    'black_king',
    'black_queen',
    'black_rook',
    'black_bishop',
    'black_knight',
    'black_pawn',
  ]),
}
const PAWNS_ONLY = {
  label: 'Pauper',
  helper: 'Hide all pieces except pawns',
  data: new Set([
    'white_king',
    'white_queen',
    'white_rook',
    'white_bishop',
    'white_knight',
    'black_king',
    'black_queen',
    'black_rook',
    'black_bishop',
    'black_knight',
  ]),
}
const WHITE_PAWN_PARTY = {
  label: 'Pawn',
  helper: "Hide all of white's pieces (except pawns)",
  data: new Set(['white_king', 'white_queen', 'white_rook', 'white_bishop', 'white_knight']),
}
const BLACK_PAWN_PARTY = {
  label: 'Party',
  helper: "Hide all of black's pieces (except pawns)",
  data: new Set(['black_king', 'black_queen', 'black_rook', 'black_bishop', 'black_knight']),
}
const PAWN_PARTY = [WHITE_PAWN_PARTY, BLACK_PAWN_PARTY]

const KINGS_ROOKS_AND_QUEENS = {
  label: 'Popular Revolt',
  helper: 'The kings and queens are nowhere to be found',
  data: new Set(['white_king', 'white_queen', 'black_king', 'black_queen']),
}

type Preset = {
  label: string
  helper: string
  data: Set<string>
}

function areSetsEqual(set1: Set<string>, set2: Set<string>) {
  if (set1.size !== set2.size) return false
  for (const item of set1) {
    if (!set2.has(item)) return false
  }
  return true
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
  pieces: Set<string>
  onChange: (pieces: Set<string>) => void
}) {
  const { delayOnHide, setDelayOnHide } = useContext(AppStateContext)
  const [checkedPieces, setCheckedPieces] = useState(pieces)

  useEffect(() => {
    onChange(checkedPieces)
  }, [checkedPieces])
  const preconfigured = [
    ALL_HIDDEN,
    PAWNS_ONLY,
    PAWN_PARTY,
    KINGS_ROOKS_AND_QUEENS,
    {
      label: 'Show all pieces',
      helper: 'Always show all pieces',
      data: new Set<string>([]),
    },
  ]
  const isUsingPreconfigured = preconfigured.some((p) => {
    if (!Array.isArray(p)) {
      return areSetsEqual(p.data, checkedPieces)
    } else {
      return p.some((p) => areSetsEqual(p.data, checkedPieces))
    }
  })
  const [activeTab, setActiveTab] = useState(isUsingPreconfigured ? 'tab1' : 'tab2')

  const WHITE_PIECES = [
    'white_pawn',
    'white_knight',
    'white_bishop',
    'white_rook',
    'white_queen',
    'white_king',
  ]
  const BLACK_PIECES = [
    'black_pawn',
    'black_knight',
    'black_bishop',
    'black_rook',
    'black_queen',
    'black_king',
  ]
  const isUsingEveryWhitePiece = WHITE_PIECES.every((p) => checkedPieces.has(p))
  const isUsingEveryBlackPiece = BLACK_PIECES.every((p) => checkedPieces.has(p))
  const isUsingNoWhitePiece = WHITE_PIECES.every((p) => !checkedPieces.has(p))
  const isUsingNoBlackPiece = BLACK_PIECES.every((p) => !checkedPieces.has(p))

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
        <Trigger value="tab3" activeTab={activeTab}>
          Settings
        </Trigger>
      </Tabs.List>
      <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none " value="tab1">
        <div className="ml-3 space-y-3 text-gray-500">
          <p className="text-gray-300 hover:text-gray-500 hover:border-2 hover:border-gray-300 hover:bg-gray-100 rounded-md p-2">
            Use the presets to choose which pieces are hidden in your games
          </p>
          <div className="flex flex-col gap-2 w-full">
            {preconfigured.map((preset) => {
              const renderPreset = (p: Preset) => (
                <Preset
                  key={p.label}
                  preset={p}
                  setCheckedPieces={setCheckedPieces}
                  isActive={areSetsEqual(checkedPieces, p.data)}
                />
              )

              // is preset an array or a single preset?
              if (Array.isArray(preset)) {
                return (
                  <div key={preset[0].label} className="flex flex-row gap-2">
                    {preset.map(renderPreset)}
                  </div>
                )
              }
              if (preset) {
                return renderPreset(preset)
              }
            })}
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
            <div className="flex flex-row gap-1">
              <div className="w-1/3"></div>
              <div className="w-1/3">
                <div
                  id="white-pieces-toggle"
                  role="button"
                  onClick={() => {
                    if (isUsingNoWhitePiece) {
                      setCheckedPieces(new Set(Array.from(checkedPieces).concat(WHITE_PIECES)))
                    } else {
                      setCheckedPieces(
                        new Set(Array.from(checkedPieces).filter((p) => !WHITE_PIECES.includes(p))),
                      )
                    }
                  }}
                  className="cursor-pointer underline"
                >
                  {isUsingNoWhitePiece ? 'Remove all' : 'Add all'}
                </div>
              </div>

              <div className="w-1/3">
                <div
                  id="black-pieces-toggle"
                  role="button"
                  onClick={() => {
                    if (isUsingNoBlackPiece) {
                      setCheckedPieces(new Set(Array.from(checkedPieces).concat(BLACK_PIECES)))
                    } else {
                      setCheckedPieces(
                        new Set(Array.from(checkedPieces).filter((p) => !BLACK_PIECES.includes(p))),
                      )
                    }
                  }}
                  className="cursor-pointer underline"
                >
                  {isUsingNoBlackPiece ? 'Remove all' : 'Add all'}
                </div>
              </div>
            </div>
            {Object.values(CHESS_PIECE_NAMES).map((n) => {
              const name = n as CHESS_PIECE_NAMES
              return (
                <div key={name} className="flex flex-row gap-1">
                  <div className="w-1/3">{name}</div>
                  {[CHESS_PIECE_COLORS.WHITE, CHESS_PIECE_COLORS.BLACK].map((color) => {
                    return (
                      <div key={`${name}-${color}`} className="w-1/3">
                        <PieceCheckBox
                          name={name as CHESS_PIECE_NAMES}
                          color={color}
                          isChecked={
                            !checkedPieces?.has(stringifyChessPieceIdentifier({ name, color }))
                          }
                          onChange={(pieceType) => {
                            if (checkedPieces?.has(pieceType)) {
                              setCheckedPieces(
                                new Set(Array.from(checkedPieces).filter((p) => p !== pieceType)),
                              )
                            } else {
                              setCheckedPieces(new Set(Array.from(checkedPieces).concat(pieceType)))
                            }
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab3"
      >
        <div className="ml-3 space-y-3">
          <p>Choose how long to delay hiding the pieces</p>
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="delay-on-hide">{delayOnHide / 1000} seconds</label>
            <input
              type="range"
              min="0"
              max="10"
              step={0.1}
              value={delayOnHide / 1000}
              onChange={(e) => setDelayOnHide(e.target.valueAsNumber * 1000)}
            />
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

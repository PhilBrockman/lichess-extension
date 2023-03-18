import { CHESS_PIECE_COLORS, CHESS_PIECE_NAMES } from '../lib/types'
import { urlFromPiece } from '../HiddenPieces/HiddenPiece'
import { stringifyChessPieceIdentifier } from '../lib/helpers'
import * as React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

const Tooltipping = ({
  trigger,
  content,
}: {
  trigger: React.ReactNode
  content: React.ReactNode
}) => {
  return (
    <Tooltip.Provider skipDelayDuration={0} delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div className="your-div-classname" tabIndex={0}>
            {trigger}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            style={{
              zIndex: 99999,
            }}
            sideOffset={5}
            side={'bottom'}
          >
            {content}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function Preset({
  preset,
  setCheckedPieces,
  isActive,
}: {
  preset: {
    label: string
    helper: string
    data: Set<string>
  }
  setCheckedPieces: (pieces: Set<string>) => void
  isActive: boolean
}) {
  const commonClasses =
    'relative flex flex-col flex-grow-0 items-center justify-center gap-1 p-3 rounded-md border '
  const activeClasses =
    'bg-blue-100 text-gray-800 hover:text-gray-900 cursor-default border-blue-500'
  const inactiveClasses =
    'cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 border-gray-300'

  const invertedPiecRow = (color: CHESS_PIECE_COLORS) =>
    Object.values(CHESS_PIECE_NAMES).map((n) => {
      const name = n as CHESS_PIECE_NAMES
      const piece = stringifyChessPieceIdentifier({ color, name })
      if (preset.data.has(piece)) return null
      return (
        <img
          key={piece}
          src={urlFromPiece({
            name,
            color,
          })}
          className="w-6 h-6"
        />
      )
    })

  const trigger = (
    <div className="relative">
      <div
        className={commonClasses + (isActive ? activeClasses : inactiveClasses)}
        onClick={() => setCheckedPieces(preset.data)}
        role="button"
      >
        <div className="text-center text-xl">{preset.label}</div>
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
        <div>
          <div className="flex flex-row gap-1 justify-between flex-wrap">
            {invertedPiecRow(CHESS_PIECE_COLORS.WHITE)}
          </div>
          <div className="flex flex-row gap-1 justify-between flex-wrap">
            {invertedPiecRow(CHESS_PIECE_COLORS.BLACK)}
          </div>
        </div>
      </div>
    </div>
  )
  const content = (
    <div className="rounded-md p-3 border bg-gray-100 shadow border-3 border-gray-400">
      <p className="text-md text-gray-500 group-hover:text-gray-700">{preset.helper}</p>
    </div>
  )

  return <Tooltipping content={content} trigger={trigger} />
}

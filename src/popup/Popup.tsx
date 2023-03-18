import { allCombinationsOfChessPieces, stringifyChessPieceIdentifier } from './lib/helpers'
import {
  useHidePieces,
  showAllPieces,
  classNamesToChessPiece,
  getChessPieceLocation,
} from './lib/hidePieces'
import _ from 'lodash'
import { puzzleObserver } from './lib/basicObserver'
import { AppStateContext, SerializedChessPiece } from './lib/types'
import { useStorageSyncState } from './lib/useStorageSyncState'
import { LoadedContent } from './LoadedContent'
import { useCallback, useEffect, useState } from 'react'

const version = '_V6'
const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES_BY_COLOR' + version
const IS_ACTIVE = 'IS_ACTIVE' + version
const DELAY_ON_HIDE = 'DELAY_ON_HIDE' + version

function App() {
  // saved settings
  const [isActive, setIsActive, resetActive] = useStorageSyncState<boolean>(IS_ACTIVE, false)
  const [delayOnHide, setDelayOnHide, resetDelay] = useStorageSyncState<number>(DELAY_ON_HIDE, 2500)
  const [pieces, setPieces, resetPieces] = useStorageSyncState<Set<string>>(
    PREFERRED_HIDDEN_PIECES,
    allCombinationsOfChessPieces(),
  )
  const reset = () => {
    resetActive()
    resetDelay()
    resetPieces()
  }

  // local state
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const handleShowAllPieces = () => {
    showAllPieces()
    setHiddenPieces([])
  }
  const { hidePieces } = useHidePieces({
    PIECES_THAT_I_CAN_HIDE: pieces,
    delayTime: delayOnHide,
    isActive,
  })

  // hide pieces on load
  const hidePiecesHandler = useCallback(() => {
    if (!isActive) return handleShowAllPieces()
    if (pieces === undefined) return
    const pieceElements = document.querySelectorAll('piece')
    const newHiddenPieces = Array.from(pieceElements)
      .map((piece) => {
        const chessPiece = classNamesToChessPiece(piece.className)
        if (!chessPiece) {
          return {
            chessPiece: undefined,
            piece: undefined,
          }
        }
        return { chessPiece, piece }
      })
      .filter(
        ({ chessPiece }) => chessPiece && pieces.has(stringifyChessPieceIdentifier(chessPiece)),
      )
      .map(
        ({ piece }) => piece && getChessPieceLocation(piece as HTMLElement),
      ) as SerializedChessPiece[]

    setHiddenPieces(newHiddenPieces)
    hidePieces()
  }, [delayOnHide, isActive, pieces])

  useEffect(() => {
    const obs = puzzleObserver({
      newPuzzleCallback: () => {
        handleShowAllPieces()
      },
      pieceCallback: _.debounce(hidePiecesHandler, 100, { leading: true, trailing: true }),
    })
    return () => {
      obs?.disconnect()
    }
  }, [hidePiecesHandler])

  useEffect(() => {
    handleShowAllPieces()
    if (isActive) {
      hidePiecesHandler()
    }
  }, [isActive, pieces])

  return (
    <AppStateContext.Provider
      value={{
        pieces,
        setPieces,
        hiddenPieces,
        isActive,
        setIsActive,
        delayOnHide,
        setDelayOnHide,
        reset,
      }}
    >
      <div
        className="text-sm font-medium text-center text-gray-500 border-gray-200 py-3 "
        style={{ zIndex: 1000 }}
      >
        <LoadedContent />
      </div>
    </AppStateContext.Provider>
  )
}

export default App

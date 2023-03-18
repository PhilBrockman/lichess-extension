import { allCombinationsOfChessPieces } from './lib/helpers'
import { useHidePieces, showAllPieces } from './lib/hidePieces'
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
  const [hidingInterval, setHidingInterval] = useState<number | undefined>()
  const handleShowAllPieces = () => {
    showAllPieces()
    setHiddenPieces([])
  }
  const clearCurrentInterval = () => {
    clearInterval(hidingInterval)
    setHidingInterval(undefined)
  }
  const hidePieces = useHidePieces({
    PIECES_THAT_I_CAN_HIDE: pieces,
    setHiddenPieces,
    clearCurrentInterval,
    setHidingInterval,
  })

  useEffect(() => {
    console.log('hidingInterval', hidingInterval)
  }, [hidingInterval])

  // hide pieces on load
  const hidePiecesHandler = useCallback(() => {
    if (!isActive) return handleShowAllPieces()
    if (pieces === undefined) return
    hidePieces(delayOnHide)
  }, [delayOnHide, hidingInterval, isActive, pieces])

  useEffect(() => {
    const obs = puzzleObserver({
      newPuzzleCallback: () => {
        handleShowAllPieces()
      },
      pieceCallback: _.debounce(hidePiecesHandler, 300, { leading: true, trailing: true }),
    })
    return () => {
      obs?.disconnect()
    }
  }, [hidePiecesHandler])

  useEffect(() => {
    handleShowAllPieces()
    hidePiecesHandler()
  }, [pieces])

  useEffect(() => {
    if (!isActive) {
      handleShowAllPieces()
    } else {
      hidePiecesHandler()
    }
  }, [isActive])

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

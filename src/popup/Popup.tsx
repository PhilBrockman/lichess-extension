import { allCombinationsOfChessPieces } from './lib/helpers'
import { hidePieces, showAllPieces } from './lib/hidePieces'
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
  const [isActive, setIsActive] = useStorageSyncState<boolean>(IS_ACTIVE, false)
  const [delayOnHide, setDelayOnHide] = useStorageSyncState<number>(DELAY_ON_HIDE, 2500)
  const [pieces, setPieces] = useStorageSyncState<Set<string>>(
    PREFERRED_HIDDEN_PIECES,
    allCombinationsOfChessPieces(),
  )

  // local state
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const [hidingInterval, setHidingInterval] = useState<number | undefined>()

  const handleShowAllPieces = () => {
    showAllPieces()
    setHiddenPieces([])
    clearInterval(hidingInterval)
    setHidingInterval(undefined)
  }

  // hide pieces on load
  const hidePiecesHandler = useCallback(() => {
    if (!isActive) {
      clearInterval(hidingInterval)
      handleShowAllPieces()
      return
    }
    if (pieces === undefined) return
    const result = hidePieces({
      PIECES_THAT_I_CAN_HIDE: pieces,
      delayTime: delayOnHide,
      setHiddenPieces,
      hasStartedHiding: Boolean(hidingInterval),
    })
    result && setHidingInterval(result.interval)
  }, [delayOnHide, hidingInterval, isActive, pieces])

  useEffect(() => {
    const obs = puzzleObserver({
      newPuzzleCallback: () => {
        console.log('starting new puzzle')
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
      }}
    >
      <div className="space-y-3" style={{ zIndex: 1000 }}>
        <div className="text-sm font-medium text-center text-gray-500 border-gray-200 py-3 ">
          <LoadedContent />
        </div>
      </div>
    </AppStateContext.Provider>
  )
}

export default App

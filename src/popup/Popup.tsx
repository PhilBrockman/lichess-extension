import { allCombinationsOfChessPieces } from './lib/helpers'
import { hidePieces, showAllPieces } from './lib/hidePieces'
import _ from 'lodash'
import { basicObserver } from './lib/basicObserver'
import { AppStateContext, SerializedChessPiece } from './lib/types'
import { useStorageSyncState } from './lib/useStorageSyncState'
import { LoadedContent } from './LoadedContent'
import { useEffect, useState } from 'react'

const version = '_V4'
const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES_BY_COLOR' + version
const IS_ACTIVE = 'IS_ACTIVE' + version
const DELAY_ON_HIDE = 'DELAY_ON_HIDE' + version

function App() {
  // saved settings
  const [isActive, setIsActive] = useStorageSyncState<boolean>(IS_ACTIVE, false)
  const [delayOnHide, setDelayOnHide] = useStorageSyncState<number>(DELAY_ON_HIDE, 300)
  const [pieces, setPieces] = useStorageSyncState<Set<string>>(
    PREFERRED_HIDDEN_PIECES,
    allCombinationsOfChessPieces(),
  )

  // local state
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const [hidingInterval, setHidingInterval] = useState<number | undefined>()

  // hide pieces on load
  const hidePiecesHandler = () => {
    if (!isActive) {
      clearInterval(hidingInterval)
      showAllPieces()
      return
    }
    if (pieces === undefined) return
    if (hidingInterval) {
      clearInterval(hidingInterval)
    }
    const { interval, hiddenPieces } = hidePieces(pieces, delayOnHide)
    setHidingInterval(interval)
    setHiddenPieces(hiddenPieces)
  }

  useEffect(() => {
    const obs = basicObserver({
      callback: _.debounce(
        () => {
          hidePiecesHandler()
        },
        300,
        { leading: true },
      ),
    })
    hidePiecesHandler()
    return () => {
      obs?.disconnect()
    }
  }, [pieces, isActive])

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
          <LoadedContent
            isActive={isActive}
            pieces={pieces}
            setPieces={setPieces}
            hiddenPieces={hiddenPieces}
            setIsActive={setIsActive}
          />
        </div>
      </div>
    </AppStateContext.Provider>
  )
}

export default App

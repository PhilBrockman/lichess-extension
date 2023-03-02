import { useCallback, useEffect, useMemo, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces } from './lib/hidePieces'

const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES'
const ACTIVE_TAB_INDEX = 'ACTIVE_TAB_INDEX'
export const boardElement = document.querySelector('cg-board')

export const createObservations = (callback: () => void) => {
  const observerCallback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'PIECE') {
            callback()
          }
        })
        mutation.removedNodes.forEach((node) => {
          if (node.nodeName === 'PIECE') {
            callback()
          }
        })
      }
    }
  }
  // Create a new observer
  const observer = new MutationObserver(observerCallback)
  const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
  }
  if (!boardElement) return
  // Start observing the target node for configured mutations
  observer.observe(boardElement, observerOptions)
  return observer
}
export const createAnimationEndObservations = (callback: () => void) => {
  // create a new observer
  const observer = new MutationObserver((mutationsList) => {
    const lastMoves = document.querySelectorAll('square.last-move')
    // loop through each mutation that occurred
    for (let mutation of mutationsList) {
      // check if a piece element was added or removed
      if (mutation.target.nodeName === 'PIECE') {
        // check if the anim class was added or removed
        if (mutation.target.classList.contains('anim')) {
          // console.log('anim class added to piece')
          // do something when anim class is added
          // callback()
        } else {
          // console.log('checking', mutation.target)
          lastMoves.forEach((lastMove) => {
            // if (areElementsOverlapping(mutation.target, lastMove)) {
            console.log('anim class removed from piece', mutation.target)
            // do something when anim class is removed
            callback()
            // }
          })
        }
      }
    }
  })

  // start observing the chessboard element
  observer.observe(boardElement, { attributes: true, childList: true, subtree: true })
  return observer
}

function App() {
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const [activeTab, setActiveTab] = useState<number>()

  useEffect(() => {
    console.log('loading state')
    // load in pieces from chrome storage
    chrome.storage.sync.get([PREFERRED_HIDDEN_PIECES, ACTIVE_TAB_INDEX], (result) => {
      if (result[PREFERRED_HIDDEN_PIECES]) {
        setPieces(result[PREFERRED_HIDDEN_PIECES])
      }
      if (result[ACTIVE_TAB_INDEX]) {
        setActiveTab(result[ACTIVE_TAB_INDEX])
      }
    })
  }, [])

  useEffect(() => {
    const handleUpdateHiddenPieces = () => {
      const res = hidePieces(pieces)
      console.log({ newHiddenPieces: res })
      setHiddenPieces(res)
    }
    // update chrome storage
    chrome.storage.sync.set({ [PREFERRED_HIDDEN_PIECES]: pieces })
    const obs1 = createObservations(() => {
      console.count('create obs')
      handleUpdateHiddenPieces()
    })
    const obs2 = createAnimationEndObservations(() => {
      console.count('animation end')
      handleUpdateHiddenPieces()
    })
    handleUpdateHiddenPieces()
    return () => {
      // cleanup the observer
      obs1?.disconnect()
      obs2?.disconnect()
    }
  }, [pieces])

  useEffect(() => {
    console.log('active tab changed, updating hidden pieces')
    // update chrome storage
    chrome.storage.sync.set({ [ACTIVE_TAB_INDEX]: activeTab })
  }, [activeTab])

  return (
    <div className="absolute left-0 top-16" style={{ zIndex: 1000 }}>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <button
          onClick={() => {
            const res = hidePieces(pieces)
            console.log({ newHiddenPieces: res })
            setHiddenPieces(res)
          }}
        >
          Hide Pieces
        </button>
        <Content
          pieces={pieces}
          setPieces={setPieces}
          hiddenPieces={hiddenPieces}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  )
}

const Content = ({
  pieces,
  setPieces,
  hiddenPieces,
  activeTab,
  setActiveTab,
}: {
  pieces?: string[] | undefined
  setPieces: (pieces: string[]) => void
  hiddenPieces?: SerializedChessPiece[]
  activeTab: number
  setActiveTab: (index: number) => void
}) => {
  const content = [
    {
      label: 'Settings',
      content: <>{pieces && <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />}</>,
    },
    {
      label: 'Hidden Pieces',
      content: <>{hiddenPieces && <HiddenPieces pieces={hiddenPieces} />}</>,
    },
  ]
  return (
    <>
      <ul className="flex flex-row -mb-px">
        {content.map((tab, index) => {
          const isActive = index === activeTab
          const regularClasses =
            'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer'
          const activeClasses =
            'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'

          return (
            <li
              key={tab.label}
              className={isActive ? activeClasses : regularClasses}
              onClick={() => {
                setActiveTab(index)
                chrome.storage.local.set({ [ACTIVE_TAB_INDEX]: index })
              }}
            >
              {tab.label}
            </li>
          )
        })}
      </ul>
      <div className="max-h-96 overflow-y-auto">
        {activeTab !== undefined && content[activeTab]?.content}
      </div>
    </>
  )
}

export default App

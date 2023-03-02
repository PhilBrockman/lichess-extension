import { useCallback, useEffect, useMemo, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces } from './lib/hidePieces'

const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES'
const ACTIVE_TAB_INDEX = 'ACTIVE_TAB_INDEX'
export const boardElement = document.querySelector('cg-board')
const createObservations = (callback: () => void) => {
  const observerCallback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'style' &&
        !mutation.target.className.includes('dragging') &&
        !mutation.target.className.includes('anim') &&
        // !mutation.target.className.includes('last-move') &&
        !mutation.target.className.includes('move-dest')
      ) {
        callback()
      } else if (mutation.type === 'childList') {
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
const createAnimationEndObservations = (callback: () => void) => {
  const targetNode = boardElement

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true }

  // Create a new MutationObserver object
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.nodeName === 'PIECE') {
            // A new "piece" element has been added to the "parentBoard" element
            observeClassChanges(addedNode)
          }
        }
      } else if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class' &&
        !mutation.target.classList.contains('anim') &&
        mutation.target.classList.contains('piece')
      ) {
        // The class "anim" has been removed from a "piece" tag element
        console.log('Class "anim" has been removed from a "piece" tag element')
      }
    }
  })

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config)

  // Function to observe class changes of "piece" elements
  function observeClassChanges(pieceElement) {
    const pieceObserver = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          !mutation.target.classList.contains('anim')
        ) {
          // The class "anim" has been removed from the "piece" element
          console.log('Class "anim" has been removed from a "piece" element')
        }
      }
    })
    pieceObserver.observe(pieceElement, { attributes: true })
  }
}

function App() {
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const [activeTab, setActiveTab] = useState<number>()
  const handleUpdateHiddenPieces = () => {}
  useMemo(() => {
    const res = hidePieces(pieces)
    console.log({ newHiddenPieces: res })
    setHiddenPieces(res)
  }, [pieces])

  useEffect(() => {
    const observers = [
      createObservations(handleUpdateHiddenPieces),
      createAnimationEndObservations(handleUpdateHiddenPieces),
    ]

    // load in pieces from chrome storage
    chrome.storage.sync.get([PREFERRED_HIDDEN_PIECES, ACTIVE_TAB_INDEX], (result) => {
      if (result[PREFERRED_HIDDEN_PIECES]) {
        setPieces(result[PREFERRED_HIDDEN_PIECES])
      }
      if (result[ACTIVE_TAB_INDEX]) {
        setActiveTab(result[ACTIVE_TAB_INDEX])
      }
    })
    return () => {
      // cleanup the observer
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])
  useEffect(() => {
    handleUpdateHiddenPieces()
    // update chrome storage
    chrome.storage.sync.set({ [PREFERRED_HIDDEN_PIECES]: pieces })
  }, [pieces])

  useEffect(() => {
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

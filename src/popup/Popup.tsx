import { useCallback, useEffect, useMemo, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces } from './lib/hidePieces'
import _ from 'lodash'

const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES'
const ACTIVE_TAB_INDEX = 'ACTIVE_TAB_INDEX'

function areElementsOverlapping(element1: HTMLElement, element2: HTMLElement) {
  const rect1 = element1.getBoundingClientRect()
  const rect2 = element2.getBoundingClientRect()

  const overlapX = Math.max(
    0,
    Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left),
  )
  const overlapY = Math.max(
    0,
    Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top),
  )

  const area1 = (rect1.right - rect1.left) * (rect1.bottom - rect1.top)
  const area2 = (rect2.right - rect2.left) * (rect2.bottom - rect2.top)

  const overlapArea = overlapX * overlapY
  const totalArea = area1 + area2 - overlapArea

  return overlapArea / totalArea >= 0.95
}
const basicObserver = ({ callback }: { callback: (target: any) => void }) => {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if a <piece> element was added or removed
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'PIECE') {
            // console.log('A <piece> element was added to the <cg-board>!')
            callback(mutation.target)
          }
        }
        for (const node of mutation.removedNodes) {
          if (node.tagName === 'PIECE') {
            // console.log('A <piece> element was removed from the <cg-board>!')
            callback(mutation.target)
          }
        }
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Check if the 'anim' class was removed from a <piece> element
        const target = mutation.target
        if (target.tagName === 'PIECE' && !target.classList.contains('anim')) {
          // console.log("The 'anim' class was removed from a <piece> element!")
          callback(mutation.target)
        }
      }
    }
  })

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }

  // Start observing the target node for configured mutations
  observer.observe(document.body, config)
  return observer
}

function App() {
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()
  const [activeTab, setActiveTab] = useState<number>()

  useEffect(() => {
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
    console.log('creating observers')
    const obs3 = basicObserver({
      callback: _.debounce(
        () => {
          console.count('--->')
          setHiddenPieces(hidePieces(pieces))
        },
        500,
        { leading: true },
      ),
    })
    return () => {
      console.error('disconnecting observers')
      obs3?.disconnect()
    }
  }, [pieces])

  useEffect(() => {
    // update chrome storage
    console.log('updtangi storage')
    chrome.storage.sync.set({ [PREFERRED_HIDDEN_PIECES]: pieces })
    setHiddenPieces(hidePieces(pieces))
  }, [pieces])

  useEffect(() => {
    chrome.storage.sync.set({ [ACTIVE_TAB_INDEX]: activeTab })
  }, [activeTab])

  return (
    <div className="absolute left-0 top-16" style={{ zIndex: 1000 }}>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <button
          onClick={() => {
            setHiddenPieces(hidePieces(pieces))
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
  activeTab?: number
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
      <ul className="flex flex-row -mb-px bg-gray-200">
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

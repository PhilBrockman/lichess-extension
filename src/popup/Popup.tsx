import { useEffect, useState } from 'react'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces, showAllPieces } from './lib/hidePieces'
import _ from 'lodash'
import Settings from './Modal/Settings'

const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES'
const IS_ACTIVE = 'IS_ACTIVE'

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
  const [isActive, setIsActive] = useState<boolean>(false)
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()

  useEffect(() => {
    // load in pieces from chrome storage
    chrome.storage.sync.get([PREFERRED_HIDDEN_PIECES, IS_ACTIVE], (result) => {
      if (result[PREFERRED_HIDDEN_PIECES]) {
        setPieces(result[PREFERRED_HIDDEN_PIECES])
      }
      if (result[IS_ACTIVE]) {
        setIsActive(result[IS_ACTIVE])
      }
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const obs3 = basicObserver({
      callback: _.debounce(
        () => {
          setHiddenPieces(hidePieces(pieces))
        },
        300,
        { leading: true },
      ),
    })
    return () => {
      obs3?.disconnect()
    }
  }, [pieces, isActive])

  useEffect(() => {
    // update chrome storage
    chrome.storage.sync.set({ [PREFERRED_HIDDEN_PIECES]: pieces })
    if (!isActive) return
    setHiddenPieces(hidePieces(pieces))
  }, [pieces])

  const disableExtension = () => {
    setIsActive(false)
    showAllPieces()
  }

  useEffect(() => {
    chrome.storage.sync.set({ [IS_ACTIVE]: isActive })
    if (!isActive) {
      showAllPieces()
    } else {
      setHiddenPieces(hidePieces(pieces))
    }
  }, [isActive])

  return (
    <div className="" style={{ zIndex: 1000 }}>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <Content
          isActive={isActive}
          pieces={pieces}
          setPieces={setPieces}
          hiddenPieces={hiddenPieces}
          setIsActive={setIsActive}
        />
      </div>
    </div>
  )
}

const Content = ({
  isActive,
  pieces,
  setPieces,
  hiddenPieces,
  setIsActive,
}: {
  isActive: boolean
  pieces?: string[] | undefined
  setPieces: (pieces: string[]) => void
  hiddenPieces?: SerializedChessPiece[]
  setIsActive: (isActive: boolean) => void
}) => {
  return (
    <>
      <div>
        <div className="flex flex-row gap-3">
          {isActive ? (
            <>
              <button
                onClick={() => setIsActive(false)}
                className="px-4 py-2 text-sm font-medium text-center text-gray-500 border border-gray-200 rounded-md dark:text-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Disable
              </button>
              <Settings pieces={pieces} setPieces={setPieces} />
            </>
          ) : (
            <button
              onClick={() => {
                // set active to true
                setIsActive(true)
                // scroll all the way to the bottom of the container
                const container = document.querySelector('.puzzle__moves.areplay')
                console.log(container)
                if (container) {
                  setTimeout(() => {
                    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
                  }, 150)
                }
              }}
              className="w-full px-4 py-2 text-sm font-medium text-center text-gray-500 border border-gray-200 rounded-md dark:text-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Hide Pieces
            </button>
          )}
        </div>
        <div className="flex flex-row gap-3">
          <>{isActive && hiddenPieces && <HiddenPieces pieces={hiddenPieces} />}</>
        </div>
      </div>
    </>
  )
}

export default App

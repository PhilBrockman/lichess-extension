import { useEffect, useState } from 'react'
import {
  SerializedChessPiece,
  allCombinationsOfChessPieces,
  stringifyChessPieceIdentifier,
} from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'
import { hidePieces, showAllPieces } from './lib/hidePieces'
import _ from 'lodash'
import Settings from './Modal/Settings'

const PREFERRED_HIDDEN_PIECES = 'PREFERRED_HIDDEN_PIECES_BY_COLOR'
const IS_ACTIVE = 'IS_ACTIVE'

// function areElementsOverlapping(element1: HTMLElement, element2: HTMLElement) {
//   const rect1 = element1.getBoundingClientRect()
//   const rect2 = element2.getBoundingClientRect()

//   const overlapX = Math.max(
//     0,
//     Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left),
//   )
//   const overlapY = Math.max(
//     0,
//     Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top),
//   )

//   const area1 = (rect1.right - rect1.left) * (rect1.bottom - rect1.top)
//   const area2 = (rect2.right - rect2.left) * (rect2.bottom - rect2.top)

//   const overlapArea = overlapX * overlapY
//   const totalArea = area1 + area2 - overlapArea

//   return overlapArea / totalArea >= 0.95
// }
const basicObserver = ({ callback }: { callback: (target: any) => void }) => {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if a <piece> element was added or removed
        for (const node of mutation.addedNodes) {
          if ((node as any).tagName === 'PIECE') {
            // console.log('A <piece> element was added to the <cg-board>!')
            callback(mutation.target)
          }
        }
        for (const node of mutation.removedNodes) {
          if ((node as any).tagName === 'PIECE') {
            // console.log('A <piece> element was removed from the <cg-board>!')
            callback(mutation.target)
          }
        }
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Check if the 'anim' class was removed from a <piece> element
        const target = mutation.target
        if ((target as any).tagName === 'PIECE' && !(target as any).classList.contains('anim')) {
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
  const [isActive, setIsActive] = useState<boolean>()
  const [pieces, setPieces] = useState<Set<string>>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()

  useEffect(() => {
    // load in pieces from chrome storage
    chrome.storage.sync.get([PREFERRED_HIDDEN_PIECES, IS_ACTIVE], (result) => {
      if (result[PREFERRED_HIDDEN_PIECES]) {
        // convert object to set
        setPieces(new Set(Object.keys(result[PREFERRED_HIDDEN_PIECES])))
      } else {
        setPieces(allCombinationsOfChessPieces())
      }
      if (result[IS_ACTIVE]) {
        setIsActive(result[IS_ACTIVE])
      } else {
        setIsActive(false)
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
    if (pieces === undefined) return
    // convert set to object with values of true
    const storedPieces = Array.from(pieces).reduce((acc, piece) => {
      acc[piece] = true
      return acc
    }, {} as Record<string, boolean>)
    // update chrome storage
    chrome.storage.sync.set({ [PREFERRED_HIDDEN_PIECES]: storedPieces })
    if (!isActive) return
    setHiddenPieces(hidePieces(pieces))
  }, [pieces])

  useEffect(() => {
    chrome.storage.sync.set({ [IS_ACTIVE]: isActive })
    if (!isActive) {
      showAllPieces()
    } else {
      setHiddenPieces(hidePieces(pieces))
    }
  }, [isActive])

  return (
    <div className="space-y-3" style={{ zIndex: 1000 }}>
      <div className="text-sm font-medium text-center text-gray-500 border-gray-200 py-3 ">
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
  isActive?: boolean
  pieces?: Set<string> | undefined
  setPieces: (pieces: Set<string>) => void
  hiddenPieces?: SerializedChessPiece[]
  setIsActive: (isActive: boolean) => void
}) => {
  return (
    <>
      <div className="space-y-3 p-3">
        <div className="">
          {isActive ? (
            <div className="justify-between flex flex-row ">
              <Settings pieces={pieces} setPieces={setPieces} />
              <div className="flex flex-row space-x-2">
                {/* <a
                  href="https://chess.minuspieces.com/"
                  target="_blank"
                  className="px-2 py-1 flex items-center text-sm bg-yellow-500 rounded-md text-purple-700 hover:bg-yellow-600"
                >
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
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </a> */}

                {isActive && (
                  <button
                    className="float-right px-4 py-2 text-sm font-medium text-gray-700 rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsActive(false)}
                  >
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                // set active to true
                setIsActive(true)
                // scroll all the way to the bottom of the container
                const container = document.querySelector('.puzzle__moves.areplay')
                if (container) {
                  setTimeout(() => {
                    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
                  }, 150)
                }
              }}
              className="w-full px-4 py-2 text-sm font-medium text-center text-gray-500 border border-gray-200 rounded-md hover:bg-gray-400 bg-gray-200 transition-colors duration-200 hover:border-gray-400"
            >
              <span className="flex flex-row items-center justify-center gap-2">
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
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>

                <span>Hide Pieces</span>
              </span>
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

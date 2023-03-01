import { useEffect, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'

const PIECES_THAT_CAN_BE_HIDDEN = 'PIECES_THAT_CAN_BE_HIDDEN'
const ACTIVE_TAB_INDEX = 'ACTIVE_TAB_INDEX'

function App() {
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>([])
  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // console.log('message', message)
      switch (message.type) {
        case 'hidePieces':
          setHiddenPieces(message.pieces)
          break
      }
    })

    chrome.storage.local.get(PIECES_THAT_CAN_BE_HIDDEN, function (result) {
      if (result[PIECES_THAT_CAN_BE_HIDDEN]) {
        const parsed = JSON.parse(result[PIECES_THAT_CAN_BE_HIDDEN])
        setPieces(parsed)
      } else {
        setPieces(['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'])
      }
    })

    chrome.storage.local.get(ACTIVE_TAB_INDEX, function (result) {
      if (result[ACTIVE_TAB_INDEX]) {
        setActiveTab(result[ACTIVE_TAB_INDEX])
      } else {
        setActiveTab(0)
      }
    })
  }, [])
  useEffect(() => {
    if (pieces === undefined) return
    chrome.storage.local.set({ [PIECES_THAT_CAN_BE_HIDDEN]: JSON.stringify(pieces) })
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   if (!tabs[0]?.id) return
    //   chrome.tabs.sendMessage(tabs[0].id, { type: 'setPieces', pieces }, function (response) {
    //     console.log(response)
    //   })
    // })
  }, [pieces])

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
    <main>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
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
        {activeTab !== undefined && content[activeTab]?.content}
      </div>
    </main>
  )
}

export default App

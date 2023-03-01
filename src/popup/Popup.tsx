import { useEffect, useState } from 'react'
import PiecesCheckBoxes from './Pieces/PiecesCheckBoxes'
import { SerializedChessPiece } from './types'
import { HiddenPieces } from './HiddenPieces/HiddenPieces'

const PIECES_THAT_CAN_BE_HIDDEN = 'PIECES_THAT_CAN_BE_HIDDEN'

function App() {
  const [pieces, setPieces] = useState<string[]>()
  const [hiddenPieces, setHiddenPieces] = useState<SerializedChessPiece[]>()

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
  }, [])

  useEffect(() => {
    if (pieces === undefined) return
    chrome.storage.local.set({ [PIECES_THAT_CAN_BE_HIDDEN]: JSON.stringify(pieces) })
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]?.id) return
      chrome.tabs.sendMessage(tabs[0].id, { type: 'setPieces', pieces }, function (response) {
        console.log(response)
      })
    })
  }, [pieces])

  return (
    <main className="bg-red-400">
      {pieces && <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />}
      {hiddenPieces && <HiddenPieces pieces={hiddenPieces} />}
    </main>
  )
}

export default App

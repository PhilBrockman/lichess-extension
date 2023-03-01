import { useEffect, useState } from 'react'
import './Popup.css'

const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']

function PieceCheckBox({
  pieceType,
  isChecked,
  onChange,
}: {
  pieceType: string
  isChecked: boolean
  onChange: (pieceType: string) => void
}) {
  return (
    <div className="piece-checkbox">
      <input
        type="checkbox"
        id={pieceType}
        checked={isChecked}
        onChange={() => onChange(pieceType)}
      />
      <label htmlFor={pieceType}>{pieceType}</label>
    </div>
  )
}

function PiecesCheckBoxes({
  pieces,
  onChange,
}: {
  pieces: string[]
  onChange: (pieces: string[]) => void
}) {
  const [checkedPieces, setCheckedPieces] = useState(pieces)

  useEffect(() => {
    onChange(checkedPieces)
  }, [checkedPieces])

  return (
    <div className="pieces-checkboxes">
      {pieceTypes.map((pieceType) => (
        <PieceCheckBox
          key={pieceType}
          pieceType={pieceType}
          isChecked={checkedPieces.includes(pieceType)}
          onChange={(pieceType) => {
            if (checkedPieces.includes(pieceType)) {
              setCheckedPieces(checkedPieces.filter((p) => p !== pieceType))
            } else {
              setCheckedPieces([...checkedPieces, pieceType])
            }
          }}
        />
      ))}
    </div>
  )
}

function HiddenPiece(piece: { row: number; column: string; color: string; pieceName: string }) {
  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + piece.pieceName.slice(0, 1)
  }.png`

  return (
    <div className="hidden-piece">
      <img src={url} alt="" />
      <div className="hidden-piece__row">{piece.row}</div>
      <div className="hidden-piece__column">{piece.column}</div>
    </div>
  )
}

function HiddenPieces({
  pieces,
}: {
  pieces: {
    row: number
    column: string
    color: string
    pieceName: string
  }[]
}) {
  return (
    <div className="hidden-pieces">
      {pieces.map((piece) => (
        <HiddenPiece key={`${piece.row}${piece.column}`} {...piece} />
      ))}
    </div>
  )
}

const PIECES_THAT_CAN_BE_HIDDEN = 'PIECES_THAT_CAN_BE_HIDDEN'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')
  const [pieces, setPieces] = useState()
  const [hiddenPieces, setHiddenPieces] = useState()

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      console.log('message', message)
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
      chrome.tabs.sendMessage(tabs[0].id, { type: 'setPieces', pieces }, function (response) {
        console.log(response)
      })
    })
  }, [pieces])

  return (
    <main>
      {pieces && <PiecesCheckBoxes pieces={pieces} onChange={setPieces} />}
      {hiddenPieces && <HiddenPieces pieces={hiddenPieces} />}
    </main>
  )
}

export default App

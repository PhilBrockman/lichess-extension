import { boardElement } from '../Popup'
import { getTransformationFromChessNotation } from '../lib/hidePieces'
import { SerializedChessPiece } from '../types'

export function HiddenPiece(piece: SerializedChessPiece) {
  if (piece.color === 'ghost') return null
  const url = `https://www.chess.com/chess-themes/pieces/neo/150/${
    piece.color.slice(0, 1) + piece.pieceName.slice(0, 1)
  }.png`

  const handleClick = () => {
    const {
      translate: { x, y },
    } = getTransformationFromChessNotation(piece.column, piece.row)

    const rect = boardElement.getBoundingClientRect()
    const boardx = rect.left + window.scrollX
    const boardy = rect.top + window.scrollY

    const searchX = boardx + x
    const searchY = boardy + y

    console.log({
      x,
      y,
      boardx,
      boardy,
      searchX,
      searchY,
    })

    // create a letter a and place it at x, y
    const a = document.createElement('div')
    a.className = 'absolute left-0 top-0'
    a.style.transform = `translate(${x}px, ${y}px)`
    a.innerHTML = 'a'
    document.body.appendChild(a)

    const elements = document.getElementsByTagName('piece')
    const aboveElements = []
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const rect = element.getBoundingClientRect()

      // Check if the element's top-left corner is above the search location
      if (rect.top < y && rect.left < x) {
        aboveElements.push(element)
      }
    }

    // The aboveElements array now contains all elements that are above the search location
    console.log(aboveElements)

    //
  }

  return (
    <div
      className="flex flex-row gap-2 items-center cursor-pointer"
      onClick={handleClick}
      role="button"
    >
      <img src={url} className="w-8 h-8" />
      <div>
        <span>{piece.column}</span>
        <span>{piece.row}</span>
      </div>
    </div>
  )
}

console.info('chrome-ext template-react-ts content script')
// select the piece element
const board = document.querySelector('cg-board')
let PIECES_THAT_I_CAN_HIDE = []

// Options for the observer (which mutations to observe)
const observerOptions = {
  childList: true,
  attributes: true,
  subtree: true,
}

// Callback function to execute when mutations are observed
const observerCallback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (
      mutation.type === 'attributes' &&
      mutation.attributeName === 'style' &&
      !mutation.target.className.includes('dragging') &&
      !mutation.target.className.includes('anim') &&
      !mutation.target.className.includes('last-move') &&
      !mutation.target.className.includes('move-dest')
    ) {
      hidePieces()
    } else if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'PIECE') {
          hidePieces()
        }
      })
      mutation.removedNodes.forEach((node) => {
        if (node.nodeName === 'PIECE') {
          hidePieces()
        }
      })
    }
  }
}

// Create a new observer
const observer = new MutationObserver(observerCallback)

// Start observing the target node for configured mutations
observer.observe(board, observerOptions)

function getChessPiecePosition(width, height, transformX, transformY) {
  const boardParent = document.querySelector('cg-container').parentElement
  // Calculate the size of each square on the chessboard
  const squareSize = width / 8
  // Apply the transformation to find the final position of the piece
  const finalX = transformX + squareSize / 2 // add half of square size to account for the piece's center position
  const finalY = transformY + squareSize / 2

  if (boardParent.classList.contains('orientation-white')) {
    // Divide the final position of the piece by the size of each square to get its rank and file
    const file = 1 + Math.floor(finalX / squareSize)
    const rank = 8 - Math.floor(finalY / squareSize) // invert the y-coordinate to account for the fact that the board is numbered from bottom to top

    // Return an object with the rank and file of the piece
    return {
      rank,
      file,
    }
  } else {
    // Divide the final position of the piece by the size of each square to get its rank and file
    const file = 8 - Math.floor(finalX / squareSize)
    const rank = 1 + Math.floor(finalY / squareSize) // invert the y-coordinate to account for the fact that the board is numbered from bottom to top

    // Return an object with the rank and file of the piece
    return {
      rank,
      file,
    }
  }
}

function getChessBoardDimensions() {
  const board = document.querySelector('cg-container')
  // Get the width and height of the chessboard
  const width = board.clientWidth
  const height = board.clientHeight

  // Return an object with the width and height of the chessboard
  return {
    width,
    height,
  }
}

function getTransformDirections(transform) {
  const regex = /translate\((-?\d+)px,\s*(-?\d+)px\)/
  const match = transform.match(regex)

  if (!match) {
    console.log('transform', transform)
    throw new Error(`Invalid transformation string: ${transform}`)
  }

  const [_, x, y] = match // extract the x and y values from the regex match

  return [parseInt(x), parseInt(y)]
}

function getChessPieceLocation(piece) {
  // Get the width and height of the chessboard
  const { width, height } = getChessBoardDimensions()

  // Get the transform values of the piece
  const transform = piece.style.transform

  if (!transform) return
  const [transformX, transformY] = getTransformDirections(transform)

  // Get the rank and file of the piece
  const { rank, file } = getChessPiecePosition(width, height, transformX, transformY)

  // Return an object with the rank and file of the piece
  const [color, pieceName] = piece.className.split(' ')
  return {
    row: rank,
    column: String.fromCharCode(96 + file),
    color,
    pieceName,
  }
}

const hidePieces = () => {
  const pieces = document.querySelectorAll('piece')
  const hiddenPieces = []
  pieces.forEach((piece) => {
    // if any of the class names are in PIECES_THAT_I_CAN_HIDE, hide the piece
    if (PIECES_THAT_I_CAN_HIDE.some((pieceName) => piece.className.includes(pieceName))) {
      piece.style.opacity = '0'
      hiddenPieces.push(getChessPieceLocation(piece))
    } else {
      piece.style.opacity = '1'
    }
  })

  chrome.runtime.sendMessage({
    type: 'hidePieces',
    pieces: hiddenPieces,
  })

  return hiddenPieces
}

chrome.runtime.sendMessage({ action: 'injectPopup' }, function (response) {
  console.log(response)
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'setPieces') {
    PIECES_THAT_I_CAN_HIDE = request.pieces
    hidePieces()
  }
  if (request.action === 'getPopupContent') {
    fetch(chrome.runtime.getURL('popup.html'))
      .then((response) => response.text())
      .then((html) => sendResponse(html))
      .catch((error) => console.error(error))
    return true // Tell Chrome that we want to send a response asynchronously
  }
})

chrome.storage.local.get('PIECES_THAT_CAN_BE_HIDDEN', function (result) {
  if (result.PIECES_THAT_CAN_BE_HIDDEN) {
    PIECES_THAT_I_CAN_HIDE = JSON.parse(result.PIECES_THAT_CAN_BE_HIDDEN)
    hidePieces()
  }
})

export {}

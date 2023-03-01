console.info('chrome-ext template-react-ts content script')
// select the piece element
const piece = document.querySelector('cg-board')

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
      console.log('A piece has moved:', mutation.target)
    } else if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'PIECE') {
          console.log('A piece has been added:', node)
        }
      })
      mutation.removedNodes.forEach((node) => {
        if (node.nodeName === 'PIECE') {
          console.log('A piece has been removed:', node)
        }
      })
    }
  }
}

// Create a new observer
const observer = new MutationObserver(observerCallback)

// Start observing the target node for configured mutations
observer.observe(piece, observerOptions)
export {}

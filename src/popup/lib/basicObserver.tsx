export function puzzleObserver({
  pieceCallback,
  newPuzzleCallback,
}: {
  pieceCallback: (target: any) => void
  newPuzzleCallback: () => void
}): MutationObserver {
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if a <piece> element was added or removed
        for (const node of mutation.addedNodes) {
          if ((node as any).tagName === 'PIECE') {
            pieceCallback(mutation.target)
          }
          // console.log('checknig node', node)
          if (node instanceof HTMLElement && node.matches('div.puzzle__feedback.play')) {
            newPuzzleCallback()
          }
        }
        for (const node of mutation.removedNodes) {
          if ((node as any).tagName === 'PIECE') {
            pieceCallback(mutation.target)
          }
        }
      } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Check if the 'anim' class was removed from a <piece> element
        const target = mutation.target
        if ((target as any).tagName === 'PIECE' && !(target as any).classList.contains('anim')) {
          pieceCallback(mutation.target)
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

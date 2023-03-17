export function basicObserver({ callback }: { callback: (target: any) => void }): MutationObserver {
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

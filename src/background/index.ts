chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // if (message.domCount) {
  //   // do something with the count
  // }
  console.log('message', message)
})

export {}

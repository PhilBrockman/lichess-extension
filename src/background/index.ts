// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // if (request.type === 'injectPopup') {
  //   // Get the URL of the popup page
  //   var popupUrl = chrome.runtime.getURL('popup.html')
  //   // Fetch the contents of the popup page as a string
  //   fetch(popupUrl)
  //     .then((response) => response.text())
  //     .then((popupContents) => {
  //       console.log('popupContents', popupContents)
  //       // Inject the popup contents into the active tab
  //       // chrome.tabs.executeScript(
  //       //   request.tabId,
  //       //   {
  //       //     code: `
  //       //   // Create a container element
  //       //   var container = document.createElement('div');
  //       //   container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;';
  //       //   // Create a popup element
  //       //   var popup = document.createElement('div');
  //       //   popup.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 10px;';
  //       //   // Add the contents of the popup to the popup element
  //       //   popup.innerHTML = '${popupContents}';
  //       //   // Add the popup element to the container element
  //       //   container.appendChild(popup);
  //       //   // Add the container element to the document body
  //       //   document.body.appendChild(container);
  //       // `,
  //       //   },
  //       //   function (result) {
  //       //     sendResponse(result)
  //       //   },
  //       // )
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       sendResponse({ error: error.message })
  //     })
  //   return true
  // }
})

export {}

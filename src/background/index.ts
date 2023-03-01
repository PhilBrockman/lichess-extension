// Listen for messages from the popup script
// background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // if (request.action === 'injectPopup') {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     chrome.tabs.executeScript(
  //       tabs[0].id,
  //       { code: 'document.body.innerHTML += "<div id=\\"extension-popup\\"></div>";' },
  //       function () {
  //         chrome.runtime.sendMessage({ action: 'getPopupContent' }, function (response) {
  //           chrome.tabs.executeScript(tabs[0].id, {
  //             code: `document.querySelector("#extension-popup").innerHTML = \`${response}\`;`,
  //           })
  //         })
  //       },
  //     )
  //   })
  // }
})

export {}

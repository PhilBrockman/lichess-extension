import { useEffect, useState } from 'react'
import './Popup.css'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // if (message.domCount) {
      //   // do something with the count
      // }
      console.log('message', message)
      setCrx(message)
    })
  }, [])

  return (
    <main>
      <h3>Popup Pageeee!</h3>

      <h6>v 0.0.0</h6>

      <a href="https://www.npmjs.com/package/create-chrome-ext" target="_blank"></a>
      {JSON.stringify(crx)}
    </main>
  )
}

export default App

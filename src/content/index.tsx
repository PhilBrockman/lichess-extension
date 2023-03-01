import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../popup/Popup'

// Create a new link element
const linkElement = document.createElement('link')

// Set the attributes for the link element
linkElement.rel = 'stylesheet'
linkElement.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'

// Inject the link element into the head of the page
document.head.appendChild(linkElement)

// Create a container element in the DOM where you can render your component
const container = document.createElement('div')
document.body.appendChild(container)

// Render your React component into the container element
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

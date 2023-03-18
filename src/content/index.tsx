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
const element = document.querySelectorAll('.puzzle__moves.areplay, .analyse__moves.areplay')
element?.[0].appendChild(container)

// const element = document.querySelector('.puzzle__board.main-board')
// // append "flex and flex-row" to the classList
// element?.classList.add('flex', 'flex-row')

// Get the element to be wrapped

// Create a new div element
// const div = document.createElement('div')
// div.classList.add('flex', 'flex-row')
// // Insert the div before the element in the DOM tree
// element.parentNode.insertBefore(div, element)
// // Move the element inside the new div
// div.appendChild(element)
// div.appendChild(container)

// Render your React component into the container element
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

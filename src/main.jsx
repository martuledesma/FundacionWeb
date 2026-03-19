import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app' 
import './index.css' // <--- ESTE ES EL ENCHUFE DEL CÓDIGO QUE PASASTE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
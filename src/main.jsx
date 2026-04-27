import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- ESTA LÍNEA
import App from './app'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- ESTO ENVOLVIENDO A APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
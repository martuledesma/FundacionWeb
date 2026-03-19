import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app' // Importa tu componente App
import './index.css'   // ESTO IMPORTA EL DISEÑO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
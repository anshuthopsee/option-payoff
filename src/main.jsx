import React from 'react'
import ReactDOM from 'react-dom/client'
import DarkModeContextProvider from './Contexts/DarkModeContextProvider.jsx'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
  </React.StrictMode>
  ,
)

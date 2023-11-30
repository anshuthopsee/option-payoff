import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import DarkModeContextProvider from './Contexts/DarkModeContextProvider.jsx'
import store from './store.js';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DarkModeContextProvider>
        <BrowserRouter basename="/option-payoff/">
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </DarkModeContextProvider>
    </Provider>
  </React.StrictMode>
  ,
);
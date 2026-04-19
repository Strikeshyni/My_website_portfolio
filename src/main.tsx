import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'
import './index.css'
import { API_BASE_URL } from './lib/api'

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

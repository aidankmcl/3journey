// import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
  // <Perf /> Doesn't work with strict mode
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { autoRestore } from './db/backup'

// Request persistent storage
if (navigator.storage?.persist) {
  navigator.storage.persist()
}

// Auto-restore from backup if IndexedDB was cleared
autoRestore().then(restored => {
  if (restored) console.log('[GymTracker] Data restored from auto-backup')
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

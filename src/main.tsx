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

// Force SW update check on every app open / return from background
async function checkForUpdates() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) {
      await reg.update()
      // If a new SW is waiting, activate it immediately
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    }
  } catch {}
}

// Check on load
checkForUpdates()

// Check when returning from background
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkForUpdates()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

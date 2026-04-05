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

// Save state before app goes to background (iOS fix)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // Force Zustand persist flush — localStorage.setItem is synchronous
    const state = JSON.parse(localStorage.getItem('gym-tracker-workout') || '{}')
    if (state?.state?.activeWorkout?.isActive) {
      localStorage.setItem('gym-tracker-workout', JSON.stringify(state))
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

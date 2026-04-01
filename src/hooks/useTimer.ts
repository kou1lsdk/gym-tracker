import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '../store/appStore'

export function useRestTimer() {
  const restTimerEnd = useAppStore((s) => s.activeWorkout.restTimerEnd)
  const clearRestTimer = useAppStore((s) => s.clearRestTimer)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!restTimerEnd) {
      setSecondsLeft(0)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((restTimerEnd - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        clearRestTimer()
        try { navigator.vibrate?.(300) } catch {}
      }
    }

    tick()
    intervalRef.current = setInterval(tick, 250)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [restTimerEnd, clearRestTimer])

  return { secondsLeft, isRunning: restTimerEnd !== null && secondsLeft > 0 }
}

export function useWakeLock() {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  const request = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        lockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {}
  }, [])

  const release = useCallback(async () => {
    try {
      await lockRef.current?.release()
      lockRef.current = null
    } catch {}
  }, [])

  return { request, release }
}

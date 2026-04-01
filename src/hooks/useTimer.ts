import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '../store/appStore'

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
    // Second beep
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.frequency.value = 1100
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
    osc2.start(ctx.currentTime + 0.2)
    osc2.stop(ctx.currentTime + 0.35)
  } catch {}
}

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
        try { navigator.vibrate?.([200, 100, 200]) } catch {}
        playBeep()
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

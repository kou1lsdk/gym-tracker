import { useRestTimer } from '../../hooks/useTimer'
import { useAppStore } from '../../store/appStore'
import { formatTimer } from '../../utils/dateUtils'

export function RestTimer() {
  const { secondsLeft, isRunning } = useRestTimer()
  const totalSeconds = useAppStore((s) => s.activeWorkout.restTimerTotal)
  const clearRestTimer = useAppStore((s) => s.clearRestTimer)

  if (!isRunning) return null

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  const circumference = 2 * Math.PI * 45 // r=45

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center gap-6">
      <p className="text-slate-400 text-lg">Відпочинок</p>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="#6366f1" strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <span className="text-5xl font-bold text-white tabular-nums">
          {formatTimer(secondsLeft)}
        </span>
      </div>
      <button
        onClick={clearRestTimer}
        className="px-8 py-3 rounded-2xl bg-slate-800 text-slate-300 text-lg font-medium active:bg-slate-700"
      >
        Пропустити
      </button>
    </div>
  )
}

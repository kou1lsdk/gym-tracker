import { useRestTimer } from '../../hooks/useTimer'
import { useAppStore } from '../../store/appStore'
import { formatTimer } from '../../utils/dateUtils'

export function RestTimer() {
  const { secondsLeft, isRunning } = useRestTimer()
  const clearRestTimer = useAppStore((s) => s.clearRestTimer)

  if (!isRunning) return null

  const progress = secondsLeft > 0 ? 1 : 0 // simplified

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center gap-6">
      <p className="text-slate-400 text-lg">Відпочинок</p>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="#6366f1" strokeWidth="6"
            strokeDasharray={`${progress * 283} 283`}
            strokeLinecap="round"
            className="transition-all duration-250"
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

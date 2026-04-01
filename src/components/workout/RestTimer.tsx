import { useRestTimer } from '../../hooks/useTimer'
import { useAppStore } from '../../store/appStore'
import { formatTimer } from '../../utils/dateUtils'

export function RestTimer() {
  const { secondsLeft, isRunning } = useRestTimer()
  const totalSeconds = useAppStore((s) => s.activeWorkout.restTimerTotal)
  const clearRestTimer = useAppStore((s) => s.clearRestTimer)

  if (!isRunning) return null

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  const circumference = 2 * Math.PI * 45

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center gap-8">
      <p className="text-[#8E8E93] text-lg font-medium">Відпочинок</p>
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1C1C1E" strokeWidth="5" />
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="#FF9F0A" strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <span className="text-5xl font-bold text-white tabular-nums tracking-tight">
          {formatTimer(secondsLeft)}
        </span>
      </div>
      <button
        onClick={clearRestTimer}
        className="px-8 py-3 rounded-2xl bg-[#1C1C1E] text-[#8E8E93] text-base font-medium active:bg-[#2C2C2E]"
      >
        Пропустити
      </button>
    </div>
  )
}

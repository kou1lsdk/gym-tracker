import { useState, useEffect, useRef } from 'react'
import type { PhaseExercise } from '../../data/warmup'

interface Props {
  title: string
  exercises: PhaseExercise[]
  onComplete: () => void
  onSkip: () => void
}

export function PhaseTimer({ title, exercises, onComplete, onSkip }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(exercises[0]?.duration ?? 0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = exercises[currentIndex]
  const isLast = currentIndex >= exercises.length - 1

  useEffect(() => {
    setSecondsLeft(exercises[currentIndex]?.duration ?? 0)
  }, [currentIndex, exercises])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Auto-advance
          if (isLast) {
            clearInterval(intervalRef.current!)
            onComplete()
            return 0
          }
          setCurrentIndex(i => i + 1)
          return exercises[currentIndex + 1]?.duration ?? 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [currentIndex, isLast])

  const handleNext = () => {
    if (isLast) {
      onComplete()
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (!current) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">
      <p className="text-sm text-[#8E8E93] font-medium">{title}</p>
      <p className="text-xs text-[#636366]">{currentIndex + 1} / {exercises.length}</p>

      {/* Timer circle */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1C1C1E" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="42"
            fill="none" stroke="#FF9F0A" strokeWidth="4"
            strokeDasharray={264}
            strokeDashoffset={264 * (1 - secondsLeft / (current.duration || 1))}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="text-4xl font-bold text-white tabular-nums">{secondsLeft}</span>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-bold text-white">{current.name}</p>
        <p className="text-sm text-[#8E8E93]">{current.desc}</p>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={onSkip}
          className="flex-1 py-3 rounded-xl bg-[#1C1C1E] text-[#636366] text-sm font-medium">
          Пропустити
        </button>
        <button onClick={handleNext}
          className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-semibold">
          {isLast ? 'Готово' : 'Далі →'}
        </button>
      </div>
    </div>
  )
}

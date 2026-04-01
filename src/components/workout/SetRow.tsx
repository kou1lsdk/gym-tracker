import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { NumberStepper } from '../ui/NumberStepper'

interface Props {
  setNumber: number
  targetReps: string
  lastWeight?: number
  lastReps?: number
  completed: boolean
  onComplete: (weight: number, reps: number) => void
}

export function SetRow({ setNumber, targetReps, lastWeight, lastReps, completed, onComplete }: Props) {
  const [weight, setWeight] = useState(lastWeight ?? 20)
  const [reps, setReps] = useState(lastReps ?? 0)

  useEffect(() => {
    if (lastWeight !== undefined) setWeight(lastWeight)
    if (lastReps !== undefined) setReps(lastReps)
  }, [lastWeight, lastReps])

  if (completed) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check size={16} className="text-emerald-400" />
        </div>
        <span className="text-sm text-slate-400">Підхід {setNumber}</span>
        <span className="ml-auto text-sm font-medium">{weight} кг × {reps}</span>
      </div>
    )
  }

  return (
    <div className="py-3 px-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-indigo-400">Підхід {setNumber}</span>
        <span className="text-xs text-slate-500">Ціль: {targetReps}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <NumberStepper value={weight} onChange={setWeight} step={2.5} label="кг" inputMode="decimal" />
        <NumberStepper value={reps} onChange={setReps} step={1} label="повт" />
      </div>
      <button
        onClick={() => {
          try { navigator.vibrate?.(50) } catch {}
          onComplete(weight, reps)
        }}
        disabled={reps === 0}
        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium active:bg-indigo-700 disabled:opacity-40 disabled:active:bg-indigo-600 transition-colors"
      >
        Записати ✓
      </button>
    </div>
  )
}

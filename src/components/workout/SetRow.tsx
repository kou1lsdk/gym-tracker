import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { NumberStepper } from '../ui/NumberStepper'

const DEFAULT_WEIGHTS: Record<string, number> = {
  bench_press: 40,
  incline_db_press: 24,
  seated_db_press: 16,
  lateral_raises: 8,
  tricep_pushdowns: 25,
  pullups: 0,
  barbell_row: 40,
  single_arm_row: 18,
  face_pulls: 15,
  bicep_curls: 12,
  squat: 50,
  romanian_deadlift: 40,
  leg_press: 80,
  leg_curls: 30,
  calf_raises: 40,
}

function parseTargetMid(target: string): number {
  const parts = target.split('-').map(Number)
  if (parts.length === 2) return Math.round((parts[0] + parts[1]) / 2)
  return parts[0] || 0
}

interface Props {
  setNumber: number
  exerciseId: string
  targetReps: string
  lastWeight?: number
  lastReps?: number
  previousSetWeight?: number
  previousSetReps?: number
  completed: boolean
  completedWeight?: number
  completedReps?: number
  onComplete: (weight: number, reps: number) => void
}

export function SetRow({
  setNumber, exerciseId, targetReps,
  lastWeight, lastReps,
  previousSetWeight, previousSetReps,
  completed, completedWeight, completedReps,
  onComplete,
}: Props) {
  const defaultWeight = previousSetWeight ?? lastWeight ?? DEFAULT_WEIGHTS[exerciseId] ?? 20
  const defaultReps = previousSetReps ?? lastReps ?? parseTargetMid(targetReps)

  const [weight, setWeight] = useState(defaultWeight)
  const [reps, setReps] = useState(defaultReps)

  useEffect(() => {
    if (!completed) {
      setWeight(previousSetWeight ?? lastWeight ?? DEFAULT_WEIGHTS[exerciseId] ?? 20)
      setReps(previousSetReps ?? lastReps ?? parseTargetMid(targetReps))
    }
  }, [previousSetWeight, previousSetReps, lastWeight, lastReps, exerciseId, targetReps, completed])

  if (completed) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check size={16} className="text-emerald-400" />
        </div>
        <span className="text-sm text-slate-400">Підхід {setNumber}</span>
        <span className="ml-auto text-sm font-medium">{completedWeight ?? weight} кг × {completedReps ?? reps}</span>
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

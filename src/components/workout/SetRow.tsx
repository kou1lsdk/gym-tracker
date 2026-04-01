import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { NumberStepper } from '../ui/NumberStepper'
import type { RPE } from '../../types/workout'
import { RPE_CONFIG } from '../../types/workout'

const DEFAULT_WEIGHTS: Record<string, number> = {
  bench_press: 40, incline_db_press: 24, seated_db_press: 16,
  lateral_raises: 8, tricep_pushdowns: 25, pullups: 0,
  barbell_row: 40, single_arm_row: 18, face_pulls: 15,
  bicep_curls: 12, squat: 50, romanian_deadlift: 40,
  leg_press: 80, leg_curls: 30, calf_raises: 40,
}

function parseTargetMid(target: string): number {
  const parts = target.split('-').map(Number)
  return parts.length === 2 ? Math.round((parts[0] + parts[1]) / 2) : parts[0] || 0
}

interface Props {
  setNumber: number
  exerciseId: string
  targetReps: string
  recommendedWeight?: number
  previousSetWeight?: number
  previousSetReps?: number
  completed: boolean
  completedWeight?: number
  completedReps?: number
  completedRpe?: RPE
  onComplete: (weight: number, reps: number, rpe: RPE) => void
}

export function SetRow({
  setNumber, exerciseId, targetReps,
  recommendedWeight, previousSetWeight, previousSetReps,
  completed, completedWeight, completedReps, completedRpe,
  onComplete,
}: Props) {
  const defaultWeight = recommendedWeight ?? previousSetWeight ?? DEFAULT_WEIGHTS[exerciseId] ?? 20
  const defaultReps = previousSetReps ?? parseTargetMid(targetReps)

  const [weight, setWeight] = useState(defaultWeight)
  const [reps, setReps] = useState(defaultReps)
  const [editingWeight, setEditingWeight] = useState(false)

  // Completed state
  if (completed) {
    const rpeEmoji = completedRpe ? RPE_CONFIG[completedRpe].emoji : '✓'
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-[#1C1C1E] rounded-2xl">
        <div className="w-7 h-7 rounded-full bg-[#30D158]/20 flex items-center justify-center">
          <Check size={14} className="text-[#30D158]" />
        </div>
        <span className="text-sm text-[#8E8E93]">Підхід {setNumber}</span>
        <span className="ml-auto text-sm font-medium text-white">
          {completedWeight} кг × {completedReps} {rpeEmoji}
        </span>
      </div>
    )
  }

  // Active state
  return (
    <div className="py-4 px-4 bg-[#1C1C1E] rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Підхід {setNumber}</span>
        <span className="text-xs text-[#636366]">Ціль: {targetReps} повт.</span>
      </div>

      {/* Weight display / editor */}
      <div className="flex items-center justify-between">
        {editingWeight ? (
          <NumberStepper value={weight} onChange={setWeight} step={2.5} label="кг" inputMode="decimal" />
        ) : (
          <button
            onClick={() => setEditingWeight(true)}
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl font-bold text-white tabular-nums">{weight}</span>
            <span className="text-lg text-[#636366]">кг</span>
            <Pencil size={14} className="text-[#636366] opacity-0 group-active:opacity-100" />
          </button>
        )}
        <NumberStepper value={reps} onChange={setReps} step={1} min={1} max={30} label="повт" />
      </div>

      {/* RPE Buttons - 4 options */}
      <div className="grid grid-cols-4 gap-2">
        {([6, 7, 8, 9] as RPE[]).map((rpe) => {
          const cfg = RPE_CONFIG[rpe]
          return (
            <button
              key={rpe}
              onClick={() => {
                try { navigator.vibrate?.(50) } catch {}
                onComplete(weight, reps, rpe)
              }}
              disabled={reps < 1}
              className="flex flex-col items-center gap-1 py-3 rounded-xl bg-[#2C2C2E] active:bg-[#38383A] disabled:opacity-30 transition-colors"
            >
              <span className="text-xl">{cfg.emoji}</span>
              <span className="text-[10px] text-[#8E8E93]">{cfg.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

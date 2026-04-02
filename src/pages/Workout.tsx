import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Play, Check, Pencil, ChevronDown, ChevronUp, X, Undo2 } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { RestTimer } from '../components/workout/RestTimer'
import { MonkeyMascot } from '../components/mascot/MonkeyMascot'
import { NumberStepper } from '../components/ui/NumberStepper'
import { useProfile } from '../hooks/useProfile'
import { useTodayWorkout, useWorkoutActions, useWorkoutSets, useExerciseLastSets } from '../hooks/useWorkout'
import { useMascot } from '../hooks/useMascot'
import { useAppStore } from '../store/appStore'
import { useWakeLock } from '../hooks/useTimer'
import { EXERCISES, getDefaultWeight } from '../data/exercises'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { autoBackup } from '../db/backup'
import type { RPE } from '../types/workout'
import { RPE_CONFIG } from '../types/workout'

// Default weights now calculated from body weight in getDefaultWeight()

export function Workout() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { programDay } = useTodayWorkout(profile?.trainingDays ?? [])
  const activeWorkout = useAppStore((s) => s.activeWorkout)
  const { startRestTimer } = useAppStore()
  const { beginWorkout, logSet, completeWorkout, cancelWorkout, undoLastSet } = useWorkoutActions()
  const sets = useWorkoutSets(activeWorkout.workoutLogId)
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()
  const { state: mascotState, onWorkoutComplete } = useMascot()
  const [showSummary, setShowSummary] = useState(false)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const activeDayId = activeWorkout.programDayId ?? selectedDayId ?? programDay?.id ?? PPL_BEGINNER.days[0].id
  const activeDay = PPL_BEGINNER.days.find((d) => d.id === activeDayId)!

  useEffect(() => {
    if (activeWorkout.isActive) {
      requestWakeLock()
      return () => { releaseWakeLock() }
    }
  }, [activeWorkout.isActive])

  const handleStart = async () => {
    await beginWorkout(activeDayId)
  }

  const handleFinish = async () => {
    if (activeWorkout.workoutLogId) {
      await completeWorkout(activeWorkout.workoutLogId)
      await onWorkoutComplete()
      await autoBackup()
      setShowSummary(true)
    }
  }

  // Total progress
  const totalSetsTarget = activeDay.exercises.reduce((s, e) => s + e.sets, 0)
  const completedTotal = sets.length
  const elapsed = activeWorkout.startedAt
    ? Math.round((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 60000)
    : 0

  // Summary
  if (showSummary) {
    const totalVolume = sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.actualReps ?? 0), 0)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
          {mascotState && <MonkeyMascot state={mascotState} />}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            <SBox value={sets.length} label="Підходів" />
            <SBox value={Math.round(totalVolume)} label="Обʼєм кг" />
            <SBox value={elapsed} label="Хвилин" />
          </div>
          <button onClick={() => { setShowSummary(false); navigate('/') }}
            className="w-full max-w-sm py-3.5 rounded-xl bg-white text-black font-semibold text-sm">
            На головну
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Pre-workout: day picker + exercise list
  if (!activeWorkout.isActive) {
    return (
      <PageWrapper title="Тренування">
        <div className="space-y-4">
          {/* Day picker */}
          <div className="flex gap-2">
            {PPL_BEGINNER.days.map((day) => (
              <button key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeDayId === day.id ? 'bg-white text-black' : 'bg-[#1C1C1E] text-[#8E8E93]'
                }`}>
                {day.shortName}
              </button>
            ))}
          </div>

          {/* Exercise list */}
          <div className="bg-[#1C1C1E] rounded-2xl divide-y divide-[#38383A]">
            {activeDay.exercises.map((ex, i) => (
              <div key={ex.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#636366] w-5">{i + 1}</span>
                  <span className="text-sm text-white">{ex.name}</span>
                </div>
                <span className="text-xs text-[#636366]">{ex.sets}×{ex.repsMin}-{ex.repsMax}</span>
              </div>
            ))}
          </div>

          <button onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm active:bg-[#E5E5EA] transition-colors flex items-center justify-center gap-2">
            <Play size={16} fill="black" /> Почати
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Active workout — SCROLLABLE VIEW of all exercises
  const allDone = completedTotal >= totalSetsTarget

  return (
    <PageWrapper>
      <RestTimer />
      <div className="space-y-3">
        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#636366]">{activeDay.shortName}</p>
            <p className="text-lg font-bold text-white">{completedTotal}/{totalSetsTarget} підходів</p>
          </div>
          <div className="flex items-center gap-2">
            {completedTotal > 0 && (
              <button onClick={async () => {
                await undoLastSet(activeWorkout.workoutLogId!)
              }} className="p-2 rounded-xl bg-[#1C1C1E] active:bg-[#2C2C2E]" title="Скасувати останній підхід">
                <Undo2 size={16} className="text-[#8E8E93]" />
              </button>
            )}
            <button onClick={() => {
              if (confirm('Скасувати тренування? Всі записи будуть видалені.')) {
                cancelWorkout(activeWorkout.workoutLogId!)
              }
            }} className="p-2 rounded-xl bg-[#1C1C1E] active:bg-[#2C2C2E]" title="Скасувати тренування">
              <X size={16} className="text-[#FF453A]" />
            </button>
            <div className="text-right ml-1">
              <p className="text-xs text-[#636366]">{elapsed} хв</p>
              <div className="w-16 h-1.5 bg-[#38383A] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#30D158] rounded-full transition-all"
                  style={{ width: `${(completedTotal / totalSetsTarget) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* All exercises in scroll */}
        {activeDay.exercises.map((exercise) => (
          <ExerciseBlock
            key={exercise.id}
            exercise={exercise}
            workoutLogId={activeWorkout.workoutLogId!}
            userWeight={profile?.weightKg ?? 70}
            completedSets={sets.filter(s => s.exerciseId === exercise.id)}
            onSetComplete={async (weight, reps, rpe) => {
              const exSets = sets.filter(s => s.exerciseId === exercise.id)
              await logSet(activeWorkout.workoutLogId!, exercise.id, exSets.length + 1, exercise.repsMax, reps, weight, rpe)
              if (exSets.length + 1 < exercise.sets) {
                startRestTimer(exercise.restSeconds)
              }
            }}
          />
        ))}

        {/* Finish */}
        {allDone ? (
          <button onClick={handleFinish} className="w-full py-3.5 rounded-xl bg-[#30D158] text-black font-semibold text-sm">
            Завершити 🎉
          </button>
        ) : completedTotal > 0 && (
          <button onClick={() => { if (confirm('Завершити достроково?')) handleFinish() }}
            className="w-full py-3 rounded-xl bg-[#1C1C1E] text-[#636366] text-sm">
            Завершити достроково
          </button>
        )}
      </div>
    </PageWrapper>
  )
}

// Single exercise block with all its sets
function ExerciseBlock({ exercise, workoutLogId, userWeight, completedSets, onSetComplete }: {
  exercise: { id: string; name: string; sets: number; repsMin: number; repsMax: number; restSeconds: number }
  workoutLogId: number
  userWeight: number
  completedSets: Array<{ setNumber: number; weightKg?: number; actualReps?: number; rpe?: number }>
  onSetComplete: (weight: number, reps: number, rpe: RPE) => Promise<void>
}) {
  const isDone = completedSets.length >= exercise.sets
  const exerciseInfo = EXERCISES[exercise.id]
  const lastWorkoutSets = useExerciseLastSets(exercise.id, workoutLogId)
  const [showTips, setShowTips] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const shouldShow = !isDone || !collapsed

  return (
    <div className={`bg-[#1C1C1E] rounded-2xl overflow-hidden transition-colors ${isDone ? 'opacity-60' : ''}`}>
      {/* Exercise header */}
      <button onClick={() => isDone ? setCollapsed(!collapsed) : setShowTips(!showTips)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="w-6 h-6 rounded-full bg-[#30D158]/20 flex items-center justify-center">
              <Check size={12} className="text-[#30D158]" />
            </div>
          ) : (
            <span className="w-6 h-6 rounded-full bg-[#2C2C2E] flex items-center justify-center text-xs text-[#8E8E93]">
              {completedSets.length}/{exercise.sets}
            </span>
          )}
          <span className={`text-sm font-medium ${isDone ? 'text-[#8E8E93]' : 'text-white'}`}>
            {exercise.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isDone && exerciseInfo && (
            <span className="text-[10px] text-[#636366]">💡 техніка</span>
          )}
          {isDone && (collapsed ? <ChevronDown size={16} className="text-[#636366]" /> : <ChevronUp size={16} className="text-[#636366]" />)}
        </div>
      </button>

      {/* Tips panel */}
      {showTips && !isDone && exerciseInfo && (
        <div className="mx-4 mb-3 p-3 bg-[#2C2C2E] rounded-xl space-y-1.5">
          {exerciseInfo.tip.map((t, i) => (
            <p key={i} className="text-[11px] text-[#8E8E93]">• {t}</p>
          ))}
          <p className="text-[11px] text-[#FF453A] mt-1">⚠ {exerciseInfo.errors}</p>
        </div>
      )}

      {shouldShow && (
        <div className="px-4 pb-4 space-y-2">
          {/* Last time reference */}
          {lastWorkoutSets.length > 0 && completedSets.length === 0 && (
            <p className="text-[11px] text-[#636366]">
              Минулого разу: {lastWorkoutSets.map(s => `${s.weightKg}×${s.actualReps}`).join(' / ')}
            </p>
          )}

          {/* Sets */}
          {Array.from({ length: exercise.sets }).map((_, i) => {
            const logged = completedSets.find(s => s.setNumber === i + 1)
            const prevLogged = i > 0 ? completedSets.find(s => s.setNumber === i) : undefined
            const lastTimeSet = lastWorkoutSets[i]

            if (logged) {
              const rpeEmoji = logged.rpe ? RPE_CONFIG[logged.rpe as keyof typeof RPE_CONFIG]?.emoji : '✓'
              return (
                <div key={i} className="flex items-center gap-2 py-1.5 text-sm">
                  <Check size={14} className="text-[#30D158]" />
                  <span className="text-[#8E8E93]">{i + 1}.</span>
                  <span className="text-white font-medium">{logged.weightKg}кг × {logged.actualReps}</span>
                  <span>{rpeEmoji}</span>
                </div>
              )
            }

            if (i > completedSets.length) return null

            const defWeight = prevLogged?.weightKg ?? lastTimeSet?.weightKg ?? getDefaultWeight(exercise.id, userWeight)
            const defReps = prevLogged?.actualReps ?? lastTimeSet?.actualReps ?? Math.round((exercise.repsMin + exercise.repsMax) / 2)

            return (
              <ActiveSetRow
                key={i}
                setNumber={i + 1}
                defaultWeight={defWeight}
                defaultReps={defReps}
                targetReps={`${exercise.repsMin}-${exercise.repsMax}`}
                onComplete={onSetComplete}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// The active set input — focused on speed
function ActiveSetRow({ setNumber, defaultWeight, defaultReps, targetReps, onComplete }: {
  setNumber: number
  defaultWeight: number
  defaultReps: number
  targetReps: string
  onComplete: (weight: number, reps: number, rpe: RPE) => Promise<void>
}) {
  const [weight, setWeight] = useState(defaultWeight)
  const [reps, setReps] = useState(defaultReps)
  const [editing, setEditing] = useState(false)
  const [showRpe, setShowRpe] = useState(false)

  if (showRpe) {
    return (
      <div className="bg-[#2C2C2E] rounded-xl p-3 space-y-2">
        <p className="text-xs text-[#8E8E93] text-center">Як відчувалось? ({weight}кг × {reps})</p>
        <div className="grid grid-cols-4 gap-2">
          {([6, 7, 8, 9] as RPE[]).map((rpe) => (
            <button key={rpe} onClick={() => {
              try { navigator.vibrate?.(50) } catch {}
              onComplete(weight, reps, rpe)
            }}
              className="flex flex-col items-center gap-0.5 py-2.5 rounded-xl bg-[#38383A] active:bg-[#48484A] transition-colors">
              <span className="text-lg">{RPE_CONFIG[rpe].emoji}</span>
              <span className="text-[9px] text-[#8E8E93]">{RPE_CONFIG[rpe].label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2C2C2E] rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8E8E93]">Підхід {setNumber} • {targetReps}</span>
      </div>

      {editing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#636366]">Вага</span>
            <NumberStepper value={weight} onChange={setWeight} step={2.5} inputMode="decimal" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#636366]">Повт.</span>
            <NumberStepper value={reps} onChange={setReps} step={1} min={1} max={30} />
          </div>
          <button onClick={() => setEditing(false)} className="w-full py-2 rounded-xl bg-[#38383A] text-sm text-white active:bg-[#48484A]">
            Готово
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button onClick={() => setEditing(true)} className="flex items-baseline gap-1.5 group">
            <span className="text-2xl font-bold text-white tabular-nums">{weight}</span>
            <span className="text-sm text-[#636366]">кг</span>
            <span className="text-lg text-[#636366] mx-1">×</span>
            <span className="text-2xl font-bold text-white tabular-nums">{reps}</span>
            <Pencil size={12} className="text-[#636366] ml-1 opacity-50" />
          </button>
          <button onClick={() => setShowRpe(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm active:bg-[#E5E5EA] transition-colors">
            Готово ✓
          </button>
        </div>
      )}
    </div>
  )
}

function SBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-[10px] text-[#636366]">{label}</p>
    </div>
  )
}

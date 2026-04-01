import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SetRow } from '../components/workout/SetRow'
import { RestTimer } from '../components/workout/RestTimer'
import { MonkeyMascot } from '../components/mascot/MonkeyMascot'
import { useProfile } from '../hooks/useProfile'
import { useTodayWorkout, useWorkoutActions, useWorkoutSets } from '../hooks/useWorkout'
import { useMascot } from '../hooks/useMascot'
import { useAppStore } from '../store/appStore'
import { useWakeLock } from '../hooks/useTimer'
import { EXERCISES } from '../data/exercises'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { autoBackup } from '../db/backup'
import type { RPE } from '../types/workout'
import { RPE_CONFIG } from '../types/workout'

export function Workout() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { programDay } = useTodayWorkout(profile?.trainingDays ?? [])
  const activeWorkout = useAppStore((s) => s.activeWorkout)
  const { startRestTimer } = useAppStore()
  const { beginWorkout, logSet, completeWorkout } = useWorkoutActions()
  const sets = useWorkoutSets(activeWorkout.workoutLogId)
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()
  const { state: mascotState, onWorkoutComplete } = useMascot()

  const [exerciseIndex, setExerciseIndex] = useState(activeWorkout.currentExerciseIndex || 0)
  const [showSummary, setShowSummary] = useState(false)

  const activeDayId = activeWorkout.programDayId ?? programDay?.id
  const activeDay = PPL_BEGINNER.days.find((d) => d.id === activeDayId)

  useEffect(() => {
    if (activeWorkout.isActive) {
      requestWakeLock()
      return () => { releaseWakeLock() }
    }
  }, [activeWorkout.isActive])

  const handleStart = async () => {
    const dayId = programDay?.id ?? PPL_BEGINNER.days[0].id
    await beginWorkout(dayId)
    setExerciseIndex(0)
  }

  const handleFinish = async () => {
    if (activeWorkout.workoutLogId) {
      await completeWorkout(activeWorkout.workoutLogId)
      await onWorkoutComplete()
      await autoBackup()
      setShowSummary(true)
    }
  }

  // Summary
  if (showSummary) {
    const totalVolume = sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.actualReps ?? 0), 0)
    const durationMin = activeWorkout.startedAt
      ? Math.round((Date.now() - new Date(activeWorkout.startedAt).getTime()) / 60000)
      : 0

    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
          {mascotState && <MonkeyMascot state={mascotState} />}

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            <StatBox value={sets.length} label="Підходів" />
            <StatBox value={Math.round(totalVolume)} label="Обʼєм кг" />
            <StatBox value={durationMin} label="Хвилин" />
          </div>

          <button
            onClick={() => { setShowSummary(false); navigate('/') }}
            className="w-full max-w-sm py-3.5 rounded-xl bg-white text-black font-semibold text-sm"
          >
            На головну
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Pre-workout: show today's plan
  if (!activeWorkout.isActive) {
    const day = programDay ?? PPL_BEGINNER.days[0]
    return (
      <PageWrapper title="Тренування">
        <div className="space-y-4">
          <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
            <p className="text-lg font-bold text-white">{day.name}</p>
            <div className="space-y-2">
              {day.exercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between py-1">
                  <span className="text-sm text-[#8E8E93]">{ex.name}</span>
                  <span className="text-xs text-[#636366]">{ex.sets}×{ex.repsMin}-{ex.repsMax}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm active:bg-[#E5E5EA] transition-colors"
          >
            Почати тренування
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Active workout
  if (!activeDay) return null
  const exercise = activeDay.exercises[exerciseIndex]
  if (!exercise) return null

  const exerciseSets = sets.filter((s) => s.exerciseId === exercise.id)
  const completedSetsCount = exerciseSets.length
  const exerciseInfo = EXERCISES[exercise.id]

  const handleSetComplete = async (weight: number, reps: number, rpe: RPE) => {
    if (!activeWorkout.workoutLogId) return
    await logSet(activeWorkout.workoutLogId, exercise.id, completedSetsCount + 1, exercise.repsMax, reps, weight, rpe)

    if (completedSetsCount + 1 < exercise.sets) {
      startRestTimer(exercise.restSeconds)
    } else if (exerciseIndex < activeDay.exercises.length - 1) {
      // Auto-advance to next exercise
      setTimeout(() => setExerciseIndex(exerciseIndex + 1), 300)
    }
  }

  const canGoNext = exerciseIndex < activeDay.exercises.length - 1
  const canGoPrev = exerciseIndex > 0
  const allDone = activeDay.exercises.every((ex) => {
    return sets.filter((s) => s.exerciseId === ex.id).length >= ex.sets
  })

  // Calculate recommended weight from last workout's RPE
  const getRecommendedWeight = (): number | undefined => {
    const lastSet = exerciseSets[exerciseSets.length - 1]
    if (lastSet?.weightKg && lastSet.rpe) {
      const delta = RPE_CONFIG[lastSet.rpe as keyof typeof RPE_CONFIG]?.nextSetDelta ?? 0
      return Math.max(0, lastSet.weightKg + delta)
    }
    return undefined
  }

  return (
    <PageWrapper>
      <RestTimer />
      <div className="space-y-4">
        {/* Exercise header */}
        <div className="flex items-center justify-between">
          <button onClick={() => canGoPrev && setExerciseIndex(exerciseIndex - 1)} disabled={!canGoPrev} className="p-2 disabled:opacity-20">
            <ChevronLeft size={24} className="text-[#8E8E93]" />
          </button>
          <div className="text-center flex-1">
            <p className="text-xs text-[#636366]">{exerciseIndex + 1} / {activeDay.exercises.length}</p>
            <h2 className="text-lg font-bold text-white">{exercise.name}</h2>
            <p className="text-xs text-[#636366]">{exercise.sets} × {exercise.repsMin}-{exercise.repsMax} • {exercise.restSeconds}с</p>
          </div>
          <button onClick={() => canGoNext && setExerciseIndex(exerciseIndex + 1)} disabled={!canGoNext} className="p-2 disabled:opacity-20">
            <ChevronRight size={24} className="text-[#8E8E93]" />
          </button>
        </div>

        {/* Tip */}
        {exerciseInfo?.tip && (
          <p className="text-xs text-[#8E8E93] bg-[#1C1C1E] rounded-xl px-3 py-2">
            💡 {exerciseInfo.tip}
          </p>
        )}

        {/* Sets */}
        <div className="space-y-2">
          {Array.from({ length: exercise.sets }).map((_, i) => {
            const setLog = exerciseSets.find((s) => s.setNumber === i + 1)
            const prevSet = i > 0 ? exerciseSets.find((s) => s.setNumber === i) : undefined
            return (
              <SetRow
                key={`${exercise.id}-${i}`}
                setNumber={i + 1}
                exerciseId={exercise.id}
                targetReps={`${exercise.repsMin}-${exercise.repsMax}`}
                recommendedWeight={getRecommendedWeight()}
                previousSetWeight={prevSet?.weightKg}
                previousSetReps={prevSet?.actualReps}
                completed={!!setLog}
                completedWeight={setLog?.weightKg}
                completedReps={setLog?.actualReps}
                completedRpe={setLog?.rpe as RPE | undefined}
                onComplete={handleSetComplete}
              />
            )
          })}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {activeDay.exercises.map((ex, i) => {
            const done = sets.filter((s) => s.exerciseId === ex.id).length >= ex.sets
            return (
              <button
                key={ex.id}
                onClick={() => setExerciseIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === exerciseIndex ? 'bg-white' : done ? 'bg-[#30D158]' : 'bg-[#38383A]'
                }`}
              />
            )
          })}
        </div>

        {/* Finish */}
        {allDone ? (
          <button onClick={handleFinish} className="w-full py-3.5 rounded-xl bg-[#30D158] text-black font-semibold text-sm">
            Завершити 🎉
          </button>
        ) : sets.length > 0 && (
          <button
            onClick={() => { if (confirm('Завершити тренування достроково?')) handleFinish() }}
            className="w-full py-3 rounded-xl bg-[#1C1C1E] text-[#636366] text-sm"
          >
            Завершити достроково
          </button>
        )}
      </div>
    </PageWrapper>
  )
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-[10px] text-[#636366]">{label}</p>
    </div>
  )
}

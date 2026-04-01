import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SetRow } from '../components/workout/SetRow'
import { RestTimer } from '../components/workout/RestTimer'
import { useProfile } from '../hooks/useProfile'
import { useTodayWorkout, useWorkoutActions, useWorkoutSets } from '../hooks/useWorkout'
import { useAppStore } from '../store/appStore'
import { useWakeLock } from '../hooks/useTimer'
import { uk } from '../locale/uk'
import { EXERCISES } from '../data/exercises'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { useEffect } from 'react'

export function Workout() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { programDay } = useTodayWorkout(profile?.trainingDays ?? [])
  const activeWorkout = useAppStore((s) => s.activeWorkout)
  const { startRestTimer } = useAppStore()
  const { beginWorkout, logSet, completeWorkout } = useWorkoutActions()
  const sets = useWorkoutSets(activeWorkout.workoutLogId)
  const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  // Determine which program day to use
  const activeDayId = activeWorkout.programDayId ?? selectedDayId ?? programDay?.id
  const activeDay = PPL_BEGINNER.days.find((d) => d.id === activeDayId)

  useEffect(() => {
    if (activeWorkout.isActive) {
      requestWakeLock()
      return () => { releaseWakeLock() }
    }
  }, [activeWorkout.isActive])

  const handleStart = async () => {
    if (!activeDayId) return
    await beginWorkout(activeDayId)
    setExerciseIndex(0)
  }

  const handleFinish = async () => {
    if (activeWorkout.workoutLogId) {
      await completeWorkout(activeWorkout.workoutLogId)
      setShowSummary(true)
    }
  }

  // Summary screen
  if (showSummary) {
    const totalVolume = sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.actualReps ?? 0), 0)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="text-6xl">🔥</div>
          <h1 className="text-2xl font-bold text-white">{uk.workout.great}</h1>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-400">{sets.length}</p>
              <p className="text-xs text-slate-400">{uk.workout.totalSets}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-400">{Math.round(totalVolume)}</p>
              <p className="text-xs text-slate-400">{uk.workout.totalVolume} (кг)</p>
            </div>
          </div>
          <button
            onClick={() => { setShowSummary(false); navigate('/') }}
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            На головн��
          </button>
        </div>
      </PageWrapper>
    )
  }

  // Day selection if no active workout
  if (!activeWorkout.isActive) {
    return (
      <PageWrapper title={uk.nav.workout}>
        <div className="space-y-3">
          <p className="text-sm text-slate-400">Обери тренування:</p>
          {PPL_BEGINNER.days.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border transition-colors ${
                activeDayId === day.id
                  ? 'bg-indigo-600/20 border-indigo-500'
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <p className="font-medium text-white">{day.name}</p>
              <p className="text-xs text-slate-400 mt-1">
                {day.exercises.length} вправ • {day.exercises.reduce((s, e) => s + e.sets, 0)} підходів
              </p>
            </button>
          ))}
          <button
            onClick={handleStart}
            disabled={!activeDayId}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold active:bg-indigo-700 disabled:opacity-40 transition-colors mt-4"
          >
            {uk.home.startWorkout} 💪
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

  const handleSetComplete = async (weight: number, reps: number) => {
    if (!activeWorkout.workoutLogId) return
    await logSet(
      activeWorkout.workoutLogId,
      exercise.id,
      completedSetsCount + 1,
      exercise.repsMax,
      reps,
      weight,
    )
    if (completedSetsCount + 1 < exercise.sets) {
      startRestTimer(exercise.restSeconds)
    }
  }

  const canGoNext = exerciseIndex < activeDay.exercises.length - 1
  const canGoPrev = exerciseIndex > 0
  const allExercisesDone = activeDay.exercises.every((ex) => {
    const exSets = sets.filter((s) => s.exerciseId === ex.id)
    return exSets.length >= ex.sets
  })

  return (
    <PageWrapper>
      <RestTimer />
      <div className="space-y-4">
        {/* Exercise navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExerciseIndex((i) => Math.max(0, i - 1))}
            disabled={!canGoPrev}
            className="p-2 rounded-lg disabled:opacity-20"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-xs text-slate-500">{exerciseIndex + 1} / {activeDay.exercises.length}</p>
            <h2 className="text-lg font-bold text-white">{exercise.name}</h2>
            <p className="text-xs text-slate-400">{exercise.sets} × {exercise.repsMin}-{exercise.repsMax} • відпочинок {exercise.restSeconds}с</p>
          </div>
          <button
            onClick={() => setExerciseIndex((i) => Math.min(activeDay.exercises.length - 1, i + 1))}
            disabled={!canGoNext}
            className="p-2 rounded-lg disabled:opacity-20"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Tip */}
        {exerciseInfo?.tip && (
          <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-xs text-amber-300">💡 {exerciseInfo.tip}</p>
          </div>
        )}

        {/* Sets */}
        <div className="space-y-2">
          {Array.from({ length: exercise.sets }).map((_, i) => {
            const setLog = exerciseSets.find((s) => s.setNumber === i + 1)
            return (
              <SetRow
                key={i}
                setNumber={i + 1}
                targetReps={`${exercise.repsMin}-${exercise.repsMax}`}
                lastWeight={setLog?.weightKg}
                lastReps={setLog?.actualReps}
                completed={!!setLog}
                onComplete={(w, r) => handleSetComplete(w, r)}
              />
            )
          })}
        </div>

        {/* Exercise dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {activeDay.exercises.map((ex, i) => {
            const exSets = sets.filter((s) => s.exerciseId === ex.id)
            const done = exSets.length >= ex.sets
            return (
              <button
                key={ex.id}
                onClick={() => setExerciseIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === exerciseIndex
                    ? 'bg-indigo-500'
                    : done
                    ? 'bg-emerald-500'
                    : 'bg-slate-600'
                }`}
              />
            )
          })}
        </div>

        {/* Finish button */}
        {allExercisesDone && (
          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold active:bg-emerald-700 transition-colors"
          >
            {uk.workout.finish} 🎉
          </button>
        )}

        {!allExercisesDone && sets.length > 0 && (
          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium active:bg-slate-700 transition-colors"
          >
            Завершити достроково
          </button>
        )}
      </div>
    </PageWrapper>
  )
}

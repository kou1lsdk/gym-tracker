import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { useAppStore } from '../store/appStore'
import { todayISO, nowISO, getTrainingDayIndex } from '../utils/dateUtils'

export function useTodayWorkout(trainingDays: number[]) {
  const dayIndex = getTrainingDayIndex(trainingDays)
  const program = PPL_BEGINNER
  if (dayIndex < 0) return { programDay: null, isTrainingDay: false, program }
  const programDay = program.days[dayIndex % program.days.length]
  return { programDay, isTrainingDay: true, program }
}

export function useWorkoutActions() {
  const { startWorkout: storeStart, finishWorkout: storeFinish } = useAppStore()

  async function beginWorkout(programDayId: string): Promise<number> {
    const id = await db.workoutLogs.add({
      date: todayISO(),
      programDayId,
      startedAt: nowISO(),
    })
    storeStart(id as number, programDayId)
    return id as number
  }

  async function logSet(workoutLogId: number, exerciseId: string, setNumber: number, targetReps: number, actualReps: number, weightKg: number) {
    await db.setLogs.add({
      workoutLogId,
      exerciseId,
      setNumber,
      targetReps,
      actualReps,
      weightKg,
      completed: true,
      timestamp: nowISO(),
    })
  }

  async function completeWorkout(workoutLogId: number) {
    await db.workoutLogs.update(workoutLogId, { completedAt: nowISO() })
    storeFinish()
  }

  return { beginWorkout, logSet, completeWorkout }
}

export function useWorkoutHistory(limit = 20) {
  return useLiveQuery(() =>
    db.workoutLogs.orderBy('date').reverse().limit(limit).toArray()
  , [limit]) ?? []
}

export function useWorkoutSets(workoutLogId: number | null) {
  return useLiveQuery(
    () => workoutLogId ? db.setLogs.where('workoutLogId').equals(workoutLogId).toArray() : [],
    [workoutLogId]
  ) ?? []
}

export function useLastSets(exerciseId: string) {
  return useLiveQuery(async () => {
    const sets = await db.setLogs
      .where('exerciseId')
      .equals(exerciseId)
      .reverse()
      .limit(10)
      .toArray()
    // Group by workoutLogId and return the most recent workout's sets
    if (sets.length === 0) return []
    const lastWorkoutId = sets[0].workoutLogId
    return sets.filter(s => s.workoutLogId === lastWorkoutId).reverse()
  }, [exerciseId]) ?? []
}

export function useExerciseProgress(exerciseId: string) {
  return useLiveQuery(async () => {
    const sets = await db.setLogs
      .where('exerciseId')
      .equals(exerciseId)
      .toArray()

    // Group by workout, find max weight per workout
    const byWorkout = new Map<number, { maxWeight: number; date: string }>()
    for (const s of sets) {
      if (!s.weightKg) continue
      const existing = byWorkout.get(s.workoutLogId)
      if (!existing || s.weightKg > existing.maxWeight) {
        byWorkout.set(s.workoutLogId, { maxWeight: s.weightKg, date: s.timestamp.slice(0, 10) })
      }
    }

    return Array.from(byWorkout.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [exerciseId]) ?? []
}

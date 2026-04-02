import { db } from '../db/database'
import { getDefaultWeight } from '../data/exercises'
import type { SetLog } from '../types/workout'

/** Brzycki formula: estimate 1-rep max from weight × reps */
export function calculateE1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return weight / (1.0278 - 0.0278 * reps)
}

/** Round to nearest 2.5kg */
function roundTo2_5(value: number): number {
  return Math.round(value / 2.5) * 2.5
}

/** Get recommended weight for next session based on RPE history */
export async function getSmartWeight(
  exerciseId: string,
  userWeight: number,
  currentWorkoutId: number,
): Promise<number> {
  // Get all sets for this exercise from PREVIOUS workouts
  const allSets = await db.setLogs
    .where('exerciseId')
    .equals(exerciseId)
    .toArray()

  const prevSets = allSets.filter(s => s.workoutLogId !== currentWorkoutId && s.weightKg && s.rpe)
  if (prevSets.length === 0) return getDefaultWeight(exerciseId, userWeight)

  // Group by workout, get the latest workout
  const byWorkout = new Map<number, SetLog[]>()
  for (const s of prevSets) {
    const arr = byWorkout.get(s.workoutLogId) ?? []
    arr.push(s)
    byWorkout.set(s.workoutLogId, arr)
  }

  const workoutIds = Array.from(byWorkout.keys()).sort((a, b) => b - a)
  const lastWorkoutSets = byWorkout.get(workoutIds[0]) ?? []
  if (lastWorkoutSets.length === 0) return getDefaultWeight(exerciseId, userWeight)

  const lastWeight = lastWorkoutSets[0].weightKg ?? 0
  const avgRpe = lastWorkoutSets.reduce((sum, s) => sum + (s.rpe ?? 7), 0) / lastWorkoutSets.length

  let delta = 0
  if (avgRpe <= 6) delta = 5        // Легко → +5кг
  else if (avgRpe <= 7) delta = 2.5  // Норм → +2.5кг
  else if (avgRpe <= 8) delta = 0    // Важко → та ж
  else delta = -2.5                   // Макс → -2.5кг

  return roundTo2_5(Math.max(0, lastWeight + delta))
}

/** Check if user needs a deload week */
export async function checkDeload(exerciseId: string): Promise<boolean> {
  const allSets = await db.setLogs
    .where('exerciseId')
    .equals(exerciseId)
    .toArray()

  if (allSets.length < 9) return false // need at least 3 workouts × 3 sets

  // Group by workout
  const byWorkout = new Map<number, SetLog[]>()
  for (const s of allSets) {
    const arr = byWorkout.get(s.workoutLogId) ?? []
    arr.push(s)
    byWorkout.set(s.workoutLogId, arr)
  }

  const workoutIds = Array.from(byWorkout.keys()).sort((a, b) => b - a)
  if (workoutIds.length < 3) return false

  // Check last 3 workouts: all RPE >= 9 and no weight increase
  const last3 = workoutIds.slice(0, 3).map(id => byWorkout.get(id)!)

  const allHighRpe = last3.every(sets => {
    const avg = sets.reduce((sum, s) => sum + (s.rpe ?? 7), 0) / sets.length
    return avg >= 8.5
  })

  const weights = last3.map(sets => Math.max(...sets.map(s => s.weightKg ?? 0)))
  const noProgress = weights[0] <= weights[2] // newest <= oldest

  return allHighRpe && noProgress
}

/** Get deload weight (50% of normal) */
export function getDeloadWeight(normalWeight: number): number {
  return roundTo2_5(normalWeight * 0.5)
}

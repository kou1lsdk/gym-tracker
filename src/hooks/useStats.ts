import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export function useBodyWeights(limit = 30) {
  return useLiveQuery(
    () => db.bodyWeights.orderBy('date').reverse().limit(limit).toArray().then(r => r.reverse()),
    [limit]
  ) ?? []
}

export function useLatestBodyWeight() {
  return useLiveQuery(async () => {
    const arr = await db.bodyWeights.orderBy('date').reverse().limit(1).toArray()
    return arr[0] ?? null
  }) ?? null
}

export function useNutritionToday(date: string) {
  return useLiveQuery(
    () => db.nutritionLogs.where('date').equals(date).toArray(),
    [date]
  ) ?? []
}

export function useWeekStreak() {
  return useLiveQuery(async () => {
    const logs = await db.workoutLogs.orderBy('date').reverse().limit(50).toArray()
    if (logs.length === 0) return 0

    const weeks = new Set<string>()
    for (const log of logs) {
      const d = new Date(log.date)
      const weekStart = new Date(d)
      weekStart.setDate(d.getDate() - d.getDay() + 1) // Monday
      weeks.add(weekStart.toISOString().slice(0, 10))
    }

    const sortedWeeks = Array.from(weeks).sort().reverse()
    let streak = 0
    const now = new Date()
    const currentWeekStart = new Date(now)
    currentWeekStart.setDate(now.getDate() - now.getDay() + 1)

    for (let i = 0; i < sortedWeeks.length; i++) {
      const expected = new Date(currentWeekStart)
      expected.setDate(expected.getDate() - i * 7)
      if (sortedWeeks[i] === expected.toISOString().slice(0, 10)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }) ?? 0
}

import Dexie, { type Table } from 'dexie'
import type { WorkoutLog, SetLog, BodyWeight, NutritionLog, UserProfile, Mascot } from '../types/workout'

class GymTrackerDB extends Dexie {
  workoutLogs!: Table<WorkoutLog>
  setLogs!: Table<SetLog>
  bodyWeights!: Table<BodyWeight>
  nutritionLogs!: Table<NutritionLog>
  userProfile!: Table<UserProfile>
  mascot!: Table<Mascot>

  constructor() {
    super('GymTrackerDB')

    this.version(1).stores({
      workoutLogs: '++id, date, programDayId',
      setLogs: '++id, workoutLogId, exerciseId, timestamp',
      bodyWeights: '++id, &date',
      nutritionLogs: '++id, date',
      userProfile: '++id',
    })

    this.version(2).stores({
      workoutLogs: '++id, date, programDayId',
      setLogs: '++id, workoutLogId, exerciseId, timestamp',
      bodyWeights: '++id, &date',
      nutritionLogs: '++id, date',
      userProfile: '++id',
      mascot: '++id',
    }).upgrade(tx => {
      // mascot table is auto-created, seed it
      return tx.table('mascot').count().then(count => {
        if (count === 0) {
          return tx.table('mascot').add({
            id: 1,
            level: 1,
            xp: 0,
            mood: 3,
            streak: 0,
            lastWorkoutDate: '',
            createdAt: new Date().toISOString(),
          })
        }
      })
    })
  }
}

export const db = new GymTrackerDB()

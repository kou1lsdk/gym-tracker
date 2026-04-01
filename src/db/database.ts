import Dexie, { type Table } from 'dexie'
import type { WorkoutLog, SetLog, BodyWeight, NutritionLog, UserProfile } from '../types/workout'

class GymTrackerDB extends Dexie {
  workoutLogs!: Table<WorkoutLog>
  setLogs!: Table<SetLog>
  bodyWeights!: Table<BodyWeight>
  nutritionLogs!: Table<NutritionLog>
  userProfile!: Table<UserProfile>

  constructor() {
    super('GymTrackerDB')
    this.version(1).stores({
      workoutLogs: '++id, date, programDayId',
      setLogs: '++id, workoutLogId, exerciseId, timestamp',
      bodyWeights: '++id, &date',
      nutritionLogs: '++id, date',
      userProfile: '++id',
    })
  }
}

export const db = new GymTrackerDB()

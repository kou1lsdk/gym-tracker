export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  sets: number
  repsMin: number
  repsMax: number
  restSeconds: number
  notes?: string
}

export interface ProgramDay {
  id: string
  name: string
  shortName: string
  exercises: Exercise[]
}

export interface Program {
  id: string
  name: string
  description: string
  days: ProgramDay[]
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'

export interface WorkoutLog {
  id?: number
  date: string
  programDayId: string
  startedAt: string
  completedAt?: string
  notes?: string
}

export interface SetLog {
  id?: number
  workoutLogId: number
  exerciseId: string
  setNumber: number
  targetReps: number
  actualReps?: number
  weightKg?: number
  completed: boolean
  timestamp: string
}

export interface BodyWeight {
  id?: number
  date: string
  weightKg: number
  notes?: string
}

export interface NutritionLog {
  id?: number
  date: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  notes?: string
}

export interface UserProfile {
  id?: number
  name: string
  heightCm: number
  weightKg: number
  age: number
  sex: 'male' | 'female'
  activityLevel: number
  goal: 'bulk' | 'cut' | 'maintain'
  trainingDays: number[]
  notificationTime: string
  createdAt: string
  updatedAt: string
}

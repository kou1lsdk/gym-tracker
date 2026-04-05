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

// RIR = Reps In Reserve (скільки ще міг зробити)
export type RPE = 6 | 7 | 8 | 9 | 10

// Stored as RPE internally, displayed as RIR to user
export const RPE_CONFIG = {
  6:  { label: '4+', desc: 'Ще багато міг', emoji: '😊', nextSetDelta: 2.5, nextWorkoutDelta: 2.5 },
  7:  { label: '2-3', desc: 'Нормально',   emoji: '💪', nextSetDelta: 0,   nextWorkoutDelta: 0 },
  8:  { label: '1',   desc: 'На межі',      emoji: '🔥', nextSetDelta: 0,   nextWorkoutDelta: 0 },
  9:  { label: '0',   desc: 'Відмова',      emoji: '💀', nextSetDelta: -2.5, nextWorkoutDelta: -2.5 },
  10: { label: '0',   desc: 'Відмова',      emoji: '💀', nextSetDelta: -2.5, nextWorkoutDelta: -2.5 },
} as const

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
  rpe?: RPE
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

export interface Mascot {
  id?: number
  level: number
  xp: number
  mood: number // 1-5
  streak: number
  lastWorkoutDate: string
  createdAt: string
}

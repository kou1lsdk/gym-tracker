import { create } from 'zustand'

interface ActiveWorkoutState {
  isActive: boolean
  workoutLogId: number | null
  programDayId: string | null
  currentExerciseIndex: number
  currentSetIndex: number
  restTimerEnd: number | null
  startedAt: string | null
}

interface AppStore {
  activeWorkout: ActiveWorkoutState
  startWorkout: (workoutLogId: number, programDayId: string) => void
  setExerciseIndex: (index: number) => void
  setSetIndex: (index: number) => void
  startRestTimer: (seconds: number) => void
  clearRestTimer: () => void
  finishWorkout: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeWorkout: {
    isActive: false,
    workoutLogId: null,
    programDayId: null,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    restTimerEnd: null,
    startedAt: null,
  },

  startWorkout: (workoutLogId, programDayId) =>
    set({
      activeWorkout: {
        isActive: true,
        workoutLogId,
        programDayId,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        restTimerEnd: null,
        startedAt: new Date().toISOString(),
      },
    }),

  setExerciseIndex: (index) =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, currentExerciseIndex: index, currentSetIndex: 0 },
    })),

  setSetIndex: (index) =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, currentSetIndex: index },
    })),

  startRestTimer: (seconds) =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, restTimerEnd: Date.now() + seconds * 1000 },
    })),

  clearRestTimer: () =>
    set((state) => ({
      activeWorkout: { ...state.activeWorkout, restTimerEnd: null },
    })),

  finishWorkout: () =>
    set({
      activeWorkout: {
        isActive: false,
        workoutLogId: null,
        programDayId: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        restTimerEnd: null,
        startedAt: null,
      },
    }),
}))

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ActiveWorkoutState {
  isActive: boolean
  workoutLogId: number | null
  programDayId: string | null
  currentExerciseIndex: number
  currentSetIndex: number
  restTimerEnd: number | null
  restTimerTotal: number
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

const initialWorkout: ActiveWorkoutState = {
  isActive: false,
  workoutLogId: null,
  programDayId: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  restTimerEnd: null,
  restTimerTotal: 0,
  startedAt: null,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeWorkout: initialWorkout,

      startWorkout: (workoutLogId, programDayId) =>
        set({
          activeWorkout: {
            ...initialWorkout,
            isActive: true,
            workoutLogId,
            programDayId,
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
          activeWorkout: {
            ...state.activeWorkout,
            restTimerEnd: Date.now() + seconds * 1000,
            restTimerTotal: seconds,
          },
        })),

      clearRestTimer: () =>
        set((state) => ({
          activeWorkout: { ...state.activeWorkout, restTimerEnd: null, restTimerTotal: 0 },
        })),

      finishWorkout: () =>
        set({ activeWorkout: initialWorkout }),
    }),
    {
      name: 'gym-tracker-workout',
      partialize: (state) => ({ activeWorkout: state.activeWorkout }),
    }
  )
)

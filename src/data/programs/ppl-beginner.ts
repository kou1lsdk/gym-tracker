import type { Program } from '../../types/workout'

export const PROGRAM: Program = {
  id: 'fullbody_ab',
  name: 'Full Body A/B',
  description: 'Повне тіло, ротація A/B. Кожен мʼяз 2-3×/тиждень. Оптимально для новачка.',
  days: [
    {
      id: 'day_a',
      name: 'Full Body A — акцент Push',
      shortName: 'День A',
      exercises: [
        { id: 'squat', name: 'Присідання зі штангою', muscleGroup: 'quads', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
        { id: 'bench_press', name: 'Жим штанги лежачи', muscleGroup: 'chest', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'barbell_row', name: 'Тяга штанги в нахилі', muscleGroup: 'back', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'seated_db_press', name: 'Жим гантелей сидячи', muscleGroup: 'shoulders', sets: 2, repsMin: 10, repsMax: 12, restSeconds: 60 },
        { id: 'bicep_curls', name: 'Згинання з гантелями на біцепс', muscleGroup: 'biceps', sets: 2, repsMin: 10, repsMax: 12, restSeconds: 60 },
      ],
    },
    {
      id: 'day_b',
      name: 'Full Body B — акцент Pull',
      shortName: 'День B',
      exercises: [
        { id: 'romanian_deadlift', name: 'Румунська тяга зі штангою', muscleGroup: 'hamstrings', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
        { id: 'pullups', name: 'Тяга верхнього блоку', muscleGroup: 'back', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'incline_db_press', name: 'Жим гантелей на похилій лаві', muscleGroup: 'chest', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
        { id: 'face_pulls', name: 'Тяга на обличчя (блок)', muscleGroup: 'shoulders', sets: 2, repsMin: 12, repsMax: 15, restSeconds: 60 },
        { id: 'tricep_pushdowns', name: 'Розгинання на трицепс (блок)', muscleGroup: 'triceps', sets: 2, repsMin: 10, repsMax: 12, restSeconds: 60 },
      ],
    },
  ],
}

// Backward compat
export const PPL_BEGINNER = PROGRAM

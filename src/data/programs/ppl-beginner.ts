import type { Program } from '../../types/workout'

export const PPL_BEGINNER: Program = {
  id: 'ppl_beginner',
  name: 'Push / Pull / Legs',
  description: 'Класична програма для новачка на набір маси. 3 дні на тиждень.',
  days: [
    {
      id: 'push',
      name: 'Push — Груди, Плечі, Трицепс',
      shortName: 'Push',
      exercises: [
        { id: 'bench_press', name: 'Жим штанги лежачи', muscleGroup: 'chest', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'incline_db_press', name: 'Жим гантелей на похилій лаві', muscleGroup: 'chest', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
        { id: 'seated_db_press', name: 'Жим гантелей сидячи', muscleGroup: 'shoulders', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        { id: 'lateral_raises', name: 'Розведення гантелей в сторони', muscleGroup: 'shoulders', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        { id: 'tricep_pushdowns', name: 'Розгинання на трицепс', muscleGroup: 'triceps', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
      ],
    },
    {
      id: 'pull',
      name: 'Pull — Спина, Біцепс',
      shortName: 'Pull',
      exercises: [
        { id: 'pullups', name: 'Підтягування / Тяга верхнього блоку', muscleGroup: 'back', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'barbell_row', name: 'Тяга штанги в нахилі', muscleGroup: 'back', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
        { id: 'single_arm_row', name: 'Тяга гантелі однією рукою', muscleGroup: 'back', sets: 6, repsMin: 10, repsMax: 12, restSeconds: 45, notes: '3 на кожну руку' },
        { id: 'face_pulls', name: 'Тяга на обличчя', muscleGroup: 'shoulders', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        { id: 'bicep_curls', name: 'Згинання на біцепс', muscleGroup: 'biceps', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
      ],
    },
    {
      id: 'legs',
      name: 'Legs — Ноги',
      shortName: 'Legs',
      exercises: [
        { id: 'squat', name: 'Присідання зі штангою', muscleGroup: 'quads', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
        { id: 'romanian_deadlift', name: 'Румунська тяга', muscleGroup: 'hamstrings', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
        { id: 'leg_press', name: 'Жим ногами', muscleGroup: 'quads', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
        { id: 'leg_curls', name: 'Згинання ніг', muscleGroup: 'hamstrings', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        { id: 'calf_raises', name: 'Підйом на носки', muscleGroup: 'calves', sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
      ],
    },
  ],
}

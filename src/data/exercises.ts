import type { MuscleGroup } from '../types/workout'

interface ExerciseInfo {
  id: string
  name: string
  muscleGroup: MuscleGroup
  tip: string
}

export const EXERCISES: Record<string, ExerciseInfo> = {
  bench_press: {
    id: 'bench_press',
    name: 'Жим штанги лежачи',
    muscleGroup: 'chest',
    tip: 'Лопатки зведені, стопи на підлозі, гриф на рівні сосків',
  },
  incline_db_press: {
    id: 'incline_db_press',
    name: 'Жим гантелей на похилій лаві',
    muscleGroup: 'chest',
    tip: 'Кут лави 30-45°, лікті під 45° до тулуба',
  },
  seated_db_press: {
    id: 'seated_db_press',
    name: 'Жим гантелей сидячи',
    muscleGroup: 'shoulders',
    tip: 'Спина притиснута, не прогинай поперек',
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Розведення гантелей в сторони',
    muscleGroup: 'shoulders',
    tip: 'Лікті трохи зігнуті, піднімай до рівня плечей',
  },
  tricep_pushdowns: {
    id: 'tricep_pushdowns',
    name: 'Розгинання на трицепс',
    muscleGroup: 'triceps',
    tip: 'Лікті притиснуті до тулуба, рухається тільки передпліччя',
  },
  pullups: {
    id: 'pullups',
    name: 'Підтягування / Тяга верхнього блоку',
    muscleGroup: 'back',
    tip: 'Тягни до грудей, зводь лопатки внизу',
  },
  barbell_row: {
    id: 'barbell_row',
    name: 'Тяга штанги в нахилі',
    muscleGroup: 'back',
    tip: 'Нахил 45°, тягни до живота, спина рівна',
  },
  single_arm_row: {
    id: 'single_arm_row',
    name: 'Тяга гантелі однією рукою',
    muscleGroup: 'back',
    tip: 'Коліно і рука на лаві, тягни до стегна',
  },
  face_pulls: {
    id: 'face_pulls',
    name: 'Тяга на обличчя',
    muscleGroup: 'shoulders',
    tip: 'Тягни мотузку до рівня очей, розводь руки',
  },
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Згинання на біцепс',
    muscleGroup: 'biceps',
    tip: 'Лікті нерухомі, повна амплітуда',
  },
  squat: {
    id: 'squat',
    name: 'Присідання зі штангою',
    muscleGroup: 'quads',
    tip: 'Коліна в напрямку носків, сідай нижче паралелі',
  },
  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Румунська тяга',
    muscleGroup: 'hamstrings',
    tip: 'Ноги трохи зігнуті, відводь таз назад, спина рівна',
  },
  leg_press: {
    id: 'leg_press',
    name: 'Жим ногами',
    muscleGroup: 'quads',
    tip: 'Стопи на ширині плечей, не блокуй коліна вгорі',
  },
  leg_curls: {
    id: 'leg_curls',
    name: 'Згинання ніг',
    muscleGroup: 'hamstrings',
    tip: 'Повільний контрольований рух, не підкидай вагу',
  },
  calf_raises: {
    id: 'calf_raises',
    name: 'Підйом на носки',
    muscleGroup: 'calves',
    tip: 'Повна амплітуда: розтягни внизу, стисни вгорі',
  },
}

export const MUSCLE_GROUP_NAMES: Record<MuscleGroup, string> = {
  chest: 'Груди',
  back: 'Спина',
  shoulders: 'Плечі',
  biceps: 'Біцепс',
  triceps: 'Трицепс',
  quads: 'Квадрицепс',
  hamstrings: 'Біцепс стегна',
  glutes: 'Сідниці',
  calves: 'Литки',
  core: 'Кор',
}

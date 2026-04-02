import type { MuscleGroup } from '../types/workout'

interface ExerciseInfo {
  id: string
  name: string
  muscleGroup: MuscleGroup
  tip: string[]
  defaultWeightRatio: number // множник від ваги тіла
  errors: string // типова помилка
}

export const EXERCISES: Record<string, ExerciseInfo> = {
  bench_press: {
    id: 'bench_press',
    name: 'Жим штанги лежачи',
    muscleGroup: 'chest',
    defaultWeightRatio: 0.5, // 50% від ваги тіла
    tip: [
      'Лопатки зведені і притиснуті до лави',
      'Стопи твердо на підлозі, не відривай',
      'Опускай гриф до середини грудей',
      'Видихай на підйомі',
    ],
    errors: 'Не відривай таз від лави і не "пружинь" штангу від грудей',
  },
  incline_db_press: {
    id: 'incline_db_press',
    name: 'Жим гантелей на похилій лаві',
    muscleGroup: 'chest',
    defaultWeightRatio: 0.3,
    tip: [
      'Кут лави 30-45° (не вище!)',
      'Лікті під 45° до тулуба',
      'Зводь гантелі вгорі, не стукай',
    ],
    errors: 'Не закидай лікті вбік на 90° — це травмує плече',
  },
  seated_db_press: {
    id: 'seated_db_press',
    name: 'Жим гантелей сидячи',
    muscleGroup: 'shoulders',
    defaultWeightRatio: 0.2,
    tip: [
      'Спина повністю притиснута до спинки',
      'Не прогинай поперек',
      'Гантелі на рівні вух внизу, повне випрямлення вгорі',
    ],
    errors: 'Не нахиляйся назад — це перетворює жим плечей в жим грудей',
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Розведення гантелей в сторони',
    muscleGroup: 'shoulders',
    defaultWeightRatio: 0.1,
    tip: [
      'Лікті ЗАВЖДИ трохи зігнуті',
      'Піднімай до рівня плечей, не вище',
      'Уявляй що виливаєш воду з келихів',
    ],
    errors: 'Не бери занадто важкі — техніка важливіша за вагу тут',
  },
  tricep_pushdowns: {
    id: 'tricep_pushdowns',
    name: 'Розгинання на трицепс',
    muscleGroup: 'triceps',
    defaultWeightRatio: 0.3,
    tip: [
      'Лікті притиснуті до тулуба — не рухай їх!',
      'Рухається тільки передпліччя',
      'Повністю випрямляй руки внизу',
    ],
    errors: 'Не допомагай корпусом — тримай тіло нерухомо',
  },
  pullups: {
    id: 'pullups',
    name: 'Підтягування / Тяга верхнього блоку',
    muscleGroup: 'back',
    defaultWeightRatio: 0.5,
    tip: [
      'Тягни до верху грудей, не до підборіддя',
      'Зводь лопатки внизу руху',
      'Контролюй спуск — не падай вниз',
    ],
    errors: 'Не розгойдуйся (кіпінг) — це не рахується',
  },
  barbell_row: {
    id: 'barbell_row',
    name: 'Тяга штанги в нахилі',
    muscleGroup: 'back',
    defaultWeightRatio: 0.5,
    tip: [
      'Нахил корпусу ~45°, спина РІВНА',
      'Тягни штангу до живота/пупка',
      'Зводь лопатки у верхній точці',
    ],
    errors: 'Не округлюй спину — це пряма дорога до травми',
  },
  single_arm_row: {
    id: 'single_arm_row',
    name: 'Тяга гантелі однією рукою',
    muscleGroup: 'back',
    defaultWeightRatio: 0.25,
    tip: [
      'Коліно і рука на лаві для опори',
      'Тягни гантель до стегна, не до грудей',
      'Не крути корпус — тримай рівно',
    ],
    errors: 'Не підкидай вагу ривком — повільний контрольований рух',
  },
  face_pulls: {
    id: 'face_pulls',
    name: 'Тяга на обличчя',
    muscleGroup: 'shoulders',
    defaultWeightRatio: 0.2,
    tip: [
      'Тягни мотузку до рівня очей',
      'Розводь руки в сторони у кінцевій точці',
      'Це вправа для здоровʼя плечей — не гонися за вагою',
    ],
    errors: 'Не тягни до шиї/грудей — саме до обличчя',
  },
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Згинання на біцепс',
    muscleGroup: 'biceps',
    defaultWeightRatio: 0.15,
    tip: [
      'Лікті нерухомі і притиснуті до тулуба',
      'Повна амплітуда: знизу до верху',
      'Опускай повільно (2-3 секунди)',
    ],
    errors: 'Не розгойдуй корпус — якщо "читиш" значить вага завелика',
  },
  squat: {
    id: 'squat',
    name: 'Присідання зі штангою',
    muscleGroup: 'quads',
    defaultWeightRatio: 0.6,
    tip: [
      'Коліна в напрямку носків, не всередину!',
      'Сідай мінімум до паралелі стегон з підлогою',
      'Тримай груди високо, погляд вперед',
      'Вдихай на спуску, видихай на підйомі',
    ],
    errors: 'Не зводь коліна всередину — це найчастіша і найнебезпечніша помилка',
  },
  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Румунська тяга',
    muscleGroup: 'hamstrings',
    defaultWeightRatio: 0.5,
    tip: [
      'Ноги ТРОХИ зігнуті (не блокуй коліна)',
      'Відводь таз назад як ніби сідаєш на стілець далеко позаду',
      'Штанга ковзає по ногах — тримай близько до тіла',
      'Спина завжди рівна!',
    ],
    errors: 'Не округлюй поперек — це може травмувати спину',
  },
  leg_press: {
    id: 'leg_press',
    name: 'Жим ногами',
    muscleGroup: 'quads',
    defaultWeightRatio: 1.0,
    tip: [
      'Стопи на ширині плечей на платформі',
      'Не блокуй коліна у верхній точці!',
      'Опускай до ~90° в колінах',
    ],
    errors: 'НІКОЛИ не випрямляй коліна повністю — це дуже небезпечно',
  },
  leg_curls: {
    id: 'leg_curls',
    name: 'Згинання ніг',
    muscleGroup: 'hamstrings',
    defaultWeightRatio: 0.35,
    tip: [
      'Повільний контрольований рух',
      'Стисни біцепс стегна у верхній точці',
      'Не підкидай вагу ривком',
    ],
    errors: 'Не відривай стегна від лави — це знімає навантаження',
  },
  calf_raises: {
    id: 'calf_raises',
    name: 'Підйом на носки',
    muscleGroup: 'calves',
    defaultWeightRatio: 0.5,
    tip: [
      'Повна амплітуда: максимально розтягни внизу',
      'Затримайся на 1сек у верхній точці',
      'Не пружинь — контрольований рух',
    ],
    errors: 'Не скорочуй амплітуду — литки ростуть від повного розтягнення',
  },
}

export function getDefaultWeight(exerciseId: string, bodyWeightKg: number): number {
  const ex = EXERCISES[exerciseId]
  if (!ex) return 20
  return Math.round(bodyWeightKg * ex.defaultWeightRatio / 2.5) * 2.5 // round to 2.5
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

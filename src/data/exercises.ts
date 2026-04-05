import type { MuscleGroup } from '../types/workout'

export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight'

interface ExerciseInfo {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  isUnilateral: boolean // per arm/leg — sets are PER SIDE
  tip: string[]
  defaultWeightRatio: number // від ваги тіла (для гантелей = per hand)
  errors: string
  searchQuery: string // для YouTube пошуку
}

export const EXERCISES: Record<string, ExerciseInfo> = {
  bench_press: {
    id: 'bench_press',
    name: 'Жим штанги лежачи',
    muscleGroup: 'chest',
    equipment: 'barbell',
    isUnilateral: false,
    defaultWeightRatio: 0.5,
    tip: [
      'Лопатки зведені і притиснуті до лави',
      'Стопи твердо на підлозі, не відривай',
      'Опускай гриф до середини грудей',
      'Видихай на підйомі',
    ],
    errors: 'Не відривай таз від лави і не "пружинь" штангу від грудей',
    searchQuery: 'bench press form tutorial',
  },
  incline_db_press: {
    id: 'incline_db_press',
    name: 'Жим гантелей на похилій лаві',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    isUnilateral: false, // обидві руки одночасно
    defaultWeightRatio: 0.15, // per hand! 68кг → ~10кг per hand
    tip: [
      'Кут лави 30-45° (не вище!)',
      'Лікті під 45° до тулуба',
      'Зводь гантелі вгорі, не стукай',
      'Вага вказана НА ОДНУ гантель',
    ],
    errors: 'Не закидай лікті вбік на 90° — це травмує плече',
    searchQuery: 'incline dumbbell press form',
  },
  seated_db_press: {
    id: 'seated_db_press',
    name: 'Жим гантелей сидячи',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    isUnilateral: false,
    defaultWeightRatio: 0.12, // per hand
    tip: [
      'Спина повністю притиснута до спинки',
      'Не прогинай поперек',
      'Гантелі на рівні вух внизу',
      'Вага вказана НА ОДНУ гантель',
    ],
    errors: 'Не нахиляйся назад — це перетворює жим плечей в жим грудей',
    searchQuery: 'seated dumbbell shoulder press form',
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Розведення гантелей в сторони',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    isUnilateral: false,
    defaultWeightRatio: 0.07, // per hand, дуже легкі
    tip: [
      'Лікті ЗАВЖДИ трохи зігнуті',
      'Піднімай до рівня плечей, не вище',
      'Уявляй що виливаєш воду з келихів',
      'Вага вказана НА ОДНУ гантель',
    ],
    errors: 'Не бери занадто важкі — техніка важливіша за вагу тут',
    searchQuery: 'lateral raise form tutorial',
  },
  tricep_pushdowns: {
    id: 'tricep_pushdowns',
    name: 'Розгинання на трицепс (блок)',
    muscleGroup: 'triceps',
    equipment: 'cable',
    isUnilateral: false,
    defaultWeightRatio: 0.25,
    tip: [
      'Лікті притиснуті до тулуба — не рухай їх!',
      'Рухається тільки передпліччя',
      'Повністю випрямляй руки внизу',
    ],
    errors: 'Не допомагай корпусом — тримай тіло нерухомо',
    searchQuery: 'tricep pushdown cable form',
  },
  pullups: {
    id: 'pullups',
    name: 'Тяга верхнього блоку',
    muscleGroup: 'back',
    equipment: 'cable',
    isUnilateral: false,
    defaultWeightRatio: 0.5,
    tip: [
      'Тягни до верху грудей, не до підборіддя',
      'Зводь лопатки внизу руху',
      'Контролюй повернення — не кидай вагу',
      'Відхились злегка назад',
    ],
    errors: 'Не тягни за рахунок біцепсів — ініціюй рух лопатками',
    searchQuery: 'lat pulldown form tutorial',
  },
  barbell_row: {
    id: 'barbell_row',
    name: 'Тяга штанги в нахилі',
    muscleGroup: 'back',
    equipment: 'barbell',
    isUnilateral: false,
    defaultWeightRatio: 0.5,
    tip: [
      'Нахил корпусу ~45°, спина РІВНА',
      'Тягни штангу до живота/пупка',
      'Зводь лопатки у верхній точці',
    ],
    errors: 'Не округлюй спину — це пряма дорога до травми',
    searchQuery: 'barbell row form tutorial',
  },
  single_arm_row: {
    id: 'single_arm_row',
    name: 'Тяга гантелі однією рукою',
    muscleGroup: 'back',
    equipment: 'dumbbell',
    isUnilateral: true, // ← PER ARM!
    defaultWeightRatio: 0.18, // per hand
    tip: [
      'Коліно і рука на лаві для опори',
      'Тягни гантель до стегна, не до грудей',
      'Спочатку всі підходи на одну руку, потім міняй',
      '⚡ Підходи рахуються НА КОЖНУ РУКУ',
    ],
    errors: 'Не крути корпус — тримай плечі рівно',
    searchQuery: 'single arm dumbbell row form',
  },
  face_pulls: {
    id: 'face_pulls',
    name: 'Тяга на обличчя (блок)',
    muscleGroup: 'shoulders',
    equipment: 'cable',
    isUnilateral: false,
    defaultWeightRatio: 0.15,
    tip: [
      'Тягни мотузку до рівня очей',
      'Розводь руки в сторони у кінцевій точці',
      'Це вправа для здоровʼя плечей — легка вага!',
    ],
    errors: 'Не тягни до шиї/грудей — саме до обличчя',
    searchQuery: 'face pull cable form',
  },
  bicep_curls: {
    id: 'bicep_curls',
    name: 'Згинання з гантелями на біцепс',
    muscleGroup: 'biceps',
    equipment: 'dumbbell',
    isUnilateral: false, // обидві руки одночасно або поперемінно
    defaultWeightRatio: 0.1, // per hand
    tip: [
      'Лікті нерухомі і притиснуті до тулуба',
      'Повна амплітуда: знизу до верху',
      'Опускай повільно (2-3 секунди)',
      'Вага вказана НА ОДНУ гантель',
    ],
    errors: 'Не розгойдуй корпус — якщо "читиш" значить вага завелика',
    searchQuery: 'dumbbell bicep curl form',
  },
  squat: {
    id: 'squat',
    name: 'Присідання зі штангою',
    muscleGroup: 'quads',
    equipment: 'barbell',
    isUnilateral: false,
    defaultWeightRatio: 0.6,
    tip: [
      'Коліна в напрямку носків, не всередину!',
      'Сідай мінімум до паралелі стегон з підлогою',
      'Тримай груди високо, погляд вперед',
      'Вдихай на спуску, видихай на підйомі',
    ],
    errors: 'Не зводь коліна всередину — це найнебезпечніша помилка',
    searchQuery: 'barbell squat form beginner',
  },
  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Румунська тяга зі штангою',
    muscleGroup: 'hamstrings',
    equipment: 'barbell',
    isUnilateral: false,
    defaultWeightRatio: 0.5,
    tip: [
      'Ноги ТРОХИ зігнуті (не блокуй коліна)',
      'Відводь таз назад як сідаєш на далекий стілець',
      'Штанга ковзає по ногах — тримай близько',
      'Спина завжди рівна!',
    ],
    errors: 'Не округлюй поперек — це може травмувати спину',
    searchQuery: 'romanian deadlift form tutorial',
  },
  leg_press: {
    id: 'leg_press',
    name: 'Жим ногами (тренажер)',
    muscleGroup: 'quads',
    equipment: 'machine',
    isUnilateral: false,
    defaultWeightRatio: 1.0,
    tip: [
      'Стопи на ширині плечей на платформі',
      'Не блокуй коліна у верхній точці!',
      'Опускай до ~90° в колінах',
    ],
    errors: 'НІКОЛИ не випрямляй коліна повністю — дуже небезпечно',
    searchQuery: 'leg press machine form',
  },
  leg_curls: {
    id: 'leg_curls',
    name: 'Згинання ніг (тренажер)',
    muscleGroup: 'hamstrings',
    equipment: 'machine',
    isUnilateral: false,
    defaultWeightRatio: 0.35,
    tip: [
      'Повільний контрольований рух',
      'Стисни біцепс стегна у верхній точці',
      'Не підкидай вагу ривком',
    ],
    errors: 'Не відривай стегна від лави — це знімає навантаження',
    searchQuery: 'leg curl machine form',
  },
  calf_raises: {
    id: 'calf_raises',
    name: 'Підйом на носки',
    muscleGroup: 'calves',
    equipment: 'machine',
    isUnilateral: false,
    defaultWeightRatio: 0.5,
    tip: [
      'Повна амплітуда: максимально розтягни внизу',
      'Затримайся на 1сек у верхній точці',
      'Не пружинь — контрольований рух',
    ],
    errors: 'Не скорочуй амплітуду — литки ростуть від повного розтягнення',
    searchQuery: 'calf raise form tutorial',
  },
}

export function getDefaultWeight(exerciseId: string, bodyWeightKg: number): number {
  const ex = EXERCISES[exerciseId]
  if (!ex) return 20
  return Math.round(bodyWeightKg * ex.defaultWeightRatio / 2.5) * 2.5
}

export const MUSCLE_GROUP_NAMES: Record<MuscleGroup, string> = {
  chest: 'Груди', back: 'Спина', shoulders: 'Плечі',
  biceps: 'Біцепс', triceps: 'Трицепс', quads: 'Квадрицепс',
  hamstrings: 'Біцепс стегна', glutes: 'Сідниці', calves: 'Литки', core: 'Кор',
}

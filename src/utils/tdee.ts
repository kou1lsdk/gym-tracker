export function calcBMR(weightKg: number, heightCm: number, age: number, sex: 'male' | 'female'): number {
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function calcTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel)
}

export function calcBulkCalories(tdee: number): number {
  return tdee + 400
}

export interface Macros {
  protein: number
  fat: number
  carbs: number
  calories: number
}

export function calcMacros(weightKg: number, totalCalories: number): Macros {
  const protein = Math.round(weightKg * 2)
  const fat = Math.round(weightKg * 0.9)
  const proteinCal = protein * 4
  const fatCal = fat * 9
  const carbsCal = totalCalories - proteinCal - fatCal
  const carbs = Math.round(Math.max(0, carbsCal / 4))
  return { protein, fat, carbs, calories: totalCalories }
}

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Сидячий (офіс)' },
  { value: 1.375, label: 'Легка активність (1-3 тр./тиж.)' },
  { value: 1.55, label: 'Помірна активність (3-5 тр./тиж.)' },
  { value: 1.725, label: 'Висока активність (6-7 тр./тиж.)' },
]

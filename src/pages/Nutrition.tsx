import { useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { useNutritionToday } from '../hooks/useStats'
import { calcBMR, calcTDEE, calcBulkCalories, calcMacros } from '../utils/tdee'
import { todayISO } from '../utils/dateUtils'
import { uk } from '../locale/uk'
import { db } from '../db/database'
import { Beef, Wheat, Droplets } from 'lucide-react'

export function Nutrition() {
  const { profile } = useProfile()
  const todayLogs = useNutritionToday(todayISO())
  const [showForm, setShowForm] = useState(false)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  if (!profile) return <PageWrapper title={uk.nutrition.title}><p className="text-slate-400">Спочатку заповни профіль</p></PageWrapper>

  const bmr = calcBMR(profile.weightKg, profile.heightCm, profile.age, profile.sex)
  const tdee = calcTDEE(bmr, profile.activityLevel)
  const bulkCal = calcBulkCalories(tdee)
  const macros = calcMacros(profile.weightKg, bulkCal)

  const todayTotals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.proteinG,
      carbs: acc.carbs + log.carbsG,
      fat: acc.fat + log.fatG,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const handleLog = async () => {
    await db.nutritionLogs.add({
      date: todayISO(),
      calories: parseFloat(calories) || 0,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatG: parseFloat(fat) || 0,
    })
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setShowForm(false)
  }

  return (
    <PageWrapper title={uk.nutrition.title}>
      <div className="space-y-5">
        {/* TDEE section */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 space-y-3">
          <h2 className="text-sm font-medium text-slate-400">{uk.nutrition.target} (набір маси)</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{bulkCal}</p>
            <p className="text-sm text-slate-400">{uk.nutrition.calories}/день</p>
          </div>
          <div className="text-xs text-slate-500 text-center">
            BMR: {Math.round(bmr)} • TDEE: {tdee} • +400 профіцит
          </div>
        </div>

        {/* Macro targets */}
        <div className="grid grid-cols-3 gap-3">
          <MacroCard icon={<Beef size={18} />} color="red" label={uk.nutrition.protein} value={macros.protein} unit="г" />
          <MacroCard icon={<Wheat size={18} />} color="amber" label={uk.nutrition.carbs} value={macros.carbs} unit="г" />
          <MacroCard icon={<Droplets size={18} />} color="blue" label={uk.nutrition.fat} value={macros.fat} unit="г" />
        </div>

        {/* Today's intake */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{uk.nutrition.todayTotal}</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white"
            >
              + Додати
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <MiniStat label="ккал" value={todayTotals.calories} target={bulkCal} />
            <MiniStat label="білок" value={todayTotals.protein} target={macros.protein} unit="г" />
            <MiniStat label="вуг." value={todayTotals.carbs} target={macros.carbs} unit="г" />
            <MiniStat label="жири" value={todayTotals.fat} target={macros.fat} unit="г" />
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{todayTotals.calories} ккал</span>
              <span>{bulkCal} ккал</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (todayTotals.calories / bulkCal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Log form */}
        {showForm && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-3">
            <h3 className="font-medium text-white text-sm">{uk.nutrition.log}</h3>
            <div className="grid grid-cols-2 gap-3">
              <NutritionInput label="Калорії" value={calories} onChange={setCalories} placeholder="500" />
              <NutritionInput label="Білок (г)" value={protein} onChange={setProtein} placeholder="30" />
              <NutritionInput label="Вуглеводи (г)" value={carbs} onChange={setCarbs} placeholder="60" />
              <NutritionInput label="Жири (г)" value={fat} onChange={setFat} placeholder="15" />
            </div>
            <button
              onClick={handleLog}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium"
            >
              Записа��и
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-medium text-amber-300">💡 Поради для набору маси</h3>
          <ul className="text-xs text-amber-200/70 space-y-1">
            <li>• Їж кожні 3-4 години (4-5 прийомів їжі)</li>
            <li>• Білок в кожному прийомі: м'ясо, риба, яйця, сир</li>
            <li>• Складні вуглеводи: рис, гречка, вівсянка, картопля</li>
            <li>• Не пропускай прийоми їжі — набирати масу = їсти достатньо</li>
            <li>• Пий 2-3 літри води на день</li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  )
}

function MacroCard({ icon, color, label, value, unit }: { icon: React.ReactNode; color: string; label: string; value: number; unit: string }) {
  const colorMap: Record<string, string> = {
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }
  const cls = colorMap[color] ?? ''
  return (
    <div className={`rounded-xl border p-3 text-center ${cls}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-lg font-bold text-white">{value}<span className="text-xs ml-0.5">{unit}</span></p>
      <p className="text-[10px] opacity-70">{label}</p>
    </div>
  )
}

function MiniStat({ label, value, target, unit }: { label: string; value: number; target: number; unit?: string }) {
  const pct = target > 0 ? Math.round((value / target) * 100) : 0
  return (
    <div>
      <p className="text-sm font-bold text-white">{Math.round(value)}{unit && <span className="text-[10px]">{unit}</span>}</p>
      <p className="text-[10px] text-slate-500">{pct}% • {label}</p>
    </div>
  )
}

function NutritionInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:border-indigo-500 focus:outline-none"
      />
    </div>
  )
}

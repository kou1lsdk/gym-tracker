import { useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { useNutritionToday } from '../hooks/useStats'
import { calcBMR, calcTDEE, calcBulkCalories, calcMacros } from '../utils/tdee'
import { todayISO } from '../utils/dateUtils'
import { db } from '../db/database'

export function Nutrition() {
  const { profile } = useProfile()
  const todayLogs = useNutritionToday(todayISO())
  const [showForm, setShowForm] = useState(false)
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  if (!profile) return <PageWrapper title="Їжа"><p className="text-[#636366]">Спочатку заповни профіль</p></PageWrapper>

  const bmr = calcBMR(profile.weightKg, profile.heightCm, profile.age, profile.sex)
  const tdee = calcTDEE(bmr, profile.activityLevel)
  const bulkCal = calcBulkCalories(tdee)
  const macros = calcMacros(profile.weightKg, bulkCal)

  const totals = todayLogs.reduce(
    (acc, log) => ({ calories: acc.calories + log.calories, protein: acc.protein + log.proteinG, carbs: acc.carbs + log.carbsG, fat: acc.fat + log.fatG }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const handleLog = async () => {
    const cal = parseFloat(calories) || 0
    if (cal <= 0) return
    try {
      await db.nutritionLogs.add({ date: todayISO(), calories: cal, proteinG: parseFloat(protein) || 0, carbsG: parseFloat(carbs) || 0, fatG: parseFloat(fat) || 0 })
      setCalories(''); setProtein(''); setCarbs(''); setFat(''); setShowForm(false)
    } catch { alert('Помилка збереження') }
  }

  return (
    <PageWrapper title="Їжа">
      <div className="space-y-4">
        {/* TDEE target */}
        <div className="bg-[#1C1C1E] rounded-2xl p-5 text-center">
          <p className="text-xs text-[#8E8E93] mb-1">Ціль (набір маси)</p>
          <p className="text-4xl font-bold text-white tabular-nums">{bulkCal}</p>
          <p className="text-sm text-[#636366]">ккал/день</p>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          <MacroCard label="Білок" value={macros.protein} unit="г" color="#FF453A" />
          <MacroCard label="Вуглеводи" value={macros.carbs} unit="г" color="#FF9F0A" />
          <MacroCard label="Жири" value={macros.fat} unit="г" color="#0A84FF" />
        </div>

        {/* Today's progress */}
        <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Сьогодні</span>
            <button onClick={() => setShowForm(!showForm)} className="text-xs px-3 py-1.5 rounded-lg bg-white text-black font-medium">
              + Додати
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#8E8E93]">
              <span>{totals.calories} ккал</span>
              <span>{bulkCal} ккал</span>
            </div>
            <div className="h-2 bg-[#38383A] rounded-full overflow-hidden">
              <div className="h-full bg-[#30D158] rounded-full transition-all" style={{ width: `${Math.min(100, (totals.calories / bulkCal) * 100)}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <MiniStat label="ккал" value={totals.calories} target={bulkCal} />
            <MiniStat label="білок" value={totals.protein} target={macros.protein} />
            <MiniStat label="вуг." value={totals.carbs} target={macros.carbs} />
            <MiniStat label="жири" value={totals.fat} target={macros.fat} />
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <NInput label="Калорії" value={calories} onChange={setCalories} placeholder="500" />
              <NInput label="Білок (г)" value={protein} onChange={setProtein} placeholder="30" />
              <NInput label="Вуглеводи (г)" value={carbs} onChange={setCarbs} placeholder="60" />
              <NInput label="Жири (г)" value={fat} onChange={setFat} placeholder="15" />
            </div>
            <button onClick={handleLog} className="w-full py-2.5 rounded-xl bg-white text-black font-medium text-sm">Записати</button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-2">
          <p className="text-sm font-medium text-[#FF9F0A]">💡 Поради</p>
          <ul className="text-xs text-[#8E8E93] space-y-1">
            <li>• Білок в кожному прийомі: мʼясо, риба, яйця</li>
            <li>• Складні вуглеводи: рис, гречка, вівсянка</li>
            <li>• Їж кожні 3-4 години (4-5 прийомів)</li>
            <li>• 2-3 літри води на день</li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  )
}

function MacroCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-3 text-center">
      <p className="text-lg font-bold text-white">{value}<span className="text-xs text-[#636366] ml-0.5">{unit}</span></p>
      <p className="text-[10px]" style={{ color }}>{label}</p>
    </div>
  )
}

function MiniStat({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = target > 0 ? Math.round((value / target) * 100) : 0
  return (
    <div>
      <p className="text-sm font-bold text-white tabular-nums">{Math.round(value)}</p>
      <p className="text-[10px] text-[#636366]">{pct}% {label}</p>
    </div>
  )
}

function NInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-xs text-[#636366] mb-1 block">{label}</label>
      <input type="number" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl bg-[#2C2C2E] border border-[#38383A] text-white text-sm focus:border-[#636366] focus:outline-none" />
    </div>
  )
}

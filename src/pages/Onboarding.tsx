import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { ACTIVITY_LEVELS } from '../utils/tdee'

const WEEK_DAYS = [
  { value: 1, label: 'Пн' }, { value: 2, label: 'Вт' }, { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' }, { value: 5, label: 'Пт' }, { value: 6, label: 'Сб' },
  { value: 0, label: 'Нд' },
]

export function Onboarding() {
  const { saveProfile } = useProfile()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [heightCm, setHeightCm] = useState(175)
  const [weightKg, setWeightKg] = useState(70)
  const [age, setAge] = useState(25)
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [activityLevel, setActivityLevel] = useState(1.375)
  const [trainingDays, setTrainingDays] = useState<number[]>([1, 3, 5])

  const toggleDay = (d: number) => setTrainingDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort())

  const canProceed = name.trim().length > 0 && age >= 10 && age <= 100 && heightCm >= 100 && weightKg >= 30

  const handleSubmit = async () => {
    await saveProfile({
      name: name || 'Атлет', heightCm, weightKg, age, sex, activityLevel,
      goal: 'bulk', trainingDays, notificationTime: '09:00',
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <pre className="text-white text-sm leading-tight font-mono">{'   ╭───╮\n  ( •ᴗ• )\n   ╰─┬─╯\n     │\n    ╱ ╲'}</pre>
          <h1 className="text-2xl font-bold text-white">Ласкаво просимо!</h1>
          <p className="text-sm text-[#8E8E93]">Налаштуй профіль для персоналізованої програми</p>
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <Field label="Імʼя">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Твоє ім'я"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1E] border border-[#38383A] text-white text-sm focus:border-[#636366] focus:outline-none" />
            </Field>
            <Field label="Стать">
              <div className="flex gap-3">
                <Toggle active={sex === 'male'} onClick={() => setSex('male')} label="Чоловік" />
                <Toggle active={sex === 'female'} onClick={() => setSex('female')} label="Жінка" />
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Вік">
                <NumInput value={age} onChange={setAge} />
              </Field>
              <Field label="Зріст (см)">
                <NumInput value={heightCm} onChange={setHeightCm} />
              </Field>
              <Field label="Вага (кг)">
                <NumInput value={weightKg} onChange={setWeightKg} mode="decimal" />
              </Field>
            </div>
            <button onClick={() => setStep(1)} disabled={!canProceed}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-30">
              Далі
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Рівень активності">
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((al) => (
                  <button key={al.value} onClick={() => setActivityLevel(al.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                      activityLevel === al.value ? 'bg-white text-black font-medium' : 'bg-[#1C1C1E] text-[#8E8E93] border border-[#38383A]'
                    }`}>
                    {al.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Дні тренувань">
              <div className="flex gap-2">
                {WEEK_DAYS.map(({ value, label }) => (
                  <button key={value} onClick={() => toggleDay(value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                      trainingDays.includes(value) ? 'bg-white text-black' : 'bg-[#1C1C1E] text-[#636366]'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl bg-[#1C1C1E] text-[#8E8E93] font-medium text-sm">Назад</button>
              <button onClick={handleSubmit} disabled={trainingDays.length === 0}
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-30">
                Почати
              </button>
            </div>
            <p className="text-xs text-center text-[#636366]">📱 Додай на головний екран для найкращого досвіду</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium text-[#8E8E93]">{label}</label>{children}</div>
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-white text-black' : 'bg-[#1C1C1E] text-[#636366]'}`}>
      {label}
    </button>
  )
}

function NumInput({ value, onChange, mode }: { value: number; onChange: (v: number) => void; mode?: string }) {
  return (
    <input type="number" inputMode={mode === 'decimal' ? 'decimal' : 'numeric'} value={value} onChange={(e) => onChange(+e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-[#1C1C1E] border border-[#38383A] text-white text-sm focus:border-[#636366] focus:outline-none" />
  )
}

import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { uk } from '../locale/uk'
import { ACTIVITY_LEVELS } from '../utils/tdee'

const WEEK_DAYS = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: '��б' },
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

  const toggleDay = (d: number) => {
    setTrainingDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    )
  }

  const handleSubmit = async () => {
    await saveProfile({
      name: name || 'Атлет',
      heightCm,
      weightKg,
      age,
      sex,
      activityLevel,
      goal: 'bulk',
      trainingDays,
      notificationTime: '09:00',
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">🏋️</div>
          <h1 className="text-2xl font-bold text-white">{uk.onboarding.welcome}</h1>
          <p className="text-slate-400 text-sm">{uk.onboarding.subtitle}</p>
        </div>

        {step === 0 && (
          <div className="space-y-4 animate-in">
            <Field label={uk.onboarding.name}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Твоє ім'я"
                className="input-field"
              />
            </Field>
            <Field label={uk.onboarding.sex}>
              <div className="flex gap-3">
                <SexButton active={sex === 'male'} onClick={() => setSex('male')} label={uk.onboarding.male} />
                <SexButton active={sex === 'female'} onClick={() => setSex('female')} label={uk.onboarding.female} />
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label={uk.onboarding.age}>
                <input type="number" inputMode="numeric" value={age} onChange={(e) => setAge(+e.target.value)} className="input-field" />
              </Field>
              <Field label={uk.onboarding.height}>
                <input type="number" inputMode="numeric" value={heightCm} onChange={(e) => setHeightCm(+e.target.value)} className="input-field" />
              </Field>
              <Field label={uk.onboarding.weight}>
                <input type="number" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(+e.target.value)} className="input-field" />
              </Field>
            </div>
            <button onClick={() => setStep(1)} className="btn-primary w-full">{uk.common.next}</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in">
            <Field label={uk.onboarding.activity}>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((al) => (
                  <button
                    key={al.value}
                    onClick={() => setActivityLevel(al.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                      activityLevel === al.value
                        ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    {al.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={uk.onboarding.trainingDays}>
              <div className="flex gap-2">
                {WEEK_DAYS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleDay(value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                      trainingDays.includes(value)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">{uk.common.back}</button>
              <button onClick={handleSubmit} className="btn-primary flex-1">{uk.onboarding.start}</button>
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">{uk.onboarding.addToHomeScreen}</p>
          </div>
        )}
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgb(30 41 59);
          border: 1px solid rgb(51 65 85);
          color: white;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus {
          border-color: rgb(99 102 241);
        }
        .btn-primary {
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgb(79 70 229);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
        }
        .btn-primary:active {
          background: rgb(67 56 202);
        }
        .btn-secondary {
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgb(30 41 59);
          color: rgb(148 163 184);
          font-weight: 500;
          font-size: 0.875rem;
          border: 1px solid rgb(51 65 85);
          cursor: pointer;
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  )
}

function SexButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

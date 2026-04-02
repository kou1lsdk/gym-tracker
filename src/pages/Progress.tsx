import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { DotCalendar } from '../components/charts/DotCalendar'
import { useBodyWeights } from '../hooks/useStats'
import { useExerciseProgress, useWorkoutHistory } from '../hooks/useWorkout'
import { todayISO, formatDate } from '../utils/dateUtils'
import { db } from '../db/database'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'

export function Progress() {
  const bodyWeights = useBodyWeights(60)
  const history = useWorkoutHistory(50)
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [selectedExercise, setSelectedExercise] = useState('bench_press')
  const exerciseProgress = useExerciseProgress(selectedExercise)

  const allExercises = PPL_BEGINNER.days.flatMap((d) => d.exercises)
  const uniqueExercises = allExercises.filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i)

  const workoutDates = useMemo(() => new Set(history.map(w => w.date)), [history])

  const handleAddWeight = async () => {
    const w = parseFloat(newWeight)
    if (isNaN(w) || w <= 0) return
    try {
      await db.bodyWeights.add({ date: todayISO(), weightKg: w })
    } catch {
      await db.bodyWeights.where('date').equals(todayISO()).modify({ weightKg: w })
    }
    setNewWeight('')
    setShowWeightInput(false)
  }

  const weightChartData = bodyWeights.map((bw) => ({ date: formatDate(bw.date), kg: bw.weightKg }))
  const exerciseChartData = exerciseProgress.map((ep) => ({ date: formatDate(ep.date), kg: ep.maxWeight }))

  return (
    <PageWrapper title="Прогрес">
      <div className="space-y-5">
        {/* Calendar */}
        <DotCalendar workoutDates={workoutDates} weeks={12} />

        {/* Body weight */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-white">Вага тіла</span>
              <span className="text-xs text-[#636366] ml-2">кг, за останні 60 днів</span>
            </div>
            <button onClick={() => setShowWeightInput(!showWeightInput)} className="p-2 rounded-xl bg-[#1C1C1E] active:bg-[#2C2C2E]">
              <Plus size={16} className="text-[#30D158]" />
            </button>
          </div>

          {showWeightInput && (
            <div className="flex gap-2">
              <input
                type="number" inputMode="decimal" value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)} placeholder="72.5" autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#38383A] text-white focus:border-[#636366] focus:outline-none"
              />
              <button onClick={handleAddWeight} className="px-4 py-2.5 rounded-xl bg-[#30D158] text-black font-medium text-sm">
                OK
              </button>
            </div>
          )}

          {weightChartData.length >= 1 ? (
            <Chart data={weightChartData} color="#30D158" />
          ) : (
            <EmptyState text="Додай вагу тіла" />
          )}
        </section>

        {/* Exercise progress */}
        <section className="space-y-3">
          <span className="text-sm font-semibold text-white">Прогрес по вправах</span>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {uniqueExercises.map((ex) => (
              <button
                key={ex.id} onClick={() => setSelectedExercise(ex.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedExercise === ex.id ? 'bg-white text-black' : 'bg-[#1C1C1E] text-[#8E8E93]'
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          {exerciseChartData.length >= 1 ? (
            <Chart data={exerciseChartData} color="#FF9F0A" />
          ) : (
            <EmptyState text="Ще немає даних" />
          )}
        </section>

        {/* History */}
        <section className="space-y-2">
          <span className="text-sm font-semibold text-white">Історія</span>
          {history.length === 0 ? (
            <EmptyState text="Ще немає тренувань" />
          ) : (
            history.slice(0, 10).map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3 px-4 bg-[#1C1C1E] rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-white">{w.programDayId}</p>
                  <p className="text-xs text-[#636366]">{formatDate(w.date)}</p>
                </div>
                {w.completedAt && <span className="text-xs text-[#30D158]">✓</span>}
              </div>
            ))
          )}
        </section>
      </div>
    </PageWrapper>
  )
}

function Chart({ data, color }: { data: { date: string; kg: number }[]; color: string }) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-3 h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#38383A" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#636366' }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#636366' }} width={35} />
          <Tooltip contentStyle={{ background: '#1C1C1E', border: '1px solid #38383A', borderRadius: 12, fontSize: 12, color: '#fff' }} />
          <Line type="monotone" dataKey="kg" stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-[#636366] text-center py-6 bg-[#1C1C1E] rounded-2xl">{text}</p>
}

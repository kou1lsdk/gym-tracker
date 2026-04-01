import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Scale } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useBodyWeights } from '../hooks/useStats'
import { useExerciseProgress, useWorkoutHistory } from '../hooks/useWorkout'
import { uk } from '../locale/uk'
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

  const weightChartData = bodyWeights.map((bw) => ({
    date: formatDate(bw.date),
    kg: bw.weightKg,
  }))

  const exerciseChartData = exerciseProgress.map((ep) => ({
    date: formatDate(ep.date),
    kg: ep.maxWeight,
  }))

  return (
    <PageWrapper title={uk.progress.title}>
      <div className="space-y-6">
        {/* Body weight section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Scale size={18} className="text-emerald-400" />
              {uk.progress.weight}
            </h2>
            <button
              onClick={() => setShowWeightInput(!showWeightInput)}
              className="p-2 rounded-lg bg-slate-800 active:bg-slate-700"
            >
              <Plus size={18} className="text-emerald-400" />
            </button>
          </div>

          {showWeightInput && (
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="72.5"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <button onClick={handleAddWeight} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium">
                {uk.common.save}
              </button>
            </div>
          )}

          {weightChartData.length > 1 ? (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} width={35} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="kg" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{uk.progress.noData}</p>
          )}
        </section>

        {/* Exercise progress */}
        <section className="space-y-3">
          <h2 className="font-semibold text-white">{uk.progress.exerciseProgress}</h2>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {uniqueExercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExercise(ex.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedExercise === ex.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          {exerciseChartData.length > 1 ? (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} width={35} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="kg" stroke="#818cf8" strokeWidth={2} dot={{ r: 3, fill: '#818cf8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">{uk.progress.noData}</p>
          )}
        </section>

        {/* Workout history */}
        <section className="space-y-3">
          <h2 className="font-semibold text-white">{uk.history.title}</h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{uk.history.noWorkouts}</p>
          ) : (
            <div className="space-y-2">
              {history.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3 px-4 bg-slate-800/30 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-300">{getDayLabel(w.programDayId)}</p>
                    <p className="text-xs text-slate-500">{formatDate(w.date)}</p>
                  </div>
                  {w.completedAt && w.startedAt && (
                    <span className="text-xs text-slate-500">{formatDurationSafe(w.startedAt, w.completedAt)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PageWrapper>
  )
}

function getDayLabel(id: string): string {
  const map: Record<string, string> = { push: 'Push', pull: 'Pull', legs: 'Legs' }
  return map[id] ?? id
}

function formatDurationSafe(start: string, end: string): string {
  try {
    const ms = new Date(end).getTime() - new Date(start).getTime()
    const mins = Math.floor(ms / 60000)
    if (mins < 60) return `${mins} хв`
    return `${Math.floor(mins / 60)}г ${mins % 60}хв`
  } catch {
    return ''
  }
}

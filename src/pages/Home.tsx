import { useNavigate } from 'react-router'
import { Dumbbell, Scale, Flame, ChevronRight } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { useTodayWorkout, useWorkoutHistory } from '../hooks/useWorkout'
import { useLatestBodyWeight, useWeekStreak } from '../hooks/useStats'
import { uk } from '../locale/uk'
import { formatDate } from '../utils/dateUtils'

export function Home() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { programDay, isTrainingDay } = useTodayWorkout(profile?.trainingDays ?? [])
  const history = useWorkoutHistory(5)
  const latestWeight = useLatestBodyWeight()
  const streak = useWeekStreak()

  return (
    <PageWrapper>
      <div className="space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {uk.home.greeting}, {profile?.name ?? 'Атлет'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Scale size={18} className="text-emerald-400" />}
            value={latestWeight ? `${latestWeight.weightKg}` : '—'}
            label={uk.home.bodyWeight}
            unit="кг"
          />
          <StatCard
            icon={<Dumbbell size={18} className="text-indigo-400" />}
            value={String(history.length)}
            label={uk.home.lastWorkout}
          />
          <StatCard
            icon={<Flame size={18} className="text-orange-400" />}
            value={String(streak)}
            label={uk.home.weekStreak}
          />
        </div>

        {/* Today's workout */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h2 className="font-semibold text-white">{uk.home.todayWorkout}</h2>
          </div>
          {isTrainingDay && programDay ? (
            <div className="p-4 space-y-3">
              <p className="text-indigo-400 font-medium">{programDay.name}</p>
              <div className="space-y-2">
                {programDay.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{ex.name}</span>
                    <span className="text-slate-500">{ex.sets}×{ex.repsMin}-{ex.repsMax}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/workout')}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold active:bg-indigo-700 transition-colors mt-2"
              >
                {uk.home.startWorkout} 💪
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-slate-400">{uk.home.restDay}</p>
            </div>
          )}
        </div>

        {/* Recent history */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">{uk.history.title}</h2>
              <button onClick={() => navigate('/progress')} className="text-xs text-indigo-400 flex items-center gap-1">
                Все <ChevronRight size={14} />
              </button>
            </div>
            {history.slice(0, 3).map((w) => (
              <div key={w.id} className="flex items-center justify-between py-2.5 px-3 bg-slate-800/30 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    {getProgramDayName(w.programDayId)}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(w.date)}</p>
                </div>
                {w.completedAt && (
                  <span className="text-xs text-emerald-400">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function StatCard({ icon, value, label, unit }: { icon: React.ReactNode; value: string; label: string; unit?: string }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-lg font-bold text-white">
        {value}{unit && <span className="text-xs text-slate-400 ml-0.5">{unit}</span>}
      </p>
      <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function getProgramDayName(id: string): string {
  const map: Record<string, string> = {
    push: 'Push — Груди, Плечі',
    pull: 'Pull — Спина, Біцепс',
    legs: 'Legs — Ноги',
  }
  return map[id] ?? id
}

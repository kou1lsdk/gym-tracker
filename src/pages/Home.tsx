import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { MonkeyMascot } from '../components/mascot/MonkeyMascot'
import { DotCalendar } from '../components/charts/DotCalendar'
import { useProfile } from '../hooks/useProfile'
import { useTodayWorkout, useWorkoutHistory } from '../hooks/useWorkout'
import { useLatestBodyWeight, useWeekStreak } from '../hooks/useStats'
import { useMascot } from '../hooks/useMascot'
import { shouldRemindBackup } from '../db/backup'
import { formatDate } from '../utils/dateUtils'
import { useMemo } from 'react'

export function Home() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { programDay, isTrainingDay } = useTodayWorkout(profile?.trainingDays ?? [])
  const history = useWorkoutHistory(50)
  const latestWeight = useLatestBodyWeight()
  useWeekStreak() // keep hook active
  const { state: mascotState, checkMoodDecay } = useMascot()

  useEffect(() => { checkMoodDecay() }, [])

  const workoutDates = useMemo(() => new Set(history.map(w => w.date)), [history])

  return (
    <PageWrapper title={`Привіт, ${profile?.name ?? 'Атлет'}`}>
      <div className="space-y-4">

        {/* Mascot */}
        {mascotState && <MonkeyMascot state={mascotState} compact />}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1C1C1E] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8E8E93]">Вага тіла</span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {latestWeight ? latestWeight.weightKg : '—'}
              <span className="text-sm text-[#636366] ml-1">кг</span>
            </p>
          </div>
          <div className="bg-[#1C1C1E] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#8E8E93]">Обʼєм за тиждень</span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {history.length > 0 ? history.length : '0'}
              <span className="text-sm text-[#636366] ml-1">трен.</span>
            </p>
          </div>
        </div>

        {/* Dot Calendar */}
        <DotCalendar workoutDates={workoutDates} weeks={12} />

        {/* Today's workout */}
        {isTrainingDay && programDay ? (
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8E8E93]">Сьогодні</p>
                  <p className="text-lg font-bold text-white">{programDay.shortName}</p>
                </div>
                <span className="text-xs text-[#636366]">{programDay.exercises.length} вправ</span>
              </div>
              <button
                onClick={() => navigate('/workout')}
                className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm active:bg-[#E5E5EA] transition-colors"
              >
                Почати тренування
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#1C1C1E] rounded-2xl p-6 text-center space-y-2">
            <p className="text-2xl">😴</p>
            <p className="text-[#8E8E93]">День відпочинку</p>
            <p className="text-xs text-[#636366]">Відпочинок — це коли мʼязи ростуть</p>
          </div>
        )}

        {/* Backup reminder */}
        {shouldRemindBackup() && history.length > 3 && (
          <button
            onClick={() => navigate('/settings')}
            className="w-full py-3 px-4 bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 rounded-2xl text-left"
          >
            <p className="text-sm text-[#FF9F0A] font-medium">Зроби бекап даних</p>
            <p className="text-xs text-[#FF9F0A]/60">Щоб не втратити прогрес</p>
          </button>
        )}

        {/* Recent history */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Останні тренування</span>
              <button onClick={() => navigate('/progress')} className="text-xs text-[#636366] flex items-center gap-0.5">
                Все <ChevronRight size={12} />
              </button>
            </div>
            {history.slice(0, 3).map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3 px-4 bg-[#1C1C1E] rounded-2xl">
                <div>
                  <p className="text-sm font-medium text-white">{getDayLabel(w.programDayId)}</p>
                  <p className="text-xs text-[#636366]">{formatDate(w.date)}</p>
                </div>
                {w.completedAt && <span className="text-xs text-[#30D158]">✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Weight prompt */}
        {!latestWeight && history.length > 0 && (
          <button
            onClick={() => navigate('/progress')}
            className="w-full py-3.5 px-4 bg-[#30D158]/10 border border-[#30D158]/20 rounded-2xl text-left"
          >
            <p className="text-sm text-[#30D158] font-medium">Запиши вагу тіла</p>
            <p className="text-xs text-[#30D158]/60">Щоб відстежувати прогрес</p>
          </button>
        )}
      </div>
    </PageWrapper>
  )
}

function getDayLabel(id: string): string {
  const map: Record<string, string> = { push: 'Push', pull: 'Pull', legs: 'Legs' }
  return map[id] ?? id
}

import { useMemo } from 'react'
import { localDateISO } from '../../utils/dateUtils'

interface Props {
  workoutDates: Set<string>
  weeks?: number
}

export function DotCalendar({ workoutDates, weeks = 12 }: Props) {
  const days = useMemo(() => {
    const today = new Date()
    const result: { date: string; isToday: boolean; hasWorkout: boolean }[] = []

    // Start from (weeks) weeks ago, aligned to Monday
    const start = new Date(today)
    start.setDate(start.getDate() - (weeks * 7) + 1)
    // Align to Monday
    const dayOfWeek = start.getDay()
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(start.getDate() + offset)

    const todayStr = localDateISO(today)

    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const iso = localDateISO(d)
      result.push({
        date: iso,
        isToday: iso === todayStr,
        hasWorkout: workoutDates.has(iso),
      })
    }
    return result
  }, [workoutDates, weeks])

  const cols = weeks
  const MONTHS = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру']

  // Extract month labels for top row
  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = []
    let lastMonth = -1
    for (let col = 0; col < cols; col++) {
      const dayIndex = col * 7
      if (dayIndex < days.length) {
        const month = new Date(days[dayIndex].date).getMonth()
        if (month !== lastMonth) {
          labels.push({ col, label: MONTHS[month] })
          lastMonth = month
        }
      }
    }
    return labels
  }, [days, cols])

  return (
    <div className="p-4 bg-[#1C1C1E] rounded-2xl">
      {/* Month labels */}
      <div className="flex mb-2" style={{ paddingLeft: 0 }}>
        {monthLabels.map(({ col, label }) => (
          <span
            key={`${col}-${label}`}
            className="text-xs text-[#8E8E93]"
            style={{ position: 'relative', left: `${(col / cols) * 100}%` }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Dot grid: 7 rows × N cols */}
      <div className="flex gap-[3px]">
        {Array.from({ length: cols }).map((_, col) => (
          <div key={col} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, row) => {
              const idx = col * 7 + row
              const day = days[idx]
              if (!day) return <div key={row} className="w-2.5 h-2.5" />

              return (
                <div
                  key={row}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    day.isToday
                      ? 'ring-1 ring-white ring-offset-1 ring-offset-[#1C1C1E]'
                      : ''
                  } ${
                    day.hasWorkout
                      ? 'bg-white'
                      : 'bg-[#38383A]'
                  }`}
                  title={day.date}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

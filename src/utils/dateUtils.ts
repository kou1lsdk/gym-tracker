export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'short' })
}

export function formatDuration(startISO: string, endISO: string): string {
  const ms = new Date(endISO).getTime() - new Date(startISO).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins} хв`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hrs}г ${remMins}хв`
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function getDayOfWeek(): number {
  return new Date().getDay() // 0=Sun, 1=Mon...
}

export function getTrainingDayIndex(trainingDays: number[], date?: Date): number {
  const d = date || new Date()
  const dow = d.getDay()
  return trainingDays.indexOf(dow)
}

const DAY_MAP: Record<number, string> = {
  0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA',
}

export function generateICS(trainingDays: number[], time: string, programDayNames: string[]): string {
  const byDay = trainingDays.map(d => DAY_MAP[d]).join(',')
  const [hours, minutes] = time.split(':')
  const now = new Date()
  const dtstart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}T${hours}${minutes}00`
  const summary = `Тренування (${programDayNames.join(' / ')})`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GymTracker//UA',
    'BEGIN:VEVENT',
    `DTSTART:${dtstart}`,
    `DURATION:PT1H30M`,
    `RRULE:FREQ=WEEKLY;BYDAY=${byDay}`,
    `SUMMARY:${summary}`,
    'DESCRIPTION:Час тренування! 💪 Відкрий GymTracker',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Тренування через 30 хвилин',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gym-tracker-schedule.ics'
  a.click()
  URL.revokeObjectURL(url)
}

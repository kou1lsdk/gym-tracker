import { db } from './database'

export async function exportData(): Promise<string> {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    workoutLogs: await db.workoutLogs.toArray(),
    setLogs: await db.setLogs.toArray(),
    bodyWeights: await db.bodyWeights.toArray(),
    nutritionLogs: await db.nutritionLogs.toArray(),
    userProfile: await db.userProfile.toArray(),
  }
  return JSON.stringify(data, null, 2)
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString)
  if (!data.version) throw new Error('Невірний формат файлу')

  await db.transaction('rw', [db.workoutLogs, db.setLogs, db.bodyWeights, db.nutritionLogs, db.userProfile], async () => {
    await db.workoutLogs.clear()
    await db.setLogs.clear()
    await db.bodyWeights.clear()
    await db.nutritionLogs.clear()
    await db.userProfile.clear()

    if (data.workoutLogs?.length) await db.workoutLogs.bulkAdd(data.workoutLogs)
    if (data.setLogs?.length) await db.setLogs.bulkAdd(data.setLogs)
    if (data.bodyWeights?.length) await db.bodyWeights.bulkAdd(data.bodyWeights)
    if (data.nutritionLogs?.length) await db.nutritionLogs.bulkAdd(data.nutritionLogs)
    if (data.userProfile?.length) await db.userProfile.bulkAdd(data.userProfile)
  })
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

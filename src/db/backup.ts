import { db } from './database'

const AUTO_BACKUP_KEY = 'gymtracker-auto-backup'
const LAST_BACKUP_KEY = 'gymtracker-last-backup-date'

export async function exportData(): Promise<string> {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    workoutLogs: await db.workoutLogs.toArray(),
    setLogs: await db.setLogs.toArray(),
    bodyWeights: await db.bodyWeights.toArray(),
    nutritionLogs: await db.nutritionLogs.toArray(),
    userProfile: await db.userProfile.toArray(),
    mascot: await db.mascot.toArray(),
  }
  return JSON.stringify(data, null, 2)
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString)
  if (!data.version) throw new Error('Невірний формат файлу')

  await db.transaction('rw', [db.workoutLogs, db.setLogs, db.bodyWeights, db.nutritionLogs, db.userProfile, db.mascot], async () => {
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
    // mascot: merge, don't overwrite if exists (protect the monkey!)
    if (data.mascot?.length) {
      const existing = await db.mascot.get(1)
      if (!existing) {
        await db.mascot.bulkAdd(data.mascot)
      } else {
        // keep the higher level/xp
        const imported = data.mascot[0]
        if (imported.level > existing.level || imported.xp > existing.xp) {
          await db.mascot.update(1, imported)
        }
      }
    }
  })
}

export async function autoBackup(): Promise<void> {
  try {
    const json = await exportData()
    localStorage.setItem(AUTO_BACKUP_KEY, json)
    localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString())
  } catch {}
}

export async function autoRestore(): Promise<boolean> {
  try {
    const profileCount = await db.userProfile.count()
    if (profileCount > 0) return false // data exists, no need to restore

    const backup = localStorage.getItem(AUTO_BACKUP_KEY)
    if (!backup) return false

    await importData(backup)
    return true
  } catch {
    return false
  }
}

export function getLastBackupDate(): string | null {
  return localStorage.getItem(LAST_BACKUP_KEY)
}

export function shouldRemindBackup(): boolean {
  const last = getLastBackupDate()
  if (!last) return true
  const daysSince = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
  return daysSince > 14
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

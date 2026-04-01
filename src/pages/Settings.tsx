import { useRef } from 'react'
import { Download, Upload, Calendar, Info, Database } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { exportData, importData, downloadJson } from '../db/backup'
import { generateICS, downloadICS } from '../utils/icsGenerator'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { uk } from '../locale/uk'

export function Settings() {
  const { profile } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const json = await exportData()
    const date = new Date().toISOString().slice(0, 10)
    downloadJson(json, `gymtracker-backup-${date}.json`)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      await importData(text)
      alert('Дані успішно імпортовано!')
    } catch (err) {
      alert('Помилка імпорту: ' + (err as Error).message)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCalendarExport = () => {
    if (!profile) return
    const dayNames = PPL_BEGINNER.days.map((d) => d.shortName)
    const ics = generateICS(profile.trainingDays, profile.notificationTime, dayNames)
    downloadICS(ics)
  }

  return (
    <PageWrapper title={uk.settings.title}>
      <div className="space-y-4">
        {/* Profile summary */}
        {profile && (
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <h2 className="font-semibold text-white mb-3">{uk.settings.profile}</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-400">Ім'я</span>
              <span className="text-white">{profile.name}</span>
              <span className="text-slate-400">Вік</span>
              <span className="text-white">{profile.age} років</span>
              <span className="text-slate-400">Зріст</span>
              <span className="text-white">{profile.heightCm} см</span>
              <span className="text-slate-400">Вага</span>
              <span className="text-white">{profile.weightKg} кг</span>
              <span className="text-slate-400">Дні тренувань</span>
              <span className="text-white">
                {profile.trainingDays.map((d) => uk.days[d]).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <h2 className="font-semibold text-white">{uk.settings.backup}</h2>

          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-800/50 rounded-xl border border-slate-700 active:bg-slate-700 transition-colors"
          >
            <Download size={20} className="text-emerald-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">{uk.settings.export}</p>
              <p className="text-xs text-slate-500">Завантажити JSON файл з усіма даними</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-800/50 rounded-xl border border-slate-700 active:bg-slate-700 transition-colors"
          >
            <Upload size={20} className="text-blue-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">{uk.settings.import}</p>
              <p className="text-xs text-slate-500">Відновити з резервної копії</p>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

          <button
            onClick={handleCalendarExport}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-800/50 rounded-xl border border-slate-700 active:bg-slate-700 transition-colors"
          >
            <Calendar size={20} className="text-indigo-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">{uk.settings.calendar}</p>
              <p className="text-xs text-slate-500">{uk.settings.calendarDesc}</p>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="bg-slate-800/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Database size={16} />
            <span className="text-xs">{uk.settings.dataInfo}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Info size={16} />
            <span className="text-xs">{uk.settings.version} 1.0.0</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

import { useRef } from 'react'
import { Download, Upload, Calendar, Info } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { exportData, importData, downloadJson, getLastBackupDate } from '../db/backup'
import { generateICS, downloadICS } from '../utils/icsGenerator'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'

export function Settings() {
  const { profile } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const json = await exportData()
    downloadJson(json, `gymtracker-backup-${new Date().toISOString().slice(0, 10)}.json`)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importData(await file.text())
      alert('Дані відновлено!')
    } catch (err) { alert('Помилка: ' + (err as Error).message) }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCalendar = () => {
    if (!profile) return
    downloadICS(generateICS(profile.trainingDays, profile.notificationTime, PPL_BEGINNER.days.map(d => d.shortName)))
  }

  const lastBackup = getLastBackupDate()

  return (
    <PageWrapper title="Налаштування">
      <div className="space-y-4">
        {/* Profile */}
        {profile && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-2">
            <p className="text-sm font-semibold text-white mb-2">Профіль</p>
            <Row label="Імʼя" value={profile.name} />
            <Row label="Вік" value={`${profile.age}`} />
            <Row label="Зріст" value={`${profile.heightCm} см`} />
            <Row label="Вага" value={`${profile.weightKg} кг`} />
          </div>
        )}

        {/* Data */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Дані</p>

          <ActionButton icon={<Download size={18} className="text-[#30D158]" />} title="Експорт" desc={lastBackup ? `Останній: ${new Date(lastBackup).toLocaleDateString('uk-UA')}` : 'Завантажити JSON бекап'} onClick={handleExport} />
          <ActionButton icon={<Upload size={18} className="text-[#0A84FF]" />} title="Імпорт" desc="Відновити з файлу" onClick={() => fileInputRef.current?.click()} />
          <ActionButton icon={<Calendar size={18} className="text-[#FF9F0A]" />} title="Календар" desc="Додати розклад в Apple Calendar" onClick={handleCalendar} />

          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 px-4 py-3 text-[#636366]">
          <Info size={14} />
          <span className="text-xs">v2.0 • Дані зберігаються локально + авто-бекап</span>
        </div>
      </div>
    </PageWrapper>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#8E8E93]">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}

function ActionButton({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#1C1C1E] rounded-2xl active:bg-[#2C2C2E] transition-colors text-left">
      {icon}
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-[#636366]">{desc}</p>
      </div>
    </button>
  )
}

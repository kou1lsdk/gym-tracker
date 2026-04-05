import { useRef } from 'react'
import { Download, Upload, Calendar, Info } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useProfile } from '../hooks/useProfile'
import { exportData, importData, downloadJson, getLastBackupDate } from '../db/backup'
import { generateICS, downloadICS } from '../utils/icsGenerator'
import { PPL_BEGINNER } from '../data/programs/ppl-beginner'
import { db } from '../db/database'

const WEEK_DAYS = [
  { value: 1, label: 'Пн' }, { value: 2, label: 'Вт' }, { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' }, { value: 5, label: 'Пт' }, { value: 6, label: 'Сб' },
  { value: 0, label: 'Нд' },
]

const DAY_NAMES: Record<number, string> = { 0: 'Нд', 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб' }

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

  const toggleDay = async (day: number) => {
    if (!profile) return
    const current = profile.trainingDays
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
    await db.userProfile.update(1, { trainingDays: updated, updatedAt: new Date().toISOString() })
  }

  const lastBackup = getLastBackupDate()

  // Map training days to program days
  const dayMapping = profile?.trainingDays.map((d, i) => ({
    day: DAY_NAMES[d],
    program: PPL_BEGINNER.days[i % PPL_BEGINNER.days.length].shortName,
  })) ?? []

  return (
    <PageWrapper title="Налаштування">
      <div className="space-y-4">
        {/* Profile */}
        {profile && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-2">
            <p className="text-sm font-semibold text-white mb-2">Профіль</p>
            <Row label="Імʼя" value={profile.name} />
            <Row label="Вік" value={`${profile.age}`} />
            <Row label="Зріст / Вага" value={`${profile.heightCm}см / ${profile.weightKg}кг`} />
          </div>
        )}

        {/* Training days editor */}
        {profile && (
          <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-white">Дні тренувань</p>
            <div className="flex gap-2">
              {WEEK_DAYS.map(({ value, label }) => (
                <button key={value} onClick={() => toggleDay(value)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    profile.trainingDays.includes(value) ? 'bg-white text-black' : 'bg-[#2C2C2E] text-[#636366]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {/* Day → Program mapping */}
            {dayMapping.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {dayMapping.map((m, i) => (
                  <span key={i} className="text-xs text-[#8E8E93] bg-[#2C2C2E] px-2 py-1 rounded-lg">
                    {m.day} → {m.program}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Дані</p>
          <ActionButton icon={<Download size={18} className="text-[#30D158]" />} title="Експорт" desc={lastBackup ? `Останній: ${new Date(lastBackup).toLocaleDateString('uk-UA')}` : 'JSON бекап'} onClick={handleExport} />
          <ActionButton icon={<Upload size={18} className="text-[#0A84FF]" />} title="Імпорт" desc="Відновити з файлу" onClick={() => fileInputRef.current?.click()} />
          <ActionButton icon={<Calendar size={18} className="text-[#FF9F0A]" />} title="Календар" desc="Apple Calendar" onClick={handleCalendar} />
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        <div className="bg-[#1C1C1E] rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#636366]">
            <Info size={14} />
            <span className="text-xs">Про додаток</span>
          </div>
          <div className="text-xs text-[#636366] space-y-1">
            <p>Версія: {(globalThis as any).__APP_VERSION__ ?? '2.1'}</p>
            <p>Оновлено: {new Date((globalThis as any).__BUILD_DATE__ ?? Date.now()).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p>Програма: Full Body A/B (ротація)</p>
            <p>Дані зберігаються локально + авто-бекап</p>
          </div>
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

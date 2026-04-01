import type { MascotState } from '../../hooks/useMascot'

interface Props {
  state: MascotState
  compact?: boolean
}

export function MonkeyMascot({ state, compact }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#1C1C1E] rounded-2xl">
        <span className="text-3xl">{state.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{state.title}</span>
            <span className="text-xs text-[#8E8E93]">Lv.{state.level}</span>
          </div>
          <div className="mt-1 h-1.5 bg-[#38383A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#30D158] rounded-full transition-all duration-500"
              style={{ width: `${(state.xp / state.xpToNext) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#8E8E93] mt-1 truncate">{state.phrase}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 bg-[#1C1C1E] rounded-2xl text-center space-y-3">
      <pre className="text-white text-sm leading-tight font-mono select-none">
        {state.ascii}
      </pre>
      <div>
        <p className="text-lg font-bold text-white">{state.emoji} {state.title}</p>
        <p className="text-sm text-[#8E8E93]">{state.phrase}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-[#636366]">
          <span>Lv.{state.level}</span>
          <span>{state.xp}/{state.xpToNext} XP</span>
        </div>
        <div className="h-2 bg-[#38383A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#30D158] rounded-full transition-all duration-500"
            style={{ width: `${(state.xp / state.xpToNext) * 100}%` }}
          />
        </div>
      </div>
      {state.streak > 0 && (
        <p className="text-xs text-[#FF9F0A]">🔥 Streak: {state.streak} тренувань</p>
      )}
    </div>
  )
}

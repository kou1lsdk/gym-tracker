import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  label?: string
  inputMode?: 'decimal' | 'numeric'
}

export function NumberStepper({ value, onChange, step = 1, min = 0, max = 999, label, inputMode = 'numeric' }: Props) {
  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-xs text-slate-400 w-8">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center active:bg-slate-600 transition-colors"
      >
        <Minus size={18} />
      </button>
      <input
        type="number"
        inputMode={inputMode}
        value={value || ''}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v) && v >= min && v <= max) onChange(v)
          if (e.target.value === '') onChange(0)
        }}
        className="w-16 h-11 rounded-xl bg-slate-800 text-center text-lg font-semibold border border-slate-600 focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center active:bg-slate-600 transition-colors"
      >
        <Plus size={18} />
      </button>
    </div>
  )
}

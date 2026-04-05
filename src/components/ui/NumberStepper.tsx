import { useState, useEffect } from 'react'
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
  const [text, setText] = useState(String(value))

  // Sync text when value changes from outside (e.g. +/- buttons)
  useEffect(() => { setText(String(value)) }, [value])

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-[#636366] w-8">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
        className="w-10 h-10 rounded-xl bg-[#2C2C2E] flex items-center justify-center active:bg-[#38383A] transition-colors"
      >
        <Minus size={16} className="text-[#8E8E93]" />
      </button>
      <input
        type="number"
        inputMode={inputMode}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          const v = parseFloat(e.target.value)
          if (!isNaN(v) && v >= min && v <= max) onChange(v)
        }}
        onBlur={() => {
          if (text === '' || isNaN(parseFloat(text))) {
            setText(String(value))
          }
        }}
        className="w-14 h-10 rounded-xl bg-[#2C2C2E] text-center text-base font-semibold text-white border border-[#38383A] focus:border-[#636366] focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
        className="w-10 h-10 rounded-xl bg-[#2C2C2E] flex items-center justify-center active:bg-[#38383A] transition-colors"
      >
        <Plus size={16} className="text-[#8E8E93]" />
      </button>
    </div>
  )
}

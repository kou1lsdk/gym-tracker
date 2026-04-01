import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
  noPadding?: boolean
}

export function PageWrapper({ children, title, noPadding }: Props) {
  return (
    <div className={`min-h-screen pb-16 ${noPadding ? '' : 'px-4 pt-2'}`}>
      {title && (
        <h1 className={`text-[28px] font-bold text-white mb-5 tracking-tight ${noPadding ? 'px-4 pt-2' : ''}`}>
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
  noPadding?: boolean
}

export function PageWrapper({ children, title, noPadding }: Props) {
  return (
    <div className={`min-h-screen pb-20 ${noPadding ? '' : 'px-4 pt-4'}`}>
      {title && (
        <h1 className={`text-xl font-bold text-white mb-4 ${noPadding ? 'px-4 pt-4' : ''}`}>
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}

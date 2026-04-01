import { NavLink } from 'react-router'
import { Home, Dumbbell, TrendingUp, UtensilsCrossed, Settings } from 'lucide-react'
import { uk } from '../../locale/uk'

const tabs = [
  { to: '/', icon: Home, label: uk.nav.home },
  { to: '/workout', icon: Dumbbell, label: uk.nav.workout },
  { to: '/progress', icon: TrendingUp, label: uk.nav.progress },
  { to: '/nutrition', icon: UtensilsCrossed, label: uk.nav.nutrition },
  { to: '/settings', icon: Settings, label: uk.nav.settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

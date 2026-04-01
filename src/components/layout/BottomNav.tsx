import { NavLink } from 'react-router'
import { LayoutGrid, Dumbbell, BarChart3, Settings } from 'lucide-react'

const tabs = [
  { to: '/', icon: LayoutGrid },
  { to: '/workout', icon: Dumbbell },
  { to: '/progress', icon: BarChart3 },
  { to: '/settings', icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#1C1C1E] pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-12 max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-3 transition-colors ${isActive ? 'text-white' : 'text-[#636366]'}`
            }
          >
            <Icon size={22} />
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

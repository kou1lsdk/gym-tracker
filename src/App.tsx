import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { BottomNav } from './components/layout/BottomNav'
import { useProfile } from './hooks/useProfile'
import { Home } from './pages/Home'
import { Workout } from './pages/Workout'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { Onboarding } from './pages/Onboarding'

function AppRoutes() {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-3">
          <pre className="text-white text-sm leading-tight font-mono">{'   ╭───╮\n  ( •ᴗ• )\n   ╰─┬─╯'}</pre>
          <p className="text-[#636366] text-sm">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (!profile) return <Onboarding />

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/gym-tracker">
      <AppRoutes />
    </BrowserRouter>
  )
}

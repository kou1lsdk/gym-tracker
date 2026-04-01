import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { BottomNav } from './components/layout/BottomNav'
import { useProfile } from './hooks/useProfile'
import { Home } from './pages/Home'
import { Workout } from './pages/Workout'
import { Progress } from './pages/Progress'
import { Nutrition } from './pages/Nutrition'
import { Settings } from './pages/Settings'
import { Onboarding } from './pages/Onboarding'

function AppRoutes() {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🏋️</div>
          <p className="text-slate-400 text-sm">Завантажен��я...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <Onboarding />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/nutrition" element={<Nutrition />} />
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

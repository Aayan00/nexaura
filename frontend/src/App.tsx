import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RPGProvider } from './context/RPGContext'
import { AppShell } from './components/AppShell'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { MissionsPage } from './pages/MissionsPage'
import { FocusModePage } from './pages/FocusModePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CharacterPage } from './pages/CharacterPage'
import { ShopPage } from './pages/ShopPage'
import { AchievementsPage } from './pages/AchievementsPage'
import { SettingsPage } from './pages/SettingsPage'

export function App() {
  return (
    <RPGProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Main App Routes within Cyber AppShell */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/focus" element={<FocusModePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RPGProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RPGProvider } from './context/RPGContext'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { MissionsPage } from './pages/MissionsPage'
import { FocusModePage } from './pages/FocusModePage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CharacterPage } from './pages/CharacterPage'
import { ShopPage } from './pages/ShopPage'
import { AchievementsPage } from './pages/AchievementsPage'
import { SettingsPage } from './pages/SettingsPage'
import { VisionLabPage } from './pages/VisionLabPage'

export function App() {
  return (
    <RPGProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/vision-lab" element={<VisionLabPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Protected Main App Routes within Cyber AppShell */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/tasks" element={<Navigate to="/missions" replace />} />
            <Route path="/bosses" element={<MissionsPage />} />
            <Route path="/focus" element={<FocusModePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/inventory" element={<Navigate to="/shop" replace />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RPGProvider>
  )
}

export default App

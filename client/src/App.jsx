import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RoleProvider } from './contexts/RoleContext'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './pages/DashboardLayout'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import SSOCallback from './pages/SSOCallback'
import Guidelines from './components/dashboard/Guidelines'
import PromptLibrary from './components/dashboard/PromptLibrary'
import BriefsList from './components/dashboard/BriefsList'
import SiteMapBuilder from './components/dashboard/SiteMapBuilder'
import UserJourneyBuilder from './components/dashboard/UserJourneyBuilder'
import UsersManagement from './pages/admin/UsersManagement'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/sso-callback" element={<SSOCallback />} />

        {/* Profile */}
        <Route path="/profile" element={<DashboardLayout />}>
          <Route index element={<Profile />} />
        </Route>

        {/* Dashboard Tools */}
        <Route path="/dashboard/guidelines" element={<DashboardLayout />}>
          <Route index element={<Guidelines />} />
        </Route>
        <Route path="/dashboard/prompts" element={<DashboardLayout />}>
          <Route index element={<PromptLibrary />} />
        </Route>
        <Route path="/dashboard/briefs" element={<DashboardLayout />}>
          <Route index element={<BriefsList />} />
        </Route>
        <Route path="/dashboard/sitemap" element={<DashboardLayout />}>
          <Route index element={<SiteMapBuilder />} />
        </Route>
        <Route path="/dashboard/journeys" element={<DashboardLayout />}>
          <Route index element={<UserJourneyBuilder />} />
        </Route>

        {/* Admin Section */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/admin/users" element={<DashboardLayout />}>
          <Route index element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersManagement />
            </ProtectedRoute>
          } />
        </Route>
        </Routes>
      </RoleProvider>
    </AuthProvider>
  )
}

export default App

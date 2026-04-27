import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RoleProvider } from './contexts/RoleContext'
import ProtectedRoute from './components/common/ProtectedRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'))
const Contact = lazy(() => import('./pages/Contact'))
const Admin = lazy(() => import('./pages/Admin'))
const Profile = lazy(() => import('./pages/Profile'))
const SSOCallback = lazy(() => import('./pages/SSOCallback'))
const Guidelines = lazy(() => import('./components/dashboard/Guidelines'))
const PromptLibrary = lazy(() => import('./components/dashboard/PromptLibrary'))
const BriefsList = lazy(() => import('./components/dashboard/BriefsList'))
const SiteMapBuilder = lazy(() => import('./components/dashboard/SiteMapBuilder'))
const UserJourneyBuilder = lazy(() => import('./components/dashboard/UserJourneyBuilder'))
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/contact" element={<Contact />} />
            <Route path="/sso-callback" element={<SSOCallback />} />

            <Route path="/profile" element={<DashboardLayout />}>
              <Route index element={<Profile />} />
            </Route>

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

            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={
                <ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>
              } />
            </Route>
            <Route path="/admin/users" element={<DashboardLayout />}>
              <Route index element={
                <ProtectedRoute allowedRoles={['admin']}><UsersManagement /></ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </RoleProvider>
    </AuthProvider>
  )
}

export default App

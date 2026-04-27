import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRole } from '../contexts/RoleContext'
import { Menu } from 'lucide-react'
import Sidebar from '../components/common/Sidebar'
import PageLayoutSkeleton from '../components/common/PageLayoutSkeleton'

const DashboardLayout = () => {
  const { user, loading } = useAuth()
  const { role, loading: roleLoading } = useRole()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  // Show loading if auth or role is still loading
  // Note: role can be null for new OAuth users - that's okay, Dashboard will handle it
  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90"
        >
          <Menu size={24} />
        </button>

        <main className="flex-grow py-8">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

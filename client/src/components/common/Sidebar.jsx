import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  BookOpen,
  Network,
  Route,
  Users,
  Shield,
  Eye,
  Briefcase,
  Settings,
  X,
  LogOut,
  User,
  ArrowUpCircle,
  Clock
} from 'lucide-react'
import { useRole } from '../../contexts/RoleContext'
import { useAuth } from '../../context/AuthContext'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { role, isAdmin, isPM, isViewer } = useRole()
  const { user, signOut } = useAuth()
  const { getToken } = useClerkAuth()
  const [requestingRole, setRequestingRole] = useState(false)
  const [hasActiveRequest, setHasActiveRequest] = useState(false)

  // Check if viewer has active role request
  useEffect(() => {
    const checkActiveRequest = async () => {
      if (isViewer && user) {
        try {
          const token = await getToken()
          const response = await fetch(API_URL + '/api/users/role-requests/pending', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await response.json()
          const userRequest = data.requests?.find(req => req.user_id === user.id)
          setHasActiveRequest(!!userRequest)
        } catch (error) {
          console.error('Error checking role request:', error)
        }
      }
    }
    checkActiveRequest()
  }, [isViewer, user])

  const requestPMRole = async () => {
    setRequestingRole(true)
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/users/request-role-change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestedRole: 'pm',
          reason: 'I would like to create and manage my own briefs.'
        })
      })

      if (response.ok) {
        alert('✅ PM access requested! An admin will review your request.')
        setHasActiveRequest(true)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error requesting role:', error)
      alert('Failed to submit request')
    } finally {
      setRequestingRole(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Define navigation items based on role
  const getNavigationItems = () => {
    const items = []

    // Dashboard - All users
    items.push({
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'pm', 'viewer']
    })

    // Admin Section
    if (isAdmin) {
      items.push({
        name: 'divider',
        label: 'Administration'
      })

      items.push({
        name: 'Users Management',
        icon: Users,
        path: '/admin/users',
        roles: ['admin']
      })

      items.push({
        name: 'divider',
        label: 'Content Management'
      })
    }

    // Best Practices - Admin can edit, PM/Viewer can view
    items.push({
      name: 'Best Practices',
      icon: BookOpen,
      path: '/dashboard/guidelines',
      roles: ['admin', 'pm', 'viewer']
    })

    // Briefs - All users (PMs see their own, Admins see all, Viewers see all read-only)
    items.push({
      name: isViewer ? 'All Briefs' : 'Briefs',
      icon: FileText,
      path: '/dashboard/briefs',
      roles: ['admin', 'pm', 'viewer']
    })

    // AI Prompts - Admin can edit, PM/Viewer can view
    items.push({
      name: 'AI Prompts',
      icon: Lightbulb,
      path: '/dashboard/prompts',
      roles: ['admin', 'pm', 'viewer']
    })

    return items
  }

  const navigationItems = getNavigationItems()

  const getRoleInfo = () => {
    const roleConfig = {
      admin: { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100', label: 'ADMIN' },
      pm: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', label: 'PM' },
      viewer: { icon: Eye, color: 'text-green-600', bg: 'bg-green-100', label: 'VIEWER' }
    }
    return roleConfig[role] || null
  }

  const roleInfo = getRoleInfo()

  const handleLinkClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky inset-y-0 lg:top-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PM</span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">PM Toolkit</div>
            </div>
          </Link>
        </div>

        {/* User Info Section */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 truncate">
                {user?.firstName || 'User'} {user?.lastName || ''}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {user?.primaryEmailAddress?.emailAddress || user?.email || ''}
              </div>
            </div>
          </div>

          {/* Role Badge */}
          {roleInfo ? (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${roleInfo.bg} ${roleInfo.color} text-xs font-semibold w-full justify-center`}>
              <roleInfo.icon size={14} />
              <span>{roleInfo.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-semibold w-full justify-center">
              <span>Loading...</span>
            </div>
          )}
        </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {navigationItems.map((item, index) => {
            if (item.name === 'divider') {
              return (
                <div key={index} className="pt-4 pb-2">
                  <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              )
            }

            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                  ${active
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Request PM Access - Viewers Only */}
      {isViewer && (
        <div className="px-4 py-3 border-t border-gray-200">
          {hasActiveRequest ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
              <Clock size={18} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">Request Pending</p>
                <p className="text-xs opacity-75">Admin will review soon</p>
              </div>
            </div>
          ) : (
            <button
              onClick={requestPMRole}
              disabled={requestingRole}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUpCircle size={18} className="flex-shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">Upgrade to PM</p>
                <p className="text-xs opacity-90">Create & manage briefs</p>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
      </div>
    </>
  )
}

export default Sidebar

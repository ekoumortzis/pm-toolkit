import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Code, FileText, LayoutDashboard, Lock, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
import { useRole } from '../contexts/RoleContext'
import SignUp from '../components/auth/SignUp'
import Login from '../components/auth/Login'
import RoleSelection from '../components/auth/RoleSelection'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import DashboardSkeleton from '../components/common/DashboardSkeleton'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const { getToken } = useClerkAuth()
  const { role, isAdmin, isPM, isViewer, loading: roleLoading } = useRole()
  const [showAuth, setShowAuth] = useState('login') // 'login' or 'signup'
  const navigate = useNavigate()

  // Show loading while auth or role is loading
  // Use simple centered spinner for all loading states (sign in, sign out, initial load)
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

  // Handle role selection for new OAuth users
  const handleRoleSelect = async (selectedRole) => {
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/users/set-role', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: selectedRole })
      })

      if (response.ok) {
        // Reload the page to fetch updated role
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to set role')
      }
    } catch (error) {
      console.error('Error setting role:', error)
      alert('Failed to set role. Please try again.')
    }
  }

  // Show role selection if user exists but has no role (new OAuth user)
  // Only show after loading is complete to avoid flash on page reload
  if (!loading && !roleLoading && user && role === null) {
    return <RoleSelection onSelect={handleRoleSelect} />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md">
          {showAuth === 'login' ? (
            <Login onToggle={() => setShowAuth('signup')} />
          ) : (
            <SignUp onToggle={() => setShowAuth('login')} />
          )}
        </div>
      </div>
    )
  }

  // All tools visible to everyone (matching sidebar order)
  const getTools = () => {
    const allTools = [
      // 1. Best Practices - All users
      {
        icon: BookOpen,
        title: 'Best Practices',
        description: 'Learn what designers expect from PMs and how to communicate requirements effectively',
        color: 'from-blue-500 to-blue-600',
        link: '/dashboard/guidelines',
        locked: false
      },
      // 2. Briefs - All users
      {
        icon: FileText,
        title: isViewer ? 'View All Briefs' : 'My Briefs',
        description: isViewer
          ? 'Browse all project briefs created by the team'
          : 'Build structured project briefs with site-maps, user journeys, and detailed specifications',
        color: 'from-green-500 to-green-600',
        link: '/dashboard/briefs',
        locked: false
      },
      // 3. AI Prompts - All users
      {
        icon: Code,
        title: 'AI Prompts',
        description: 'Access ready-to-use prompts for building apps and features with AI tools',
        color: 'from-purple-500 to-purple-600',
        link: '/dashboard/prompts',
        locked: false // Now accessible to all users including viewers
      },
      // 4. Users Management - Admin only
      {
        icon: Users,
        title: 'Users Management',
        description: 'Manage user roles, permissions, and access requests',
        color: 'from-indigo-500 to-indigo-600',
        link: '/admin/users',
        locked: !isAdmin,
        lockMessage: 'Admin access required',
        hideWhenLocked: true // Hide completely from non-admins
      }
    ]

    // Filter out tools that should be hidden when locked
    return allTools.filter(tool => !(tool.locked && tool.hideWhenLocked))
  }

  const tools = getTools()

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        title={isAdmin ? 'Admin Dashboard' : 'Dashboard'}
        subtitle={
          isViewer
            ? 'View briefs, access AI prompts, and explore best practices'
            : isAdmin
            ? 'Manage users, content, and platform settings'
            : 'Create briefs, access AI prompts, and best practices'
        }
      />

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          const isLocked = tool.locked

          return (
            <button
              key={index}
              onClick={() => {
                if (isLocked) {
                  alert(`🔒 ${tool.lockMessage}`)
                } else {
                  navigate(tool.link)
                }
              }}
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 text-left border border-gray-100 relative ${
                isLocked
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-2xl hover:-translate-y-2'
              }`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4">
                  <Lock size={20} className="text-gray-400" />
                </div>
              )}
              <div className={`bg-gradient-to-r ${tool.color} w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-md ${isLocked ? 'opacity-50' : ''}`}>
                <Icon className="text-white" size={32} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isLocked ? 'text-gray-500' : 'text-primary'}`}>
                {tool.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {tool.description}
              </p>
              {isLocked && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 font-semibold">
                  <Lock size={14} />
                  {tool.lockMessage}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard

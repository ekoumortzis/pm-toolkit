import { useState } from 'react'
import { Briefcase, Eye, Shield } from 'lucide-react'
import Button from '../common/Button'
import { useAuth } from '../../context/AuthContext'

const RoleSelection = ({ onSelect }) => {
  const { user } = useAuth()
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email || ''
  const isAdminEmail = userEmail === 'ekoumortzis@agroapps.gr'

  const [selectedRole, setSelectedRole] = useState(isAdminEmail ? 'admin' : 'pm')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await onSelect(selectedRole)
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to PM Toolkit!
          </h1>
          <p className="text-gray-600">
            Before we get started, please select your role
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isAdminEmail ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
          {/* Admin Role - Only for agroapps.gr email */}
          {isAdminEmail && (
            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-6 rounded-xl border-3 transition-all text-left ${
                selectedRole === 'admin'
                  ? 'border-purple-600 bg-purple-600/5 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                selectedRole === 'admin' ? 'bg-purple-600' : 'bg-gray-100'
              }`}>
                <Shield size={32} className={selectedRole === 'admin' ? 'text-white' : 'text-gray-400'} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Administrator
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Full platform access with user management and content control
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  Manage all users
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  View all briefs
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 mr-2">✓</span>
                  Full platform control
                </div>
              </div>
            </button>
          )}

          {/* PM Role */}
          <button
            onClick={() => setSelectedRole('pm')}
            className={`p-6 rounded-xl border-3 transition-all text-left ${
              selectedRole === 'pm'
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
              selectedRole === 'pm' ? 'bg-primary' : 'bg-gray-100'
            }`}>
              <Briefcase size={32} className={selectedRole === 'pm' ? 'text-white' : 'text-gray-400'} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Project Manager
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Create and manage project briefs with site-maps, user journeys, and detailed specifications
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Create project briefs
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                Access AI prompts
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                View best practices
              </div>
            </div>
          </button>

          {/* Viewer Role */}
          <button
            onClick={() => setSelectedRole('viewer')}
            className={`p-6 rounded-xl border-3 transition-all text-left ${
              selectedRole === 'viewer'
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
              selectedRole === 'viewer' ? 'bg-primary' : 'bg-gray-100'
            }`}>
              <Eye size={32} className={selectedRole === 'viewer' ? 'text-white' : 'text-gray-400'} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Viewer
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              View all project briefs created by your team and access best practices
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                View all briefs
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">✓</span>
                View best practices
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <span className="text-gray-400 mr-2">✗</span>
                Request PM access later
              </div>
            </div>
          </button>
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
            className="px-12"
          >
            {loading ? 'Setting up your account...' : 'Continue'}
          </Button>
          <p className="text-xs text-gray-500 mt-4">
            You can request role changes later from your dashboard
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection

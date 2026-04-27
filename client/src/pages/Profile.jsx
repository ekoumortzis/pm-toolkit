import API_URL from '../../config/api'
import { useState } from 'react'
import { useUser, useClerk, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Shield, Trash2, LogOut, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import ProfileSkeleton from '../components/common/ProfileSkeleton'
import { useRole } from '../contexts/RoleContext'

const Profile = () => {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const { role } = useRole()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errorModal, setErrorModal] = useState({ show: false, message: '' })
  const [successModal, setSuccessModal] = useState({ show: false, message: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isLoaded) {
    return <ProfileSkeleton />
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Get authentication token
      const token = await getToken()

      if (!token) {
        throw new Error('No authentication token available')
      }

      // Call backend API to delete account
      const response = await fetch(API_URL + '/api/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account')
      }

      // Show success message
      setSuccessModal({
        show: true,
        message: 'Your account has been successfully deleted. We\'re sorry to see you go!'
      })

      // Sign out and redirect after a moment
      setTimeout(async () => {
        await signOut()
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Error deleting account:', error)

      setErrorModal({
        show: true,
        message: error.message || 'Failed to delete account. Please try again.'
      })
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const getConnectionMethod = () => {
    if (user.externalAccounts && user.externalAccounts.length > 0) {
      return user.externalAccounts[0].provider
    }
    return 'email'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-6 mb-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Profile'}
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {user.fullName || 'User'}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span>{user.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={16} />
                  <span className="capitalize">
                    Connected via: {getConnectionMethod()}
                    {getConnectionMethod() === 'oauth_google' && ' (Google)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600 block mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">{user.fullName || 'Not set'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600 block mb-1">
                  Email Address
                </label>
                <p className="text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600 block mb-1">
                  Email Verified
                </label>
                <p className="text-gray-900">
                  {user.primaryEmailAddress?.verification?.status === 'verified' ? (
                    <span className="text-green-600 font-semibold">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600 block mb-1">
                  Account Type
                </label>
                <p className="text-gray-900 capitalize">
                  {role === 'admin' ? 'Administrator' : role === 'pm' ? 'Project Manager' : role === 'viewer' ? 'Viewer' : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          {user.externalAccounts && user.externalAccounts.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Connected Accounts
              </h3>
              <div className="space-y-3">
                {user.externalAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {account.provider === 'oauth_google' && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {account.provider === 'oauth_google' && 'Google'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.emailAddress || account.username}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Connected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
            <Trash2 size={20} />
            Danger Zone
          </h3>
          <p className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete My Account
            </Button>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-800 font-semibold mb-4">
                ⚠️ Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.show}
        onClose={() => setErrorModal({ show: false, message: '' })}
        title="Unable to Delete Account"
        icon={AlertTriangle}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        footer={
          <Button
            variant="primary"
            onClick={() => setErrorModal({ show: false, message: '' })}
          >
            I Understand
          </Button>
        }
      >
        <p className="text-gray-700 leading-relaxed">{errorModal.message}</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={successModal.show}
        onClose={() => setSuccessModal({ show: false, message: '' })}
        title="Account Deleted"
        icon={CheckCircle}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      >
        <p className="text-gray-700 leading-relaxed">{successModal.message}</p>
      </Modal>
    </div>
  )
}

export default Profile

import API_URL from '../config/api'
import { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'

const RoleContext = createContext()

export const RoleProvider = ({ children }) => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [userRole, setUserRole] = useState(undefined) // undefined = not loaded yet, null = loaded but no role
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async (retryCount = 0) => {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        const token = await getToken()
        const response = await fetch(API_URL + '/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUserRole(data.user.role) // Can be null for new OAuth users
          console.log('👤 User role loaded:', data.user.role === null ? 'null (needs selection)' : data.user.role)
          setLoading(false)
        } else if (response.status === 404 && retryCount < 3) {
          // User not found - might be first login, retry after delay
          console.log(`⏳ User not found, retrying... (${retryCount + 1}/3)`)
          setTimeout(() => {
            fetchUserRole(retryCount + 1)
          }, 1000) // Wait 1 second before retry
        } else {
          console.error('Failed to fetch user role:', response.status)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        if (retryCount < 3) {
          console.log(`⏳ Error occurred, retrying... (${retryCount + 1}/3)`)
          setTimeout(() => {
            fetchUserRole(retryCount + 1)
          }, 1000)
        } else {
          setLoading(false)
        }
      }
    }

    fetchUserRole()
  }, [user, isLoaded, getToken])

  const hasPermission = (allowedRoles) => {
    if (!userRole) return false
    return allowedRoles.includes(userRole)
  }

  const isAdmin = userRole === 'admin'
  const isPM = userRole === 'pm'
  const isViewer = userRole === 'viewer'

  const value = {
    role: userRole,
    loading,
    hasPermission,
    isAdmin,
    isPM,
    isViewer
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}

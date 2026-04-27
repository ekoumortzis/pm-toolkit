import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'

const SSOCallback = () => {
  const navigate = useNavigate()
  const { handleRedirectCallback } = useClerk()
  const { isLoaded, user } = useUser()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the OAuth callback
        await handleRedirectCallback()

        // Small delay to ensure session is fully activated and user is loaded
        await new Promise(resolve => setTimeout(resolve, 800))

        // Redirect to dashboard after successful authentication
        navigate('/dashboard', { replace: true })
      } catch (error) {
        console.error('OAuth callback error:', error)
        // If there's an error, go back to dashboard (which will show login)
        navigate('/dashboard', { replace: true })
      }
    }

    handleCallback()
  }, [handleRedirectCallback, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default SSOCallback

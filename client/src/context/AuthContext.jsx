import { createContext, useContext } from 'react'
import { useUser, useSignUp, useSignIn, useClerk } from '@clerk/clerk-react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser()
  const { signUp: clerkSignUp } = useSignUp()
  const { signIn: clerkSignIn, setActive } = useSignIn()
  const { signOut: clerkSignOut } = useClerk()

  const loading = !isLoaded

  const signUp = async (email, password, fullName, role = 'pm') => {
    try {
      await clerkSignUp.create({
        emailAddress: email,
        password,
        firstName: fullName?.split(' ')[0] || '',
        lastName: fullName?.split(' ').slice(1).join(' ') || '',
        unsafeMetadata: { role } // Store role in metadata
      })

      await clerkSignUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      return { data: { user: clerkSignUp }, error: null }
    } catch (error) {
      return { data: null, error: { message: error.errors?.[0]?.message || error.message } }
    }
  }

  const signIn = async (email, password) => {
    try {
      const result = await clerkSignIn.create({
        identifier: email,
        password,
      })

      // Activate the session if sign-in is complete
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId, beforeEmit: () => window.location.href = '/dashboard' })
      }

      return { data: { user: result }, error: null }
    } catch (error) {
      return { data: null, error: { message: error.errors?.[0]?.message || error.message } }
    }
  }

  const signOut = async () => {
    try {
      await clerkSignOut()
      return { error: null }
    } catch (error) {
      return { error: { message: error.message } }
    }
  }

  const resetPassword = async (email) => {
    // Clerk handles password reset differently - typically through their UI components
    // For now, return a message to use Clerk's built-in reset
    return {
      data: null,
      error: { message: 'Please use the forgot password link on the login page' }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      await user.updatePassword({ newPassword })
      return { data: { success: true }, error: null }
    } catch (error) {
      return { data: null, error: { message: error.message } }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

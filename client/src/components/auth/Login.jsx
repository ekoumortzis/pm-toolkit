import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSignIn } from '@clerk/clerk-react'
import Button from '../common/Button'
import Input from '../common/Input'

const Login = ({ onToggle }) => {
  const { signIn } = useAuth()
  const { signIn: clerkSignIn } = useSignIn()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) throw error

      setStatus('success')
      // Clerk handles redirect via fallbackRedirectUrl in ClerkProvider
    } catch (error) {
      setStatus('error')
      setErrors({
        submit: error.message || 'Invalid email or password'
      })
    }
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-2 text-center">
          Welcome Back
        </h2>
      <p className="text-gray-600 mb-6 text-center">
        Sign in to continue to PM Toolkit
      </p>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={() => clerkSignIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard'
        })}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all font-semibold text-gray-700 mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />

        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-accent transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onToggle}
            className="text-primary font-semibold hover:text-accent transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

const ForgotPasswordForm = ({ onBack }) => {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Failed to send reset link')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <Button variant="outline" onClick={onBack}>
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-2 text-center">
        Reset Password
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          onClick={onBack}
        >
          Back to Login
        </Button>
      </form>
    </div>
  )
}

export default Login

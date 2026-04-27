import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSignUp } from '@clerk/clerk-react'
import Button from '../common/Button'
import Input from '../common/Input'

const SignUp = ({ onToggle }) => {
  const { signUp } = useAuth()
  const { signUp: clerkSignUp } = useSignUp()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'pm' // Default to PM
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setStatus('loading')

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      )

      if (error) throw error

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrors({ submit: error.message || 'Failed to create account' })
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setErrors({ verification: 'Please enter the verification code' })
      return
    }

    setVerifying(true)
    setErrors({})

    try {
      await clerkSignUp.attemptEmailAddressVerification({
        code: verificationCode
      })

      // Verification successful - user will be automatically logged in
      window.location.href = '/dashboard'
    } catch (error) {
      setVerifying(false)
      setErrors({
        verification: error.errors?.[0]?.message || 'Invalid verification code. Please try again.'
      })
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Enter Verification Code
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit code to <strong>{formData.email}</strong>.
            Please enter it below to verify your account.
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <Input
              label="Verification Code"
              name="code"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value)
                setErrors({})
              }}
              placeholder="Enter 6-digit code"
              maxLength="6"
              error={errors.verification}
              required
              autoFocus
            />

            {errors.verification && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.verification}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-4">
            <button
              onClick={onToggle}
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-2 text-center">
        Create Account
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Join PM Toolkit and start building better briefs
      </p>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={() => clerkSignUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard'
        })}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all font-semibold text-gray-700"
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
          <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.fullName}
          required
        />

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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            I want to *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'pm' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role === 'pm'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">Create Briefs</div>
              <div className="text-xs text-gray-600 mt-1">PM Role</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'viewer' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.role === 'viewer'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">View Briefs</div>
              <div className="text-xs text-gray-600 mt-1">Viewer Role</div>
            </button>
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 6 characters"
          error={errors.password}
          helperText="At least 6 characters"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          required
        />

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
          {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggle}
            className="text-primary font-semibold hover:text-accent transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignUp

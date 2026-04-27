import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, Shield, Briefcase, Eye } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRole } from '../../contexts/RoleContext'
import Button from './Button'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { role, isAdmin } = useRole()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getRoleBadge = (role) => {
    if (!role) return null

    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      pm: 'bg-blue-100 text-blue-800',
      viewer: 'bg-green-100 text-green-800'
    }
    const icons = {
      admin: Shield,
      pm: Briefcase,
      viewer: Eye
    }
    const Icon = icons[role]

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
        <Icon size={12} />
        {role.toUpperCase()}
      </span>
    )
  }

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-accent py-2">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-white">
            🚀 Build better briefs. Build better apps. No coding required.
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">PM Toolkit</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-accent transition-colors">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-accent transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  {getRoleBadge(role)}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 hover:text-accent transition-colors"
                  >
                    <User size={18} />
                    <span className="text-sm">{user.email}</span>
                  </Link>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="flex items-center justify-center pb-2">
                    {getRoleBadge(role)}
                  </div>
                  <Link
                    to="/dashboard"
                    className="hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:text-accent transition-colors flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/contact"
                    className="hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header

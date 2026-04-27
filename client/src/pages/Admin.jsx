import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRole } from '../contexts/RoleContext'
import { Users, FileCode, BookOpen, BarChart, Shield } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import DashboardSkeleton from '../components/common/DashboardSkeleton'

const Admin = () => {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: roleLoading } = useRole()
  const navigate = useNavigate()

  const loading = authLoading || roleLoading

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user || !isAdmin) {
    navigate('/dashboard')
    return null
  }

  const adminTools = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage users, verify accounts, and handle permissions',
      color: 'from-blue-500 to-blue-600',
      count: '0 users',
      path: '/admin/users'
    },
    {
      icon: FileCode,
      title: 'Prompt Library',
      description: 'Add, edit, and organize AI prompts',
      color: 'from-purple-500 to-purple-600',
      count: '0 prompts',
      path: null
    },
    {
      icon: BookOpen,
      title: 'Guidelines Management',
      description: 'Update documentation and best practices',
      color: 'from-green-500 to-green-600',
      count: '0 articles',
      path: null
    },
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'View platform usage and statistics',
      color: 'from-orange-500 to-orange-600',
      count: 'Coming soon',
      path: null
    }
  ]

  return (
    <div>
      <PageHeader
        icon={Shield}
        title="Admin Dashboard"
        subtitle="Manage platform content and users"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminTools.map((tool, index) => {
          const Icon = tool.icon
          const isClickable = tool.path !== null

          const cardContent = (
            <>
              <div className={`bg-gradient-to-r ${tool.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {tool.description}
              </p>
              <p className="text-xs text-gray-500">
                {tool.count}
              </p>
            </>
          )

          if (isClickable) {
            return (
              <div
                key={index}
                onClick={() => navigate(tool.path)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              >
                {cardContent}
              </div>
            )
          }

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg opacity-60"
            >
              {cardContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Admin

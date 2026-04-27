import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Clock, Shield, Eye, Briefcase, Pause, Play, Trash2 } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import UsersTableSkeleton from '../../components/common/UsersTableSkeleton'

const UsersManagement = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [users, setUsers] = useState([])
  const [roleRequests, setRoleRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, admin, pm, viewer

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUsers()
      fetchRoleRequests()
    }
  }, [isLoaded, isSignedIn])

  const fetchUsers = async () => {
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoleRequests = async () => {
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/users/role-requests/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setRoleRequests(data.requests)
    } catch (error) {
      console.error('Error fetching role requests:', error)
    }
  }

  const changeUserRole = async (userId, newRole) => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return

    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        alert('Role updated successfully!')
        fetchUsers()
      }
    } catch (error) {
      console.error('Error changing role:', error)
      alert('Failed to change role')
    }
  }

  const handleRoleRequest = async (requestId, status) => {
    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/users/role-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        alert(status === 'approved' ? 'Request approved!' : 'Request rejected')
        fetchRoleRequests()
        fetchUsers()
      }
    } catch (error) {
      console.error('Error handling request:', error)
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'pause' : 'activate'
    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        alert(`User ${action}d successfully!`)
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update user status')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Failed to update user status')
    }
  }

  const deleteUser = async (userId, userName) => {
    if (!confirm(`⚠️ Are you sure you want to DELETE ${userName}? This action cannot be undone!`)) return

    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('User deleted successfully!')
        fetchUsers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const getRoleBadge = (role) => {
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
        <Icon size={14} />
        {role.toUpperCase()}
      </span>
    )
  }

  const filteredUsers = filter === 'all'
    ? users
    : users.filter(u => u.role === filter)

  if (loading) {
    return <UsersTableSkeleton />
  }

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Users Management"
        subtitle="Manage user roles and permissions"
      />

        {/* Pending Role Requests */}
        {roleRequests.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-yellow-600" />
              Pending Role Change Requests ({roleRequests.length})
            </h2>
            <div className="space-y-4">
              {roleRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {request.first_name} {request.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Requesting: {getRoleBadge(request.from_role)} → {getRoleBadge(request.requested_role)}
                      </p>
                      {request.reason && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{request.reason}"</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRoleRequest(request.id, 'approved')}
                        className="flex items-center gap-1"
                      >
                        <UserCheck size={16} />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleRequest(request.id, 'rejected')}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <UserX size={16} />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </Button>
            <Button
              variant={filter === 'admin' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('admin')}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </Button>
            <Button
              variant={filter === 'pm' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pm')}
            >
              PMs ({users.filter(u => u.role === 'pm').length})
            </Button>
            <Button
              variant={filter === 'viewer' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('viewer')}
            >
              Viewers ({users.filter(u => u.role === 'viewer').length})
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'bg-gray-100 opacity-60' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? '✓ Active' : '⏸ Paused'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                        disabled={!user.is_active}
                      >
                        <option value="admin">Admin</option>
                        <option value="pm">PM</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.is_active
                            ? 'text-orange-600 hover:bg-orange-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.is_active ? 'Pause user' : 'Activate user'}
                      >
                        {user.is_active ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
    </div>
  )
}

export default UsersManagement

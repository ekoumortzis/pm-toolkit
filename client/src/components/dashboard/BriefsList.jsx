import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Calendar, FileText, Layers, Download, User, Shield, Briefcase, Eye } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { useRole } from '../../contexts/RoleContext'
import Button from '../common/Button'
import PageHeader from '../common/PageHeader'
import BriefModal from './BriefModal'
import ConfirmModal from '../common/ConfirmModal'
import NotificationModal from '../common/NotificationModal'
import BriefsListSkeleton from '../common/BriefsListSkeleton'

const BriefsList = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { isViewer } = useRole()
  const [briefs, setBriefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrief, setSelectedBrief] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, briefId: null, briefName: '' })
  const [notification, setNotification] = useState({ isOpen: false, type: 'info', title: '', message: '' })
  const [autoExport, setAutoExport] = useState(false)

  // Fetch briefs
  const fetchBriefs = async () => {
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/briefs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      setBriefs(data.briefs || [])
    } catch (error) {
      console.error('Error fetching briefs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBriefs()
    }
  }, [isLoaded, isSignedIn])

  // Delete brief
  const handleDeleteClick = (briefId, briefName) => {
    setConfirmDelete({ isOpen: true, briefId, briefName })
  }

  const handleDeleteConfirm = async () => {
    const { briefId } = confirmDelete
    setConfirmDelete({ isOpen: false, briefId: null, briefName: '' })

    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/briefs/${briefId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setBriefs(prev => prev.filter(b => b.id !== briefId))
        setNotification({ isOpen: true, type: 'success', title: 'Deleted!', message: 'Brief deleted successfully' })
      } else {
        setNotification({ isOpen: true, type: 'error', title: 'Delete Failed', message: 'Failed to delete brief' })
      }
    } catch (error) {
      console.error('Error deleting brief:', error)
      setNotification({ isOpen: true, type: 'error', title: 'Delete Failed', message: 'Failed to delete brief' })
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDelete({ isOpen: false, briefId: null, briefName: '' })
  }

  // Export brief to PDF - fetch fresh data first, then open with auto-export
  const handleExportPDF = async (brief) => {
    try {
      // Fetch fresh brief data from server
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/briefs/${brief.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const freshBrief = data.brief || brief

        setSelectedBrief(freshBrief)
        setAutoExport(true)
        setIsModalOpen(true)
      } else {
        // Fallback to existing data if fetch fails
        setSelectedBrief(brief)
        setAutoExport(true)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching fresh brief:', error)
      // Fallback to existing data
      setSelectedBrief(brief)
      setAutoExport(true)
      setIsModalOpen(true)
    }
  }

  // Open modal for create/edit
  const handleCreateNew = () => {
    setSelectedBrief(null)
    setAutoExport(false)
    setIsModalOpen(true)
  }

  const handleEdit = (brief) => {
    // Open modal immediately with available data, then fetch full data in background
    setSelectedBrief(brief)
    setAutoExport(false)
    setIsModalOpen(true)
    getToken().then(token =>
      fetch(`${API_URL}/api/briefs/${brief.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ).then(res => res.ok ? res.json() : null)
     .then(data => { if (data?.brief) setSelectedBrief(data.brief) })
     .catch(() => {})
  }

  // Close modal and refresh
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedBrief(null)
    setAutoExport(false)
    fetchBriefs()
  }

  // Count pages in site map
  const countPages = (pages) => {
    let count = pages.length
    pages.forEach(page => {
      if (page.children && page.children.length > 0) {
        count += countPages(page.children)
      }
    })
    return count
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get role badge
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

  if (loading) {
    return <BriefsListSkeleton />
  }

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Project Briefs"
        subtitle={isViewer ? "View all project briefs created by your team" : "Create and manage your product requirement documents"}
        actions={
          !isViewer && (
            <Button
              variant="primary"
              onClick={handleCreateNew}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Brief
            </Button>
          )
        }
      />

      {/* Briefs Grid */}
      {briefs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No briefs yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first project brief to define requirements for designers
            </p>
            <Button
              variant="primary"
              onClick={handleCreateNew}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Your First Brief
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => {
            const pageCount = countPages(brief.site_map?.pages || [])
            const journeyCount = brief.user_journeys?.length || 0

            return (
              <div
                key={brief.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-2 border-gray-100 hover:border-primary group"
              >
                {/* Project Name */}
                <h3 className="text-xl font-bold text-primary mb-4 line-clamp-2">
                  {brief.project_name}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Layers size={16} />
                    <span>{pageCount} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText size={16} />
                    <span>{journeyCount} journeys</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                  <Calendar size={14} />
                  <span>Updated {formatDate(brief.updated_at)}</span>
                </div>

                {/* Creator Info */}
                {(brief.creator_name || brief.creator_role) && (
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {brief.creator_name || 'Unknown'}
                    </span>
                    {brief.creator_role && (
                      <>
                        <span className="text-gray-300">•</span>
                        {getRoleBadge(brief.creator_role)}
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  {isViewer ? (
                    <>
                      {/* Viewer: View + Download buttons */}
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(brief)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExportPDF(brief)}
                        className="px-4 flex items-center justify-center gap-2 text-green-600 hover:text-green-700 hover:border-green-600"
                      >
                        <Download size={16} />
                        Export
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* PM/Admin: Edit + Export + Delete buttons */}
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(brief)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExportPDF(brief)}
                        className="px-3 text-green-600 hover:text-green-700 hover:border-green-600"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteClick(brief.id, brief.project_name)}
                        className="px-3 text-red-600 hover:text-red-700 hover:border-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BriefModal
          brief={selectedBrief}
          onClose={handleModalClose}
          autoExport={autoExport}
          readOnly={isViewer}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Brief?"
        message={`Are you sure you want to delete "${confirmDelete.briefName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ isOpen: false, type: 'info', title: '', message: '' })}
      />
    </div>
  )
}

export default BriefsList

import { X, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react'
import Button from './Button'

const NotificationModal = ({ type = 'info', title, message, onClose, isOpen }) => {
  if (!isOpen) return null

  const icons = {
    success: <CheckCircle size={48} className="text-green-500" />,
    error: <AlertCircle size={48} className="text-red-500" />,
    info: <Info size={48} className="text-blue-500" />,
    loading: <Loader size={48} className="text-primary animate-spin" />
  }

  const colors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    loading: 'border-primary'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 ${colors[type]}`}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {icons[type]}
          </div>

          {title && (
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {title}
            </h3>
          )}

          {message && (
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          )}

          {type !== 'loading' && (
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full"
            >
              OK
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationModal

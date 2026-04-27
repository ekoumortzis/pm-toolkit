import { AlertCircle } from 'lucide-react'
import Button from './Button'

const ConfirmModal = ({ title, message, onConfirm, onCancel, isOpen, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border-t-4 border-yellow-500">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <AlertCircle size={48} className="text-yellow-500" />
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

          <div className="flex gap-3 w-full">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="primary"
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

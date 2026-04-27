import { useState, useEffect } from 'react'
import { X, Save, Eye, Edit } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Button from '../common/Button'

const BestPracticeModal = ({ isOpen, onClose, onSave, practice = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'best-practices',
    content: '',
    order_index: 0
  })
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (practice) {
      setFormData({
        title: practice.title || '',
        category: practice.category || 'best-practices',
        content: practice.content || '',
        order_index: practice.order_index || 0
      })
    } else {
      setFormData({
        title: '',
        category: 'best-practices',
        content: '',
        order_index: 0
      })
    }
  }, [practice])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {practice ? 'Edit Best Practice' : 'Add New Best Practice'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter title..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="best-practices">1. Getting Started</option>
                  <option value="briefs-sitemaps">2. Briefs & Sitemaps</option>
                  <option value="user-journeys">3. User Journeys</option>
                  <option value="requirements">4. Requirements & Specifications</option>
                </select>
              </div>

              {/* Order Index */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order (for sorting)
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              {/* Content with Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Content (Markdown supported) *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        !previewMode
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        previewMode
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  </div>
                </div>

                {!previewMode ? (
                  <>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={15}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="Enter content in Markdown format..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supports Markdown: **bold**, *italic*, # headings, - lists, etc.
                    </p>
                  </>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-6 min-h-[400px] max-h-[500px] overflow-y-auto bg-gray-50">
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        components={{
                          h2: ({ children }) => (
                            <h2 className="text-2xl font-bold text-primary mt-8 mb-4 pb-2 border-b-2 border-gray-200">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xl font-bold text-primary mt-6 mb-3">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-700 text-base leading-relaxed mb-4">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="space-y-3 mb-6">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => {
                            const text = String(children);
                            const isCheckmark = text.startsWith('✅');
                            const isCross = text.startsWith('❌');
                            const isBullet = text.startsWith('•');

                            return (
                              <li className="flex items-start gap-3 text-gray-700">
                                {isCheckmark ? (
                                  <span className="text-green-600 font-bold text-xl leading-none mt-0.5">✅</span>
                                ) : isCross ? (
                                  <span className="text-red-600 font-bold text-xl leading-none mt-0.5">❌</span>
                                ) : isBullet ? (
                                  <span className="text-primary font-bold leading-none mt-1.5">•</span>
                                ) : (
                                  <span className="text-primary font-bold leading-none mt-1.5">•</span>
                                )}
                                <span className="flex-1">
                                  {isCheckmark || isCross || isBullet
                                    ? text.substring(text.indexOf(' ') + 1)
                                    : children}
                                </span>
                              </li>
                            );
                          },
                          strong: ({ children }) => (
                            <strong className="font-bold text-primary">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-800">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-red-600">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent pl-4 italic text-gray-600 my-4">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {formData.content || '*No content yet. Switch to Edit mode to add content.*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <Save size={18} />
              {practice ? 'Save Changes' : 'Create Best Practice'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestPracticeModal

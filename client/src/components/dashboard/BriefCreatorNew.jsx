import API_URL from '../../config/api'
import { useState, useMemo } from 'react'
import { FileText, Plus, Trash2, Save, Download, ChevronRight, ChevronLeft, Map, Route, FileEdit, Upload, File, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import Button from '../common/Button'
import SiteMapBuilder from '../brief/SiteMapBuilder'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const BriefCreatorNew = () => {
  const { getToken } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [brief, setBrief] = useState({
    id: null,
    projectName: '',
    whatBuilding: '',
    whyBuilding: '',
    whoUsing: '',
    successGoals: '',
    siteMap: {
      pages: []
    },
    userJourneys: [],
    pageContent: {}, // { pageId: { content: '', images: [], files: [] } }
    generalAssets: {
      images: [],
      files: []
    }
  })

  const [newJourney, setNewJourney] = useState({ name: '', steps: [''] })
  const [activePageTab, setActivePageTab] = useState(null)

  const steps = [
    { num: 1, name: 'Project Brief', icon: FileText },
    { num: 2, name: 'Site-Map', icon: Map },
    { num: 3, name: 'User Journeys', icon: Route },
    { num: 4, name: 'Page Details', icon: FileEdit },
    { num: 5, name: 'Preview & Export', icon: Save }
  ]

  // File download handler
  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // File upload handler for page files
  const handleFileUpload = (pageId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt'
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }))

      setBrief(prev => ({
        ...prev,
        pageContent: {
          ...prev.pageContent,
          [pageId]: {
            ...prev.pageContent[pageId],
            files: [...(prev.pageContent[pageId]?.files || []), ...fileData]
          }
        }
      }))
    }
    input.click()
  }

  // Remove file handler
  const removeFile = (pageId, index) => {
    setBrief(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          files: prev.pageContent[pageId].files.filter((_, i) => i !== index)
        }
      }
    }))
  }

  // Project Brief handlers
  const updateBrief = (field, value) => {
    setBrief(prev => ({ ...prev, [field]: value }))
  }

  // Flatten pages helper
  const flattenPages = (pages, level = 0) => {
    let result = []
    pages.forEach(page => {
      result.push({ ...page, level })
      if (page.children && page.children.length > 0) {
        result = result.concat(flattenPages(page.children, level + 1))
      }
    })
    return result
  }

  // Page content handlers
  const updatePageContent = (pageId, content) => {
    setBrief(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          content
        }
      }
    }))
  }

  const handleImageUpload = (pageId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageData = event.target.result
          setBrief(prev => ({
            ...prev,
            pageContent: {
              ...prev.pageContent,
              [pageId]: {
                ...prev.pageContent[pageId],
                content: prev.pageContent[pageId]?.content || '',
                images: [...(prev.pageContent[pageId]?.images || []), imageData]
              }
            }
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeImage = (pageId, imageIndex) => {
    setBrief(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          images: prev.pageContent[pageId].images.filter((_, i) => i !== imageIndex)
        }
      }
    }))
  }


  // User Journey handlers
  const addJourney = () => {
    if (newJourney.name.trim() && newJourney.steps.some(s => s.trim())) {
      setBrief(prev => ({
        ...prev,
        userJourneys: [...prev.userJourneys, { ...newJourney }]
      }))
      setNewJourney({ name: '', steps: [''] })
    }
  }

  const removeJourney = (index) => {
    setBrief(prev => ({
      ...prev,
      userJourneys: prev.userJourneys.filter((_, i) => i !== index)
    }))
  }

  const addJourneyStep = () => {
    setNewJourney(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }))
  }

  const updateJourneyStep = (index, value) => {
    setNewJourney(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }))
  }

  const removeJourneyStep = (index) => {
    if (newJourney.steps.length > 1) {
      setNewJourney(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSave = async () => {
    try {
      const token = await getToken()

      const url = brief.id
        ? `${API_URL}/api/briefs/${brief.id}`
        : API_URL + '/api/briefs'

      const method = brief.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(brief)
      })

      const data = await response.json()

      if (data.success) {
        alert(brief.id ? '✅ Brief updated successfully!' : '✅ Brief saved successfully!')
        // Update brief with the returned ID if it's a new brief
        if (!brief.id && data.brief.id) {
          setBrief(prev => ({ ...prev, id: data.brief.id }))
        }
      } else {
        alert('❌ Error: ' + (data.error || 'Failed to save brief'))
      }
    } catch (error) {
      console.error('Error saving brief:', error)
      alert('❌ Failed to save brief. Please try again.')
    }
  }

  const handleExportPDF = () => {
    console.log('Exporting to PDF:', brief)
    // TODO: Generate PDF
    alert('PDF export coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Brief Creator</h1>
          <p className="text-gray-600 mt-1">Create comprehensive product requirements for designers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
            <Save size={18} />
            Save Draft
          </Button>
          <Button variant="primary" onClick={handleExportPDF} className="flex items-center gap-2">
            <Download size={18} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentStep === step.num
                    ? 'bg-primary text-white shadow-lg'
                    : currentStep > step.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep === step.num ? 'bg-white text-primary' : 'bg-gray-200'
                }`}>
                  {step.num}
                </div>
                <span className="font-semibold hidden md:block">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${
                  currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Step 1: Project Brief */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Project Brief</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={brief.projectName}
                onChange={(e) => updateBrief('projectName', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., Task Management Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What are you building? *
              </label>
              <textarea
                value={brief.whatBuilding}
                onChange={(e) => updateBrief('whatBuilding', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Describe what you're building... (e.g., A collaborative task management tool where teams can create projects, assign tasks, and track progress)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why are you building it? *
              </label>
              <textarea
                value={brief.whyBuilding}
                onChange={(e) => updateBrief('whyBuilding', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="What problem does it solve? (e.g., Teams struggle to keep track of tasks across multiple tools. We want to provide a single place for all project management needs)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Who will use it? *
              </label>
              <textarea
                value={brief.whoUsing}
                onChange={(e) => updateBrief('whoUsing', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Target users... (e.g., Small to medium-sized teams (5-50 people), project managers, team leads, individual contributors)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Success Goals
              </label>
              <textarea
                value={brief.successGoals}
                onChange={(e) => updateBrief('successGoals', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="What does success look like? (e.g., 1000 active teams in first 6 months, 80% weekly active users, reduce task completion time by 30%)"
              />
            </div>
          </div>
        )}

        {/* Step 2: Site-Map */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Site-Map</h2>
            <p className="text-gray-600 mb-6">Build a visual hierarchy of your application's pages and structure</p>

            <SiteMapBuilder
              pages={brief.siteMap.pages}
              onChange={(pages) => updateBrief('siteMap', { pages })}
            />
          </div>
        )}

        {/* Step 3: User Journeys */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">User Journeys</h2>
            <p className="text-gray-600 mb-6">Define how users complete key tasks</p>

            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="font-semibold text-primary mb-4">Add New Journey</h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Journey Name
                </label>
                <input
                  type="text"
                  value={newJourney.name}
                  onChange={(e) => setNewJourney(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., User Creates a Project, User Invites Team Member"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Steps
                </label>
                <div className="space-y-2">
                  {newJourney.steps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-gray-500 font-semibold mt-2 w-8">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateJourneyStep(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder={`Step ${index + 1}...`}
                      />
                      {newJourney.steps.length > 1 && (
                        <button
                          onClick={() => removeJourneyStep(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addJourneyStep}
                  variant="outline"
                  size="sm"
                  className="mt-2 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Step
                </Button>
              </div>

              <Button onClick={addJourney} variant="primary" className="flex items-center gap-2">
                <Plus size={18} />
                Add Journey
              </Button>
            </div>

            <div className="space-y-4">
              {brief.userJourneys.map((journey, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">{journey.name}</h3>
                    <button
                      onClick={() => removeJourney(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <ol className="space-y-2">
                    {journey.steps.filter(s => s.trim()).map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3">
                        <span className="font-semibold text-gray-500">{stepIndex + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              {brief.userJourneys.length === 0 && (
                <p className="text-center text-gray-400 py-8">No user journeys added yet</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Page Content Details */}
        {currentStep === 4 && (() => {
          const flatPages = flattenPages(brief.siteMap.pages)
          const currentPage = flatPages.find(p => p.id === activePageTab) || flatPages[0]

          // Auto-select first page if none selected
          if (!activePageTab && flatPages.length > 0) {
            setActivePageTab(flatPages[0].id)
          }

          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Page Content Details</h2>
              <p className="text-gray-600 mb-6">Add descriptions, features, and images for each page</p>

              {flatPages.length === 0 ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-yellow-800 font-semibold mb-2">No pages in site-map yet</p>
                  <p className="text-yellow-700 text-sm">Go back to Step 2 to add pages first</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Page Tabs */}
                  <div className="flex flex-wrap gap-2 border-b-2 border-gray-200 pb-2">
                    {flatPages.map(page => (
                      <button
                        key={page.id}
                        onClick={() => setActivePageTab(page.id)}
                        className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                          activePageTab === page.id
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ paddingLeft: `${page.level * 12 + 16}px` }}
                      >
                        {page.level > 0 && '└─ '}
                        {page.name}
                      </button>
                    ))}
                  </div>

                  {/* Page Content Editor */}
                  {currentPage && (
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-primary mb-4">
                        {currentPage.name}
                      </h3>

                      {/* Rich Text Editor */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Page Description & Content
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={brief.pageContent[currentPage.id]?.content || ''}
                          onChange={(content) => updatePageContent(currentPage.id, content)}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'color': [] }, { 'background': [] }],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              [{ 'indent': '-1'}, { 'indent': '+1' }],
                              [{ 'align': [] }],
                              ['blockquote', 'code-block'],
                              ['link'],
                              ['clean']
                            ]
                          }}
                          placeholder="Describe what this page contains, its features, services, functionality..."
                          className="bg-white"
                          style={{ height: '300px', marginBottom: '50px' }}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Images & Screenshots
                        </label>
                        <Button
                          onClick={() => handleImageUpload(currentPage.id)}
                          variant="outline"
                          className="flex items-center gap-2 mb-4"
                        >
                          <Plus size={18} />
                          Upload Image
                        </Button>

                        {/* Image Gallery */}
                        {brief.pageContent[currentPage.id]?.images?.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {brief.pageContent[currentPage.id].images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => downloadFile(image, `image-${index + 1}.jpg`)}
                                    className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                    title="Download"
                                  >
                                    <Download size={14} />
                                  </button>
                                  <button
                                    onClick={() => removeImage(currentPage.id, index)}
                                    className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* File Upload Section */}
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Files & Documents
                        </label>
                        <Button
                          onClick={() => handleFileUpload(currentPage.id)}
                          variant="outline"
                          className="flex items-center gap-2 mb-4"
                        >
                          <Upload size={18} />
                          Upload Files (PDF, DOC, XLS, ZIP)
                        </Button>

                        {/* File List */}
                        {brief.pageContent[currentPage.id]?.files?.length > 0 && (
                          <div className="space-y-2">
                            {brief.pageContent[currentPage.id].files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  <File size={20} className="text-purple-500" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => downloadFile(file.url, file.name)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Download"
                                  >
                                    <Download size={18} />
                                  </button>
                                  <button
                                    onClick={() => removeFile(currentPage.id, index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Preview & Export (was step 4) */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary mb-4">Preview & Export</h2>
                  <p className="text-gray-600">Review your brief and export when ready.</p>

                  <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                    <h3 className="font-semibold text-lg mb-4">Brief Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Project Name:</p>
                        <p className="text-gray-900">{brief.projectName || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Total Pages:</p>
                        <p className="text-gray-900">{brief.siteMap.pages.length} pages</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">User Journeys:</p>
                        <p className="text-gray-900">{brief.userJourneys.length} journeys</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            variant="outline"
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button
              onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              variant="primary"
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Save size={18} />
              Save Brief
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BriefCreatorNew

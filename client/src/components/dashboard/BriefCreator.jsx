import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { FileText, Save, Download, Trash2, Upload, File, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import Button from '../common/Button'
import Input from '../common/Input'

const BriefCreator = () => {
  const { getToken } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [briefs, setBriefs] = useState([])
  const [loadingBriefs, setLoadingBriefs] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    project_description: '',
    target_audience: '',
    key_features: [],
    design_preferences: {
      style: '',
      colors: '',
      reference_sites: ''
    },
    page_images: [], // { name, url, size, type }
    page_files: [], // { name, url, size, type }
    general_images: [], // { name, url, size, type }
    general_files: [], // { name, url, size, type }
    status: 'draft'
  })

  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    fetchBriefs()
  }, [])

  const fetchBriefs = async () => {
    try {
      const token = await getToken()
      const response = await fetch(API_URL + '/api/briefs', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      setBriefs(data.briefs || [])
    } catch (error) {
      console.error('Error fetching briefs:', error)
    } finally {
      setLoadingBriefs(false)
    }
  }

  const loadBrief = (brief) => {
    setFormData({
      id: brief.id,
      title: brief.title || '',
      project_description: brief.project_description || '',
      target_audience: brief.target_audience || '',
      key_features: brief.key_features || [],
      design_preferences: brief.design_preferences || {
        style: '',
        colors: '',
        reference_sites: ''
      },
      status: brief.status || 'draft'
    })
    setCurrentStep(1)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDesignChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      design_preferences: {
        ...prev.design_preferences,
        [field]: value
      }
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        key_features: [...prev.key_features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      key_features: prev.key_features.filter((_, i) => i !== index)
    }))
  }

  const saveBrief = async (status = 'draft') => {
    try {
      setSaving(true)
      const token = await getToken()

      const briefData = {
        ...formData,
        status
      }

      if (formData.id) {
        // Update existing
        const response = await fetch(`${API_URL}/api/briefs/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(briefData)
        })

        if (!response.ok) throw new Error('Failed to update brief')

        alert('Brief updated successfully!')
      } else {
        // Create new
        const { data, error } = await supabase
          .from('briefs')
          .insert(briefData)
          .select()
          .single()

        if (error) throw error

        setFormData(prev => ({ ...prev, id: data.id }))
        alert('Brief saved successfully!')
      }

      fetchBriefs()
    } catch (error) {
      console.error('Error saving brief:', error)
      alert('Failed to save brief')
    } finally {
      setSaving(false)
    }
  }

  const deleteBrief = async (id) => {
    if (!confirm('Are you sure you want to delete this brief?')) return

    try {
      const token = await getToken()
      const response = await fetch(`${API_URL}/api/briefs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to delete brief')

      alert('Brief deleted successfully!')
      fetchBriefs()

      if (formData.id === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Error deleting brief:', error)
      alert('Failed to delete brief')
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      project_description: '',
      target_audience: '',
      key_features: [],
      design_preferences: {
        style: '',
        colors: '',
        reference_sites: ''
      },
      status: 'draft'
    })
    setCurrentStep(1)
  }

  // File handling functions
  const handleFileUpload = (e, category) => {
    const files = Array.from(e.target.files)
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // Temporary URL for preview
      file: file // Keep actual file for upload
    }))

    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], ...fileData]
    }))
  }

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteFile = (category, index) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }))
  }

  const steps = [
    { number: 1, title: 'Project Basics' },
    { number: 2, title: 'Features' },
    { number: 3, title: 'Page Details' },
    { number: 4, title: 'General Assets' },
    { number: 5, title: 'Design Preferences' },
    { number: 6, title: 'Review & Save' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Brief Creator</h1>
          <p className="text-gray-600">Create comprehensive project briefs with guided questions</p>
        </div>
        <Button variant="outline" onClick={resetForm}>
          New Brief
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Saved Briefs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Saved Briefs</h3>
            {loadingBriefs ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : briefs.length === 0 ? (
              <p className="text-sm text-gray-500">No saved briefs</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {briefs.map(brief => (
                  <div
                    key={brief.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:border-primary transition-colors ${
                      formData.id === brief.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div onClick={() => loadBrief(brief)} className="flex-1">
                        <p className="font-medium text-sm text-primary">{brief.title || 'Untitled'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(brief.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBrief(brief.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.number)}
                    className={`flex items-center space-x-2 ${
                      currentStep === step.number ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentStep === step.number
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="hidden md:block font-medium">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Step 1: Project Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Project Basics</h2>

                <Input
                  label="Project Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., E-commerce Platform for Sustainable Fashion"
                  required
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-primary">
                    Project Description <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleChange}
                    placeholder="Describe what this project does and its main goals..."
                    rows={6}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-primary">
                    Target Audience <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    placeholder="Who will use this application? What are their needs and pain points?"
                    rows={4}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Features */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Key Features</h2>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      placeholder="Add a feature (e.g., User authentication, Shopping cart)"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button variant="primary" onClick={addFeature}>
                      Add
                    </Button>
                  </div>

                  {formData.key_features.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No features added yet. Start by adding your first feature above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.key_features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-gray-700">{feature}</span>
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Page Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Page Details - Images & Files</h2>
                <p className="text-gray-600 mb-4">Upload page-specific images and reference files</p>

                {/* Page Images */}
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="text-primary" size={24} />
                    <h3 className="font-semibold text-gray-800">Page Images</h3>
                  </div>

                  <label className="block w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'page_images')}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Images */}
                  {formData.page_images.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.page_images.map((img, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ImageIcon size={20} className="text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">{img.name}</p>
                              <p className="text-xs text-gray-500">{(img.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadFile(img.url, img.name)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteFile('page_images', idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

                {/* Page Files */}
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <File className="text-primary" size={24} />
                    <h3 className="font-semibold text-gray-800">Page Files</h3>
                  </div>

                  <label className="block w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Click to upload files</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, XLS, ZIP, etc. up to 25MB</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
                      onChange={(e) => handleFileUpload(e, 'page_files')}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Files */}
                  {formData.page_files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.page_files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <File size={20} className="text-purple-500" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadFile(file.url, file.name)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteFile('page_files', idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

            {/* Step 4: General Assets */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">General Assets</h2>
                <p className="text-gray-600 mb-4">Upload general images and files for the project</p>

                {/* General Images */}
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="text-primary" size={24} />
                    <h3 className="font-semibold text-gray-800">General Images</h3>
                  </div>

                  <label className="block w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Click to upload general images</p>
                      <p className="text-xs text-gray-400 mt-1">Logos, icons, graphics, etc.</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'general_images')}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Images */}
                  {formData.general_images.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.general_images.map((img, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ImageIcon size={20} className="text-green-500" />
                            <div>
                              <p className="text-sm font-medium">{img.name}</p>
                              <p className="text-xs text-gray-500">{(img.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadFile(img.url, img.name)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteFile('general_images', idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

                {/* General Files */}
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <File className="text-primary" size={24} />
                    <h3 className="font-semibold text-gray-800">General Files</h3>
                  </div>

                  <label className="block w-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Click to upload general files</p>
                      <p className="text-xs text-gray-400 mt-1">Documents, spreadsheets, archives, etc.</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
                      onChange={(e) => handleFileUpload(e, 'general_files')}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Files */}
                  {formData.general_files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.general_files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <File size={20} className="text-orange-500" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadFile(file.url, file.name)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteFile('general_files', idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

            {/* Step 5: Design Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Design Preferences</h2>

                <Input
                  label="Design Style"
                  value={formData.design_preferences.style}
                  onChange={(e) => handleDesignChange('style', e.target.value)}
                  placeholder="e.g., Modern, Minimal, Corporate, Playful"
                />

                <Input
                  label="Color Preferences"
                  value={formData.design_preferences.colors}
                  onChange={(e) => handleDesignChange('colors', e.target.value)}
                  placeholder="e.g., Blue and white, Earth tones, Brand colors: #102542"
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-primary">
                    Reference Sites
                  </label>
                  <textarea
                    value={formData.design_preferences.reference_sites}
                    onChange={(e) => handleDesignChange('reference_sites', e.target.value)}
                    placeholder="List any websites whose design you like..."
                    rows={4}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Review & Save */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Review Your Brief</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Project Title</h3>
                    <p className="text-gray-700">{formData.title || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formData.project_description || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Target Audience</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formData.target_audience || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Key Features</h3>
                    {formData.key_features.length === 0 ? (
                      <p className="text-gray-500">No features added</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {formData.key_features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Design Preferences</h3>
                    <div className="text-gray-700 space-y-1">
                      <p><strong>Style:</strong> {formData.design_preferences.style || 'Not specified'}</p>
                      <p><strong>Colors:</strong> {formData.design_preferences.colors || 'Not specified'}</p>
                      {formData.design_preferences.reference_sites && (
                        <p><strong>References:</strong> {formData.design_preferences.reference_sites}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => saveBrief('draft')}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </Button>

                {currentStep < 4 ? (
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    onClick={() => saveBrief('completed')}
                    disabled={saving}
                    className="flex items-center space-x-2"
                  >
                    <Download size={18} />
                    <span>Complete Brief</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BriefCreator

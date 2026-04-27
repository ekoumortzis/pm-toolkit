import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { FileText, Map, Route, GitBranch, ChevronRight, Search, BookOpen } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import ReactMarkdown from 'react-markdown'
import PageHeader from '../common/PageHeader'
import ContentSkeleton from '../common/ContentSkeleton'

const Guidelines = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [guidelines, setGuidelines] = useState([])
  const [selectedGuideline, setSelectedGuideline] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('all')

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchGuidelines()
    }
  }, [isLoaded, isSignedIn])

  const fetchGuidelines = async () => {
    try {
      const token = await getToken()

      if (!token) {
        console.error('❌ No token available for guidelines')
        return
      }

      console.log('✅ Fetching guidelines with token...')
      const response = await fetch(API_URL + '/api/guidelines', {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('📡 Guidelines response:', response.status)
      const data = await response.json()
      console.log('📊 Guidelines data:', data)

      setGuidelines(data.guidelines || [])

      if (data.guidelines && data.guidelines.length > 0) {
        setSelectedGuideline(data.guidelines[0])
      }
    } catch (error) {
      console.error('❌ Error fetching guidelines:', error)
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    { id: 'all', name: 'All Guidelines', icon: null },
    { id: 'best-practices', name: '1. Getting Started', icon: FileText, color: 'text-blue-600' },
    { id: 'site-maps', name: '2. Site-Maps', icon: Map, color: 'text-green-600' },
    { id: 'user-journeys', name: '3. User Journeys', icon: Route, color: 'text-purple-600' },
    { id: 'decision-trees', name: '4. Decision Trees', icon: GitBranch, color: 'text-orange-600' }
  ]

  const filteredGuidelines = guidelines.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         g.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSection = activeSection === 'all' || g.section === activeSection
    return matchesSearch && matchesSection
  })

  // Auto-select first article when section changes
  useEffect(() => {
    if (filteredGuidelines.length > 0 && (!selectedGuideline || !filteredGuidelines.find(g => g.id === selectedGuideline.id))) {
      setSelectedGuideline(filteredGuidelines[0])
    }
  }, [activeSection, filteredGuidelines.length])

  if (loading) {
    return <ContentSkeleton />
  }

  return (
    <div>
      <PageHeader
        icon={BookOpen}
        title="Best Practices"
        subtitle="Learn what designers expect from PMs and how to communicate requirements effectively"
      />

      <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Sidebar */}
      <div className="lg:w-1/3 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Section Filter */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-primary mb-3">Sections</h3>
          <div className="space-y-2">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2
                    ${activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      className={activeSection === section.id ? 'text-white' : section.color}
                    />
                  )}
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guidelines List */}
        <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="font-semibold text-primary mb-3">Articles</h3>
          {filteredGuidelines.length === 0 ? (
            <p className="text-gray-500 text-sm">No guidelines found</p>
          ) : (
            <div className="space-y-2">
              {filteredGuidelines.map(guideline => (
                <button
                  key={guideline.id}
                  onClick={() => setSelectedGuideline(guideline)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-all
                    ${selectedGuideline?.id === guideline.id
                      ? 'bg-accent text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{guideline.title}</span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:w-2/3">
        {selectedGuideline ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const section = sections.find(s => s.id === selectedGuideline.section);
                  const Icon = section?.icon;
                  return Icon ? <Icon size={32} className={section.color} strokeWidth={2} /> : null;
                })()}
                <h1 className="text-3xl font-bold text-primary">
                  {selectedGuideline.title}
                </h1>
              </div>
              <p className="text-sm text-gray-500 font-medium ml-11">
                {sections.find(s => s.id === selectedGuideline.section)?.name || selectedGuideline.section}
              </p>
            </div>

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
                          <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                        ) : isCross ? (
                          <span className="text-red-600 font-bold flex-shrink-0">×</span>
                        ) : isBullet ? (
                          <span className="text-accent font-bold flex-shrink-0">•</span>
                        ) : (
                          <span className="text-primary font-bold flex-shrink-0">•</span>
                        )}
                        <span className="flex-1">{children}</span>
                      </li>
                    );
                  },
                  strong: ({ children }) => (
                    <strong className="font-bold text-primary">
                      {children}
                    </strong>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-mono font-semibold">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg overflow-x-auto my-6">
                        <code className="text-sm font-mono text-gray-800 leading-relaxed">{children}</code>
                      </pre>
                    ),
                  hr: () => (
                    <hr className="my-8 border-t-2 border-gray-200" />
                  ),
                }}
              >
                {selectedGuideline.content}
              </ReactMarkdown>

              {selectedGuideline.examples && selectedGuideline.examples.length > 0 && (
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-xl font-bold text-primary mb-6">
                    📋 Practical Examples
                  </h3>
                  <div className="space-y-4">
                    {selectedGuideline.examples.map((example, index) => (
                      <div key={index} className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg p-6">
                        {typeof example === 'string' ? (
                          <p className="text-gray-800 leading-relaxed font-medium">{example}</p>
                        ) : (
                          <>
                            {example.title && (
                              <h4 className="font-bold text-blue-600 mb-2 text-lg">
                                {example.title}
                              </h4>
                            )}
                            {example.description && (
                              <p className="text-gray-800 leading-relaxed font-medium">
                                {example.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <BookOpen className="text-gray-300 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              No Guideline Selected
            </h2>
            <p className="text-gray-500">
              Select a guideline from the sidebar to get started
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Guidelines

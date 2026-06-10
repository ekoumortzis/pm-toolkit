import { useState } from 'react'
import { X, Copy, Check, ChevronDown, ChevronUp, Wand2 } from 'lucide-react'
import { generateBuildPrompts } from '../../utils/generateBuildPrompts'

const BuildPromptsModal = ({ brief, onClose }) => {
  const [copiedId, setCopiedId] = useState(null)
  const [expandedPhase, setExpandedPhase] = useState(0)
  const [expandedPrompts, setExpandedPrompts] = useState({})

  const phases = generateBuildPrompts(brief)

  const totalPrompts = phases.reduce((sum, p) => sum + p.prompts.length, 0)

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const copyAll = () => {
    const text = phases.map(phase =>
      `${'━'.repeat(60)}\n${phase.icon}  PHASE ${phase.phase}: ${phase.title.toUpperCase()}\n${'━'.repeat(60)}\n\n` +
      phase.prompts.map((p, i) =>
        `── Prompt ${i + 1}: ${p.title} ──\n\n${p.content}`
      ).join('\n\n\n')
    ).join('\n\n\n')
    copy(text, 'all')
  }

  const togglePromptPreview = (id) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Wand2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Build with AI</h2>
              <p className="text-xs text-gray-500">
                {totalPrompts} prompts across {phases.length} phases · copy into Claude Code in order
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                copiedId === 'all'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {copiedId === 'all' ? <Check size={15} /> : <Copy size={15} />}
              {copiedId === 'all' ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {phases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="border border-gray-200 rounded-xl overflow-hidden">

              {/* Phase header row */}
              <button
                onClick={() => setExpandedPhase(expandedPhase === phaseIdx ? null : phaseIdx)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{phase.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phase {phase.phase}</p>
                    <p className="font-semibold text-gray-800 text-sm">{phase.title}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    {phase.prompts.length} prompt{phase.prompts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {expandedPhase === phaseIdx
                  ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                }
              </button>

              {/* Prompts inside phase */}
              {expandedPhase === phaseIdx && (
                <div className="divide-y divide-gray-100">
                  {phase.prompts.map((prompt, promptIdx) => {
                    const promptId = `${phaseIdx}-${promptIdx}`
                    const isCopied = copiedId === promptId
                    const isPreviewOpen = expandedPrompts[promptId]

                    return (
                      <div key={promptIdx} className="px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {promptIdx + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-700 truncate">{prompt.title}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => togglePromptPreview(promptId)}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {isPreviewOpen ? 'Hide' : 'Preview'}
                            </button>
                            <button
                              onClick={() => copy(prompt.content, promptId)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isCopied
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              }`}
                            >
                              {isCopied ? <Check size={12} /> : <Copy size={12} />}
                              {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        {isPreviewOpen && (
                          <pre className="mt-3 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                            {prompt.content}
                          </pre>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <p className="text-xs text-gray-400 text-center">
            Paste prompts into Claude Code one at a time, in order · each prompt builds on the previous
          </p>
        </div>
      </div>
    </div>
  )
}

export default BuildPromptsModal

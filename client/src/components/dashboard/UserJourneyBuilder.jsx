import { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Plus, Save, Download, Trash2, Play, Square, GitBranch, CheckCircle, XCircle } from 'lucide-react'
import Button from '../common/Button'

const nodeTypes = {
  start: { icon: Play, color: 'from-green-500 to-green-600', label: 'Start' },
  action: { icon: Square, color: 'from-blue-500 to-blue-600', label: 'Action' },
  decision: { icon: GitBranch, color: 'from-purple-500 to-purple-600', label: 'Decision' },
  success: { icon: CheckCircle, color: 'from-teal-500 to-teal-600', label: 'Success' },
  error: { icon: XCircle, color: 'from-red-500 to-red-600', label: 'Error' }
}

const CustomNode = ({ data }) => {
  const nodeType = nodeTypes[data.type] || nodeTypes.action
  const Icon = nodeType.icon

  const isDecision = data.type === 'decision'

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r ${nodeType.color} min-w-[150px] ${
        isDecision ? 'transform rotate-45' : ''
      }`}
    >
      <div className={`flex items-center space-x-2 text-white ${isDecision ? 'transform -rotate-45' : ''}`}>
        <Icon size={16} />
        <div className="font-medium">{data.label}</div>
      </div>
      {data.description && (
        <div className={`text-xs text-white/80 mt-1 ${isDecision ? 'transform -rotate-45' : ''}`}>
          {data.description}
        </div>
      )}
    </div>
  )
}

const customNodeTypes = {
  custom: CustomNode
}

const UserJourneyBuilder = () => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeName, setNodeName] = useState('')
  const [nodeDescription, setNodeDescription] = useState('')
  const [nodeType, setNodeType] = useState('action')
  const [edgeLabel, setEdgeLabel] = useState('')

  const onConnect = useCallback(
    (params) => {
      const label = edgeLabel || undefined
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            label,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#102542'
            },
            style: {
              stroke: '#102542',
              strokeWidth: 2
            }
          },
          eds
        )
      )
      setEdgeLabel('')
    },
    [setEdges, edgeLabel]
  )

  const addNode = () => {
    if (!nodeName.trim()) {
      alert('Please enter a node name')
      return
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: nodeName,
        description: nodeDescription,
        type: nodeType
      }
    }

    setNodes((nds) => [...nds, newNode])
    setNodeName('')
    setNodeDescription('')
  }

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
      )
      setSelectedNode(null)
    }
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to clear the entire user journey?')) {
      setNodes([])
      setEdges([])
      setSelectedNode(null)
    }
  }

  const loadTemplate = (template) => {
    let templateNodes = []
    let templateEdges = []

    if (template === 'signup') {
      templateNodes = [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 0 },
          data: { label: 'User lands on signup', type: 'start' }
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: { label: 'Fill form', type: 'action' }
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: { label: 'Valid data?', type: 'decision' }
        },
        {
          id: '4',
          type: 'custom',
          position: { x: 400, y: 200 },
          data: { label: 'Show error', type: 'error' }
        },
        {
          id: '5',
          type: 'custom',
          position: { x: 250, y: 300 },
          data: { label: 'Create account', type: 'action' }
        },
        {
          id: '6',
          type: 'custom',
          position: { x: 250, y: 400 },
          data: { label: 'Account created!', type: 'success' }
        }
      ]

      templateEdges = [
        { id: 'e1-2', source: '1', target: '2', label: 'clicks signup' },
        { id: 'e2-3', source: '2', target: '3', label: 'submits' },
        { id: 'e3-4', source: '3', target: '4', label: 'No' },
        { id: 'e4-2', source: '4', target: '2', label: 'retry' },
        { id: 'e3-5', source: '3', target: '5', label: 'Yes' },
        { id: 'e5-6', source: '5', target: '6' }
      ].map(edge => ({
        ...edge,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#102542' },
        style: { stroke: '#102542', strokeWidth: 2 }
      }))
    } else if (template === 'checkout') {
      templateNodes = [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 0 },
          data: { label: 'User at cart', type: 'start' }
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: { label: 'Click checkout', type: 'action' }
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: { label: 'Logged in?', type: 'decision' }
        },
        {
          id: '4',
          type: 'custom',
          position: { x: 100, y: 300 },
          data: { label: 'Login/signup', type: 'action' }
        },
        {
          id: '5',
          type: 'custom',
          position: { x: 400, y: 300 },
          data: { label: 'Enter details', type: 'action' }
        },
        {
          id: '6',
          type: 'custom',
          position: { x: 250, y: 400 },
          data: { label: 'Payment success', type: 'success' }
        }
      ]

      templateEdges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', label: 'No' },
        { id: 'e3-5', source: '3', target: '5', label: 'Yes' },
        { id: 'e4-5', source: '4', target: '5' },
        { id: 'e5-6', source: '5', target: '6' }
      ].map(edge => ({
        ...edge,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#102542' },
        style: { stroke: '#102542', strokeWidth: 2 }
      }))
    }

    setNodes(templateNodes)
    setEdges(templateEdges)
  }

  const saveJourney = async () => {
    // TODO: Implement save to Supabase
    const journeyData = {
      nodes,
      edges
    }
    console.log('Saving user journey:', journeyData)
    alert('User journey saved! (Feature coming soon)')
  }

  const exportImage = () => {
    // TODO: Implement export as image
    alert('Export as image coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">User Journey Builder</h1>
        <p className="text-gray-600">Map user paths with decision logic and conditional flows</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Templates */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Templates</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => loadTemplate('signup')}
              >
                User Signup Flow
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => loadTemplate('checkout')}
              >
                Checkout Process
              </Button>
            </div>
          </div>

          {/* Add Node */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Add Step</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Step Type</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="start">Start Point</option>
                  <option value="action">Action</option>
                  <option value="decision">Decision (If/Then)</option>
                  <option value="success">Success State</option>
                  <option value="error">Error State</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Step Name</label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g., User clicks button"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
                <input
                  type="text"
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                  placeholder="Additional details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={addNode}
                className="flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Step</span>
              </Button>
            </div>
          </div>

          {/* Edge Label */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Connection Label</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Label for next connection
                </label>
                <input
                  type="text"
                  value={edgeLabel}
                  onChange={(e) => setEdgeLabel(e.target.value)}
                  placeholder="e.g., Yes, No, If valid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Add before connecting nodes
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                variant="accent"
                size="sm"
                fullWidth
                onClick={saveJourney}
                className="flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Save</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={exportImage}
                className="flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </Button>
              {selectedNode && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={deleteNode}
                  className="flex items-center justify-center space-x-2 text-red-600 border-red-600"
                >
                  <Trash2 size={16} />
                  <span>Delete Selected</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={clearAll}
                className="flex items-center justify-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Legend</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(nodeTypes).map(([key, { icon: Icon, color, label }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '700px' }}>
            <ReactFlow
              ref={reactFlowWrapper}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNode(node)}
              nodeTypes={customNodeTypes}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserJourneyBuilder

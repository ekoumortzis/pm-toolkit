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
import { Plus, Save, Download, Trash2, Home, FileText, Link as LinkIcon } from 'lucide-react'
import Button from '../common/Button'

const nodeTypes = {
  homepage: { icon: Home, color: 'from-blue-500 to-blue-600' },
  main: { icon: FileText, color: 'from-green-500 to-green-600' },
  sub: { icon: FileText, color: 'from-purple-500 to-purple-600' },
  external: { icon: LinkIcon, color: 'from-orange-500 to-orange-600' }
}

const CustomNode = ({ data }) => {
  const nodeType = nodeTypes[data.type] || nodeTypes.main
  const Icon = nodeType.icon

  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r ${nodeType.color} min-w-[150px]`}>
      <div className="flex items-center space-x-2 text-white">
        <Icon size={16} />
        <div className="font-medium">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs text-white/80 mt-1">{data.description}</div>
      )}
    </div>
  )
}

const customNodeTypes = {
  custom: CustomNode
}

const SiteMapBuilder = () => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeName, setNodeName] = useState('')
  const [nodeDescription, setNodeDescription] = useState('')
  const [nodeType, setNodeType] = useState('main')

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
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
      ),
    [setEdges]
  )

  const addNode = () => {
    if (!nodeName.trim()) {
      alert('Please enter a page name')
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
    if (confirm('Are you sure you want to clear the entire site-map?')) {
      setNodes([])
      setEdges([])
      setSelectedNode(null)
    }
  }

  const loadTemplate = (template) => {
    let templateNodes = []
    let templateEdges = []

    if (template === 'ecommerce') {
      templateNodes = [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 0 },
          data: { label: 'Home', type: 'homepage' }
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'Products', type: 'main' }
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: { label: 'Cart', type: 'main' }
        },
        {
          id: '4',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: { label: 'Account', type: 'main' }
        },
        {
          id: '5',
          type: 'custom',
          position: { x: 100, y: 200 },
          data: { label: 'Product Detail', type: 'sub' }
        },
        {
          id: '6',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: { label: 'Checkout', type: 'sub' }
        }
      ]

      templateEdges = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
        { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', animated: true },
        { id: 'e2-5', source: '2', target: '5', type: 'smoothstep', animated: true },
        { id: 'e3-6', source: '3', target: '6', type: 'smoothstep', animated: true }
      ].map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#102542' },
        style: { stroke: '#102542', strokeWidth: 2 }
      }))
    } else if (template === 'saas') {
      templateNodes = [
        {
          id: '1',
          type: 'custom',
          position: { x: 250, y: 0 },
          data: { label: 'Home', type: 'homepage' }
        },
        {
          id: '2',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { label: 'Features', type: 'main' }
        },
        {
          id: '3',
          type: 'custom',
          position: { x: 250, y: 100 },
          data: { label: 'Pricing', type: 'main' }
        },
        {
          id: '4',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: { label: 'Dashboard', type: 'main' }
        },
        {
          id: '5',
          type: 'custom',
          position: { x: 250, y: 200 },
          data: { label: 'Sign Up', type: 'sub' }
        }
      ]

      templateEdges = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
        { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
        { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', animated: true },
        { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', animated: true }
      ].map(edge => ({
        ...edge,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#102542' },
        style: { stroke: '#102542', strokeWidth: 2 }
      }))
    }

    setNodes(templateNodes)
    setEdges(templateEdges)
  }

  const saveSiteMap = async () => {
    // TODO: Implement save to Supabase
    const sitemapData = {
      nodes,
      edges
    }
    console.log('Saving site-map:', sitemapData)
    alert('Site-map saved! (Feature coming soon)')
  }

  const exportImage = () => {
    // TODO: Implement export as image
    alert('Export as image coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Site-Map Builder</h1>
        <p className="text-gray-600">Create visual page hierarchies with drag-and-drop</p>
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
                onClick={() => loadTemplate('ecommerce')}
              >
                E-commerce
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => loadTemplate('saas')}
              >
                SaaS Platform
              </Button>
            </div>
          </div>

          {/* Add Node */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Add Page</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Page Type</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="homepage">Homepage</option>
                  <option value="main">Main Page</option>
                  <option value="sub">Sub Page</option>
                  <option value="external">External Link</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Page Name</label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g., About Us"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
                <input
                  type="text"
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                  placeholder="Brief description"
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
                <span>Add Page</span>
              </Button>
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
                onClick={saveSiteMap}
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
              {Object.entries(nodeTypes).map(([key, { icon: Icon, color }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${color}`} />
                  <span className="capitalize">{key}</span>
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

export default SiteMapBuilder

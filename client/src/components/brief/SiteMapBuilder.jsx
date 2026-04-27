import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import Button from '../common/Button'

const SiteMapBuilder = ({ pages, onChange }) => {
  const [newPageName, setNewPageName] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [dropIndicator, setDropIndicator] = useState(null)
  const [editingPage, setEditingPage] = useState(null)
  const [editName, setEditName] = useState('')

  // Flatten tree to array with levels
  const flattenPages = (pages, level = 0, parentId = null) => {
    let result = []
    pages.forEach((page, index) => {
      result.push({ ...page, level, parentId, index })
      if (page.children && page.children.length > 0) {
        result = result.concat(flattenPages(page.children, level + 1, page.id))
      }
    })
    return result
  }

  // Rebuild tree from flat array
  const buildTree = (flatArray) => {
    const tree = []
    const map = {}

    flatArray.forEach(item => {
      map[item.id] = { ...item, children: [] }
    })

    flatArray.forEach(item => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id])
      } else {
        tree.push(map[item.id])
      }
    })

    return tree
  }

  // Add new page
  const addPage = () => {
    if (!newPageName.trim()) return

    const newPage = {
      id: Date.now().toString(),
      name: newPageName.trim(),
      children: []
    }

    onChange([...pages, newPage])
    setNewPageName('')
  }

  // Remove page
  const removePage = (pageId) => {
    const removeFromTree = (pages) => {
      return pages.filter(page => {
        if (page.id === pageId) return false
        if (page.children) {
          page.children = removeFromTree(page.children)
        }
        return true
      })
    }
    onChange(removeFromTree(pages))
  }

  // Drag handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetItem) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetItem.id) return

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseY = e.clientY - rect.top
    const mouseX = e.clientX - rect.left

    // Calculate new level based on horizontal position
    const baseLevel = targetItem.level
    const pixelsPerLevel = 32
    const deltaLevel = Math.floor(mouseX / pixelsPerLevel) - baseLevel
    const newLevel = Math.max(0, Math.min(baseLevel + 1, targetItem.level + deltaLevel))

    // Determine position (before/after)
    const isAfter = mouseY > rect.height / 2

    setDropIndicator({
      targetId: targetItem.id,
      position: isAfter ? 'after' : 'before',
      level: newLevel
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!draggedItem || !dropIndicator) return

    const flatArray = flattenPages(pages)
    const targetIndex = flatArray.findIndex(p => p.id === dropIndicator.targetId)

    if (targetIndex === -1) {
      setDraggedItem(null)
      setDropIndicator(null)
      return
    }

    const targetItem = flatArray[targetIndex]

    // Remove dragged item
    let newFlat = flatArray.filter(p => p.id !== draggedItem.id && !isDescendant(p.id, draggedItem.id, flatArray))

    // Find insert position
    const newTargetIndex = newFlat.findIndex(p => p.id === dropIndicator.targetId)
    const insertIndex = dropIndicator.position === 'after' ? newTargetIndex + 1 : newTargetIndex

    // Determine new parent
    let newParentId = null
    const newLevel = dropIndicator.level

    if (newLevel > 0) {
      // Find parent at level above
      for (let i = insertIndex - 1; i >= 0; i--) {
        if (newFlat[i].level === newLevel - 1) {
          newParentId = newFlat[i].id
          break
        }
      }
    }

    // Insert item
    const newItem = { ...draggedItem, level: newLevel, parentId: newParentId }
    newFlat.splice(insertIndex, 0, newItem)

    // Rebuild tree
    const newTree = buildTree(newFlat)
    onChange(newTree)

    setDraggedItem(null)
    setDropIndicator(null)
  }

  const isDescendant = (pageId, ancestorId, flatArray) => {
    let current = flatArray.find(p => p.id === pageId)
    while (current && current.parentId) {
      if (current.parentId === ancestorId) return true
      current = flatArray.find(p => p.id === current.parentId)
    }
    return false
  }

  // Double-click to rename
  const handleDoubleClick = (page) => {
    setEditingPage(page.id)
    setEditName(page.name)
  }

  const handleRenameSubmit = (pageId) => {
    if (!editName.trim()) {
      setEditingPage(null)
      return
    }

    const renamePage = (pages) => {
      return pages.map(page => {
        if (page.id === pageId) {
          return { ...page, name: editName.trim() }
        }
        if (page.children) {
          return { ...page, children: renamePage(page.children) }
        }
        return page
      })
    }

    onChange(renamePage(pages))
    setEditingPage(null)
    setEditName('')
  }

  const handleRenameKeyPress = (e, pageId) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(pageId)
    } else if (e.key === 'Escape') {
      setEditingPage(null)
      setEditName('')
    }
  }

  // Render flat list
  const flatPages = flattenPages(pages)

  return (
    <div className="space-y-4">
      {/* Add Page Form */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Add New Page
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPage()}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            placeholder="Page name (e.g., Dashboard, Projects, Settings)"
          />
          <Button onClick={addPage} variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            Add
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Tip: Drag left/right to change nesting, up/down to reorder, double-click to rename
        </p>
      </div>

      {/* Visual List (WordPress-style) */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        {flatPages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {flatPages.map((page) => {
              const isDragging = draggedItem?.id === page.id
              const isEditing = editingPage === page.id
              const showDropBefore = dropIndicator?.targetId === page.id && dropIndicator?.position === 'before'
              const showDropAfter = dropIndicator?.targetId === page.id && dropIndicator?.position === 'after'

              return (
                <div key={page.id}>
                  {/* Drop indicator - BEFORE */}
                  {showDropBefore && (
                    <div
                      className="h-1 bg-primary relative"
                      style={{ marginLeft: `${dropIndicator.level * 32 + 48}px` }}
                    >
                      <div className="absolute left-0 top-1/2 -mt-1 w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors group ${
                      isDragging ? 'opacity-40' : ''
                    }`}
                    style={{ paddingLeft: `${page.level * 32 + 16}px` }}
                    draggable={!isEditing}
                    onDragStart={(e) => handleDragStart(e, page)}
                    onDragOver={(e) => handleDragOver(e, page)}
                    onDrop={handleDrop}
                    onDragEnd={() => {
                      setDraggedItem(null)
                      setDropIndicator(null)
                    }}
                  >
                    {/* Drag Handle */}
                    <div className="cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical size={18} />
                    </div>

                    {/* Page Name */}
                    <div
                      className="flex-1"
                      onDoubleClick={() => handleDoubleClick(page)}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleRenameKeyPress(e, page.id)}
                          onBlur={() => handleRenameSubmit(page.id)}
                          className="w-full px-3 py-1.5 border-2 border-primary rounded focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-medium text-gray-700">{page.name}</span>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removePage(page.id)}
                      className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Drop indicator - AFTER */}
                  {showDropAfter && (
                    <div
                      className="h-1 bg-primary relative"
                      style={{ marginLeft: `${dropIndicator.level * 32 + 48}px` }}
                    >
                      <div className="absolute left-0 top-1/2 -mt-1 w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-lg font-medium mb-2">No pages added yet</p>
            <p className="text-sm">Add your first page above to get started</p>
          </div>
        )}
      </div>

      {/* Preview Text */}
      {pages.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Structure Preview:</h4>
          <pre className="font-mono text-xs text-gray-600 overflow-x-auto">
            {generateTextPreview(pages)}
          </pre>
        </div>
      )}
    </div>
  )
}

// Generate text preview
const generateTextPreview = (pages, prefix = '', isLast = true) => {
  let result = ''
  pages.forEach((page, index) => {
    const isLastChild = index === pages.length - 1
    const connector = isLastChild ? '└──' : '├──'
    const childPrefix = prefix + (isLastChild ? '    ' : '│   ')

    result += prefix + connector + ' ' + page.name + '\n'

    if (page.children && page.children.length > 0) {
      result += generateTextPreview(page.children, childPrefix, isLastChild)
    }
  })
  return result
}

export default SiteMapBuilder

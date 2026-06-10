import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const MenuBuilder = ({ menuItems = [], availablePages = [], onChange }) => {
  const [draggedItem, setDraggedItem] = useState(null)
  const [dropIndicator, setDropIndicator] = useState(null)

  // Flatten tree to array with level/parentId metadata
  const flattenItems = (items, level = 0, parentId = null) => {
    let result = []
    items.forEach(item => {
      result.push({ ...item, level, parentId })
      if (item.children?.length > 0) {
        result = result.concat(flattenItems(item.children, level + 1, item.id))
      }
    })
    return result
  }

  // Rebuild tree from flat array
  const buildTree = (flatArray) => {
    const tree = []
    const map = {}
    flatArray.forEach(item => { map[item.id] = { id: item.id, name: item.name, children: [] } })
    flatArray.forEach(item => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id])
      } else {
        tree.push(map[item.id])
      }
    })
    return tree
  }

  const isDescendant = (itemId, ancestorId, flatArray) => {
    let current = flatArray.find(p => p.id === itemId)
    while (current?.parentId) {
      if (current.parentId === ancestorId) return true
      current = flatArray.find(p => p.id === current.parentId)
    }
    return false
  }

  const getAllIds = (items) => {
    let ids = []
    items.forEach(item => {
      ids.push(item.id)
      if (item.children) ids = ids.concat(getAllIds(item.children))
    })
    return ids
  }

  const addToMenu = (page) => {
    onChange([...menuItems, { id: page.id, name: page.name, children: [] }])
  }

  const removeFromMenu = (itemId) => {
    const remove = (items) => items.filter(item => {
      if (item.id === itemId) return false
      if (item.children) item.children = remove(item.children)
      return true
    })
    onChange(remove(JSON.parse(JSON.stringify(menuItems))))
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
    const deltaLevel = Math.floor(mouseX / 32) - targetItem.level
    const newLevel = Math.max(0, Math.min(targetItem.level + 1, targetItem.level + deltaLevel))
    setDropIndicator({
      targetId: targetItem.id,
      position: mouseY > rect.height / 2 ? 'after' : 'before',
      level: newLevel
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!draggedItem || !dropIndicator) return
    const flatArray = flattenItems(menuItems)
    const targetIndex = flatArray.findIndex(p => p.id === dropIndicator.targetId)
    if (targetIndex === -1) { setDraggedItem(null); setDropIndicator(null); return }
    let newFlat = flatArray.filter(p => p.id !== draggedItem.id && !isDescendant(p.id, draggedItem.id, flatArray))
    const newTargetIndex = newFlat.findIndex(p => p.id === dropIndicator.targetId)
    const insertIndex = dropIndicator.position === 'after' ? newTargetIndex + 1 : newTargetIndex
    let newParentId = null
    const newLevel = dropIndicator.level
    if (newLevel > 0) {
      for (let i = insertIndex - 1; i >= 0; i--) {
        if (newFlat[i].level === newLevel - 1) { newParentId = newFlat[i].id; break }
      }
    }
    newFlat.splice(insertIndex, 0, { ...draggedItem, level: newLevel, parentId: newParentId })
    onChange(buildTree(newFlat))
    setDraggedItem(null)
    setDropIndicator(null)
  }

  const flatItems = flattenItems(menuItems)
  const menuIds = getAllIds(menuItems)
  const available = availablePages.filter(p => !menuIds.includes(p.id))

  return (
    <div className="space-y-3">
      {/* Available pages to add */}
      {available.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Click to add to menu:</p>
          <div className="flex flex-wrap gap-2">
            {available.map(page => (
              <button
                key={page.id}
                type="button"
                onClick={() => addToMenu(page)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-primary hover:text-primary transition-all"
              >
                <Plus size={12} />
                {page.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag-and-drop tree */}
      {flatItems.length > 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <p className="text-xs text-gray-400 px-3 pt-2 pb-1">Drag to reorder · drag right to nest as sub-item</p>
          <div className="divide-y divide-gray-100">
            {flatItems.map(item => {
              const isDragging = draggedItem?.id === item.id
              const showBefore = dropIndicator?.targetId === item.id && dropIndicator.position === 'before'
              const showAfter = dropIndicator?.targetId === item.id && dropIndicator.position === 'after'
              return (
                <div key={item.id}>
                  {showBefore && (
                    <div className="h-0.5 bg-primary relative" style={{ marginLeft: `${item.level * 32 + 48}px` }}>
                      <div className="absolute left-0 top-1/2 -mt-1 w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 group ${isDragging ? 'opacity-40' : ''}`}
                    style={{ paddingLeft: `${item.level * 32 + 12}px` }}
                    draggable
                    onDragStart={e => handleDragStart(e, item)}
                    onDragOver={e => handleDragOver(e, item)}
                    onDrop={handleDrop}
                    onDragEnd={() => { setDraggedItem(null); setDropIndicator(null) }}
                  >
                    <GripVertical size={16} className="text-gray-300 cursor-move flex-shrink-0" />
                    {item.level > 0 && <span className="text-gray-300 text-xs select-none">↳</span>}
                    <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFromMenu(item.id)}
                      className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {showAfter && (
                    <div className="h-0.5 bg-primary relative" style={{ marginLeft: `${dropIndicator.level * 32 + 48}px` }}>
                      <div className="absolute left-0 top-1/2 -mt-1 w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          No menu items yet — add pages above
        </div>
      )}

      {/* Tree preview */}
      {menuItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <pre className="font-mono text-xs text-gray-600 leading-relaxed">{generatePreview(menuItems)}</pre>
        </div>
      )}
    </div>
  )
}

const generatePreview = (items, prefix = '') => {
  let result = ''
  items.forEach((item, i) => {
    const isLast = i === items.length - 1
    result += prefix + (isLast ? '└── ' : '├── ') + item.name + '\n'
    if (item.children?.length > 0) {
      result += generatePreview(item.children, prefix + (isLast ? '    ' : '│   '))
    }
  })
  return result
}

export default MenuBuilder

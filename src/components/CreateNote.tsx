import { useState, useRef, useEffect } from 'react'
import { Pin, Image, Palette, CheckSquare, Bell, MoreVertical, RotateCcw, RotateCw } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = [
  { name: 'Default', value: 'transparent' },
  { name: 'Red', value: '#f28b82' },
  { name: 'Orange', value: '#fbbc04' },
  { name: 'Yellow', value: '#fff475' },
  { name: 'Green', value: '#ccff90' },
  { name: 'Teal', value: '#a7ffeb' },
  { name: 'Blue', value: '#cbf0f8' },
  { name: 'Dark Blue', value: '#aecbfa' },
  { name: 'Purple', value: '#d7aefb' },
  { name: 'Pink', value: '#fdcfe8' },
  { name: 'Brown', value: '#e6c9a8' },
  { name: 'Gray', value: '#e8eaed' },
]

export const CreateNote = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('transparent')
  const [isPinned, setIsPinned] = useState(false)
  const [isChecklist, setIsChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState<{ id: string, text: string, checked: boolean }[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const addNote = useNoteStore((state) => state.addNote)

  const handleClose = () => {
    if (title.trim() || content.trim() || (isChecklist && checklistItems.some(i => i.text.trim()))) {
      addNote({
        title,
        content: isChecklist ? '' : content,
        color,
        pinned: isPinned,
        isChecklist,
        checklistItems: isChecklist ? checklistItems.filter(i => i.text.trim()) : [],
      })
    }
    setTitle('')
    setContent('')
    setColor('transparent')
    setIsPinned(false)
    setIsChecklist(false)
    setChecklistItems([])
    setIsExpanded(false)
    setShowColorPicker(false)
  }

  const toggleChecklist = () => {
    if (!isChecklist && content.trim()) {
      const items = content.split('\n').map(line => ({
        id: crypto.randomUUID(),
        text: line,
        checked: false
      }))
      setChecklistItems(items)
    } else if (isChecklist) {
      const newContent = checklistItems.map(i => i.text).join('\n')
      setContent(newContent)
    }
    setIsChecklist(!isChecklist)
    setIsExpanded(true)
  }

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { id: crypto.randomUUID(), text: '', checked: false }])
  }

  const updateChecklistItem = (id: string, text: string) => {
    setChecklistItems(checklistItems.map(item => item.id === id ? { ...item, text } : item))
  }

  const toggleItemCheck = (id: string) => {
    setChecklistItems(checklistItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  const removeChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [title, content, color, isPinned])

  return (
    <div 
      ref={containerRef}
      className={cn(
        "max-w-[600px] mx-auto mb-8 transition-all duration-200 rounded-lg border border-gray-200 dark:border-gray-700 shadow-keep bg-white dark:bg-gray-800",
        isExpanded ? "p-3" : "px-4 py-2"
      )}
      style={{ backgroundColor: color !== 'transparent' ? color : undefined }}
    >
      {!isExpanded ? (
        <div 
          className="flex items-center justify-between cursor-text"
          onClick={() => setIsExpanded(true)}
        >
          <span className="text-gray-500 font-medium">Take a note...</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleChecklist(); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500"
            >
              <CheckSquare size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
              <Image size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-medium bg-transparent border-none focus:ring-0 placeholder-gray-500"
              autoFocus
            />
            <button 
              onClick={() => setIsPinned(!isPinned)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isPinned ? "text-gray-900 dark:text-gray-100" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Pin size={20} fill={isPinned ? "currentColor" : "none"} />
            </button>
          </div>
          {isChecklist ? (
            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto pr-2">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group/item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItemCheck(item.id)}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-gray-500"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addChecklistItem()
                      } else if (e.key === 'Backspace' && !item.text) {
                        removeChecklistItem(item.id)
                      }
                    }}
                    placeholder="List item"
                    className={cn(
                      "flex-1 bg-transparent border-none focus:ring-0 text-sm",
                      item.checked && "line-through text-gray-500"
                    )}
                    autoFocus={!item.text}
                  />
                  <button 
                    onClick={() => removeChecklistItem(item.id)}
                    className="p-1 opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-gray-600"
                  >
                    <RotateCcw size={14} className="rotate-45" />
                  </button>
                </div>
              ))}
              <button 
                onClick={addChecklistItem}
                className="flex items-center gap-3 p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <RotateCcw size={16} className="rotate-45" />
                <span className="text-sm">List item</span>
              </button>
            </div>
          ) : (
            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 resize-none placeholder-gray-500"
            />
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 relative">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <Bell size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <User size={18} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500"
                >
                  <Palette size={18} />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-keep border border-gray-200 dark:border-gray-700 z-50 flex flex-wrap gap-1 w-48">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setColor(c.value)
                          setShowColorPicker(false)
                        }}
                        className={cn(
                          "w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600",
                          color === c.value && "ring-2 ring-gray-900 dark:ring-gray-100"
                        )}
                        style={{ backgroundColor: c.value === 'transparent' ? 'white' : c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <Image size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <Archive size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <MoreVertical size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <RotateCcw size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                <RotateCw size={18} />
              </button>
            </div>
            <button 
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const User = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

const Archive = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
)

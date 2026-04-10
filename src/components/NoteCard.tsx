import { useState, useRef, useEffect } from 'react'
import { Pin, Palette, Archive, Trash2, MoreVertical, Bell, Check, RotateCcw } from 'lucide-react'
import { Note } from '../types'
import { useNoteStore } from '../store/useNoteStore'
import { highlightText } from '../utils/highlight'
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

interface NoteCardProps {
  note: Note;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const { updateNote, deleteNote, togglePin, toggleArchive, restoreNote, permanentlyDeleteNote, searchQuery, addLabel, removeLabel } = useNoteStore()
  const editRef = useRef<HTMLDivElement>(null)

  const handleUpdate = () => {
    if (title !== note.title || content !== note.content) {
      updateNote(note.id, { title, content })
    }
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (event: MouseEvent) => {
        if (editRef.current && !editRef.current.contains(event.target as Node)) {
          handleUpdate()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing, title, content])

  if (isEditing) {
    return (
      <div 
        ref={editRef}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      >
        <div 
          className="w-full max-w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4"
          style={{ backgroundColor: note.color !== 'transparent' ? note.color : undefined }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium bg-transparent border-none focus:ring-0 mb-4"
            placeholder="Title"
            autoFocus
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] bg-transparent border-none focus:ring-0 resize-none mb-4"
            placeholder="Note"
          />
          <div className="flex justify-end">
            <button 
              onClick={handleUpdate}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-keep-hover cursor-default",
        note.color !== 'transparent' && "border-transparent"
      )}
      style={{ backgroundColor: note.color !== 'transparent' ? note.color : undefined }}
      onClick={() => !note.trashed && setIsEditing(true)}
    >
      <div className="flex items-start justify-between mb-3">
        {note.title && (
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {highlightText(note.title, searchQuery)}
          </h3>
        )}
        {!note.trashed && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              togglePin(note.id)
            }}
            className={cn(
              "p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hover:bg-black/5",
              note.pinned ? "opacity-100 text-gray-900 dark:text-gray-100" : "text-gray-500"
            )}
          >
            <Pin size={18} fill={note.pinned ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words line-clamp-[15]">
        {note.isChecklist ? (
          <div className="flex flex-col gap-1">
            {note.checklistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    e.stopPropagation()
                    const newItems = note.checklistItems.map(i => 
                      i.id === item.id ? { ...i, checked: !i.checked } : i
                    )
                    updateNote(note.id, { checklistItems: newItems })
                  }}
                  className="w-3.5 h-3.5 rounded border-gray-300 pointer-events-auto"
                />
                <span className={cn(
                  "flex-1 break-words",
                  item.checked && "line-through text-gray-500"
                )}>
                  {highlightText(item.text, searchQuery)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          highlightText(note.content, searchQuery)
        )}
      </div>

      <div className="mt-4 flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100">
        {!note.trashed ? (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                // Reminder logic
              }}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500"
              title="Remind me"
            >
              <Bell size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowColorPicker(!showColorPicker)
                }}
                className="p-2 rounded-full hover:bg-black/5 text-gray-500"
                title="Background options"
              >
                <Palette size={16} />
              </button>
              {showColorPicker && (
                <div 
                  className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-keep border border-gray-200 dark:border-gray-700 z-50 flex flex-wrap gap-1 w-48"
                  onClick={(e) => e.stopPropagation()}
                >
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        updateNote(note.id, { color: c.value })
                        setShowColorPicker(false)
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600",
                        note.color === c.value && "ring-2 ring-gray-900 dark:ring-gray-100"
                      )}
                      style={{ backgroundColor: c.value === 'transparent' ? 'white' : c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                toggleArchive(note.id)
              }}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500"
              title={note.archived ? "Unarchive" : "Archive"}
            >
              <Archive size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                deleteNote(note.id)
              }}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLabelPicker(!showLabelPicker)
                }}
                className="p-2 rounded-full hover:bg-black/5 text-gray-500"
                title="Add label"
              >
                <MoreVertical size={16} />
              </button>
              {showLabelPicker && (
                <div 
                  className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-keep border border-gray-200 dark:border-gray-700 z-50 w-48"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs font-medium text-gray-500 px-2 py-1">Label note</p>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newLabel.trim()) {
                        addLabel(note.id, newLabel.trim())
                        setNewLabel('')
                      }
                    }}
                    placeholder="Enter label name"
                    className="w-full text-sm bg-transparent border-none focus:ring-0 px-2 py-1 placeholder-gray-400"
                    autoFocus
                  />
                  {note.labels.length > 0 && (
                    <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-1">
                      {note.labels.map(label => (
                        <div key={label} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded group/label">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                          <button 
                            onClick={() => removeLabel(note.id, label)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover/label:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                permanentlyDeleteNote(note.id)
              }}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500"
              title="Delete forever"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                restoreNote(note.id)
              }}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500"
              title="Restore"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>

      {note.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.labels.map((label) => (
            <span 
              key={label}
              className="px-2 py-0.5 text-[11px] font-medium bg-black/5 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

import { Lightbulb, Bell, Tag, Edit3, Archive, Trash2 } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore'
import { NoteView } from '../types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const sidebarItems = [
  { id: 'notes', label: 'Notes', icon: Lightbulb },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'edit-labels', label: 'Edit labels', icon: Edit3 },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

export const Sidebar = () => {
  const { sidebarOpen, activeView, setActiveView, notes } = useNoteStore()

  const labels = Array.from(new Set(notes.flatMap(note => note.labels)))

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 transition-all duration-200 bg-white dark:bg-[#202124]",
        sidebarOpen ? "w-[280px]" : "w-16",
        "md:translate-x-0",
        !sidebarOpen && "translate-x-[-100%] md:translate-x-0"
      )}
    >
      <nav className="mt-2 flex flex-col gap-0.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as NoteView)}
              className={cn(
                "flex items-center gap-5 p-3 rounded-r-full transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#feefc3] dark:bg-[#41331c] text-gray-900 dark:text-gray-100" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <div className="min-w-[24px]">
                <Icon 
                  size={24} 
                  className={cn(isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-500")}
                />
              </div>
              <span className={cn(
                "whitespace-nowrap font-medium transition-opacity duration-200",
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}

        {labels.map((label) => (
          <button
            key={label}
            onClick={() => useNoteStore.getState().setActiveLabel(label)}
            className={cn(
              "flex items-center gap-5 p-3 rounded-r-full transition-all duration-200 group relative",
              useNoteStore.getState().activeLabel === label
                ? "bg-[#feefc3] dark:bg-[#41331c] text-gray-900 dark:text-gray-100" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
          >
            <div className="min-w-[24px]">
              <Tag size={24} className="text-gray-500" />
            </div>
            <span className={cn(
              "whitespace-nowrap font-medium transition-opacity duration-200",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

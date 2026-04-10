import { useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { CreateNote } from './components/CreateNote'
import { NoteGrid } from './components/NoteGrid'
import { useNoteStore } from './store/useNoteStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function App() {
  const { 
    notes, 
    searchQuery, 
    activeView, 
    activeLabel, 
    sidebarOpen, 
    darkMode,
  } = useNoteStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // '/' to focus search
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder="Search"]')?.focus()
      }
      // 'c' to create note (only if not in input/textarea)
      if (e.key === 'c' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        // Focus the take a note input
        document.querySelector<HTMLDivElement>('div[className*="cursor-text"]')?.click()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeView === 'trash') return note.trashed
    if (note.trashed) return false

    if (activeView === 'archive') return note.archived
    if (note.archived) return false

    if (activeView === 'reminders') return !!note.reminder
    if (activeView === 'labels') return activeLabel ? note.labels.includes(activeLabel) : true

    return true
  })

  const pinnedNotes = filteredNotes.filter((note) => note.pinned)
  const otherNotes = filteredNotes.filter((note) => !note.pinned)

  return (
    <div className="min-h-screen bg-white dark:bg-[#202124] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-24 px-4 pb-8 transition-all duration-200 min-h-screen",
        sidebarOpen ? "md:ml-[280px]" : "md:ml-16"
      )}>
        {activeView === 'notes' && !searchQuery && <CreateNote />}

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <EmptyState view={activeView} hasSearch={!!searchQuery} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {pinnedNotes.length > 0 && otherNotes.length > 0 ? (
              <>
                <NoteGrid notes={pinnedNotes} title="Pinned" />
                <NoteGrid notes={otherNotes} title="Others" />
              </>
            ) : (
              <NoteGrid notes={filteredNotes} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

const EmptyState = ({ view, hasSearch }: { view: string, hasSearch: boolean }) => {
  if (hasSearch) return <p className="text-xl">No matching notes found.</p>

  switch (view) {
    case 'notes':
      return (
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
              <path d="M12 3v18m-9-9h18" />
            </svg>
          </div>
          <p className="text-xl">Notes you add appear here</p>
        </div>
      )
    case 'archive':
      return (
        <div className="flex flex-col items-center">
          <p className="text-xl">Your archived notes appear here</p>
        </div>
      )
    case 'trash':
      return (
        <div className="flex flex-col items-center">
          <p className="text-xl">No notes in Trash</p>
        </div>
      )
    default:
      return <p className="text-xl">Nothing to see here</p>
  }
}

export default App

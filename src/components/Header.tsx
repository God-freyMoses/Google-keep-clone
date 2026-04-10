import { Menu, Search, RotateCcw, LayoutGrid, Settings, User } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore'

export const Header = () => {
  const { toggleSidebar, searchQuery, setSearchQuery, toggleDarkMode, darkMode } = useNoteStore()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#202124] border-b border-gray-200 dark:border-gray-700 flex items-center px-4 z-50">
      <div className="flex items-center gap-4 min-w-[240px]">
        <button 
          onClick={toggleSidebar}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" 
            alt="Google Keep Logo" 
            className="w-10 h-10"
          />
          <span className="text-xl font-medium text-gray-700 dark:text-gray-200">Keep</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-0 focus:bg-white dark:focus:bg-[#2d2e30] shadow-none focus:shadow-md transition-all placeholder-gray-500 text-gray-900 dark:text-gray-100"
            placeholder="Search"
            aria-label="Search notes"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          onClick={() => window.location.reload()}
        >
          <RotateCcw size={22} />
        </button>
        <button 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          onClick={toggleDarkMode}
        >
          {darkMode ? <LayoutGrid size={22} /> : <Settings size={22} />}
        </button>
        <div className="ml-4 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer">
          <User size={24} />
        </div>
      </div>
    </header>
  )
}

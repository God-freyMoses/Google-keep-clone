import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Note, NoteView, AppState } from '../types'

interface NoteActions {
  addNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: NoteView) => void;
  setActiveLabel: (label: string | null) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  reorderNotes: (startIndex: number, endIndex: number) => void;
  addLabel: (noteId: string, label: string) => void;
  removeLabel: (noteId: string, label: string) => void;
}

type NoteStore = AppState & NoteActions;

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      searchQuery: '',
      activeView: 'notes',
      activeLabel: null,
      darkMode: false,
      sidebarOpen: true,

      addNote: (noteData) => set((state) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: '',
          content: '',
          color: 'transparent',
          pinned: false,
          archived: false,
          trashed: false,
          labels: [],
          reminder: null,
          isChecklist: false,
          checklistItems: [],
          images: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          order: state.notes.length,
          ...noteData,
        };
        return { notes: [newNote, ...state.notes] };
      }),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        ),
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, trashed: true, archived: false, pinned: false } : note
        ),
      })),

      restoreNote: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, trashed: false } : note
        ),
      })),

      permanentlyDeleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      })),

      togglePin: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, pinned: !note.pinned, archived: false } : note
        ),
      })),

      toggleArchive: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, archived: !note.archived, pinned: false } : note
        ),
      })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveView: (activeView) => set({ activeView, activeLabel: null }),
      setActiveLabel: (activeLabel) => set({ activeLabel, activeView: 'labels' }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      reorderNotes: (startIndex, endIndex) => set((state) => {
        const newNotes = Array.from(state.notes);
        const [removed] = newNotes.splice(startIndex, 1);
        newNotes.splice(endIndex, 0, removed);
        return { notes: newNotes.map((note, index) => ({ ...note, order: index })) };
      }),

      addLabel: (noteId, label) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId && !note.labels.includes(label)
            ? { ...note, labels: [...note.labels, label] }
            : note
        ),
      })),

      removeLabel: (noteId, label) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId
            ? { ...note, labels: note.labels.filter((l) => l !== label) }
            : note
        ),
      })),
    }),
    {
      name: 'keep-clone-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

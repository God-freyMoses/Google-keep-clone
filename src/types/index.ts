export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  labels: string[];
  reminder: number | null;
  isChecklist: boolean;
  checklistItems: ChecklistItem[];
  images: string[];
  createdAt: number;
  updatedAt: number;
  order: number;
}

export type NoteView = 'notes' | 'reminders' | 'labels' | 'archive' | 'trash';

export interface AppState {
  notes: Note[];
  searchQuery: string;
  activeView: NoteView;
  activeLabel: string | null;
  darkMode: boolean;
  sidebarOpen: boolean;
}

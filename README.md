# Google Keep Clone

A production-ready Google Keep clone built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Phase 1: Core Application
- **Navigation Bar**: Google-style header with logo, search, and avatar.
- **Create Note**: Expandable input for quick note-taking.
- **Masonry Grid**: Responsive Pinterest-style layout for notes.
- **CRUD**: Full Create, Read, Update, and Delete operations.
- **Responsiveness**: Fluid layout for Desktop, Tablet, and Mobile.

### Phase 2: Custom Features
- **Color Coding**: 12 Google Keep colors to choose from.
- **Pinning**: Keep important notes at the top.
- **Archive + Trash**: Soft delete with archive and trash management.
- **Labels/Tags**: Add multiple tags to notes and filter by label.
- **Smart Search**: Real-time search with match highlighting.

### Phase 3: Advanced Features
- **Dark Mode**: System-aware dark theme with persistent preference.
- **Checklists**: Toggle between text and checklist mode for any note.
- **Keyboard Shortcuts**: `/` for search, `c` to create note.

## 🏗️ Architecture decisions
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global state with `persist` middleware for LocalStorage synchronization.
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid development and responsive design.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, beautiful iconography.
- **Layout**: [react-masonry-css](https://github.com/paulcollett/react-masonry-css) for the responsive grid layout.
- **Performance**: Debounced search, memoized filtering, and efficient state updates.

## 🛠️ Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

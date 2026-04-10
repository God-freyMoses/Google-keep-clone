import Masonry from 'react-masonry-css'
import { NoteCard } from './NoteCard'
import { Note } from '../types'
import { useNoteStore } from '../store/useNoteStore'

interface NoteGridProps {
  notes: Note[];
  title?: string;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}

export const NoteGrid = ({ notes, title }: NoteGridProps) => {
  if (notes.length === 0) return null

  return (
    <div className="mb-12">
      {title && (
        <h2 className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">
          {title}
        </h2>
      )}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </Masonry>
    </div>
  )
}

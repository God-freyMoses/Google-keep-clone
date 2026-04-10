import React from 'react'

export const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 dark:text-white p-0 rounded-sm">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

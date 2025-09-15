'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
}

export default function SearchBox({ 
  placeholder = "Search by patient ID...", 
  onSearch, 
  debounceMs = 500,
  className = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search effect
  useEffect(() => {
    if (query.trim() === '') {
      setIsSearching(false)
      onSearch('')
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(() => {
      onSearch(query.trim())
      setIsSearching(false)
    }, debounceMs)

    return () => {
      clearTimeout(timeoutId)
      setIsSearching(false)
    }
  }, [query, onSearch, debounceMs])

  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}

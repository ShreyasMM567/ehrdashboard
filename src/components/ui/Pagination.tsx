import React from 'react'
import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  hasNext: boolean
  hasPrev: boolean
}

export function Pagination({
  currentPage,
  onPageChange,
  hasNext,
  hasPrev
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 border-t border-gray-200 bg-white px-4 py-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <span className="text-sm text-gray-700 font-medium">
        Page {currentPage}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

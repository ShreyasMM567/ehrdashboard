'use client'

import React, { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface EditSuccessPopupProps {
  isVisible: boolean
  onClose: () => void
  patientName: string
  patientId: string
  updatedFields: string[]
  duration?: number // in milliseconds
}

export function EditSuccessPopup({ 
  isVisible, 
  onClose, 
  patientName, 
  patientId, 
  updatedFields,
  duration = 5000 
}: EditSuccessPopupProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  const formatFields = (fields: string[]) => {
    if (fields.length === 0) return 'patient information'
    if (fields.length === 1) return fields[0]
    if (fields.length === 2) return `${fields[0]} and ${fields[1]}`
    return `${fields.slice(0, -1).join(', ')}, and ${fields[fields.length - 1]}`
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black">
              Patient Updated Successfully!
            </p>
            <p className="text-sm text-black mt-1">
              Successfully edited <span className="font-semibold">&quot;{formatFields(updatedFields)}&quot;</span> for patient <span className="font-semibold">&quot;{patientName}&quot;</span> with ID <span className="font-mono text-blue-600">&quot;{patientId}&quot;</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-black hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

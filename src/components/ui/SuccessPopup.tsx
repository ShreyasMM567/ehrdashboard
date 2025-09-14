'use client'

import React, { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface SuccessPopupProps {
  isVisible: boolean
  onClose: () => void
  patientName: string
  patientId: string
  duration?: number // in milliseconds
}

export function SuccessPopup({ 
  isVisible, 
  onClose, 
  patientName, 
  patientId, 
  duration = 5000 
}: SuccessPopupProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black">
              Patient Created Successfully!
            </p>
            <p className="text-sm text-black mt-1">
              Created patient <span className="font-semibold">"{patientName}"</span> with ID <span className="font-mono text-blue-600">"{patientId}"</span>
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

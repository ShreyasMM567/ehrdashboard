'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Appointment } from '@/types'

interface AppointmentEditFormProps {
  appointment: Appointment | null
  onSubmit: (data: {
    status: string
    start: string
    end: string
    minutesDuration: number
  }) => void
  onCancel: () => void
  isLoading?: boolean
  error?: string | null
}

const STATUS_OPTIONS = [
  { value: 'booked', label: 'Booked' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No Show' }
]

export default function AppointmentEditForm({
  appointment,
  onSubmit,
  onCancel,
  isLoading = false,
  error
}: AppointmentEditFormProps) {
  const [formData, setFormData] = useState({
    status: '',
    start: '',
    end: '',
    minutesDuration: 30
  })

  useEffect(() => {
    if (appointment) {
      // Convert ISO datetime to local datetime format for input
      const startDate = new Date(appointment.start)
      const endDate = new Date(appointment.end)
      
      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      setFormData({
        status: appointment.status || 'booked',
        start: formatDateTime(startDate),
        end: formatDateTime(endDate),
        minutesDuration: appointment.minutesDuration || 30
      })
    }
  }, [appointment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert local datetime back to ISO format
    const startISO = new Date(formData.start).toISOString()
    const endISO = new Date(formData.end).toISOString()
    
    onSubmit({
      status: formData.status,
      start: startISO,
      end: endISO,
      minutesDuration: formData.minutesDuration
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStartDateTimeChange = (value: string) => {
    setFormData(prev => {
      const newStart = new Date(value)
      const newEnd = new Date(newStart.getTime() + prev.minutesDuration * 60000)
      
      return {
        ...prev,
        start: value,
        end: newEnd.toISOString().slice(0, 16) // Format for datetime-local input
      }
    })
  }

  const handleDurationChange = (value: number) => {
    setFormData(prev => {
      const startDate = new Date(prev.start)
      const newEnd = new Date(startDate.getTime() + value * 60000)
      
      return {
        ...prev,
        minutesDuration: value,
        end: newEnd.toISOString().slice(0, 16) // Format for datetime-local input
      }
    })
  }

  if (!appointment) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No appointment selected for editing.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="minutesDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <Input
            id="minutesDuration"
            type="number"
            min="15"
            max="480"
            step="15"
            value={formData.minutesDuration}
            onChange={(e) => handleDurationChange(parseInt(e.target.value) || 30)}
            placeholder="30"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date & Time */}
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time
          </label>
          <Input
            id="start"
            type="datetime-local"
            value={formData.start}
            onChange={(e) => handleStartDateTimeChange(e.target.value)}
            required
          />
        </div>

        {/* End Date & Time */}
        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time
          </label>
          <Input
            id="end"
            type="datetime-local"
            value={formData.end}
            onChange={(e) => handleInputChange('end', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Appointment Info Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Appointment Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Patient:</span>
            <span className="ml-2 font-medium">{appointment.patientName || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Practitioner:</span>
            <span className="ml-2 font-medium">{appointment.practitionerName || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Service Type:</span>
            <span className="ml-2 font-medium">{appointment.serviceType || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Location:</span>
            <span className="ml-2 font-medium">{appointment.location || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Appointment'}
        </Button>
      </div>
    </form>
  )
}

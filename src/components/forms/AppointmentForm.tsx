'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Appointment } from '@/types'

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  providerId: z.string().min(1, 'Provider is required'),
  providerName: z.string().min(1, 'Provider name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  type: z.enum(['consultation', 'follow-up', 'procedure', 'checkup']),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']),
  notes: z.string().optional()
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  appointment?: Appointment | null
  onSubmit: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment ? {
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      providerId: appointment.practitionerId || '',
      providerName: appointment.practitionerName || '',
      date: appointment.start ? appointment.start.split('T')[0] : '',
      time: appointment.start ? appointment.start.split('T')[1]?.split('.')[0] || '' : '',
      duration: appointment.minutesDuration || 30,
      type: appointment.serviceType as "consultation" | "follow-up" | "procedure" | "checkup" || 'consultation',
      status: appointment.status as "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show",
      notes: appointment.description || ''
    } : {
      status: 'scheduled',
      duration: 30
    }
  })

  const handleFormSubmit = (data: AppointmentFormData) => {
    // Convert date and time to start and end timestamps
    const startDateTime = new Date(`${data.date}T${data.time}`)
    const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000) // Add duration in milliseconds
    
    const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      status: data.status,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      patientId: data.patientId,
      patientName: data.patientName,
      practitionerId: data.providerId,
      practitionerName: data.providerName,
      description: data.notes,
      serviceType: data.type,
      minutesDuration: data.duration
    }
    
    onSubmit(appointmentData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Patient Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Patient ID"
            {...register('patientId')}
            error={errors.patientId?.message}
          />
          <Input
            label="Patient Name"
            {...register('patientName')}
            error={errors.patientName?.message}
          />
        </div>
      </div>

      {/* Provider Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Provider Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Provider ID"
            {...register('providerId')}
            error={errors.providerId?.message}
          />
          <Input
            label="Provider Name"
            {...register('providerName')}
            error={errors.providerName?.message}
          />
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Appointment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
          <Input
            label="Time"
            type="time"
            {...register('time')}
            error={errors.time?.message}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            error={errors.duration?.message}
          />
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Type
            </label>
            <select
              {...register('type')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="procedure">Procedure</option>
              <option value="checkup">Checkup</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Notes</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes about the appointment..."
          />
          {errors.notes && (
            <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : appointment ? 'Update Appointment' : 'Book Appointment'}
        </Button>
      </div>
    </form>
  )
}

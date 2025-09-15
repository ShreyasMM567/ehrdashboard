'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const appointmentBookingSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  practitionerId: z.string().min(1, 'Practitioner ID is required'),
  startDateTime: z.string().min(1, 'Start date and time is required'),
  endDateTime: z.string().min(1, 'End date and time is required'),
  minutesDuration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours').optional()
})

type AppointmentBookingFormData = z.infer<typeof appointmentBookingSchema>

interface AppointmentBookingFormProps {
  onSubmit: (data: AppointmentBookingFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  error?: string | null
}

function AppointmentBookingForm({ onSubmit, onCancel, isLoading, error }: AppointmentBookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AppointmentBookingFormData>({
    resolver: zodResolver(appointmentBookingSchema),
    defaultValues: {
      minutesDuration: 30
    }
  })

  const startDateTime = watch('startDateTime')

  // Auto-calculate end time when start time changes
  React.useEffect(() => {
    if (startDateTime) {
      const start = new Date(startDateTime)
      const duration = watch('minutesDuration') || 30
      const end = new Date(start.getTime() + duration * 60000)
      setValue('endDateTime', end.toISOString().slice(0, 16))
    }
  }, [startDateTime, watch('minutesDuration'), setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">
            {error === 'BOOKING_UNAVAILABLE' 
              ? 'This time slot is not available for booking. Please choose a different time.'
              : error
            }
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Patient ID"
            placeholder="e.g., 256548"
            {...register('patientId')}
            error={errors.patientId?.message}
          />
        </div>

        <div>
          <Input
            label="Practitioner ID"
            placeholder="e.g., 256540"
            {...register('practitionerId')}
            error={errors.practitionerId?.message}
          />
        </div>
      </div>

      <div>
        <Input
          label="Start Date & Time"
          type="datetime-local"
          {...register('startDateTime')}
          error={errors.startDateTime?.message}
        />
      </div>

      <div>
        <Input
          label="End Date & Time"
          type="datetime-local"
          {...register('endDateTime')}
          error={errors.endDateTime?.message}
        />
      </div>

      <div>
        <Input
          label="Duration (minutes)"
          type="number"
          min="15"
          max="480"
          {...register('minutesDuration', { valueAsNumber: true })}
          error={errors.minutesDuration?.message}
        />
        <p className="text-xs text-gray-600 mt-1">Duration will auto-calculate end time</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="font-medium text-blue-900 mb-2">Appointment Details</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Type:</strong> New Patient</p>
          <p><strong>Location:</strong> Wall Street (Location/604)</p>
          <p><strong>Status:</strong> Booked</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Appointment...' : 'Create Appointment'}
        </Button>
      </div>
    </form>
  )
}

export default AppointmentBookingForm

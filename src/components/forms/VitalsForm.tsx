'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Vitals } from '@/types'

const vitalsSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  date: z.string().min(1, 'Date is required'),
  bloodPressure: z.object({
    systolic: z.number().min(50).max(300, 'Systolic pressure must be between 50-300'),
    diastolic: z.number().min(30).max(200, 'Diastolic pressure must be between 30-200')
  }),
  heartRate: z.number().min(30).max(200, 'Heart rate must be between 30-200'),
  temperature: z.number().min(95).max(110, 'Temperature must be between 95-110°F'),
  weight: z.number().min(50).max(1000, 'Weight must be between 50-1000 lbs'),
  height: z.number().min(36).max(96, 'Height must be between 36-96 inches'),
  oxygenSaturation: z.number().min(70).max(100, 'Oxygen saturation must be between 70-100%'),
  notes: z.string().optional()
})

type VitalsFormData = z.infer<typeof vitalsSchema>

interface VitalsFormProps {
  vitals?: Vitals | null
  onSubmit: (data: Omit<Vitals, 'id' | 'bmi'>) => void
  onCancel: () => void
}

export function VitalsForm({ vitals, onSubmit, onCancel }: VitalsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: vitals ? {
      patientId: vitals.patientId,
      date: vitals.date,
      bloodPressure: vitals.bloodPressure,
      heartRate: vitals.heartRate,
      temperature: vitals.temperature,
      weight: vitals.weight,
      height: vitals.height,
      oxygenSaturation: vitals.oxygenSaturation,
      notes: vitals.notes || ''
    } : {
      date: new Date().toISOString().split('T')[0]
    }
  })

  const handleFormSubmit = (data: VitalsFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Patient and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Patient ID"
          {...register('patientId')}
          error={errors.patientId?.message}
        />
        <Input
          label="Date"
          type="date"
          {...register('date')}
          error={errors.date?.message}
        />
      </div>

      {/* Blood Pressure */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Blood Pressure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Systolic (mmHg)"
            type="number"
            {...register('bloodPressure.systolic', { valueAsNumber: true })}
            error={errors.bloodPressure?.systolic?.message}
          />
          <Input
            label="Diastolic (mmHg)"
            type="number"
            {...register('bloodPressure.diastolic', { valueAsNumber: true })}
            error={errors.bloodPressure?.diastolic?.message}
          />
        </div>
      </div>

      {/* Vital Signs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            {...register('heartRate', { valueAsNumber: true })}
            error={errors.heartRate?.message}
          />
          <Input
            label="Temperature (°F)"
            type="number"
            step="0.1"
            {...register('temperature', { valueAsNumber: true })}
            error={errors.temperature?.message}
          />
          <Input
            label="Weight (lbs)"
            type="number"
            {...register('weight', { valueAsNumber: true })}
            error={errors.weight?.message}
          />
          <Input
            label="Height (inches)"
            type="number"
            {...register('height', { valueAsNumber: true })}
            error={errors.height?.message}
          />
          <Input
            label="Oxygen Saturation (%)"
            type="number"
            {...register('oxygenSaturation', { valueAsNumber: true })}
            error={errors.oxygenSaturation?.message}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notes</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes about the vitals..."
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
          {isSubmitting ? 'Saving...' : vitals ? 'Update Vitals' : 'Add Vitals'}
        </Button>
      </div>
    </form>
  )
}

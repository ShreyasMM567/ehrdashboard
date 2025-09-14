'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Medication } from '@/types'

const medicationSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  prescribedBy: z.string().min(1, 'Prescribing physician is required'),
  notes: z.string().optional(),
  isActive: z.boolean()
})

type MedicationFormData = z.infer<typeof medicationSchema>

interface MedicationFormProps {
  medication?: Medication | null
  onSubmit: (data: Omit<Medication, 'id'>) => void
  onCancel: () => void
}

export function MedicationForm({ medication, onSubmit, onCancel }: MedicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: medication ? {
      patientId: medication.patientId,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: medication.startDate,
      endDate: medication.endDate || '',
      prescribedBy: medication.prescribedBy,
      notes: medication.notes || '',
      isActive: medication.isActive
    } : {
      startDate: new Date().toISOString().split('T')[0],
      isActive: true
    }
  })

  const handleFormSubmit = (data: MedicationFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Patient */}
      <div>
        <Input
          label="Patient ID"
          {...register('patientId')}
          error={errors.patientId?.message}
        />
      </div>

      {/* Medication Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Medication Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Medication Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g., Lisinopril, Metformin"
          />
          <Input
            label="Dosage"
            {...register('dosage')}
            error={errors.dosage?.message}
            placeholder="e.g., 10mg, 500mg"
          />
          <Input
            label="Frequency"
            {...register('frequency')}
            error={errors.frequency?.message}
            placeholder="e.g., Once daily, Twice daily"
          />
          <Input
            label="Prescribed By"
            {...register('prescribedBy')}
            error={errors.prescribedBy?.message}
            placeholder="e.g., Dr. Johnson"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Prescription Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input
            label="End Date (Optional)"
            type="date"
            {...register('endDate')}
            error={errors.endDate?.message}
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Status</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-black">
            Active Medication
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Additional Notes</h3>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional notes about the medication..."
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
          {isSubmitting ? 'Saving...' : medication ? 'Update Medication' : 'Add Medication'}
        </Button>
      </div>
    </form>
  )
}

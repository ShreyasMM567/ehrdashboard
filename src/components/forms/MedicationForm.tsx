'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const medicationSchema = z.object({
  medicationCodeableConcept: z.string().min(1, 'Medication name is required'),
  status: z.enum(['active', 'completed', 'entered-in-error', 'intended', 'stopped', 'on-hold', 'unknown', 'not-taken']).default('active'),
  effectiveDateTime: z.string().optional(),
  dosage: z.string().optional(),
  note: z.string().optional()
})

type MedicationFormData = z.infer<typeof medicationSchema>

interface MedicationFormProps {
  patientId: string
  onSubmit: (data: MedicationFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

function MedicationForm({ patientId, onSubmit, onCancel, isLoading }: MedicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      status: 'active'
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Medication Name"
          placeholder="e.g., Metformin, Lisinopril, Albuterol"
          {...register('medicationCodeableConcept')}
          error={errors.medicationCodeableConcept?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Status
        </label>
        <select
          {...register('status')}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="stopped">Stopped</option>
          <option value="on-hold">On Hold</option>
          <option value="intended">Intended</option>
          <option value="entered-in-error">Entered in Error</option>
          <option value="unknown">Unknown</option>
          <option value="not-taken">Not Taken</option>
        </select>
        {errors.status && (
          <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Effective Date (Optional)"
          type="date"
          {...register('effectiveDateTime')}
          error={errors.effectiveDateTime?.message}
        />
      </div>

      <div>
        <Input
          label="Dosage (Optional)"
          placeholder="e.g., 500mg twice daily, 10mg once daily"
          {...register('dosage')}
          error={errors.dosage?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register('note')}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes about the medication..."
        />
        {errors.note && (
          <p className="text-red-600 text-sm mt-1">{errors.note.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Medication'}
        </Button>
      </div>
    </form>
  )
}

export default MedicationForm
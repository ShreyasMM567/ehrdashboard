'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Allergy } from '@/types'

const allergySchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  allergen: z.string().min(1, 'Allergen is required'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  reaction: z.string().min(1, 'Reaction description is required'),
  notes: z.string().optional()
})

type AllergyFormData = z.infer<typeof allergySchema>

interface AllergyFormProps {
  allergy?: Allergy | null
  onSubmit: (data: Omit<Allergy, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function AllergyForm({ allergy, onSubmit, onCancel }: AllergyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AllergyFormData>({
    resolver: zodResolver(allergySchema),
    defaultValues: allergy ? {
      patientId: allergy.patientId,
      allergen: allergy.allergen,
      severity: allergy.severity,
      reaction: allergy.reaction,
      notes: allergy.notes || ''
    } : undefined
  })

  const handleFormSubmit = (data: AllergyFormData) => {
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

      {/* Allergy Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Allergy Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Allergen"
            {...register('allergen')}
            error={errors.allergen?.message}
            placeholder="e.g., Penicillin, Peanuts, Latex"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              {...register('severity')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            {errors.severity && (
              <p className="text-sm text-red-600 mt-1">{errors.severity.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reaction */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Reaction Details</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reaction Description
          </label>
          <textarea
            {...register('reaction')}
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the allergic reaction..."
            error={errors.reaction?.message}
          />
          {errors.reaction && (
            <p className="text-sm text-red-600 mt-1">{errors.reaction.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Additional Notes</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional notes about the allergy..."
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
          {isSubmitting ? 'Saving...' : allergy ? 'Update Allergy' : 'Add Allergy'}
        </Button>
      </div>
    </form>
  )
}

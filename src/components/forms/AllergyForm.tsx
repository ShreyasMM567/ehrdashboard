'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const allergySchema = z.object({
  code: z.string().min(1, 'Allergen name is required'),
  description: z.string().min(1, 'Reaction description is required'),
  clinicalStatus: z.enum(['active', 'inactive', 'resolved'])
})

type AllergyFormData = z.infer<typeof allergySchema>

interface AllergyFormProps {
  patientId: string
  onSubmit: (data: AllergyFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

function AllergyForm({ onSubmit, onCancel, isLoading }: AllergyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AllergyFormData>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      clinicalStatus: 'active'
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Allergen Name"
          placeholder="e.g., Penicillin, Peanuts, Shellfish"
          {...register('code')}
          error={errors.code?.message}
        />
      </div>

      <div>
        <Input
          label="Reaction Description"
          placeholder="e.g., Rash on arms, Difficulty breathing"
          {...register('description')}
          error={errors.description?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Clinical Status
        </label>
        <select
          {...register('clinicalStatus')}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="resolved">Resolved</option>
        </select>
        {errors.clinicalStatus && (
          <p className="text-red-600 text-sm mt-1">{errors.clinicalStatus.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Allergy'}
        </Button>
      </div>
    </form>
  )
}

export default AllergyForm
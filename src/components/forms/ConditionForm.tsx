'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const conditionSchema = z.object({
  code: z.string().min(1, 'Condition name is required'),
  clinicalStatus: z.enum(['active', 'inactive', 'resolved']).default('active'),
  category: z.string().min(1, 'Category is required'),
  severity: z.string().optional(),
  onsetDate: z.string().optional(),
  note: z.string().optional()
})

type ConditionFormData = z.infer<typeof conditionSchema>

interface ConditionFormProps {
  patientId: string
  onSubmit: (data: ConditionFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

function ConditionForm({ patientId, onSubmit, onCancel, isLoading }: ConditionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ConditionFormData>({
    resolver: zodResolver(conditionSchema),
    defaultValues: {
      clinicalStatus: 'active'
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Condition Name"
          placeholder="e.g., Diabetes, Hypertension, Asthma"
          {...register('code')}
          error={errors.code?.message}
        />
      </div>

      <div>
        <Input
          label="Category"
          placeholder="e.g., Endocrine, Cardiovascular, Respiratory"
          {...register('category')}
          error={errors.category?.message}
        />
      </div>

      <div>
        <Input
          label="Severity (Optional)"
          placeholder="e.g., Mild, Moderate, Severe"
          {...register('severity')}
          error={errors.severity?.message}
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

      <div>
        <Input
          label="Onset Date (Optional)"
          type="date"
          {...register('onsetDate')}
          error={errors.onsetDate?.message}
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
          placeholder="Additional notes about the condition..."
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
          {isLoading ? 'Adding...' : 'Add Condition'}
        </Button>
      </div>
    </form>
  )
}

export default ConditionForm

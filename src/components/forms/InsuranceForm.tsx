'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Insurance } from '@/types'

const insuranceSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  provider: z.string().min(1, 'Insurance provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  groupNumber: z.string().min(1, 'Group number is required'),
  subscriberName: z.string().min(1, 'Subscriber name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  copay: z.number().min(0, 'Copay must be positive'),
  deductible: z.number().min(0, 'Deductible must be positive'),
  isActive: z.boolean()
})

type InsuranceFormData = z.infer<typeof insuranceSchema>

interface InsuranceFormProps {
  insurance?: Insurance | null
  onSubmit: (data: Omit<Insurance, 'id'>) => void
  onCancel: () => void
}

export function InsuranceForm({ insurance, onSubmit, onCancel }: InsuranceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: insurance ? {
      patientId: insurance.patientId,
      provider: insurance.provider,
      policyNumber: insurance.policyNumber,
      groupNumber: insurance.groupNumber,
      subscriberName: insurance.subscriberName,
      relationship: insurance.relationship,
      effectiveDate: insurance.effectiveDate,
      expirationDate: insurance.expirationDate,
      copay: insurance.copay,
      deductible: insurance.deductible,
      isActive: insurance.isActive
    } : {
      effectiveDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      copay: 0,
      deductible: 0
    }
  })

  const handleFormSubmit = (data: InsuranceFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Patient Information */}
      <div>
        <Input
          label="Patient ID"
          {...register('patientId')}
          error={errors.patientId?.message}
        />
      </div>

      {/* Insurance Provider */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Insurance Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Insurance Provider"
            {...register('provider')}
            error={errors.provider?.message}
            placeholder="e.g., Blue Cross Blue Shield, Aetna"
          />
          <Input
            label="Policy Number"
            {...register('policyNumber')}
            error={errors.policyNumber?.message}
          />
          <Input
            label="Group Number"
            {...register('groupNumber')}
            error={errors.groupNumber?.message}
          />
        </div>
      </div>

      {/* Subscriber Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Subscriber Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Subscriber Name"
            {...register('subscriberName')}
            error={errors.subscriberName?.message}
          />
          <Input
            label="Relationship to Patient"
            {...register('relationship')}
            error={errors.relationship?.message}
            placeholder="e.g., Self, Spouse, Child"
          />
        </div>
      </div>

      {/* Coverage Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Coverage Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Effective Date"
            type="date"
            {...register('effectiveDate')}
            error={errors.effectiveDate?.message}
          />
          <Input
            label="Expiration Date"
            type="date"
            {...register('expirationDate')}
            error={errors.expirationDate?.message}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Copay Amount ($)"
            type="number"
            step="0.01"
            {...register('copay', { valueAsNumber: true })}
            error={errors.copay?.message}
          />
          <Input
            label="Deductible Amount ($)"
            type="number"
            step="0.01"
            {...register('deductible', { valueAsNumber: true })}
            error={errors.deductible?.message}
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Status</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Active Insurance Coverage
          </label>
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
          {isSubmitting ? 'Saving...' : insurance ? 'Update Insurance' : 'Add Insurance'}
        </Button>
      </div>
    </form>
  )
}

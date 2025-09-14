'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BillingRecord } from '@/types'

const billingSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  serviceDate: z.string().min(1, 'Service date is required'),
  service: z.string().min(1, 'Service description is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  insuranceCoverage: z.number().min(0, 'Insurance coverage must be positive'),
  patientResponsibility: z.number().min(0, 'Patient responsibility must be positive'),
  status: z.enum(['pending', 'paid', 'overdue', 'disputed']),
  dueDate: z.string().min(1, 'Due date is required')
})

type BillingFormData = z.infer<typeof billingSchema>

interface BillingFormProps {
  billingRecord?: BillingRecord | null
  onSubmit: (data: Omit<BillingRecord, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function BillingForm({ billingRecord, onSubmit, onCancel }: BillingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: billingRecord ? {
      patientId: billingRecord.patientId,
      patientName: billingRecord.patientName,
      serviceDate: billingRecord.serviceDate,
      service: billingRecord.service,
      amount: billingRecord.amount,
      insuranceCoverage: billingRecord.insuranceCoverage,
      patientResponsibility: billingRecord.patientResponsibility,
      status: billingRecord.status,
      dueDate: billingRecord.dueDate
    } : {
      serviceDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      amount: 0,
      insuranceCoverage: 0,
      patientResponsibility: 0
    }
  })

  const handleFormSubmit = (data: BillingFormData) => {
    onSubmit(data)
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

      {/* Service Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Service Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Service Date"
            type="date"
            {...register('serviceDate')}
            error={errors.serviceDate?.message}
          />
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="disputed">Disputed</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Service Description
          </label>
          <textarea
            {...register('service')}
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the service provided..."
          />
          {errors.service && (
            <p className="text-sm text-red-600 mt-1">{errors.service.message}</p>
          )}
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Total Amount ($)"
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
          />
          <Input
            label="Insurance Coverage ($)"
            type="number"
            step="0.01"
            {...register('insuranceCoverage', { valueAsNumber: true })}
            error={errors.insuranceCoverage?.message}
          />
          <Input
            label="Patient Responsibility ($)"
            type="number"
            step="0.01"
            {...register('patientResponsibility', { valueAsNumber: true })}
            error={errors.patientResponsibility?.message}
          />
        </div>
        <Input
          label="Due Date"
          type="date"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
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
          {isSubmitting ? 'Saving...' : billingRecord ? 'Update Billing Record' : 'Add Billing Record'}
        </Button>
      </div>
    </form>
  )
}

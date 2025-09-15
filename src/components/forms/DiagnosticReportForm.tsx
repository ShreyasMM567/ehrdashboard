'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const diagnosticReportSchema = z.object({
  code: z.string().min(1, 'Report type is required'),
  status: z.enum(['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown']).default('final'),
  category: z.string().min(1, 'Category is required'),
  effectiveDate: z.string().optional(),
  performer: z.string().optional(),
  conclusion: z.string().optional()
})

type DiagnosticReportFormData = z.infer<typeof diagnosticReportSchema>

interface DiagnosticReportFormProps {
  patientId: string
  onSubmit: (data: DiagnosticReportFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

function DiagnosticReportForm({ patientId, onSubmit, onCancel, isLoading }: DiagnosticReportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DiagnosticReportFormData>({
    resolver: zodResolver(diagnosticReportSchema),
    defaultValues: {
      status: 'final'
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Report Type"
          placeholder="e.g., Blood Test, X-Ray, MRI, CT Scan"
          {...register('code')}
          error={errors.code?.message}
        />
      </div>

      <div>
        <Input
          label="Category"
          placeholder="e.g., Laboratory, Radiology, Pathology"
          {...register('category')}
          error={errors.category?.message}
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
          <option value="final">Final</option>
          <option value="preliminary">Preliminary</option>
          <option value="partial">Partial</option>
          <option value="registered">Registered</option>
          <option value="amended">Amended</option>
          <option value="corrected">Corrected</option>
          <option value="appended">Appended</option>
          <option value="cancelled">Cancelled</option>
          <option value="entered-in-error">Entered in Error</option>
          <option value="unknown">Unknown</option>
        </select>
        {errors.status && (
          <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Effective Date (Optional)"
          type="date"
          {...register('effectiveDate')}
          error={errors.effectiveDate?.message}
        />
      </div>

      <div>
        <Input
          label="Performer (Optional)"
          placeholder="e.g., Dr. Smith, Lab Technician"
          {...register('performer')}
          error={errors.performer?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Conclusion (Optional)
        </label>
        <textarea
          {...register('conclusion')}
          rows={3}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Report conclusion or findings..."
        />
        {errors.conclusion && (
          <p className="text-red-600 text-sm mt-1">{errors.conclusion.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Diagnostic Report'}
        </Button>
      </div>
    </form>
  )
}

export default DiagnosticReportForm

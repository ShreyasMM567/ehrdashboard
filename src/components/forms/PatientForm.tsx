'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Patient } from '@/types'

const patientSchema = z.object({
  family: z.string().min(1, 'Family name is required'),
  given: z.string().min(1, 'Given name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits')
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: Omit<Patient, 'id'>) => void
  onCancel: () => void
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      family: patient.family,
      given: patient.given,
      birthDate: patient.birthDate,
      email: patient.email,
      phone: patient.phone
    } : undefined
  })

  const handleFormSubmit = (data: PatientFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-black">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Family Name"
            {...register('family')}
            error={errors.family?.message}
          />
          <Input
            label="Given Name"
            {...register('given')}
            error={errors.given?.message}
          />
          <Input
            label="Birth Date"
            type="date"
            {...register('birthDate')}
            error={errors.birthDate?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />
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
          {isSubmitting ? 'Saving...' : patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  )
}

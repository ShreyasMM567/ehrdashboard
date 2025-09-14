'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Patient } from '@/types'

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 digits')
  }),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(10, 'Emergency contact phone must be at least 10 digits')
  }),
  insurance: z.object({
    provider: z.string().min(1, 'Insurance provider is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    groupNumber: z.string().min(1, 'Group number is required')
  })
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void
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
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      insurance: patient.insurance
    } : undefined
  })

  const handleFormSubmit = (data: PatientFormData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
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

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              {...register('address.street')}
              error={errors.address?.street?.message}
            />
          </div>
          <Input
            label="City"
            {...register('address.city')}
            error={errors.address?.city?.message}
          />
          <Input
            label="State"
            {...register('address.state')}
            error={errors.address?.state?.message}
          />
          <Input
            label="ZIP Code"
            {...register('address.zipCode')}
            error={errors.address?.zipCode?.message}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contact Name"
            {...register('emergencyContact.name')}
            error={errors.emergencyContact?.name?.message}
          />
          <Input
            label="Relationship"
            {...register('emergencyContact.relationship')}
            error={errors.emergencyContact?.relationship?.message}
          />
          <Input
            label="Contact Phone"
            type="tel"
            {...register('emergencyContact.phone')}
            error={errors.emergencyContact?.phone?.message}
          />
        </div>
      </div>

      {/* Insurance */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Insurance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Insurance Provider"
            {...register('insurance.provider')}
            error={errors.insurance?.provider?.message}
          />
          <Input
            label="Policy Number"
            {...register('insurance.policyNumber')}
            error={errors.insurance?.policyNumber?.message}
          />
          <Input
            label="Group Number"
            {...register('insurance.groupNumber')}
            error={errors.insurance?.groupNumber?.message}
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

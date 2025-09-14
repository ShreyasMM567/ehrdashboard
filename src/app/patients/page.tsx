'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { PatientForm } from '@/components/forms/PatientForm'
import { usePatients, usePatientMutations } from '@/hooks/usePatients'
import { Patient } from '@/types'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { formatDate, formatPhoneNumber } from '@/lib/utils'

export default function PatientsPage() {
  const { patients, isLoading, error } = usePatients()
  const { create, update, remove } = usePatientMutations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeletePatient = async (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.given} ${patient.family}?`)) {
      await remove(patient.id)
    }
  }

  const handleSubmit = async (data: Omit<Patient, 'id'>) => {
    if (isEditing && selectedPatient) {
      await update(selectedPatient.id, data)
    } else {
      await create(data)
    }
    setIsModalOpen(false)
    setSelectedPatient(null)
    setIsEditing(false)
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading patients</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-2">Manage patient records and information</p>
          </div>
          <Button onClick={handleAddPatient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading patients...</div>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No patients found</p>
                <Button onClick={handleAddPatient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Patient
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.given} {patient.family}
                      </TableCell>
                      <TableCell>{formatDate(patient.birthDate)}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{formatPhoneNumber(patient.phone)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePatient(patient)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Patient Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPatient(null)
            setIsEditing(false)
          }}
          title={isEditing ? 'Edit Patient' : 'Add New Patient'}
          size="lg"
        >
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setSelectedPatient(null)
              setIsEditing(false)
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

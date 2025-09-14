'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { SuccessPopup } from '@/components/ui/SuccessPopup'
import { EditSuccessPopup } from '@/components/ui/EditSuccessPopup'
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [createdPatient, setCreatedPatient] = useState<{ name: string; id: string } | null>(null)
  const [showEditSuccessPopup, setShowEditSuccessPopup] = useState(false)
  const [editedPatient, setEditedPatient] = useState<{ name: string; id: string; updatedFields: string[] } | null>(null)

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
      // Track which fields were updated with better comparison
      const updatedFields: string[] = []
      
      console.log('Comparing fields:')
      console.log('Original patient:', selectedPatient)
      console.log('New data:', data)
      
      if (data.family !== selectedPatient.family) {
        console.log('Family changed:', selectedPatient.family, '->', data.family)
        updatedFields.push('family name')
      }
      if (data.given !== selectedPatient.given) {
        console.log('Given changed:', selectedPatient.given, '->', data.given)
        updatedFields.push('given name')
      }
      if (data.birthDate !== selectedPatient.birthDate) {
        console.log('Birth date changed:', selectedPatient.birthDate, '->', data.birthDate)
        updatedFields.push('birth date')
      }
      if (data.email !== selectedPatient.email) {
        console.log('Email changed:', selectedPatient.email, '->', data.email)
        updatedFields.push('email')
      }
      if (data.phone !== selectedPatient.phone) {
        console.log('Phone changed:', selectedPatient.phone, '->', data.phone)
        updatedFields.push('phone')
      }
      
      console.log('Updated fields detected:', updatedFields)
      
      const updatedPatient = await update(selectedPatient.id, data)
      
      // Show edit success popup
      if (updatedPatient) {
        // Use updated patient data, but fallback to original if names are empty
        const patientName = (updatedPatient.given && updatedPatient.family) 
          ? `${updatedPatient.given} ${updatedPatient.family}`
          : `${selectedPatient.given} ${selectedPatient.family}`
        
        console.log('Setting edited patient popup:', {
          name: patientName,
          id: updatedPatient.id,
          updatedFields: updatedFields,
          updatedPatientData: updatedPatient,
          originalPatientData: selectedPatient
        })
        
        setEditedPatient({
          name: patientName,
          id: updatedPatient.id,
          updatedFields: updatedFields
        })
        setShowEditSuccessPopup(true)
      }
    } else {
      const newPatient = await create(data)
      // Show success popup for newly created patient
      setCreatedPatient({
        name: `${newPatient.given} ${newPatient.family}`,
        id: newPatient.id
      })
      setShowSuccessPopup(true)
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
            <h1 className="text-3xl font-bold text-black">Patients</h1>
            <p className="text-black mt-2">Manage patient records and information</p>
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
                <div className="text-black">Loading patients...</div>
              </div>
            ) : !Array.isArray(patients) || patients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black mb-4">No patients found</p>
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
                  {Array.isArray(patients) ? patients.map((patient) => (
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
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-black">
                        Error loading patients data
                      </TableCell>
                    </TableRow>
                  )}
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

        {/* Success Popup */}
        {createdPatient && (
          <SuccessPopup
            isVisible={showSuccessPopup}
            onClose={() => {
              setShowSuccessPopup(false)
              setCreatedPatient(null)
            }}
            patientName={createdPatient.name}
            patientId={createdPatient.id}
            duration={5000}
          />
        )}

        {/* Edit Success Popup */}
        {editedPatient && (
          <EditSuccessPopup
            isVisible={showEditSuccessPopup}
            onClose={() => {
              setShowEditSuccessPopup(false)
              setEditedPatient(null)
            }}
            patientName={editedPatient.name}
            patientId={editedPatient.id}
            updatedFields={editedPatient.updatedFields}
            duration={5000}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

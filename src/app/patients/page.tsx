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
import { usePatients, usePatientMutations, usePatientSearch } from '@/hooks/usePatients'
import { Patient } from '@/types'
import { Plus, Edit, MoreHorizontal } from 'lucide-react'
import { formatDate, formatPhoneNumber } from '@/lib/utils'
import SearchBox from '@/components/ui/SearchBox'
import PatientDetailModal from '@/components/modals/PatientDetailModal'
import { Pagination } from '@/components/ui/Pagination'

export default function PatientsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  
  const { patients, pagination, isLoading, error } = usePatients({ 
    page: currentPage, 
    count: pageSize 
  })
  
  const { create, update, remove } = usePatientMutations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [createdPatient, setCreatedPatient] = useState<{ name: string; id: string } | null>(null)
  const [showEditSuccessPopup, setShowEditSuccessPopup] = useState(false)
  const [editedPatient, setEditedPatient] = useState<{ name: string; id: string; updatedFields: string[] } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { searchResult, isSearching, searchError } = usePatientSearch(searchQuery)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<Patient | null>(null)

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

  const handleViewPatientDetails = (patient: Patient) => {
    setSelectedPatientForDetails(patient)
    setIsDetailModalOpen(true)
  }

  const handleSearch = (query: string) => setSearchQuery(query)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPatient(null)
    setIsEditing(false)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedPatientForDetails(null)
  }

  // Display logic
  const isSearchingMode = searchQuery.trim() !== ''
  const displayPatients = isSearchingMode 
    ? (searchResult ? [searchResult] : [])
    : patients
  const isDisplayLoading = isSearchingMode ? isSearching : isLoading
  const displayError = isSearchingMode ? searchError : error

  const handleSubmit = async (data: Omit<Patient, 'id'>) => {
    if (isEditing && selectedPatient) {
      // Track which fields were updated
      const updatedFields: string[] = []
      
      if (data.family !== selectedPatient.family) updatedFields.push('family name')
      if (data.given !== selectedPatient.given) updatedFields.push('given name')
      if (data.birthDate !== selectedPatient.birthDate) updatedFields.push('birth date')
      if (data.email !== selectedPatient.email) updatedFields.push('email')
      if (data.phone !== selectedPatient.phone) updatedFields.push('phone')
      
      const updatedPatient = await update(selectedPatient.id, data)
      
      if (updatedPatient) {
        const patientName = (updatedPatient.given && updatedPatient.family) 
          ? `${updatedPatient.given} ${updatedPatient.family}`
          : `${selectedPatient.given} ${selectedPatient.family}`
        
        setEditedPatient({
          name: patientName,
          id: updatedPatient.id,
          updatedFields: updatedFields
        })
        setShowEditSuccessPopup(true)
      }
    } else {
      const newPatient = await create(data)
      setCreatedPatient({
        name: `${newPatient.given} ${newPatient.family}`,
        id: newPatient.id
      })
      setShowSuccessPopup(true)
    }
    
    closeModal()
  }

  if (displayError && !isSearchingMode) {
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

        {/* Search Box */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-md">
              <SearchBox
                placeholder="Search by patient ID..."
                onSearch={handleSearch}
                debounceMs={500}
              />
              {isSearchingMode && (
                <p className="text-sm text-black mt-2">
                  {isSearching ? 'Searching...' : 
                   searchResult ? `Found patient: ${searchResult.given} ${searchResult.family}` :
                   searchError ? 'Patient not found' : 'No results'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {isDisplayLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-black">
                  {isSearchingMode ? 'Searching for patient...' : 'Loading patients...'}
                </div>
              </div>
            ) : !Array.isArray(displayPatients) || displayPatients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black mb-4">
                  {isSearchingMode ? 'No patient found with that ID' : 'No patients found'}
                </p>
                {!isSearchingMode && (
                  <Button onClick={handleAddPatient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Patient
                  </Button>
                )}
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
                  {Array.isArray(displayPatients) ? displayPatients.map((patient) => (
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
                            title="Edit Patient"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPatientDetails(patient)}
                            title="View Patient Details"
                          >
                            <MoreHorizontal className="h-4 w-4" />
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
          
          {/* Pagination */}
          {!isSearchingMode && pagination && (
            <Pagination
              currentPage={pagination.page}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          )}
        </Card>

        {/* Patient Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={isEditing ? 'Edit Patient' : 'Add New Patient'}
          size="lg"
        >
          <PatientForm
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={closeModal}
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

        {/* Patient Detail Modal */}
        <PatientDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          patient={selectedPatientForDetails}
        />
      </div>
    </DashboardLayout>
  )
}
